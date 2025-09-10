import { Router } from "express";
import { ArchiveDocument, createNewDocument, DeleteDocumentPermenently, getAllDocuments, getAllTrashDocuments, renameDocument, UndoArchiveDocument } from "../controllers/document.controller";
import { requireAuth } from "@clerk/express";
import { addPageToDocumentController, publishAPage, updateCoverImageForPage, updatePageTitleController } from "../controllers/page.controller";


const router = Router();


router.post("/create", requireAuth(), createNewDocument);


router.post("/add-page", requireAuth(), addPageToDocumentController);
router.get("/", requireAuth(), getAllDocuments);

router.delete("/", requireAuth(), ArchiveDocument);

router.get("/trash", requireAuth(), getAllTrashDocuments);

router.put('/', requireAuth(), UndoArchiveDocument);

router.post('/rename', requireAuth(), renameDocument)

router.delete("/permanent", requireAuth(), DeleteDocumentPermenently);


router.post("/page/update-title", requireAuth(), updatePageTitleController);

router.post('/page/update-cover-image', requireAuth(), updateCoverImageForPage);


router.post("/page/publish", requireAuth(), publishAPage);


export default router;