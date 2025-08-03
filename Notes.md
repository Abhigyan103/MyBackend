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