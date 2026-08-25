import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { UserPermission } from '../entities/user-permission.entity';
import { UserRole } from '../entities/user-role.entity';

const USER_PERMISSIONS_TTL_MS = 15 * 60 * 1000;
const SUPER_ADMIN_PERMISSION = '*';
const DENIED_PERMISSION_PREFIX = '!';

@Injectable()
export class AccessCheckService {
  private readonly logger = new Logger(AccessCheckService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {}

  async hasAccess(userId: string, permission: string): Promise<boolean> {
    const results = await this.hasBulkAccess(userId, [permission]);

    return results[permission] ?? false;
  }

  async hasBulkAccess(
    userId: string,
    permissions: string[],
  ): Promise<Record<string, boolean>> {
    const uniquePermissions = Array.from(new Set(permissions));
    const effectivePermissions = await this.getEffectivePermissionNames(userId);
    const deniedPermissions = new Set(
      effectivePermissions
        .filter((permission) => permission.startsWith(DENIED_PERMISSION_PREFIX))
        .map((permission) => permission.slice(DENIED_PERMISSION_PREFIX.length)),
    );
    const grantedPermissions = new Set(
      effectivePermissions.filter(
        (permission) => !permission.startsWith(DENIED_PERMISSION_PREFIX),
      ),
    );
    const isSuperAdmin = grantedPermissions.has(SUPER_ADMIN_PERMISSION);

    return Object.fromEntries(
      uniquePermissions.map((permission) => [
        permission,
        !deniedPermissions.has(permission) &&
          (isSuperAdmin || grantedPermissions.has(permission)),
      ]),
    ) as Record<string, boolean>;
  }

  private async getEffectivePermissionNames(userId: string): Promise<string[]> {
    const cachedPermissions = await this.getCachedPermissions(userId);

    if (cachedPermissions) {
      return cachedPermissions;
    }

    const permissionNames = await this.getEffectivePermissionNamesFromDb(userId);

    await this.cachePermissions(userId, permissionNames);

    return permissionNames;
  }

  private async getEffectivePermissionNamesFromDb(
    userId: string,
  ): Promise<string[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { user: { id: userId } },
      relations: {
        role: {
          rolePermissions: {
            permission: true,
          },
        },
      },
    });

    const grantedPermissions = new Set<string>();
    const deniedPermissions = new Set<string>();
    const userPermissionOverrides = await this.userPermissionRepository.find({
      where: { user: { id: userId } },
      relations: { permission: true },
    });

    for (const userRole of userRoles) {
      for (const rolePermission of userRole.role.rolePermissions) {
        grantedPermissions.add(rolePermission.permission.name);
      }
    }

    for (const userPermission of userPermissionOverrides) {
      if (userPermission.isDenied) {
        deniedPermissions.add(userPermission.permission.name);
        grantedPermissions.delete(userPermission.permission.name);
      } else if (!deniedPermissions.has(userPermission.permission.name)) {
        grantedPermissions.add(userPermission.permission.name);
      }
    }

    if (userRoles.some((userRole) => userRole.role.isSuperAdmin)) {
      grantedPermissions.add(SUPER_ADMIN_PERMISSION);
    }

    return [
      ...Array.from(grantedPermissions),
      ...Array.from(deniedPermissions).map(
        (permission) => `${DENIED_PERMISSION_PREFIX}${permission}`,
      ),
    ];
  }

  private async getCachedPermissions(userId: string): Promise<string[] | null> {
    try {
      const cachedPermissions = await this.cacheManager.get<unknown>(
        this.getUserPermissionsKey(userId),
      );

      if (
        Array.isArray(cachedPermissions) &&
        cachedPermissions.every((permission) => typeof permission === 'string')
      ) {
        return cachedPermissions;
      }
    } catch (error) {
      this.logger.warn(
        `Failed to read permissions cache for user "${userId}". Falling back to DB.`,
      );
      this.logger.debug(error);
    }

    return null;
  }

  private async cachePermissions(
    userId: string,
    permissions: string[],
  ): Promise<void> {
    try {
      await this.cacheManager.set(
        this.getUserPermissionsKey(userId),
        permissions,
        USER_PERMISSIONS_TTL_MS,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to write permissions cache for user "${userId}". Continuing without cache.`,
      );
      this.logger.debug(error);
    }
  }

  private getUserPermissionsKey(userId: string): string {
    return `user:${userId}:permissions`;
  }
}
