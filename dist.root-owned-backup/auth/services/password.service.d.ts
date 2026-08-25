export declare class PasswordService {
    hash(password: string): Promise<string>;
    verify(password: string, passwordHash: string): Promise<boolean>;
}
