import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePermissionDto,
  PermissionFilterQueryDto,
  UpdatePermissionDto,
} from '../dto';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  findAll(query: PermissionFilterQueryDto): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: query.module ? { module: query.module } : {},
      order: { module: 'ASC', name: 'ASC' },
    });
  }

  async create(dto: CreatePermissionDto): Promise<Permission> {
    await this.ensurePermissionNameIsAvailable(dto.name);

    return this.permissionRepository.save(
      this.permissionRepository.create({
        name: dto.name,
        displayName: dto.display_name,
        module: dto.module,
      }),
    );
  }

  async update(id: string, dto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.findPermissionById(id);

    if (dto.name && dto.name !== permission.name) {
      await this.ensurePermissionNameIsAvailable(dto.name);
      permission.name = dto.name;
    }

    if (dto.display_name !== undefined) {
      permission.displayName = dto.display_name;
    }

    if (dto.module !== undefined) {
      permission.module = dto.module;
    }

    return this.permissionRepository.save(permission);
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findPermissionById(id);

    await this.permissionRepository.remove(permission);
  }

  private async findPermissionById(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOneBy({ id });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  private async ensurePermissionNameIsAvailable(name: string): Promise<void> {
    const existingPermission = await this.permissionRepository.findOneBy({
      name,
    });

    if (existingPermission) {
      throw new ConflictException('Permission name already exists');
    }
  }
}
