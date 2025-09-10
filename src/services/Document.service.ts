import { Document } from "@prisma/client";
import { prisma } from "../config/db";
import { createNewUntitledPage } from "./Pages.service";
import { logger } from "../config/logger";
import { id } from "zod/v4/locales/index.cjs";

export const createNewDoc = async (ownerId: string, title: string): Promise<Document | null> => {
   try {

      const page = await createNewUntitledPage();

      // 2️⃣ Create the document and attach the page
      const document = await prisma.document.create({
         data: {
            title: title || "Untitled Document",
            userId: ownerId,
            pages: {
               connect: { id: page }, // attach the existing page
            },
         },
         include: { pages: true },
      });

      return document;
   } catch (err: any) {
      // logger.error(err.message);
      logger.error(err.message);
      return null;
   }
};



export const getAllDocumentsForUser = async (userId: string): Promise<Document[]> => {
   try {
      const documents = await prisma.document.findMany({
         where: {
            userId: userId,
            isArchived: false
         },
         include: {
            pages: true
         }
      });
      return documents;
   } catch (err: any) {
      logger.error(err.message);
      return [];
   }
};

export const getAllTrashDocumentsForUser = async (userId: string): Promise<Document[]> => {
   try {
      const documents = await prisma.document.findMany({
         where: {
            userId: userId,
            isArchived: true
         },
         include: {
            pages: true
         }
      });
      return documents;
   } catch (err: any) {
      logger.error(err.message);
      return [];
   }
};


export const getDocumentById = async (id: string): Promise<Document | null> => {
   try {
      if (!id) {
         return null;
      }
      const document = await prisma.document.findUnique({
         where: {
            id: id,
         },
         include: {
            pages: true
         }
      });
      return document;
   } catch (err: any) {
      logger.error(err.message);
      return null;
   }
}


export const ArchiveDocumentById = async (id: string): Promise<boolean> => {
   try {
      if (!id) {
         return false;
      }
      const document = await prisma.$transaction(async (tx) => {
         // 1. Archive the document
         await tx.document.update({
            where: { id },
            data: { isArchived: true },
         });

         // 2. Archive all pages inside the document
         await tx.page.updateMany({
            where: { documentId: id },
            data: { isArchived: true },
         });
      });
      //Also archive all pages inside that doc

      return true;
   } catch (err: any) {
      logger.error(err.message);
      return false;
   }
}

export const UndoArchiveDocumentById = async (id: string): Promise<boolean> => {
   try {
      if (!id) return false;

      await prisma.$transaction(async (tx) => {
         // 1. Unarchive the document
         await tx.document.update({
            where: { id },
            data: { isArchived: false },
         });

         // 2. Unarchive all pages inside the document
         await tx.page.updateMany({
            where: { documentId: id },
            data: { isArchived: false },
         });
      });

      return true;
   } catch (err: any) {
      logger.error(err.message);
      return false;
   }
};


export const DeleteDocumentById = async (id: string): Promise<boolean> => {
   try {
      if (!id) {
         return false;
      }
      const document = await prisma.document.delete({
         where: {
            id: id,
         },
      });

      if (!document) {
         return false
      }
      return true;
   } catch (err: any) {
      logger.error(err.message);
      return false;
   }
}


export const updateDocumentTitle = async (id: string, title: string): Promise<Document | null> => {
   try {
      if (!id) {
         return null;
      }
      const document = await prisma.document.update({
         where: {
            id: id,
         },
         data: {
            title: title,
         },
      });
      return document;
   } catch (err: any) {
      logger.error(err.message);
      return null;
   }
}