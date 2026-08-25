import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AssignUserRolesDto } from '../dto';
import { UpsertUserPermissionOverrideDto } from '../dto/upsert-user-permission-override.dto';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { UserPermission } from '../entities/user-permission.entity';
import { UserRole } from '../entities/user-role.entity';
import { AuditLogService } from './audit-log.service';
import { CacheInvalidationService } from './cache-invalidation.service';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly cacheInvalidationService: CacheInvalidationService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findUserRoles(userId: string): Promise<Role[]> {
    await this.ensureUserExists(userId);

    const userRoles = await this.userRoleRepository.find({
      where: { user: { id: userId } },
      relations: { role: true },
      order: { assignedAt: 'DESC' },
    });

    return userRoles.map((userRole) => userRole.role);
  }

  async assignRoles(
    userId: string,
    dto: AssignUserRolesDto,
    assignedByUserId: string,
  ): Promise<Role[]> {
    const user = await this.findUserById(userId);
    const assignedByUser = await this.findUserById(assignedByUserId);
    const roles = await this.roleRepository.findBy({ id: In(dto.role_ids) });

    if (roles.length !== dto.role_ids.length) {
      throw new NotFoundException('One or more roles were not found');
    }

    const existingUserRoles = await this.userRoleRepository.find({
      where: {
        user: { id: userId },
        role: { id: In(dto.role_ids) },
      },
      relations: { role: true },
    });
    const existingRoleIds = new Set(
      existingUserRoles.map((userRole) => userRole.role.id),
    );
    const newUserRoles = roles
      .filter((role) => !existingRoleIds.has(role.id))
      .map((role) =>
        this.userRoleRepository.create({
          user,
          role,
          assignedByUser,
        }),
      );

    if (newUserRoles.length > 0) {
      await this.userRoleRepository.save(newUserRoles);
      await Promise.all(
        newUserRoles.map((userRole) =>
          this.auditLogService.logUserRoleChange({
            actorId: assignedByUserId,
            action: 'user_role.assigned',
            targetUserId: userId,
            roleId: userRole.role.id,
          }),
        ),
      );
      await this.cacheInvalidationService.invalidateUserPermissions(userId);
    }

    return this.findUserRoles(userId);
  }

  async removeRole(
    userId: string,
    roleId: string,
    actorId: string,
  ): Promise<void> {
    await this.ensureUserExists(userId);

    const userRole = await this.userRoleRepository.findOne({
      where: {
        user: { id: userId },
        role: { id: roleId },
      },
    });

    if (!userRole) {
      throw new NotFoundException('User role not found');
    }

    await this.userRoleRepository.remove(userRole);
    await this.auditLogService.logUserRoleChange({
      actorId,
      action: 'user_role.removed',
      targetUserId: userId,
      roleId,
    });
    await this.cacheInvalidationService.invalidateUserPermissions(userId);
  }

  async upsertPermissionOverride(
    userId: string,
    dto: UpsertUserPermissionOverrideDto,
  ): Promise<UserPermission> {
    const user = await this.findUserById(userId);
    const permission = await this.permissionRepository.findOneBy({
      id: dto.permission_id,
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const existingOverride = await this.userPermissionRepository.findOne({
      where: {
        user: { id: userId },
        permission: { id: dto.permission_id },
      },
      relations: {
        permission: true,
        user: true,
      },
    });

    const userPermission =
      existingOverride ??
      this.userPermissionRepository.create({
        user,
        permission,
      });

    userPermission.isDenied = dto.is_denied;

    const savedOverride = await this.userPermissionRepository.save(
      userPermission,
    );

    await this.cacheInvalidationService.invalidateUserPermissions(userId);

    return savedOverride;
  }

  async findEffectivePermissions(userId: string): Promise<Permission[]> {
    await this.ensureUserExists(userId);

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
    const userPermissionOverrides = await this.userPermissionRepository.find({
      where: { user: { id: userId } },
      relations: { permission: true },
    });
    const permissionsById = new Map<string, Permission>();

    if (userRoles.some((userRole) => userRole.role.isSuperAdmin)) {
      return this.permissionRepository.find({
        order: { module: 'ASC', name: 'ASC' },
      });
    }

    for (const userRole of userRoles) {
      for (const rolePermission of userRole.role.rolePermissions) {
        permissionsById.set(
          rolePermission.permission.id,
          rolePermission.permission,
        );
      }
    }

    for (const userPermission of userPermissionOverrides) {
      if (userPermission.isDenied) {
        permissionsById.delete(userPermission.permission.id);
      } else {
        permissionsById.set(
          userPermission.permission.id,
          userPermission.permission,
        );
      }
    }

    return Array.from(permissionsById.values()).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }

  private async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async ensureUserExists(id: string): Promise<void> {
    await this.findUserById(id);
  }
}
