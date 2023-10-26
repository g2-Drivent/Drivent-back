import { notFoundError } from "@/errors";
import { bookingRepository, enrollmentRepository, ticketsRepository } from "@/repositories"
import { registerRepository } from "@/repositories/register-repository";
import { TicketStatus } from "@prisma/client";

 
 async function getUserRegister(userId: number) {
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

    const register = await registerRepository.getUserRegister(userId);
    return register;
 }
 
 export const registerService = {
     getUserRegister
 }