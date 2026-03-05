import type { UserDatabase, UserEntity } from "./auth.database.js";
import type { UserRole } from "./auth.model.js";
export declare class UserService {
    private readonly userDb;
    constructor(userDb: UserDatabase);
    list(): Promise<UserEntity[]>;
    register(input: {
        email: string;
        password: string;
        role?: UserRole;
    }): Promise<UserEntity>;
}
//# sourceMappingURL=user.service.d.ts.map