import { Router } from 'express';
import { getDefaultEvent, getEventImage } from '@/controllers';

const eventsRouter = Router();

eventsRouter.get('/', getDefaultEvent);

eventsRouter.get('/image', getEventImage);

export { eventsRouter };
