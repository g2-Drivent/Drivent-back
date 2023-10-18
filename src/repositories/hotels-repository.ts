import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findHotelsWithAvailability() {
  return prisma.hotel.findMany({
    include: {
      Rooms: {
        include: {
          Booking: true,
        },
      },
    },
  });
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

export const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findHotelsWithAvailability,
};
