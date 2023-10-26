import { activitiesController, getAvailableDays, getAvailableTimes } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter
    .all('/*', authenticateToken)
    .get('/', activitiesController.getAvailableDays)
    .get('/:date', activitiesController.getAvailableTimes)
    .post('/register/:activityId', activitiesController.postActivity);


export {activitiesRouter};

