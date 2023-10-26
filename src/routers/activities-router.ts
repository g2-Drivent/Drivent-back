import { activitiesController, getAvailableDays, getAvailableTimes } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter
    .all('/*', authenticateToken)
    .get('/', getAvailableDays)
    .get('/:date', getAvailableTimes)
    .post('/register', activitiesController.postActivity);

export {activitiesRouter};

