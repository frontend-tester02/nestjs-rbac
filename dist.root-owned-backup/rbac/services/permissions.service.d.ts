import { Repository } from 'typeorm';
import { CreatePermissionDto, PermissionFilterQueryDto, UpdatePermissionDto } from '../dto';
import { Permission } from '../entities/permission.entity';
export declare class PermissionsService {
    private readonly permissionRepository;
    constructor(permissionRepository: Repository<Permission>);
    findAll(query: PermissionFilterQueryDto): Promise<Permission[]>;
    create(dto: CreatePermissionDto): Promise<Permission>;
    update(id: string, dto: UpdatePermissionDto): Promise<Permission>;
    remove(id: string): Promise<void>;
    private findPermissionById;
    private ensurePermissionNameIsAvailable;
}
