/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userServices } from "./user.service";

// const createUser=async(req:Request,res:Response,next: NextFunction)=>{
// try {
// const user=await userServices.createUser(req.body);
// res.status(httpStatus.CREATED).json({
//     message:"User created successfully",
//     user
// })
    
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// } catch (err:any) {
//     console.log(err);
//     next(err);
// }
// }

const createUser=catchAsync(async(req:Request,res:Response,next: NextFunction)=>{
    const user=await userServices.createUser(req.body);
// res.status(httpStatus.CREATED).json({
//     message:"User created successfully",
//     user
// });
sendResponse(res,{
    statusCode:httpStatus.CREATED,
    success:true,
    message:"User created successfully",
    data:user
})
})

const getAllUsers=catchAsync(async(req:Request,res:Response,next: NextFunction)=>{
    const result= await userServices.getAllUsers();
    // res.status(httpStatus.OK).json({
    //     success:true,
    //     message:"Users fetched Successfully!!!",
    //     data: users
    // });
    sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:"Users fetched Successfully!!!",
    data:result.data,
    meta:result.meta
})
})

export const userControllers={
 createUser,
 getAllUsers
}

//route matching-> controller->service->model->db