import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";

export const router=Router();

const moduleRoutes=[
    {
        path:"/user",
        route: userRoutes
    },
    {
        path:"/auth",
        route: authRoutes
    }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route);
})