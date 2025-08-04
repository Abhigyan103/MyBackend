import express, { type Request, type Response } from 'express';
import { env, connectToRedis, disconnectFromRedis, logger } from './config/index.js';

// Initialize Express app
const app = express();
const PORT = env.PORT;

// Define a simple route to increment and display a hit counter
app.get('/', async (req: Request, res: Response) => {
  try {
    const redisClient = await connectToRedis();
    const hits = await redisClient.incr('page_hits');
    res.send(`This page has been viewed ${hits} times.`);
  } catch (error) {
    logger.error('Error with Redis:', error);
    res.status(500).send('An error occurred.');
  }
});

// Start the Express server
app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
});