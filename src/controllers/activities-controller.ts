import { AuthenticatedRequest } from "@/middlewares";
import { activitiesService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

 
 export async function getAvailableDays(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    
    const days = await activitiesService.getAvailableDays(userId);

    return res.status(httpStatus.OK).send(days);
 }
 
 export async function getAvailableTimes(req: AuthenticatedRequest, res: Response) {
     const date = req.params.date;
     const { userId } = req;

     const times = await activitiesService.getAvailableTimes(date, userId);

     return res.status(httpStatus.OK).send(times);
 }
 
 async function postActivity(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { activityId} = req.params;
    const activity = await activitiesService.postActivity(userId, activityId);
    res.sendStatus(httpStatus.CREATED);
 }
 
 export const activitiesController = {
     postActivity,
     getAvailableDays,
     getAvailableTimes
 }