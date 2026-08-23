import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { PermissionsService } from './services/permissions.service';
import { UserRolesService } from './services/user-roles.service';
import { AccessCheckService } from './services/access-check.service';

@Module({
  providers: [
    RolesService,
    PermissionsService,
    UserRolesService,
    AccessCheckService,
  ],
  exports: [
    RolesService,
    PermissionsService,
    UserRolesService,
    AccessCheckService,
  ],
})
export class RbacModule {}
