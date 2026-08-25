import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthTokenService } from './auth-token.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.userRepository.save(
      this.userRepository.create({
        email,
        fullName: dto.full_name,
        passwordHash: await this.passwordService.hash(dto.password),
        isActive: true,
      }),
    );

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOneBy({
      email: dto.email.toLowerCase(),
    });

    if (!user?.passwordHash || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordIsValid = await this.passwordService.verify(
      dto.password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async findMe(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private buildAuthResponse(user: User) {
    return {
      access_token: this.authTokenService.sign({
        sub: user.id,
        email: user.email ?? undefined,
      }),
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
      },
    };
  }
}
