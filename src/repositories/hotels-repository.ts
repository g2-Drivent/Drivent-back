import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';
import { redis } from '@/config/cache';

async function findHotels() {
  const cache = await redis.get('hotels:all');

  if (cache) {
    const data: Hotel[] = JSON.parse(cache);
    return data;
  }

  const data = await prisma.hotel.findMany();
  await redis.set('hotels:all', JSON.stringify(data)); // Sem TTL pois os hotéis não mudam tão facilmente.
  return data;
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
  const cache = await redis.get(`hotels:${hotelId}`);

  if (cache) {
    const data: Hotel[] & { Room: Room[] } = JSON.parse(cache);
    return data;
  }

  const data = await prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
  await redis.set(`hotels:${hotelId}`, JSON.stringify(data), { EX: 600 });
  return data;
}

export const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findHotelsWithAvailability,
};
