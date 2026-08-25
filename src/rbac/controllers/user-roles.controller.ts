import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUserId } from '../decorators/current-user-id.decorator';
import { RequirePermission } from '../decorators/require-permissions.decorator';
import { AssignUserRolesDto, UpsertUserPermissionOverrideDto } from '../dto';
import { BearerTokenGuard } from '../guards/bearer-token.guard';
import { PermissionGuard } from '../guards/permissions.guard';
import { AccessCheckService } from '../services/access-check.service';
import { UserRolesService } from '../services/user-roles.service';

@ApiTags('RBAC User Roles')
@ApiBearerAuth()
@UseGuards(BearerTokenGuard, PermissionGuard)
@Controller('api/v1/rbac/users/:user_id')
export class UserRolesController {
  constructor(
    private readonly userRolesService: UserRolesService,
    private readonly accessCheckService: AccessCheckService,
  ) {}

  @Get('roles')
  @ApiOperation({ summary: 'Get all roles assigned to a user' })
  @ApiParam({ name: 'user_id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User roles list.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findUserRoles(@Param('user_id', ParseUUIDPipe) userId: string) {
    return this.userRolesService.findUserRoles(userId);
  }

  @Post('roles')
  @RequirePermission('roles.manage')
  @ApiOperation({ summary: 'Assign roles to a user' })
  @ApiParam({ name: 'user_id', description: 'User UUID' })
  @ApiResponse({ status: 201, description: 'Roles assigned to user.' })
  @ApiResponse({ status: 401, description: 'Current user id missing in JWT.' })
  @ApiResponse({ status: 404, description: 'User or role not found.' })
  assignRoles(
    @Param('user_id', ParseUUIDPipe) userId: string,
    @Body() dto: AssignUserRolesDto,
    @CurrentUserId() currentUserId?: string,
  ) {
    if (!currentUserId) {
      throw new UnauthorizedException('Current user id is required');
    }

    return this.userRolesService.assignRoles(userId, dto, currentUserId);
  }

  @Delete('roles/:role_id')
  @RequirePermission('roles.manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove one role from a user' })
  @ApiParam({ name: 'user_id', description: 'User UUID' })
  @ApiParam({ name: 'role_id', description: 'Role UUID' })
  @ApiResponse({ status: 204, description: 'Role removed from user.' })
  @ApiResponse({ status: 404, description: 'User role not found.' })
  removeRole(
    @Param('user_id', ParseUUIDPipe) userId: string,
    @Param('role_id', ParseUUIDPipe) roleId: string,
    @CurrentUserId() currentUserId?: string,
  ) {
    if (!currentUserId) {
      throw new UnauthorizedException('Current user id is required');
    }

    return this.userRolesService.removeRole(userId, roleId, currentUserId);
  }

  @Post('permissions/override')
  @RequirePermission('permissions.manage')
  @ApiOperation({ summary: 'Create or update a user permission override' })
  @ApiParam({ name: 'user_id', description: 'User UUID' })
  @ApiResponse({ status: 201, description: 'Permission override saved.' })
  @ApiResponse({ status: 404, description: 'User or permission not found.' })
  upsertPermissionOverride(
    @Param('user_id', ParseUUIDPipe) userId: string,
    @Body() dto: UpsertUserPermissionOverrideDto,
  ) {
    return this.userRolesService.upsertPermissionOverride(userId, dto);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get all effective permissions for a user' })
  @ApiParam({ name: 'user_id', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'Distinct effective permissions collected from user roles.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findEffectivePermissions(
    @Param('user_id', ParseUUIDPipe) userId: string,
    @CurrentUserId() currentUserId?: string,
  ) {
    await this.ensureCanViewAccess(userId, currentUserId);

    return this.userRolesService.findEffectivePermissions(userId);
  }

  private async ensureCanViewAccess(
    targetUserId: string,
    currentUserId?: string,
  ): Promise<void> {
    if (targetUserId === currentUserId) {
      return;
    }

    if (!currentUserId) {
      throw new UnauthorizedException('Current user id is required');
    }

    const canViewAccess = await this.accessCheckService.hasAccess(
      currentUserId,
      'users.view_access',
    );

    if (!canViewAccess) {
      throw new ForbiddenException('users.view_access permission is required');
    }
  }
}
