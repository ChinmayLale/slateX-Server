import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { logger, errorLogger } from "../config/logger";
import { clerkClient, getAuth } from '@clerk/express'
import { loggers } from "winston";


const getUserProfile = async (req: Request, res: Response) => {
   try {
      const { userId } = getAuth(req)

      if (!userId) {
         return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      }
      // Use Clerk's JavaScript Backend SDK to get the user's User object
      const user = await clerkClient.users.getUser(userId);
      logger.info(`User profile fetched for user id: ${userId}`);
      return res.status(200).send(new ApiResponse(200, "Success", user))
   } catch (err: Error | any) {
      errorLogger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error ", `${err.message}`))
   }
}


export { getUserProfile }