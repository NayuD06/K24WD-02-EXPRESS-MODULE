import { hashPassword } from "../../utils/crypto.js";
import { ApiError } from "../../utils/http.js";
import type { UserDatabase, UserEntity } from "./user.database.js";
import type { UserRole } from "./user.model.js";

export class UserService {
  // Injection
  constructor(private readonly userDb: UserDatabase) {}

  async list(){
    return this.userDb.list()
  }
  async register(input:{email:string, password:string, role?:UserRole}):Promise<UserEntity>{
    const email= input.email.trim().toLowerCase();
    if(!email.includes("@")){
      throw new ApiError(400, {message:"Email must be include @"});
    }
    const password= input.password.trim();
    if(password.length<6){
      throw new ApiError(400, {message:"Password must be at least 6 characters"});
    }
    // NOTE: BTVN Bắt người dùng phải nhập 1 kí hiệu đặt biệt và viết hoa 1 chứ cái
    if(!/[A-Z]/.test(password)){
      throw new ApiError(400, {message:"Password must contain at least 1 uppercase letter"});
    }
    // NOTE: BTVN Bắt lỗi email tồn tại rồi 
    if(!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)){
      throw new ApiError(400, {message:"Password must contain at least 1 special character"});
    }
    const existingUser= await this.userDb.findByEmail(email);
    if(existingUser){
      throw new ApiError(409, {message:"Email already exists"});
    }
    const now= new Date();
    const hashPwd= await hashPassword(password);
    const role: UserRole= input.role || "customer";
    return this.userDb.create({
      email,
      passwordHash: hashPwd,
      role,
      createdAt: now,
      updatedAt: now,
    });
  }
}
