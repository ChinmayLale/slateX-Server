import { Document } from "@prisma/client";
import { prisma } from "../config/db";
import { createNewUntitledPage } from "./Pages.service";
import { errorLogger } from "../config/logger";

export const createNewDoc = async (ownerId: string): Promise<Document | null> => {
   try {

      const page = await createNewUntitledPage();

      // 2️⃣ Create the document and attach the page
      const document = await prisma.document.create({
         data: {
            title: "Untitled Document",
            userId: ownerId,
            pages: {
               connect: { id: page }, // attach the existing page
            },
         },
         include: { pages: true },
      });

      return document;
   } catch (err: any) {
      errorLogger.error(err.message);
      return null;
   }
};



export const getAllDocumentsForUser = async (userId: string): Promise<Document[]> => {
   try {
      const documents = await prisma.document.findMany({
         where: {
            userId: userId,
         },
      });
      return documents;
   } catch (err: any) {
      errorLogger.error(err.message);
      return [];
   }
};