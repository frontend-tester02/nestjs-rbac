import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	ArrayNotEmpty,
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
} from 'class-validator'

export class BulkCheckAccessDto {
	@ApiPropertyOptional({
		example: '7a8f0c69-b058-40b1-9a6a-5c987f11b9b8',
		description: 'User UUID. If omitted, current JWT user is used.',
	})
	@IsOptional()
	@IsUUID('4')
	user_id?: string

	@ApiProperty({
		example: ['loans.approve', 'loans.reject', 'reports.export'],
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	@MaxLength(150, { each: true })
	permissions!: string[]
}
