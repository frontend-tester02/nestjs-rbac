import 'reflect-metadata';
import dataSource from '../data-source';
import { Permission } from '../../rbac/entities/permission.entity';
import { RolePermission } from '../../rbac/entities/role-permission.entity';
import { Role } from '../../rbac/entities/role.entity';

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

const rolePermissions: Record<string, string[]> = {
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

async function seedRbac(): Promise<void> {
  await dataSource.initialize();

  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  const rolePermissionRepository = dataSource.getRepository(RolePermission);

  await roleRepository.upsert(roles, ['name']);
  await permissionRepository.upsert(permissions, ['name']);

  const savedRoles = await roleRepository.find();
  const savedPermissions = await permissionRepository.find();

  const rolesByName = new Map(savedRoles.map((role) => [role.name, role]));
  const permissionsByName = new Map(
    savedPermissions.map((permission) => [permission.name, permission]),
  );

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
        await rolePermissionRepository.save(
          rolePermissionRepository.create({ role, permission }),
        );
      }
    }
  }
}

seedRbac()
  .then(async () => {
    await dataSource.destroy();
    console.log('RBAC seed completed successfully.');
  })
  .catch(async (error: unknown) => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    console.error('RBAC seed failed.');
    console.error(error);
    process.exit(1);
  });
