import { AuthenticatedRequest } from "@/middlewares";
import { registerService } from "@/services/register-service";
import { Response } from "express";
import httpStatus from "http-status";

 
 export async function getUserRegister(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    console.log("get register");
    const register = await registerService.getUserRegister(userId);

    return res.status(httpStatus.OK).send(register);
 }
 