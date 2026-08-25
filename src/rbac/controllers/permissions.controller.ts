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
  CreatePermissionDto,
  PermissionFilterQueryDto,
  UpdatePermissionDto,
} from '../dto';
import { RequirePermission } from '../decorators/require-permissions.decorator';
import { BearerTokenGuard } from '../guards/bearer-token.guard';
import { PermissionGuard } from '../guards/permissions.guard';
import { PermissionsService } from '../services/permissions.service';

@ApiTags('RBAC Permissions')
@ApiBearerAuth()
@UseGuards(BearerTokenGuard, PermissionGuard)
@Controller('api/v1/rbac/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get permissions, optionally filtered by module' })
  @ApiResponse({ status: 200, description: 'Permissions list.' })
  findAll(@Query() query: PermissionFilterQueryDto) {
    return this.permissionsService.findAll(query);
  }

  @Post()
  @RequirePermission('permissions.manage')
  @ApiOperation({ summary: 'Create a permission' })
  @ApiResponse({ status: 201, description: 'Permission created.' })
  @ApiResponse({
    status: 403,
    description: 'permissions.manage permission is required.',
  })
  @ApiResponse({ status: 409, description: 'Permission name already exists.' })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Put(':id')
  @RequirePermission('permissions.manage')
  @ApiOperation({ summary: 'Update a permission' })
  @ApiParam({ name: 'id', description: 'Permission UUID' })
  @ApiResponse({ status: 200, description: 'Permission updated.' })
  @ApiResponse({
    status: 403,
    description: 'permissions.manage permission is required.',
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  @ApiResponse({ status: 409, description: 'Permission name already exists.' })
  updateWithPut(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, dto);
  }

  @Patch(':id')
  @RequirePermission('permissions.manage')
  @ApiOperation({ summary: 'Patch a permission' })
  @ApiParam({ name: 'id', description: 'Permission UUID' })
  @ApiResponse({ status: 200, description: 'Permission updated.' })
  @ApiResponse({
    status: 403,
    description: 'permissions.manage permission is required.',
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  @ApiResponse({ status: 409, description: 'Permission name already exists.' })
  updateWithPatch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('permissions.manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a permission' })
  @ApiParam({ name: 'id', description: 'Permission UUID' })
  @ApiResponse({ status: 204, description: 'Permission deleted.' })
  @ApiResponse({
    status: 403,
    description: 'permissions.manage permission is required.',
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.remove(id);
  }
}
