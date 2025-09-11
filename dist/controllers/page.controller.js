"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePageTitleController = exports.createNewPage = exports.addPageToDocumentController = exports.getPageByIdController = exports.updatePageContent = exports.publishAPage = exports.updateCoverImageForPage = void 0;
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const logger_1 = require("../config/logger");
const express_1 = require("@clerk/express");
const Pages_service_1 = require("../services/Pages.service");
const Document_service_1 = require("../services/Document.service");
const createNewPage = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        const { pageName = "Untitled" } = req.body;
        // if (!userId) {
        //    return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
        // }
        // Use Clerk's JavaScript Backend SDK to get the user's User object
        // const user = await clerkClient.users.getUser(userId);
        return res.status(200).send(new apiResponse_1.ApiResponse(200, "Success", true));
    }
    catch (err) {
        logger_1.errorLogger.error(err.message);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while creating Page", `${err.message}`));
    }
};
exports.createNewPage = createNewPage;
const addPageToDocumentController = async (req, res) => {
    try {
        // const { userId } = getAuth(req)
        const { documentId } = req.body;
        logger_1.logger.info(`Document Id: ${documentId}`);
        // console.log(`Document Id: ${documentId}`);
        if (!documentId) {
            return res.status(400).send(new apiError_1.ApiError(400, "Bad Request", "Document id is required"));
        }
        const newPage = await (0, Pages_service_1.addPageInDocument)(documentId);
        if (!newPage) {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while adding Page to Document", "Failed to add page to document"));
        }
        return res.status(200).send(new apiResponse_1.ApiResponse(200, "Success", newPage));
    }
    catch (err) {
        logger_1.errorLogger.error(err.message);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while adding Page to Document", `${err.message}`));
    }
};
exports.addPageToDocumentController = addPageToDocumentController;
const updatePageTitleController = async (req, res) => {
    try {
        // const { userId } = getAuth(req)
        const { documentId, pageId, title = "Untitled Page" } = req.body;
        logger_1.logger.info(`Document Id: ${documentId} & pageId : ${pageId} & title : ${title}`);
        if (!documentId || typeof documentId !== "string" || !pageId || typeof pageId !== "string" || !title || typeof title !== "string") {
            return res.status(400).send(new apiError_1.ApiError(400, "Bad Request", "All fields are required"));
        }
        const document = await (0, Document_service_1.getDocumentById)(documentId);
        if (!document) {
            return res.status(500).send(new apiError_1.ApiError(500, "Document not found For Id ", `Failed to get document for id : ${documentId}`));
        }
        //check if that doc contains that page or not 
        const updatedTitle = await (0, Pages_service_1.updateTitleForPage)(pageId, title);
        if (!updatedTitle) {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while updating Page", "Failed to update page"));
        }
        return res.status(200).send(new apiResponse_1.ApiResponse(200, "Title Update Successfully", updatedTitle));
    }
    catch (err) {
        logger_1.logger.error(err.message);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while updating Page", `${err.message}`));
    }
};
exports.updatePageTitleController = updatePageTitleController;
const updateCoverImageForPage = async (req, res) => {
    try {
        console.log("request Recived for Updating cover Image");
        // const { userId } = getAuth(req)
        const { pageId, coverImage } = req.body;
        console.log({ pageId, coverImage });
        // Use Clerk's JavaScript Backend SDK to get the user's User object
        const page = await (0, Pages_service_1.getPageByPageId)(pageId);
        if (!page) {
            return res.status(404).send(new apiError_1.ApiError(404, "Page not found", "Page not found"));
        }
        const updatedCoverImage = await (0, Pages_service_1.addCoverImageToPage)(pageId, coverImage);
        if (updatedCoverImage === null) {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while updating Page", "Failed to update page"));
        }
        return res.status(200).send(new apiResponse_1.ApiResponse(200, "Cover Image Update Successfully", updatedCoverImage));
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error While Adding Cover Image")); // failed
    }
};
exports.updateCoverImageForPage = updateCoverImageForPage;
const publishAPage = async (req, res) => {
    try {
        // const { userId } = getAuth(req)
        const { pageId } = req.body;
        // if (!userId) {
        //    return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
        // }
        // Use Clerk's JavaScript Backend SDK to get the user's User object
        const page = await (0, Pages_service_1.getPageByPageId)(pageId);
        if (!page) {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while publishing Page", "Failed to publish page"));
        }
        const published = await (0, Pages_service_1.publishPageByPageId)(pageId, page);
        return res.status(200).send(new apiResponse_1.ApiResponse(200, "Page Published Successfully", published));
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error While publishing Page")); // failed
    }
};
exports.publishAPage = publishAPage;
const updatePageContent = async (req, res) => {
    try {
        // const { userId } = getAuth(req)
        const { pageId, pageContent } = req.body;
        console.log("Update Page Content Request Recived ");
        // console.log({pageContent, pageId});
        // if (!userId) {
        //    return res.status(400).send(new ApiError(400, "Bad Request", "User id is required"))
        // }
        // Use Clerk's JavaScript Backend SDK to get the user's User object
        const page = await (0, Pages_service_1.getPageByPageId)(pageId);
        if (!page) {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while updating Page", "Failed to update page"));
        }
        const updatedPage = await (0, Pages_service_1.updatePageContentByPageId)(pageId, pageContent);
        if (!updatedPage) {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while updating Page", "Failed to update page"));
        }
        return res.status(200).send(new apiResponse_1.ApiResponse(200, "Page Updated Successfully", updatedPage));
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error While updating Page")); // failed
    }
};
exports.updatePageContent = updatePageContent;
const getPageByIdController = async (req, res) => {
    try {
        // const { userId } = getAuth(req)
        const { pageId } = req.query;
        const page = await (0, Pages_service_1.getPageByPageId)(pageId);
        if (!page) {
            return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error while fetching Page", "Failed to fetch page"));
        }
        return res.status(200).send(new apiResponse_1.ApiResponse(200, "Page Fetched Successfully", page));
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error While fetching Page")); // failed
    }
};
exports.getPageByIdController = getPageByIdController;
