docker build -t my-backend .

docker run -d \                  
  -p 3001:3001 \
  --name rate-limiter-app \
  --env-file ./.env.docker \
  my-rate-limiter