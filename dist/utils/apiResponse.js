"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(status, message, data, success = true) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = success;
    }
}
exports.ApiResponse = ApiResponse;
