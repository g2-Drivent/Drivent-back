import { prisma } from '@/config';
import { PaymentParams } from '@/protocols';
import { ticketsRepository } from './tickets-repository';

async function findPaymentByTicketId(ticketId: number) {
  const result = await prisma.payment.findFirst({
    where: { ticketId },
  });
  return result;
}

async function processPayment(ticketId: number, params: PaymentParams) {
  await prisma.$transaction([
    createPayment(ticketId, params),
    ticketsRepository.ticketProcessPayment(ticketId)
  ])
}

function createPayment(ticketId: number, params: PaymentParams) {
  return prisma.payment.create({
    data: {
      ticketId,
      ...params,
    },
  });
}

export const paymentsRepository = {
  findPaymentByTicketId,
  processPayment,
};
