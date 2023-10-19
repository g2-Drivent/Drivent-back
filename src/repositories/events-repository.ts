import { Event } from '@prisma/client';
import { prisma } from '@/config';
import { redis } from '@/config/cache';

async function findFirst(): Promise<Event> {
  const cache = await redis.get('event');

  if (cache) {
    const data: Event = JSON.parse(cache);
    return data;
  }

  const data = await prisma.event.findFirst();
  await redis.set('event', JSON.stringify(data));
  return data;
}

export const eventRepository = {
  findFirst,
};
