import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async verify(password: string, passwordHash: string): Promise<boolean> {
    const [salt, storedKey] = passwordHash.split(':');

    if (!salt || !storedKey) {
      return false;
    }

    const storedKeyBuffer = Buffer.from(storedKey, 'hex');
    const derivedKey = (await scryptAsync(
      password,
      salt,
      storedKeyBuffer.length,
    )) as Buffer;

    return (
      storedKeyBuffer.length === derivedKey.length &&
      timingSafeEqual(storedKeyBuffer, derivedKey)
    );
  }
}
