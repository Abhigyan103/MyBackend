import { S3Client } from "@aws-sdk/client-s3";
import { SNSClient } from "@aws-sdk/client-sns";
import { SQSClient } from "@aws-sdk/client-sqs";

import { env, NodeEnv } from "./server.config.js";

const awsConfig = {
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  ...(env.NODE_ENV === NodeEnv.local && {
    endpoint: env.AWS_ENDPOINT,
    forcePathStyle: true,
  }),
};

const s3Client = new S3Client(awsConfig);
const snsClient = new SNSClient(awsConfig);
const sqsClient = new SQSClient(awsConfig);

export { s3Client, snsClient, sqsClient };
