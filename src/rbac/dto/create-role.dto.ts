import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateRoleDto {
	@ApiProperty({ example: 'manager' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	name!: string

	@ApiProperty({ example: 'Manager' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	display_name!: string
}
