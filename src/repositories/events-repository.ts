import { Event } from '@prisma/client';
import { prisma } from '@/config';
import { redis } from '@/config/cache';
import axios from 'axios';

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

async function fetchImage(imageUrl: string): Promise<string> {
  const response = await axios.get(imageUrl, {
    responseType: 'arraybuffer'
  })
  const imageBuffer = Buffer.from(response.data, 'binary');
  const base64Image = imageBuffer.toString('base64');
  const image = `data:${response.headers['content-type']};base64,${base64Image}`;
  return image;
}

export const eventRepository = {
  findFirst,
  fetchImage
};
