export interface HttpError extends Error {
  status?: number;
  fields?: string[];
  message: string;
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
