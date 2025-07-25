import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
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

export const AuthServices={
    credentialsLogin,
    getNewAccessToken
}