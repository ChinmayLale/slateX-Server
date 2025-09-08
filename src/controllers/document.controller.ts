import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { logger, errorLogger } from "../config/logger";
import { clerkClient, getAuth } from '@clerk/express';
import { createNewDoc, getAllDocumentsForUser } from "../services/Document.service";


const createNewDocument = async (req: Request, res: Response) => {
   try {
      const { userId } = getAuth(req)
      if (!userId) {
         return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      }
      // Use Clerk's JavaScript Backend SDK to get the user's User object
      const user = await clerkClient.users.getUser(userId);

      const newDocument = await createNewDoc(user.id);
      if (!newDocument) {
         return res.status(500).send(new ApiError(500, "Internal Server Error while creating Document", "Failed to create document"))
      }
      return res.status(200).send(new ApiResponse(200, "Success", newDocument))
   } catch (err: Error | any) {
      errorLogger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error while creating Document", `${err.message}`))
   }
}



const getAllDocuments = async (req: Request, res: Response) => {
   try {
      const { userId } = getAuth(req)
      if (!userId) {
         return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      }
      // Use Clerk's JavaScript Backend SDK to get the user's User object
      const user = await clerkClient.users.getUser(userId);
      const documents = await getAllDocumentsForUser(userId);
      if (!documents) {
         return res.status(500).send(new ApiError(500, "Internal Server Error while getting Documents", "Failed to get documents"))
      }
      return res.status(200).send(new ApiResponse(200, "Success", documents))
   } catch (err: Error | any) {
      errorLogger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error while getting Documents", `${err.message}`))
   }
}



export { createNewDocument, getAllDocuments }