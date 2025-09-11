"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameDocument = exports.DeleteDocumentPermenently = exports.UndoArchiveDocument = exports.getAllTrashDocuments = exports.ArchiveDocument = exports.getAllDocuments = exports.createNewDocument = void 0;
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const logger_1 = require("../config/logger");
const express_1 = require("@clerk/express");
const Document_service_1 = require("../services/Document.service");
const createNewDocument = async (req, res) => {
    try {
        const { title, userId } = req.body;
        if (!userId) {
            return res.status(400).send(new apiError_1.ApiError(400, "Bad Request", "User id is required"));
        }
        // Use Clerk's JavaScript Backend SDK to get the user's User object
        const user = await express_1.clerkClient.users.getUser(userId);
        const newDocument = await (0, Document_service_1.createNewDoc)(user.id, title);
        if (!newDocument) {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while creating Document", "Failed to create document"));
        }
        return res.status(200).send(new apiResponse_1.ApiResponse(200, "Success", newDocument));
    }
    catch (err) {
        logger_1.errorLogger.error(err.message);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while creating Document", `${err.message}`));
    }
};
exports.createNewDocument = createNewDocument;
const getAllDocuments = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId || typeof userId !== "string") {
            return res.status(400).send(new apiError_1.ApiError(400, "Bad Request", "User id is required"));
        }
        // Use Clerk's JavaScript Backend SDK to get the user's User object
        const user = await express_1.clerkClient.users.getUser(userId);
        const documents = await (0, Document_service_1.getAllDocumentsForUser)(userId);
        if (!documents) {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while getting Documents", "Failed to get documents"));
        }
        return res.status(200).send(new apiResponse_1.ApiResponse(200, "Success", documents));
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while getting Documents", `${err.message}`));
    }
};
exports.getAllDocuments = getAllDocuments;
const ArchiveDocument = async (req, res) => {
    try {
        const { documentId } = req.query;
        // const { userId } = getAuth(req);
        if (!documentId || typeof documentId !== "string") {
            return res
                .status(400)
                .send(new apiError_1.ApiError(400, "Bad Request", "Document id is required"));
        }
        // if (!userId) {
        //    return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
        // }
        // const user = await clerkClient.users.getUser(userId);
        const document = await (0, Document_service_1.getDocumentById)(documentId);
        if (!document) {
            return res.status(500).send(new apiError_1.ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`));
        }
        // if (document.userId !== userId) {
        //    return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
        // }
        const updatedDocument = await (0, Document_service_1.ArchiveDocumentById)(documentId);
        if (updatedDocument === true) {
            return res.status(200).send(new apiResponse_1.ApiResponse(200, `Deleted Document With Id + doumentId`, documentId, updatedDocument));
        }
        else {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while Deleting Document", `Failed to delete document for id : ${documentId}`));
        }
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while Deleting Document", `${err.message}`));
    }
};
exports.ArchiveDocument = ArchiveDocument;
const getAllTrashDocuments = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).send(new apiError_1.ApiError(400, "Bad Request", "User id is required"));
        }
        // Use Clerk's JavaScript Backend SDK to get the user's User object
        // const user = await clerkClient.users.getUser(userId);
        const documents = await (0, Document_service_1.getAllTrashDocumentsForUser)(userId);
        if (!documents) {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while getting Documents", "Failed to get documents"));
        }
        if (documents.length === 0) {
            return res.status(200).send(new apiResponse_1.ApiResponse(200, "Success", []));
        }
        return res.status(200).send(new apiResponse_1.ApiResponse(200, "Success", documents));
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while getting Documents", `${err.message}`));
    }
};
exports.getAllTrashDocuments = getAllTrashDocuments;
const UndoArchiveDocument = async (req, res) => {
    try {
        const { documentId } = req.query;
        // const { userId } = getAuth(req);
        if (!documentId || typeof documentId !== "string") {
            return res
                .status(400)
                .send(new apiError_1.ApiError(400, "Bad Request", "Document id is required"));
        }
        // if (!userId) {
        //    return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
        // }
        // const user = await clerkClient.users.getUser(userId);
        const document = await (0, Document_service_1.getDocumentById)(documentId);
        if (!document) {
            return res.status(500).send(new apiError_1.ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`));
        }
        // if (document.userId !== userId) {
        //    return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
        // }
        const updatedDocument = await (0, Document_service_1.UndoArchiveDocumentById)(documentId);
        if (updatedDocument === true) {
            return res.status(200).send(new apiResponse_1.ApiResponse(200, `Deleted Document With Id + doumentId`, documentId, updatedDocument));
        }
        else {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while Deleting Document", `Failed to delete document for id : ${documentId}`));
        }
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while Deleting Document", `${err.message}`));
    }
};
exports.UndoArchiveDocument = UndoArchiveDocument;
const DeleteDocumentPermenently = async (req, res) => {
    try {
        const { documentId } = req.query;
        // const { userId } = getAuth(req);
        if (!documentId || typeof documentId !== "string") {
            return res
                .status(400)
                .send(new apiError_1.ApiError(400, "Bad Request", "Document id is required"));
        }
        // if (!userId) {
        //    return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
        // }
        // const user = await clerkClient.users.getUser(userId);
        const document = await (0, Document_service_1.getDocumentById)(documentId);
        if (!document) {
            return res.status(500).send(new apiError_1.ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`));
        }
        // if (document.userId !== userId) {
        //    return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
        // }
        const updatedDocument = await (0, Document_service_1.DeleteDocumentById)(documentId);
        if (updatedDocument === true) {
            return res.status(200).send(new apiResponse_1.ApiResponse(200, `Deleted Document With Id + doumentId`, documentId, updatedDocument));
        }
        else {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while Deleting Document", `Failed to delete document for id : ${documentId}`));
        }
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while Deleting Document", `${err.message}`));
    }
};
exports.DeleteDocumentPermenently = DeleteDocumentPermenently;
const renameDocument = async (req, res) => {
    try {
        const { documentId, title } = req.body;
        // const { userId } = getAuth(req);
        if (!documentId || typeof documentId !== "string") {
            return res
                .status(400)
                .send(new apiError_1.ApiError(400, "Bad Request", "Document id is required"));
        }
        // if (!userId) {
        //    return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
        // }
        // const user = await clerkClient.users.getUser(userId);
        const document = await (0, Document_service_1.getDocumentById)(documentId);
        if (!document) {
            return res.status(500).send(new apiError_1.ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`));
        }
        // if (document.userId !== userId) {
        //    return res.status(500).send(new ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`))
        // }
        const updatedDocument = await (0, Document_service_1.updateDocumentTitle)(documentId, title);
        if (updatedDocument) {
            return res.status(200).send(new apiResponse_1.ApiResponse(200, `Updated Document With Id + doumentId`, updatedDocument, true));
        }
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while Updating Document", `Failed to update document for id : ${documentId}`));
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while Deleting Document", `${err.message}`));
    }
};
exports.renameDocument = renameDocument;
