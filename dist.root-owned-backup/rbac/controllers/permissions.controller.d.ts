import { CreatePermissionDto, PermissionFilterQueryDto, UpdatePermissionDto } from '../dto';
import { PermissionsService } from '../services/permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    findAll(query: PermissionFilterQueryDto): Promise<import("../entities/permission.entity").Permission[]>;
    create(dto: CreatePermissionDto): Promise<import("../entities/permission.entity").Permission>;
    updateWithPut(id: string, dto: UpdatePermissionDto): Promise<import("../entities/permission.entity").Permission>;
    updateWithPatch(id: string, dto: UpdatePermissionDto): Promise<import("../entities/permission.entity").Permission>;
    remove(id: string): Promise<void>;
}
