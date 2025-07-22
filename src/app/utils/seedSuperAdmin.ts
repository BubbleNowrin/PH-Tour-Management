import bcryptjs from "bcryptjs";
import envVars from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin=async()=>{
    try {
        const isSuperAdminExist=await User.findOne({email:envVars.SUPER_ADMIN_EMAIL});

    if(isSuperAdminExist){
        console.log("Super Admin already exists");
        return;
    }

    const hashedPassword=await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));

    const authProvider: IAuthProvider={
        provider:"credentials",
        providerId:envVars.SUPER_ADMIN_EMAIL
    }

    const payload:IUser={
        email:envVars.SUPER_ADMIN_EMAIL,
        password:hashedPassword,
        role:Role.SUPER_ADMIN,
        name: "Super Admin",
        isVerified: true,
        auths:[authProvider]
    }

    const superAdmin=await User.create(payload);
    console.log("Super Admin created successfully:", superAdmin.email);
    } catch (error) {
        console.error("Error creating Super Admin:", error);
    }
}