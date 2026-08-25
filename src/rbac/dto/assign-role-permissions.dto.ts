import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator'

export class AssignRolePermissionsDto {
	@ApiProperty({
		example: ['6bcf56f1-e21d-4589-a05c-1b4b4bfe917c'],
		description:
			'Permission UUID values. Kept as permission_ids for API compatibility.',
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsUUID('4', { each: true })
	permission_ids!: string[]
}
