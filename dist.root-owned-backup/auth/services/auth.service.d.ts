import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthTokenService } from './auth-token.service';
import { PasswordService } from './password.service';
export declare class AuthService {
    private readonly userRepository;
    private readonly passwordService;
    private readonly authTokenService;
    constructor(userRepository: Repository<User>, passwordService: PasswordService, authTokenService: AuthTokenService);
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
    findMe(userId: string): Promise<User>;
    private buildAuthResponse;
}
