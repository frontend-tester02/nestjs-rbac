import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        token_type: string;
        user: {
            id: string;
            email: string | null;
            full_name: string | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        token_type: string;
        user: {
            id: string;
            email: string | null;
            full_name: string | null;
        };
    }>;
    me(userId: string): Promise<import("../users/entities/user.entity").User>;
}
