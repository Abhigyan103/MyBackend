import { env, NodeEnv } from "@/config/index.js";

const LOCAL_AWS_ACCOUNT_ID = "000000000000";

const bucket = (bucketName: string) => {
  return `${bucketName}`;
};

const topic = (topicName: string) => {
  if (topicName.match(/^arn:aws:sns:.*:.*:.*$/)) {
    return topicName;
  }
  if (env.NODE_ENV === NodeEnv.local) {
    return `arn:aws:sns:${env.AWS_REGION}:${LOCAL_AWS_ACCOUNT_ID}:${topicName}`;
  }
  return `arn:aws:sns:${env.AWS_REGION}:${env.AWS_ACCOUNT_ID}:${topicName}`;
};

const queue = (queueName: string) => {
  if (URL.canParse(queueName)) {
    return queueName;
  }
  if (env.NODE_ENV === NodeEnv.local) {
    return `${env.AWS_ENDPOINT}/${LOCAL_AWS_ACCOUNT_ID}/${queueName}`;
  }
  return `https://sqs.${env.AWS_REGION}.amazonaws.com/${env.AWS_ACCOUNT_ID}/${queueName}`;
};

export const AWS = {
  S3: {
    ExampleBucket: bucket("example-bucket"),
  },
  SQS: {
    ExampleQueue: queue("example-queue"),
    ExampleQueueFifo: queue("example-queue.fifo"),
  },
  SNS: {
    ExampleTopic: topic("example-topic"),
  },
} as const;
