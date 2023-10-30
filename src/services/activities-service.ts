import { ForbiddenError, conflictError, requestError, notFoundError } from "@/errors";
import { activitiesRepository, bookingRepository, enrollmentRepository, ticketsRepository } from "@/repositories"
import dayjs from "dayjs";
import httpStatus from "http-status";
import { TicketStatus } from "@prisma/client";


 
 async function getAvailableDays(userId: number) {
   const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
   if (!enrollment) throw notFoundError();

   const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
   if (!ticket) throw notFoundError();

   const type = ticket.TicketType;

   if (ticket.status === TicketStatus.RESERVED || type.isRemote) {
      if (!ticket) throw notFoundError();
   }
   const booking = await bookingRepository.findByUserId(userId);
   if (!type.isRemote && type.includesHotel && !booking) {
      if (!ticket) throw notFoundError();
   }

    const activityTimes = await activitiesRepository.getAvailableDays();
    activityTimes.sort((a,b) => dayjs(a.date).diff(b.date))
    const activityDates = [...new Set(activityTimes.map(t => dayjs(t.date).startOf('day').toISOString()))];
    return activityDates;
 }
 
 async function getAvailableTimes(date: string, userId: number) {
   const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
   if (!enrollment) throw notFoundError();

   const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
   if (!ticket) throw notFoundError();

   const type = ticket.TicketType;

   if (ticket.status === TicketStatus.RESERVED || type.isRemote) {
      if (!ticket) throw notFoundError();
   }
   const booking = await bookingRepository.findByUserId(userId);
   if (!type.isRemote && type.includesHotel && !booking) {
      if (!ticket) throw notFoundError();
   }

    const times = await activitiesRepository.getAvailableTimes(date);
    times.sort((a,b) => dayjs(a.date).diff(b.date));
    const activities = times.map(t => {
      let status = "open";
      if (t.Register.length === t.capacity)
         status = "closed";
      t.Register.forEach(r => {
         if (r.userId === userId)
            status = "joined";
      })
      return {
         activityId: t.id,
         date: t.date,
         duration: t.duration,
         title: t.name,
         place: t.local,
         status: status,
         spacesLeft: t.capacity - t.Register.length
      }

    })
    return activities;
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
        const overlap = (date < endTimeActivity) && (endTime > startActivity) && dayjs(date).startOf('day').diff(dayjs(startActivity).startOf('day')) === 0;
        if (overlap) throw conflictError('Overlapping schedules');
    })

    const registered = await activitiesRepository.countRegisterd(id);

    if(time.capacity <= registered) throw ForbiddenError();

    const createRegister = await activitiesRepository.postActivity(userId, id);
    return createRegister;    
 }
 
 export const activitiesService = {
     getAvailableDays,
     getAvailableTimes,
     postActivity
 }