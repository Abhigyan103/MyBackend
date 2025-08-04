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
  },
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
    filename: 'logs/combined.log',
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    level: 'info',
    format: fileLogFormat,
  }),
  // ... other transports
]
```
Here there are 2 transports, one for the console's log and other for saving in a file. We would like to show Human readable time in log but maybe `unix` time for saving the logs in a file and maybe in `json`


The log format is the format in which the log will be shown.

For example:
```ts
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);
```