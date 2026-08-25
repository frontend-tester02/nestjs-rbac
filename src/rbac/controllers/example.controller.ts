import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequirePermission } from '../decorators/require-permissions.decorator';
import { BearerTokenGuard } from '../guards/bearer-token.guard';
import { PermissionGuard } from '../guards/permissions.guard';

@ApiTags('RBAC Example')
@ApiBearerAuth()
@Controller('api/v1/rbac/example')
export class ExampleController {
  @Get('protected')
  @UseGuards(BearerTokenGuard, PermissionGuard)
  @RequirePermission('loans.approve')
  @ApiOperation({ summary: 'Example protected endpoint' })
  @ApiResponse({ status: 200, description: 'Access granted.' })
  @ApiResponse({
    status: 403,
    description: "Required permission is missing.",
  })
  protectedEndpoint() {
    return {
      message: 'Protected endpoint works.',
      required_permission: 'loans.approve',
    };
  }
}
