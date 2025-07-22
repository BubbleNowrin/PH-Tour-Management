import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { userControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router=Router();


router.post("/register",validateRequest(createUserZodSchema),userControllers.createUser);
router.get("/all-users",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),userControllers.getAllUsers);
router.patch("/:id",validateRequest(updateUserZodSchema) ,checkAuth(...Object.values(Role)),userControllers.updateUser)

export const userRoutes=router;