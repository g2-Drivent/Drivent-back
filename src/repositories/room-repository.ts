import { Room } from '@prisma/client';
import { prisma } from '@/config';
import { redis } from '@/config/cache';

async function findAllByHotelId(hotelId: number) {
  const cache = await redis.get('rooms:all');

  if (cache) {
    const data: Room[] = JSON.parse(cache);
    return data;
  }

  const data = await prisma.room.findMany({
    where: { hotelId },
  });
  await redis.set('rooms:all', JSON.stringify(data));
  return data;
}

async function findById(roomId: number) {
  const cache = await redis.get(`rooms:${roomId}`);

  if (cache) {
    const data: Room = JSON.parse(cache);
    return data;
  }

  const data = await prisma.room.findFirst({
    where: { id: roomId },
  });
  await redis.set(`rooms:${roomId}`, JSON.stringify(data));
  return data;
}

export const roomRepository = {
  findAllByHotelId,
  findById,
};
