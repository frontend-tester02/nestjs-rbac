import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AssignRolePermissionsDto,
  CreateRoleDto,
  PaginationQueryDto,
  UpdateRoleDto,
} from '../dto';
import { RequirePermission } from '../decorators/require-permissions.decorator';
import { BearerTokenGuard } from '../guards/bearer-token.guard';
import { PermissionGuard } from '../guards/permissions.guard';
import { RolesService } from '../services/roles.service';

@ApiTags('RBAC Roles')
@ApiBearerAuth()
@UseGuards(BearerTokenGuard, PermissionGuard)
@Controller('api/v1/rbac/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get roles with pagination' })
  @ApiResponse({ status: 200, description: 'Roles list with total count.' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.rolesService.findAll(query);
  }

  @Post()
  @RequirePermission('roles.manage')
  @ApiOperation({ summary: 'Create a role' })
  @ApiResponse({ status: 201, description: 'Role created.' })
  @ApiResponse({ status: 403, description: 'roles.manage permission is required.' })
  @ApiResponse({ status: 409, description: 'Role name already exists.' })
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by id with permissions' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiResponse({ status: 200, description: 'Role with assigned permissions.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @RequirePermission('roles.manage')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiResponse({ status: 200, description: 'Role updated.' })
  @ApiResponse({ status: 403, description: 'roles.manage permission is required.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 409, description: 'Role name already exists.' })
  updateWithPut(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, dto);
  }

  @Patch(':id')
  @RequirePermission('roles.manage')
  @ApiOperation({ summary: 'Patch a role' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiResponse({ status: 200, description: 'Role updated.' })
  @ApiResponse({ status: 403, description: 'roles.manage permission is required.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 409, description: 'Role name already exists.' })
  updateWithPatch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('roles.manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiResponse({ status: 204, description: 'Role deleted.' })
  @ApiResponse({ status: 403, description: 'roles.manage permission is required.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 409, description: 'Role is assigned to users.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }

  @Post(':id/permissions')
  @RequirePermission('roles.manage')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiResponse({ status: 201, description: 'Permissions assigned.' })
  @ApiResponse({ status: 403, description: 'roles.manage permission is required.' })
  @ApiResponse({ status: 404, description: 'Role or permission not found.' })
  assignPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignRolePermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, dto);
  }

  @Delete(':id/permissions/:permission_id')
  @RequirePermission('roles.manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove one permission from a role' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiParam({ name: 'permission_id', description: 'Permission UUID' })
  @ApiResponse({ status: 204, description: 'Permission removed from role.' })
  @ApiResponse({ status: 403, description: 'roles.manage permission is required.' })
  @ApiResponse({ status: 404, description: 'Role permission not found.' })
  removePermission(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('permission_id', ParseUUIDPipe) permissionId: string,
  ) {
    return this.rolesService.removePermission(id, permissionId);
  }
}
