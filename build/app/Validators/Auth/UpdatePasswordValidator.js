"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UpdatePasswordValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            email: Validator_1.schema.string({ trim: true }, [Validator_1.rules.email()]),
            password: Validator_1.schema.string({ trim: true }, [Validator_1.rules.minLength(8)]),
            token: Validator_1.schema.string({ trim: true }, [Validator_1.rules.uuid({ version: 4 })]),
        });
        this.messages = {
            'required': '{{ field }} is required',
            'email.email': 'Invalid email address format',
            'minLength': '{{ field }} must be at least {{ options.minLength }} characters long',
            'maxLength': '{{ field }} must be less then {{ options.maxLength }} characters long',
            'token.uuid': 'Invalid token format',
        };
    }
}
exports.default = UpdatePasswordValidator;
//# sourceMappingURL=UpdatePasswordValidator.js.map