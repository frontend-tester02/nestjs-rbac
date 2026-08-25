import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreatePermissionDto {
	@ApiProperty({ example: 'loans.approve' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(150)
	name!: string

	@ApiProperty({ example: 'Approve loans' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	display_name!: string

	@ApiProperty({ example: 'loans' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	module!: string
}
