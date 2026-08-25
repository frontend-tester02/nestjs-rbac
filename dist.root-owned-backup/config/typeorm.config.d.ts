import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
export declare function getTypeOrmConfig(configService: ConfigService): TypeOrmModuleOptions;
