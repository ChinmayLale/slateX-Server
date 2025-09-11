"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const logger_1 = require("../config/logger");
const express_1 = require("@clerk/express");
const getUserProfile = async (req, res) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId) {
            return res.status(400).send(new apiError_1.ApiError(400, "Bad Request", "User id is required"));
        }
        // Use Clerk's JavaScript Backend SDK to get the user's User object
        const user = await express_1.clerkClient.users.getUser(userId);
        logger_1.logger.info(`User profile fetched for user id: ${userId}`);
        return res.status(200).send(new apiResponse_1.ApiResponse(200, "Success", user));
    }
    catch (err) {
        logger_1.errorLogger.error(err.message);
        return res.status(500).send(new apiError_1.ApiError(500, "Internal Server Error ", `${err.message}`));
    }
};
exports.getUserProfile = getUserProfile;
