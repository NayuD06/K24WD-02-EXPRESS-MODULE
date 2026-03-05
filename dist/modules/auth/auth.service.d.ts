import type { UserDatabase } from "../user/user.database.js";
import type { AuthDatabase } from "./auth.database.js";
export declare class AuthService {
    private readonly authDb;
    private readonly userDb;
    constructor(authDb: AuthDatabase, userDb: UserDatabase);
    login(input: {
        email: string;
        password: string;
        userAgent?: string;
        ip?: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(): Promise<void>;
    logout(): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map