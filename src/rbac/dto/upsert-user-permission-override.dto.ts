import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsUUID } from 'class-validator'

export class UpsertUserPermissionOverrideDto {
	@ApiProperty({ example: '6bcf56f1-e21d-4589-a05c-1b4b4bfe917c' })
	@IsUUID('4')
	permission_id!: string

	@ApiProperty({
		example: true,
		description: 'true = explicit deny, false = explicit grant.',
	})
	@IsBoolean()
	is_denied!: boolean
}
