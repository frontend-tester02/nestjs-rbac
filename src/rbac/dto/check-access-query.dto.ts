import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
} from 'class-validator'

export class CheckAccessQueryDto {
	@ApiProperty({ example: 'loans.approve' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(150)
	permission!: string

	@ApiPropertyOptional({
		example: '7a8f0c69-b058-40b1-9a6a-5c987f11b9b8',
		description: 'User UUID. If omitted, current JWT user is used.',
	})
	@IsOptional()
	@IsUUID('4')
	user_id?: string
}
