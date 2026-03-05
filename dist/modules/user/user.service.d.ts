import type { UserDatabase, UserEntity } from "./user.database.js";
import type { UserRole } from "./user.model.js";
export declare class UserService {
    private readonly userDb;
    constructor(userDb: UserDatabase);
    list(): Promise<UserEntity[]>;
    register(input: {
        email: string;
        password: string;
        role?: UserRole;
    }): Promise<UserEntity>;
    replace(id: string, input: {
        email: string;
        password: string;
        role: UserRole;
    }): Promise<UserEntity | null>;
    update(id: string, input: Partial<{
        email: string;
        password: string;
        role: UserRole;
    }>): Promise<UserEntity | null>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map