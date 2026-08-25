import { BulkCheckAccessDto, CheckAccessQueryDto } from '../dto';
import { AccessCheckService } from '../services/access-check.service';
export declare class AccessCheckController {
    private readonly accessCheckService;
    constructor(accessCheckService: AccessCheckService);
    checkAccess(query: CheckAccessQueryDto, currentUserId?: string): Promise<{
        user_id: string;
        permission: string;
        has_access: boolean;
    }>;
    checkBulkAccess(dto: BulkCheckAccessDto, currentUserId?: string): Promise<{
        user_id: string;
        results: Record<string, boolean>;
    }>;
    private resolveTargetUserId;
    private ensureCanCheckTargetUser;
}
