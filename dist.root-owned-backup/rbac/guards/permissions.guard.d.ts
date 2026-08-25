import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessCheckService } from '../services/access-check.service';
export declare class PermissionGuard implements CanActivate {
    private readonly reflector;
    private readonly accessCheckService;
    constructor(reflector: Reflector, accessCheckService: AccessCheckService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
