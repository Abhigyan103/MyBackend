import type { NextFunction, Request, Response } from "express";
import status from "http-status";

import { getUser } from "@/modules/account/user.service.js";

export const allowInitializedUsersOnly = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUser({ id: req.user?.id! });
    if (user && !user.hasInitialized) {
      next({
        status: status.FORBIDDEN,
        message: "User account is not initialized.",
      });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};
