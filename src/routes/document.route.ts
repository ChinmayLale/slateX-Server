import { Router } from "express";
import { createNewDocument, getAllDocuments } from "../controllers/document.controller";
import { requireAuth } from "@clerk/express";
import { addPageToDocumentController } from "../controllers/page.controller";

const router = Router();


router.post("/create", requireAuth(), createNewDocument);
router.post("/add-page", requireAuth(), addPageToDocumentController);
router.get("/", requireAuth(), getAllDocuments);
export default router;