import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env";
import AppError from "../errorHelpers/appError";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const checkAuth=(...authRoles:string[])=>async (req:Request,res:Response,next:NextFunction)=>{

    try {
        const accessToken= req.headers.authorization;

    if(!accessToken){
        throw new AppError(403, "Token not received")
    }

    const verifiedToken=jwt.verify(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload;

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
   

    // if(!verifiedToken){
    //     throw new AppError(403, "You are not authorized")
    // }
    

    if(!authRoles.includes(verifiedToken.role)){
        throw new AppError(403, "You are not permitted to view this route!!!")
    }

    req.user=verifiedToken;
    next();
        
    } catch (error) {
        next(error);
    }

};