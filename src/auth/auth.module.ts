import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BearerTokenGuard } from '../rbac/guards/bearer-token.guard';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { AuthTokenService } from './services/auth-token.service';
import { PasswordService } from './services/password.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, AuthTokenService, PasswordService, BearerTokenGuard],
  exports: [AuthTokenService],
})
export class AuthModule {}
