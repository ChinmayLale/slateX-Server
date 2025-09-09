// src/services/pageService.ts
import { Page } from "@prisma/client";
import { prisma } from "../config/db";
import { errorLogger } from "../config/logger";

export const createNewUntitledPage = async (
   documentId?: string
): Promise<string> => {
   const page = await prisma.page.create({
      data: {
         title: "Untitled Page",
         documentId: documentId || null, // optional document attachment
      },
   });

   return page.id;
};


export const addPageInDocument = async (documentId: string): Promise<Page | null> => {
   try {
      const document = await prisma.document.findUnique({
         where: {
            id: documentId,
         },
      });

      if (!document) {
         return null; // Document not found
      }
      const page = await prisma.page.create({
         data: {
            title: "Untitled Page",
            documentId: documentId,
         },
      })

      return page;
   } catch (err: any) {
      errorLogger.error(err.message);
      return null;
   }
}


export const getPagesByDocumentId = async (documentId: string) => {
   return await prisma.page.findMany({
      where: {
         documentId: documentId,
      },
   });
};



export const updateTitleForPage = async (pageId: string, title: string): Promise<string | null> => {
   try {
      const page = await prisma.page.update({
         where: { id: pageId },
         data: { title: title },
      });
      return page.title; // success
   } catch (error) {
      console.error(error);
      return null; // failed
   }
};
