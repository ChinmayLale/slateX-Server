import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { logger, errorLogger } from "../config/logger";
import { clerkClient, getAuth } from '@clerk/express';
import { ArchiveDocumentById, createNewDoc, DeleteDocumentById, getAllDocumentsForUser, getAllTrashDocumentsForUser, getDocumentById, UndoArchiveDocumentById, updateDocumentTitle } from "../services/Document.service";


const createNewDocument = async (req: Request, res: Response) => {
   try {

      const { title  , userId} = req.body
      if (!userId) {
         return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      }
      // Use Clerk's JavaScript Backend SDK to get the user's User object
      const user = await clerkClient.users.getUser(userId);

      const newDocument = await createNewDoc(user.id , title);
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
      const { userId } = req.query
      if (!userId || typeof userId !== "string") {
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
      logger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error while getting Documents", `${err.message}`))
   }
}


const ArchiveDocument = async (req: Request, res: Response) => {
   try {
      const { documentId } = req.query;
      // const { userId } = getAuth(req);


      if (!documentId || typeof documentId !== "string") {
         return res
            .status(400)
            .send(new ApiError(400, "Bad Request", "Document id is required"));
      }

      // if (!userId) {
      //    return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      // }
      // const user = await clerkClient.users.getUser(userId);
      const document = await getDocumentById(documentId);
      if (!document) {
         return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
      }

      // if (document.userId !== userId) {
      //    return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
      // }

      const updatedDocument = await ArchiveDocumentById(documentId);
      if (updatedDocument === true) {
         return res.status(200).send(new ApiResponse(200, `Deleted Document With Id + doumentId`, documentId, updatedDocument))
      } else {
         return res.status(500).send(new ApiError(500, "Internal Server Error while Deleting Document", `Failed to delete document for id : ${documentId}`))
      }
   } catch (err: Error | any) {
      logger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error while Deleting Document", `${err.message}`))
   }
}


const getAllTrashDocuments = async (req: Request, res: Response) => {
   try {
      const { userId } = req.query
      if (!userId) {
         return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      }
      // Use Clerk's JavaScript Backend SDK to get the user's User object
      // const user = await clerkClient.users.getUser(userId);
      const documents = await getAllTrashDocumentsForUser(userId as string);
      if (!documents) {
         return res.status(500).send(new ApiError(500, "Internal Server Error while getting Documents", "Failed to get documents"))
      }
      if (documents.length === 0) {
         return res.status(200).send(new ApiResponse(200, "Success", []))
      }
      return res.status(200).send(new ApiResponse(200, "Success", documents))
   } catch (err: Error | any) {
      logger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error while getting Documents", `${err.message}`))
   }
}

const UndoArchiveDocument = async (req: Request, res: Response) => {
   try {
      const { documentId } = req.query;
      // const { userId } = getAuth(req);


      if (!documentId || typeof documentId !== "string") {
         return res
            .status(400)
            .send(new ApiError(400, "Bad Request", "Document id is required"));
      }

      // if (!userId) {
      //    return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      // }
      // const user = await clerkClient.users.getUser(userId);
      const document = await getDocumentById(documentId);
      if (!document) {
         return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
      }

      // if (document.userId !== userId) {
      //    return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
      // }

      const updatedDocument = await UndoArchiveDocumentById(documentId);
      if (updatedDocument === true) {
         return res.status(200).send(new ApiResponse(200, `Deleted Document With Id + doumentId`, documentId, updatedDocument))
      } else {
         return res.status(500).send(new ApiError(500, "Internal Server Error while Deleting Document", `Failed to delete document for id : ${documentId}`))
      }
   } catch (err: Error | any) {
      logger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error while Deleting Document", `${err.message}`))
   }
}


const DeleteDocumentPermenently = async (req: Request, res: Response) => {
   try {
      const { documentId } = req.query;
      // const { userId } = getAuth(req);

      if (!documentId || typeof documentId !== "string") {
         return res
            .status(400)
            .send(new ApiError(400, "Bad Request", "Document id is required"));
      }

      // if (!userId) {
      //    return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      // }
      // const user = await clerkClient.users.getUser(userId);
      const document = await getDocumentById(documentId);
      if (!document) {
         return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
      }

      // if (document.userId !== userId) {
      //    return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
      // }

      const updatedDocument = await DeleteDocumentById(documentId);
      if (updatedDocument === true) {
         return res.status(200).send(new ApiResponse(200, `Deleted Document With Id + doumentId`, documentId, updatedDocument))
      } else {
         return res.status(500).send(new ApiError(500, "Internal Server Error while Deleting Document", `Failed to delete document for id : ${documentId}`))
      }
   } catch (err: Error | any) {
      logger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error while Deleting Document", `${err.message}`))
   }
}



const renameDocument = async (req: Request, res: Response) => {
   try {
      const { documentId, title } = req.body;
      // const { userId } = getAuth(req);

      if (!documentId || typeof documentId !== "string") {
         return res
            .status(400)
            .send(new ApiError(400, "Bad Request", "Document id is required"));
      }

      // if (!userId) {
      //    return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
      // }

      // const user = await clerkClient.users.getUser(userId);
      const document = await getDocumentById(documentId);
      if (!document) {
         return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
      }

      // if (document.userId !== userId) {
      //    return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
      // }

      const updatedDocument = await updateDocumentTitle(documentId, title);

      if (updatedDocument) {
         return res.status(200).send(new ApiResponse(200, `Updated Document With Id + doumentId`, updatedDocument, true))
      }
      return res.status(500).send(new ApiError(500, "Internal Server Error while Updating Document", `Failed to update document for id : ${documentId}`))

   } catch (err: Error | any) {
      logger.error(err.message);
      return res.status(500).send(new ApiError(500, "Internal Server Error while Deleting Document", `${err.message}`))
   }
}



export { createNewDocument, getAllDocuments, ArchiveDocument, getAllTrashDocuments, UndoArchiveDocument, DeleteDocumentPermenently, renameDocument }