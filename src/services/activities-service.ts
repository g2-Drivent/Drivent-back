import { ForbiddenError, conflictError, requestError } from "@/errors";
import { activitiesRepository } from "@/repositories";
import dayjs from "dayjs";
import httpStatus from "http-status";

 
 async function getAvailableDays() {
    
 }
 
 async function getAvailableTimes() {
     
 }
 

 function formatEndTime (date: string | Date, duration: number) {
    const endTime = dayjs(date).add(duration, 'minute').toDate(); 
    return endTime;
 }

 async function postActivity(userId: number, activityId: string) {
    const id = parseInt(activityId);
    if (!id || isNaN(id)) throw requestError(httpStatus.BAD_REQUEST, 'Invalid activityId');

    const time = await activitiesRepository.getTimeById(id);
    /* const time = {
        date: '2023-10-25T11:00:30.000Z',
        duration: 45,
        capacity: 3
    } */
    const startActivity = new Date(time.date);
    const endTimeActivity = formatEndTime(time.date, time.duration);

    const interval = await activitiesRepository.getInterval(userId)
    
    const att = interval.map(h => {
        const {date, duration} = h.Activity;
        const endTime = formatEndTime(date, duration);
        const newActivity = { ...h.Activity, endTime };
       return {
        ...h,
        Activity: newActivity
       }
    })
    att.map(c => {
        const {date, endTime} = c.Activity;
        const overlap = (date <= endTimeActivity) && (endTime >= startActivity);
        if (overlap) throw conflictError('Overlapping schedules');
    })

    const registered = await activitiesRepository.countRegisterd(id);
    console.log(typeof registered)
    console.log(typeof time.capacity)

    if(time.capacity <= registered) throw ForbiddenError();

    const createRegister = await activitiesRepository.postActivity(userId, id);
    return createRegister;    
 }
 
 export const activitiesService = {
     getAvailableDays,
     getAvailableTimes,
     postActivity
 }