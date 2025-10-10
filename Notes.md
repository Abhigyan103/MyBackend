# Notes while building my custom rate limiter

## Setup process:

### 1. Setup Typescript server

```sh
npm install --save-dev typescript tsx @types/node
npx tsc --init
```

#### Copy the `tsconfig.json`

#### Setup in `package.json`

```json
{
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "clean": "rm -rf dist/",
    "build": "npm run clean && tsc",
    "start": "node dist/index.js",
    "dev": "tsx --watch src/index.ts"
  }
  // ...other options
}
```

##### Thoughts: `Maybe should have just used bun!`

### 2. Setup Redis

```sh
docker run --name my-redis -p 6379:6379 -d redis
```

```sh
npm i express redis zod
npm i -D @types/express
```

### 3. Setup Logger

I used `winston` because Gemini.
I am using `transport` to mention where the logs will go. The more the transports, the more the the log locations..

For example:

```ts
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.simple(),
      logFormat
    ),
  }),

  new winston.transports.File({
    filename: "logs/combined.log",
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    level: "info",
    format: fileLogFormat,
  }),
  // ... other transports
];
```

Here there are 2 transports, one for the console's log and other for saving in a file. We would like to show Human readable time in log but maybe `unix` time for saving the logs in a file and maybe in `json`

The log format is the format in which the log will be shown.

For example:

```ts
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);
```

### 4. Setup refresh tokens

There are two ways to implement refresh tokens,

1. We can use a generated id like UUID or ULID.
2. Another JWT for refresh tokens.

The first one is simple to implement and easier to keep track of. There is only be one source of expiry, i.e, the DB. It will be easier to get the refresh token for a specific user id, but the the vice-versa will not be true. The FE will not be able to make sense of the data with just the ID, which is good for a security standpoint.

The second one is more flexible with how it is used, but it adds complexity, multiple sources of expiry (DB and JWT Expiry).

I am using the second approach. (JUST USE AN AUTH PROVIDER)

### 5. Setup ORM

I am using Prisma ORM

1. Install as a **DEV** dependency (`npm i -D prisma`)
2. Run `npx prisma init`
3. Add your models in `prisma/schema.prisma`
4. After adding your models, Run: `npx prisma migrate dev --name init`. This command will create the tables in your database based on your schema, and automatically install and generate the Prisma Client for your TypeScript code. This command automatically runs `npm install @prisma/client` and `npx prisma generate` for you.

Prisma by default uses Postgress and adds the URL in your `.env`. To run the local pg server: `npx prisma dev`
