import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class CacheInvalidationService {
  private readonly logger = new Logger(CacheInvalidationService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async invalidateUserPermissions(userId: string): Promise<void> {
    await this.deleteCacheKey(this.getUserPermissionsKey(userId));
  }

  async invalidateRoleUsersPermissions(roleId: string): Promise<void> {
    const userRoles = await this.userRoleRepository.find({
      where: { role: { id: roleId } },
      relations: { user: true },
    });

    await Promise.all(
      userRoles.map((userRole) =>
        this.invalidateUserPermissions(userRole.user.id),
      ),
    );
  }

  private getUserPermissionsKey(userId: string): string {
    return `user:${userId}:permissions`;
  }

  private async deleteCacheKey(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.warn(
        `Failed to delete cache key "${key}". Continuing without cache invalidation.`,
      );
      this.logger.debug(error);
    }
  }
}
