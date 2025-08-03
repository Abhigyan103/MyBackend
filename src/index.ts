import express, { type Request, type Response } from 'express';
import { createClient } from 'redis';
import { env } from './config.js';

// Initialize Express app
const app = express();
const PORT = env.PORT;

// Initialize Redis client
const client = createClient({
  url: env.REDIS_URL
});

// Redis connection events
client.on('connect', () => console.log('Connected to Redis!'));
client.on('error', (err) => console.log('Redis Client Error', err));

// Connect to Redis
client.connect();

// Define a simple route to increment and display a hit counter
app.get('/', async (req: Request, res: Response) => {
  try {
    const hits = await client.incr('page_hits');
    res.send(`This page has been viewed ${hits} times.`);
  } catch (error) {
    console.error('Error with Redis:', error);
    res.status(500).send('An error occurred.');
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});