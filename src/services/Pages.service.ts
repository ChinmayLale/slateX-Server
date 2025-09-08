// src/services/pageService.ts
import { prisma } from "../config/db";

export const createNewUntitledPage = async (
   documentId?: string
): Promise<string> => {
   const page = await prisma.page.create({
      data: {
         title: "Untitled",
         documentId: documentId || null, // optional document attachment
      },
   });

   return page.id;
};

export const getPagesByDocumentId = async (documentId: string) => {
   return await prisma.page.findMany({
      where: {
         documentId: documentId,
      },
   });
};