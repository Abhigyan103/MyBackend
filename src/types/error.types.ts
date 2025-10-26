export interface HttpError extends Error {
  status?: number;
  fields?: string[];
  message: string;
  data?: any;
}

export const enum CustomErrorTypes {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  InvalidCredentialsError,
}
