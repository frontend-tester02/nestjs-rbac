import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  AssignRolePermissionsDto,
  CreateRoleDto,
  PaginationQueryDto,
  UpdateRoleDto,
} from '../dto';
import { Permission } from '../entities/permission.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { CacheInvalidationService } from './cache-invalidation.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly cacheInvalidationService: CacheInvalidationService,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const [items, total] = await this.roleRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return {
      items,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
      },
    };
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    await this.ensureRoleNameIsAvailable(dto.name);

    return this.roleRepository.save(
      this.roleRepository.create({
        name: dto.name,
        displayName: dto.display_name,
      }),
    );
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: {
        rolePermissions: {
          permission: true,
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findRoleById(id);

    if (dto.name && dto.name !== role.name) {
      await this.ensureRoleNameIsAvailable(dto.name);
      role.name = dto.name;
    }

    if (dto.display_name !== undefined) {
      role.displayName = dto.display_name;
    }

    return this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findRoleById(id);
    const usersCount = await this.userRoleRepository.count({
      where: { role: { id } },
    });

    if (usersCount > 0) {
      throw new ConflictException('Role is assigned to users');
    }

    await this.roleRepository.remove(role);
  }

  async assignPermissions(
    id: string,
    dto: AssignRolePermissionsDto,
  ): Promise<Role> {
    const role = await this.findRoleById(id);
    const permissions = await this.permissionRepository.findBy({
      id: In(dto.permission_ids),
    });

    if (permissions.length !== dto.permission_ids.length) {
      throw new NotFoundException('One or more permissions were not found');
    }

    for (const permission of permissions) {
      const exists = await this.rolePermissionRepository.findOne({
        where: {
          role: { id: role.id },
          permission: { id: permission.id },
        },
      });

      if (!exists) {
        await this.rolePermissionRepository.save(
          this.rolePermissionRepository.create({ role, permission }),
        );
      }
    }

    await this.cacheInvalidationService.invalidateRoleUsersPermissions(id);

    return this.findOne(id);
  }

  async removePermission(id: string, permissionId: string): Promise<void> {
    await this.findRoleById(id);
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: {
        role: { id },
        permission: { id: permissionId },
      },
    });

    if (!rolePermission) {
      throw new NotFoundException('Role permission not found');
    }

    await this.rolePermissionRepository.remove(rolePermission);
    await this.cacheInvalidationService.invalidateRoleUsersPermissions(id);
  }

  private async findRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  private async ensureRoleNameIsAvailable(name: string): Promise<void> {
    const existingRole = await this.roleRepository.findOneBy({ name });

    if (existingRole) {
      throw new ConflictException('Role name already exists');
    }
  }
}
