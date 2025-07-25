/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin=async(payload: Partial<IUser>)=>{

const {email,password}=payload;

const isUserExist=await User.findOne({email});

if(!isUserExist){
    throw new AppError(httpStatus.BAD_REQUEST,"User not found with this email");
}

const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

if(!isPasswordMatched){
    throw new AppError(httpStatus.BAD_REQUEST,"Password doesn't match");
}

const userTokens=createUserTokens(isUserExist);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const {password:pass, ...rest}=isUserExist.toObject();

return {
    user: rest,
    accessToken:userTokens.accessToken,
    refreshToken:userTokens.refreshToken
}
};

const  getNewAccessToken=async(refreshToken:string)=>{

const newAccessToken=await  createNewAccessTokenWithRefreshToken(refreshToken);

return {
    accessToken:newAccessToken
}
};
const  resetPassword=async(decodedToken:JwtPayload, newPassword:string,oldPassword:string)=>{
 const user = await User.findById(decodedToken.userId);

 const isOldPasswordMatched=await bcryptjs.compare(oldPassword,user!.password as string);
 if(!isOldPasswordMatched){
    throw new AppError(httpStatus.BAD_REQUEST,"Old Password doesn't match");
 }

 user!.password= await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

user!.save();

 return true;
};

export const AuthServices={
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}