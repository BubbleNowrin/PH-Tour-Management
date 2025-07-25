/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthServices } from "./auth.service";


const credentialsLogin=catchAsync(async(req:Request,res:Response,next: NextFunction)=>{

  const loginInfo=await AuthServices.credentialsLogin(req.body)

  // res.cookie("accessToken", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })


    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false,
    // })

    setAuthCookie(res, loginInfo)

sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:"User logged in successfully",
    data:loginInfo
})
})

const getNewAccessToken=catchAsync(async(req:Request,res:Response,next: NextFunction)=>{

  const refreshToken=req.cookies.refreshToken;
  if(!refreshToken){
    throw new AppError(httpStatus.BAD_REQUEST,"No Refresh token received from cookies");
  }
  const tokenInfo=await AuthServices.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo)

sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:"New Access Token Retrieved successfully",
    data:tokenInfo
})
})

const logout=catchAsync(async(req:Request,res:Response,next: NextFunction)=>{

  res.clearCookie("accessToken",{
    httpOnly:true,
    secure:false
  })

  res.clearCookie("refreshToken",{
    httpOnly:true,
    secure:false
  })

sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:"User logged out successfully",
    data:null
})
})

export const AuthControllers={
    credentialsLogin,
    getNewAccessToken,
    logout
}