import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env";
import AppError from "../errorHelpers/appError";

export const checkAuth=(...authRoles:string[])=>async (req:Request,res:Response,next:NextFunction)=>{

    try {
        const accessToken= req.headers.authorization;

    if(!accessToken){
        throw new AppError(403, "Token not received")
    }

    const verifiedToken=jwt.verify(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload;
    console.log(verifiedToken);

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