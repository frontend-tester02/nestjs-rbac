import { AssignRolePermissionsDto, CreateRoleDto, PaginationQueryDto, UpdateRoleDto } from '../dto';
import { RolesService } from '../services/roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(query: PaginationQueryDto): Promise<{
        items: import("../entities/role.entity").Role[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    create(dto: CreateRoleDto): Promise<import("../entities/role.entity").Role>;
    findOne(id: string): Promise<import("../entities/role.entity").Role>;
    updateWithPut(id: string, dto: UpdateRoleDto): Promise<import("../entities/role.entity").Role>;
    updateWithPatch(id: string, dto: UpdateRoleDto): Promise<import("../entities/role.entity").Role>;
    remove(id: string): Promise<void>;
    assignPermissions(id: string, dto: AssignRolePermissionsDto): Promise<import("../entities/role.entity").Role>;
    removePermission(id: string, permissionId: string): Promise<void>;
}
