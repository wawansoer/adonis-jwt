"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class LoginValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            email: Validator_1.schema.string({ trim: true }, [Validator_1.rules.email()]),
            password: Validator_1.schema.string({}, [Validator_1.rules.minLength(8)]),
        });
        this.messages = {
            'email.email': 'Invalid email address format',
            'minLength': '{{ field }} must be at least {{ options.minLength }} characters long',
            'maxLength': '{{ field }} must be less then {{ options.maxLength }} characters long',
            'required': '{{ field }} is required',
            'unique': '{{ field }} must be unique, and this value is already taken',
            'alphaNum': "{{ field }} can't contain space & dash",
        };
    }
}
exports.default = LoginValidator;
//# sourceMappingURL=LoginValidator.js.map