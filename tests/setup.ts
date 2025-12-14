import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createClient } from "redis";

let mongod: MongoMemoryServer;
let mongoClient: MongoClient;
let redisClient: any;

// Setup before all tests
beforeAll(async () => {
  // Setup MongoDB Memory Server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  mongoClient = new MongoClient(uri);
  await mongoClient.connect();

  // Setup Redis Mock (using redis-mock or similar)
  try {
    redisClient = createClient({
      url: "redis://localhost:6379",
    });
  } catch (error) {
    // Redis might not be available in test environment
    redisClient = null;
  }

  // Mock environment variables
  process.env.DATABASE_URL = uri;
  process.env.DATABASE_NAME = "test-my-backend";
  process.env.JWT_SECRET = "test-jwt-secret-key-for-testing";
  process.env.REFRESH_TOKEN_SECRET =
    "test-refresh-token-secret-key-for-testing";
  process.env.JWT_EXPIRY = "15m";
  process.env.REFRESH_TOKEN_EXPIRY = "7d";
  process.env.NODE_ENV = "test";
  process.env.PORT = "3002";
  process.env.REDIS_URL = "redis://localhost:6379";
});

// Cleanup after all tests
afterAll(async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
  if (mongod) {
    await mongod.stop();
  }
  if (redisClient && redisClient.quit) {
    try {
      await redisClient.quit();
    } catch (error) {
      // Redis client might already be closed
    }
  }
});

// Clear database before each test
beforeEach(async () => {
  if (mongoClient) {
    const db = mongoClient.db("test-my-backend");
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  }
});
