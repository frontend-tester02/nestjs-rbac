import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator'

export class AssignUserRolesDto {
	@ApiProperty({
		example: ['99f2f92f-0f22-4a0f-a936-29d9f0afba72'],
		description: 'Role UUID values. Kept as role_ids for API compatibility.',
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsUUID('4', { each: true })
	role_ids!: string[]
}
