import { AuthenticatedRequest } from "@/middlewares";
import { activitiesService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

 
 async function getAvailableDays() {
    
 }
 
 async function getAvailableTimes() {
     
 }
 
 async function postActivity(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { activityId} = req.params;
    const activity = await activitiesService.postActivity(userId, activityId);
    res.sendStatus(httpStatus.CREATED);
 }
 
 export const activitiesController = {
     getAvailableDays,
     getAvailableTimes,
     postActivity
 }