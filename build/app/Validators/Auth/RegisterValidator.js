"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class RegisterValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            username: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.maxLength(50),
                Validator_1.rules.minLength(3),
                Validator_1.rules.unique({ table: 'users', column: 'username' }),
                Validator_1.rules.notIn(['admin', 'super', 'moderator', 'public', 'dev', 'alpha', 'mail']),
                Validator_1.rules.alphaNum({
                    allow: ['underscore'],
                }),
            ]),
            email: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.unique({ table: 'users', column: 'email' }),
                Validator_1.rules.email(),
            ]),
            password: Validator_1.schema.string({}, [Validator_1.rules.minLength(8)]),
        });
        this.messages = {
            'minLength': '{{ field }} must be at least {{ options.minLength }} characters long',
            'maxLength': '{{ field }} must be less then {{ options.maxLength }} characters long',
            'required': '{{ field }} is required',
            'unique': '{{ field }} must be unique, and this value is already taken',
            'alphaNum': "{{ field }} can't contain space & dash",
            'email.email': 'Invalid email address format',
        };
    }
}
exports.default = RegisterValidator;
//# sourceMappingURL=RegisterValidator.js.map