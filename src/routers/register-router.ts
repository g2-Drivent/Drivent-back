import { getUserRegister } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const registerRouter = Router();

registerRouter
    .all('/*', authenticateToken)
    .get('/', getUserRegister)

export {registerRouter};

