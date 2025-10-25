import { CustomErrorTypes } from "@/types/error.types.js";

export class CustomError extends Error {
  public status: number;
  public type: CustomErrorTypes;

  /**
   * Creates an instance of HttpError.
   * @param status The HTTP status code (e.g., 404, 400, 401).
   * @param message The error message to send to the client.
   */
  constructor(
    status: number,
    message: string,
    type: CustomErrorTypes = CustomErrorTypes.InternalServerError
  ) {
    // Call the parent Error constructor
    super(message);

    // Explicitly set the status property
    this.status = status;
    this.type = type;
    // Set the prototype explicitly (important for TypeScript/extending built-ins)
    // This maintains the correct prototype chain for 'instanceof' checks
    Object.setPrototypeOf(this, CustomError.prototype);

    // Maintain proper stack trace (only if Node.js v8+ is used, which is standard)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
