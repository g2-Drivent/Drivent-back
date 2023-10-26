import { notFoundError } from "@/errors";
import { activitiesRepository, bookingRepository, enrollmentRepository, ticketsRepository } from "@/repositories"
import { TicketStatus } from "@prisma/client";
import dayjs from "dayjs";

 
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
 
 async function postActivity() {
     
 }
 
 export const activitiesService = {
     getAvailableDays,
     getAvailableTimes,
     postActivity
 }