"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ForgotPasswordValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            email: Validator_1.schema.string({ trim: true }, [Validator_1.rules.email()]),
        });
        this.messages = {
            'required': '{{ field }} is required',
            'email.email': 'Invalid email address format',
        };
    }
}
exports.default = ForgotPasswordValidator;
//# sourceMappingURL=ForgotPasswordValidator.js.map