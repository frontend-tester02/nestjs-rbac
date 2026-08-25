import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { AccessCheckController } from './controllers/access-check.controller';
import { ExampleController } from './controllers/example.controller';
import { PermissionsController } from './controllers/permissions.controller';
import { RolesController } from './controllers/roles.controller';
import { UserRolesController } from './controllers/user-roles.controller';
import { AuditLog } from './entities/audit-log.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserPermission } from './entities/user-permission.entity';
import { UserRole } from './entities/user-role.entity';
import { BearerTokenGuard } from './guards/bearer-token.guard';
import { PermissionGuard } from './guards/permissions.guard';
import { AuditLogService } from './services/audit-log.service';
import { CacheInvalidationService } from './services/cache-invalidation.service';
import { RolesService } from './services/roles.service';
import { PermissionsService } from './services/permissions.service';
import { UserRolesService } from './services/user-roles.service';
import { AccessCheckService } from './services/access-check.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Permission,
      Role,
      RolePermission,
      AuditLog,
      User,
      UserPermission,
      UserRole,
    ]),
  ],
  controllers: [
    RolesController,
    PermissionsController,
    UserRolesController,
    AccessCheckController,
    ExampleController,
  ],
  providers: [
    RolesService,
    PermissionsService,
    UserRolesService,
    AccessCheckService,
    AuditLogService,
    CacheInvalidationService,
    BearerTokenGuard,
    PermissionGuard,
  ],
  exports: [
    RolesService,
    PermissionsService,
    UserRolesService,
    AccessCheckService,
    AuditLogService,
    CacheInvalidationService,
  ],
})
export class RbacModule {}
