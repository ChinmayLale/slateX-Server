import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { logger, errorLogger } from "../config/logger";
import { clerkClient, getAuth } from '@clerk/express';
import { addPageInDocument, updateTitleForPage } from "../services/Pages.service";
import { getDocumentById } from "../services/Document.service";



const createNewPage = async (req: Request, res: Response) => {
   try {
      const { userId } = getAuth(req)
      const { pageName = "Untitled" } = req.body
      if (!userId) {
         return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      }
      // Use Clerk's JavaScript Backend SDK to get the user's User object
      const user = await clerkClient.users.getUser(userId);

      return res.status(200).send(new ApiResponse(200, "Success", user))
   } catch (err: Error | any) {
      errorLogger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error while creating Page", `${err.message}`))
   }
}

const addPageToDocumentController = async (req: Request, res: Response) => {
   try {
      const { userId } = getAuth(req)
      const { documentId } = req.body;
      logger.info(`Document Id: ${documentId}`);
      // console.log(`Document Id: ${documentId}`);
      if (!userId) {
         return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      }
      // Use Clerk's JavaScript Backend SDK to get the user's User object
      const user = await clerkClient.users.getUser(userId);

      if (!documentId) {
         return res.status(400).send(new ApiError(400, "Bad Request", "Document id is required"))
      }



      const newPage = await addPageInDocument(documentId);
      if (!newPage) {
         return res.status(500).send(new ApiError(500, "Internal Server Error while adding Page to Document", "Failed to add page to document"))
      }
      return res.status(200).send(new ApiResponse(200, "Success", newPage))
   } catch (err: Error | any) {
      errorLogger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error while adding Page to Document", `${err.message}`))
   }
}



const updatePageTitleController = async (req: Request, res: Response) => {
   try {
      const { userId } = getAuth(req)
      const { documentId, pageId, title = "Untitled Page" } = req.body;
      logger.info(`Document Id: ${documentId} & pageId : ${pageId} & title : ${title}`);

      if (!userId) {
         return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      }
      // Use Clerk's JavaScript Backend SDK to get the user's User object
      const user = await clerkClient.users.getUser(userId);

      if (!documentId || typeof documentId !== "string" || !pageId || typeof pageId !== "string" || !title || typeof title !== "string") {
         return res.status(400).send(new ApiError(400, "Bad Request", "All fields are required"))
      }

      const document = await getDocumentById(documentId);
      if (!document) {
         return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
      }

      if (document.userId !== userId) {
         return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
      }

      //check if that doc contains that page or not 
      

      const updatedTitle = await updateTitleForPage(pageId, title);
      if (!updatedTitle) {
         return res.status(500).send(new ApiError(500, "Internal Server Error while updating Page", "Failed to update page"))
      }
      return res.status(200).send(new ApiResponse(200, "Title Update Successfully", updatedTitle))
   } catch (err: Error | any) {
      logger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error while updating Page", `${err.message}`))
   }
}


export { addPageToDocumentController, createNewPage, updatePageTitleController }