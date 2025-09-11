"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocumentTitle = exports.DeleteDocumentById = exports.UndoArchiveDocumentById = exports.ArchiveDocumentById = exports.getDocumentById = exports.getAllTrashDocumentsForUser = exports.getAllDocumentsForUser = exports.createNewDoc = void 0;
const db_1 = require("../config/db");
const Pages_service_1 = require("./Pages.service");
const logger_1 = require("../config/logger");
const createNewDoc = async (ownerId, title) => {
    try {
        const page = await (0, Pages_service_1.createNewUntitledPage)();
        // 2️⃣ Create the document and attach the page
        const document = await db_1.prisma.document.create({
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
    }
    catch (err) {
        // logger.error(err.message);
        logger_1.logger.error(err.message);
        return null;
    }
};
exports.createNewDoc = createNewDoc;
const getAllDocumentsForUser = async (userId) => {
    try {
        const documents = await db_1.prisma.document.findMany({
            where: {
                userId: userId,
                isArchived: false
            },
            include: {
                pages: true
            }
        });
        return documents;
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return [];
    }
};
exports.getAllDocumentsForUser = getAllDocumentsForUser;
const getAllTrashDocumentsForUser = async (userId) => {
    try {
        const documents = await db_1.prisma.document.findMany({
            where: {
                userId: userId,
                isArchived: true
            },
            include: {
                pages: true
            }
        });
        return documents;
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return [];
    }
};
exports.getAllTrashDocumentsForUser = getAllTrashDocumentsForUser;
const getDocumentById = async (id) => {
    try {
        if (!id) {
            return null;
        }
        const document = await db_1.prisma.document.findUnique({
            where: {
                id: id,
            },
            include: {
                pages: true
            }
        });
        return document;
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return null;
    }
};
exports.getDocumentById = getDocumentById;
const ArchiveDocumentById = async (id) => {
    try {
        if (!id) {
            return false;
        }
        const document = await db_1.prisma.$transaction(async (tx) => {
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
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return false;
    }
};
exports.ArchiveDocumentById = ArchiveDocumentById;
const UndoArchiveDocumentById = async (id) => {
    try {
        if (!id)
            return false;
        await db_1.prisma.$transaction(async (tx) => {
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
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return false;
    }
};
exports.UndoArchiveDocumentById = UndoArchiveDocumentById;
const DeleteDocumentById = async (id) => {
    try {
        if (!id) {
            return false;
        }
        const document = await db_1.prisma.document.delete({
            where: {
                id: id,
            },
        });
        if (!document) {
            return false;
        }
        return true;
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return false;
    }
};
exports.DeleteDocumentById = DeleteDocumentById;
const updateDocumentTitle = async (id, title) => {
    try {
        if (!id) {
            return null;
        }
        const document = await db_1.prisma.document.update({
            where: {
                id: id,
            },
            data: {
                title: title,
            },
        });
        return document;
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return null;
    }
};
exports.updateDocumentTitle = updateDocumentTitle;
