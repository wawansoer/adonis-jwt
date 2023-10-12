"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
function Response(response, success, message, data, error, status = 200) {
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