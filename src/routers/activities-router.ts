import { activitiesController } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter
    //.all('/*', authenticateToken)
    .get('/', activitiesController.getAvailableDays)
    .get('/register', activitiesController.getAvailableTimes)
    .post('/register/:activityId', activitiesController.postActivity);

export {activitiesRouter};

