"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
function Response(response, status = 200, success, message, data, error) {
    const responseBody = {
        success,
        message,
        data,
        error,
    };
    response.status(status).json(responseBody);
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map