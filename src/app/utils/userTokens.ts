import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env";
import AppError from "../errorHelpers/appError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";

export const createUserTokens=(user: Partial<IUser>)=>{
    const jwtPayload={
    userId:user._id,
    email:user.email,
    role:user.role
}

const accessToken= generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

const refreshToken=generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

return {
    accessToken,
    refreshToken
}
};

export const createNewAccessTokenWithRefreshToken=async(refreshToken:string)=>{
    const verifiedToken=verifyToken(refreshToken,envVars.JWT_REFRESH_SECRET) as JwtPayload;

const isUserExist=await User.findOne({email:verifiedToken.email});

if(!isUserExist){
    throw new AppError(httpStatus.BAD_REQUEST,"User not found with this email");
}

if(isUserExist.isActive===IsActive.BLOCKED || isUserExist.isActive===IsActive.INACTIVE){
    throw new AppError(httpStatus.BAD_REQUEST,`User is ${isUserExist.isActive}`);
}
if(isUserExist.isDeleted){
    throw new AppError(httpStatus.BAD_REQUEST,"User is deleted");
}
 const jwtPayload={
    userId:isUserExist._id,
    email:isUserExist.email,
    role:isUserExist.role
}

const accessToken= generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

return accessToken;

}