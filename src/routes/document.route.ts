import { Router } from "express";
import { createNewDocument, getAllDocuments } from "../controllers/document.controller";
import { requireAuth } from "@clerk/express";

const router = Router();


router.post("/create", requireAuth(), createNewDocument);
router.get("/", requireAuth(), getAllDocuments);
export default router;