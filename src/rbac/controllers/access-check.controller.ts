import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUserId } from '../decorators/current-user-id.decorator';
import { BulkCheckAccessDto, CheckAccessQueryDto } from '../dto';
import { BearerTokenGuard } from '../guards/bearer-token.guard';
import { AccessCheckService } from '../services/access-check.service';

@ApiTags('RBAC Access Check')
@ApiBearerAuth()
@UseGuards(BearerTokenGuard)
@Controller('api/v1/rbac/check-access')
export class AccessCheckController {
  constructor(private readonly accessCheckService: AccessCheckService) {}

  @Get()
  @ApiOperation({ summary: 'Check one permission for a user' })
  @ApiResponse({ status: 200, description: 'Single access check result.' })
  @ApiResponse({ status: 401, description: 'Current user id missing in JWT.' })
  @ApiResponse({
    status: 403,
    description: 'users.view_access is required for another user.',
  })
  async checkAccess(
    @Query() query: CheckAccessQueryDto,
    @CurrentUserId() currentUserId?: string,
  ) {
    const targetUserId = this.resolveTargetUserId(query.user_id, currentUserId);

    await this.ensureCanCheckTargetUser(targetUserId, currentUserId);

    return {
      user_id: targetUserId,
      permission: query.permission,
      has_access: await this.accessCheckService.hasAccess(
        targetUserId,
        query.permission,
      ),
    };
  }

  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check multiple permissions for a user' })
  @ApiResponse({ status: 200, description: 'Bulk access check result.' })
  @ApiResponse({ status: 401, description: 'Current user id missing in JWT.' })
  @ApiResponse({
    status: 403,
    description: 'users.view_access is required for another user.',
  })
  async checkBulkAccess(
    @Body() dto: BulkCheckAccessDto,
    @CurrentUserId() currentUserId?: string,
  ) {
    const targetUserId = this.resolveTargetUserId(dto.user_id, currentUserId);

    await this.ensureCanCheckTargetUser(targetUserId, currentUserId);

    return {
      user_id: targetUserId,
      results: await this.accessCheckService.hasBulkAccess(
        targetUserId,
        dto.permissions,
      ),
    };
  }

  private resolveTargetUserId(
    requestedUserId?: string,
    currentUserId?: string,
  ): string {
    const targetUserId = requestedUserId ?? currentUserId;

    if (!targetUserId) {
      throw new UnauthorizedException('Current user id is required');
    }

    return targetUserId;
  }

  private async ensureCanCheckTargetUser(
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
