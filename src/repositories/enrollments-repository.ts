import { Enrollment, PrismaClient } from '@prisma/client';
import { prisma } from '@/config';
import { CreateAddressParams, UpdateAddressParams, addressRepository } from './address-repository';
import { enrollmentNotFoundError } from '@/errors';

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function upsertEnrollmentAndAddress(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
  createdAddress: CreateAddressParams,
  updatedAddress: UpdateAddressParams
) {

  return await prisma.$transaction(async (tx) => {
    const newEnrollment = await tx.enrollment.upsert({
      where: {
        userId,
      },
      create: createdEnrollment,
      update: updatedEnrollment,
    })

    if (!newEnrollment) {
      throw enrollmentNotFoundError
    }

    const address = await tx.address.upsert({
      where: {
        enrollmentId: newEnrollment.id,
      },
      create: {
        ...createdAddress,
        Enrollment: { connect: { id: newEnrollment.id } },
      },
      update: updatedAddress,
    });
    return address;
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, 'userId'>;

export const enrollmentRepository = {
  findWithAddressByUserId,
  upsertEnrollmentAndAddress,
};
