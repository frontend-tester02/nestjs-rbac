"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("../data-source");
const permission_entity_1 = require("../../rbac/entities/permission.entity");
const role_permission_entity_1 = require("../../rbac/entities/role-permission.entity");
const role_entity_1 = require("../../rbac/entities/role.entity");
const roles = [
    {
        name: 'admin',
        displayName: 'Admin',
        isSuperAdmin: true,
    },
    {
        name: 'manager',
        displayName: 'Manager',
        isSuperAdmin: false,
    },
    {
        name: 'operator',
        displayName: 'Operator',
        isSuperAdmin: false,
    },
    {
        name: 'viewer',
        displayName: 'Viewer',
        isSuperAdmin: false,
    },
];
const permissions = [
    {
        name: 'users.create',
        displayName: 'Create users',
        module: 'users',
    },
    {
        name: 'users.view',
        displayName: 'View users',
        module: 'users',
    },
    {
        name: 'users.edit',
        displayName: 'Edit users',
        module: 'users',
    },
    {
        name: 'users.delete',
        displayName: 'Delete users',
        module: 'users',
    },
    {
        name: 'users.view_access',
        displayName: 'View user access',
        module: 'users',
    },
    {
        name: 'loans.approve',
        displayName: 'Approve loans',
        module: 'loans',
    },
    {
        name: 'loans.reject',
        displayName: 'Reject loans',
        module: 'loans',
    },
    {
        name: 'loans.view',
        displayName: 'View loans',
        module: 'loans',
    },
    {
        name: 'reports.export',
        displayName: 'Export reports',
        module: 'reports',
    },
    {
        name: 'reports.view',
        displayName: 'View reports',
        module: 'reports',
    },
    {
        name: 'roles.manage',
        displayName: 'Manage roles',
        module: 'roles',
    },
    {
        name: 'permissions.manage',
        displayName: 'Manage permissions',
        module: 'permissions',
    },
];
const rolePermissions = {
    manager: [
        ...permissions
            .map((permission) => permission.name)
            .filter((permissionName) => permissionName.startsWith('loans.')),
        'reports.view',
    ],
    operator: ['loans.view', 'reports.view'],
    viewer: permissions
        .map((permission) => permission.name)
        .filter((permissionName) => permissionName.endsWith('.view')),
};
async function seedRbac() {
    await data_source_1.default.initialize();
    const roleRepository = data_source_1.default.getRepository(role_entity_1.Role);
    const permissionRepository = data_source_1.default.getRepository(permission_entity_1.Permission);
    const rolePermissionRepository = data_source_1.default.getRepository(role_permission_entity_1.RolePermission);
    await roleRepository.upsert(roles, ['name']);
    await permissionRepository.upsert(permissions, ['name']);
    const savedRoles = await roleRepository.find();
    const savedPermissions = await permissionRepository.find();
    const rolesByName = new Map(savedRoles.map((role) => [role.name, role]));
    const permissionsByName = new Map(savedPermissions.map((permission) => [permission.name, permission]));
    for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
        const role = rolesByName.get(roleName);
        if (!role) {
            throw new Error(`Role not found after upsert: ${roleName}`);
        }
        for (const permissionName of permissionNames) {
            const permission = permissionsByName.get(permissionName);
            if (!permission) {
                throw new Error(`Permission not found after upsert: ${permissionName}`);
            }
            const exists = await rolePermissionRepository.findOne({
                where: {
                    role: { id: role.id },
                    permission: { id: permission.id },
                },
            });
            if (!exists) {
                await rolePermissionRepository.save(rolePermissionRepository.create({ role, permission }));
            }
        }
    }
}
seedRbac()
    .then(async () => {
    await data_source_1.default.destroy();
    console.log('RBAC seed completed successfully.');
})
    .catch(async (error) => {
    if (data_source_1.default.isInitialized) {
        await data_source_1.default.destroy();
    }
    console.error('RBAC seed failed.');
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=rbac.seed.js.map