import { Router } from "express";
import { ArchiveDocument, createNewDocument, DeleteDocumentPermenently, getAllDocuments, getAllTrashDocuments, UndoArchiveDocument } from "../controllers/document.controller";
import { requireAuth } from "@clerk/express";
import { addPageToDocumentController, updatePageTitleController } from "../controllers/page.controller";


const router = Router();


router.post("/create", requireAuth(), createNewDocument);


router.post("/add-page", requireAuth(), addPageToDocumentController);
router.get("/", requireAuth(), getAllDocuments);

router.delete("/", requireAuth(), ArchiveDocument);

router.get("/trash", requireAuth(), getAllTrashDocuments);

router.put('/', requireAuth(), UndoArchiveDocument);

router.delete("/permanent", requireAuth(), DeleteDocumentPermenently);


router.post("/page/update-title", requireAuth(), updatePageTitleController);

export default router;