import { Router } from "express";
import { ArchiveDocument, createNewDocument, DeleteDocumentPermenently, getAllDocuments, getAllTrashDocuments, renameDocument, UndoArchiveDocument } from "../controllers/document.controller";
import { requireAuth } from "@clerk/express";
import { addPageToDocumentController, getPageByIdController, publishAPage, updateCoverImageForPage, updatePageContent, updatePageTitleController } from "../controllers/page.controller";


const router = Router();


router.post("/create", createNewDocument);


router.post("/add-page", addPageToDocumentController);
router.get("/",  getAllDocuments);

router.delete("/",  ArchiveDocument);

router.get("/trash",  getAllTrashDocuments);

router.put('/',  UndoArchiveDocument);

router.post('/rename', renameDocument)

router.delete("/permanent", DeleteDocumentPermenently);


router.post("/page/update-title",  updatePageTitleController);

router.post('/page/updateCoverImage',  updateCoverImageForPage);
// /documents/page/updateCoverImage


router.post("/page/publish",  publishAPage);


router.post('/page/update-content',  updatePageContent);


router.get('/getPage',getPageByIdController);


export default router;