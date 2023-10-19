import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getHotelsWithRooms, getHotelsWithAvailability } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', getHotels)
  .get('/availability', getHotelsWithAvailability)
  .get('/:hotelId', getHotelsWithRooms);

export { hotelsRouter };
