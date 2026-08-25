import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PermissionFilterQueryDto {
  @ApiPropertyOptional({ example: 'loans' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  module?: string;
}
