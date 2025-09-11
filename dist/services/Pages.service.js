"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePageContentByPageId = exports.publishPageByPageId = exports.getPageByPageId = exports.addCoverImageToPage = exports.updateTitleForPage = exports.getPagesByDocumentId = exports.addPageInDocument = exports.createNewUntitledPage = void 0;
const db_1 = require("../config/db");
const logger_1 = require("../config/logger");
const createNewUntitledPage = async (documentId) => {
    const page = await db_1.prisma.page.create({
        data: {
            title: "Untitled Page",
            documentId: documentId || null, // optional document attachment
            icon: null
        },
    });
    return page.id;
};
exports.createNewUntitledPage = createNewUntitledPage;
const addPageInDocument = async (documentId) => {
    try {
        const document = await db_1.prisma.document.findUnique({
            where: {
                id: documentId,
            },
        });
        if (!document) {
            return null; // Document not found
        }
        const page = await db_1.prisma.page.create({
            data: {
                title: "Untitled Page",
                documentId: documentId,
            },
        });
        return page;
    }
    catch (err) {
        logger_1.errorLogger.error(err.message);
        return null;
    }
};
exports.addPageInDocument = addPageInDocument;
const getPagesByDocumentId = async (documentId) => {
    return await db_1.prisma.page.findMany({
        where: {
            documentId: documentId,
        },
    });
};
exports.getPagesByDocumentId = getPagesByDocumentId;
const updateTitleForPage = async (pageId, title) => {
    try {
        const page = await db_1.prisma.page.update({
            where: { id: pageId },
            data: { title: title },
        });
        return page.title; // success
    }
    catch (error) {
        console.error(error);
        return null; // failed
    }
};
exports.updateTitleForPage = updateTitleForPage;
const addCoverImageToPage = async (pageId, coverImage) => {
    try {
        const page = await db_1.prisma.page.update({
            where: { id: pageId },
            data: { coverImage: coverImage },
        });
        return page.coverImage; // success
    }
    catch (error) {
        console.error(error);
        return null; // failed
    }
};
exports.addCoverImageToPage = addCoverImageToPage;
const getPageByPageId = async (pageId) => {
    try {
        const page = await db_1.prisma.page.findUnique({
            where: { id: pageId },
        });
        return page; // success
    }
    catch (error) {
        console.error(error);
        return null; // failed
    }
};
exports.getPageByPageId = getPageByPageId;
const publishPageByPageId = async (pageId, currentPage) => {
    try {
        const page = await db_1.prisma.page.update({
            where: { id: pageId },
            data: {
                isPublished: !currentPage.isPublished
            }
        });
        return page; // success
    }
    catch (error) {
        console.error(error);
        return null; // failed
    }
};
exports.publishPageByPageId = publishPageByPageId;
const updatePageContentByPageId = async (pageId, pageContent) => {
    try {
        const page = await db_1.prisma.page.update({
            where: { id: pageId },
            data: { content: pageContent },
        });
        return page; // success
    }
    catch (error) {
        console.error(error);
        return null; // failed
    }
};
exports.updatePageContentByPageId = updatePageContentByPageId;
