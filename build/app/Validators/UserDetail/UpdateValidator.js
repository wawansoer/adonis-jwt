"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UpdateValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            nik: Validator_1.schema.string({ trim: true }, [Validator_1.rules.minLength(16)]),
            nama_lengkap: Validator_1.schema.string({ trim: true }, [Validator_1.rules.minLength(10)]),
            tanggal_lahir: Validator_1.schema.date({}),
            alamat: Validator_1.schema.string({ trim: true }, [Validator_1.rules.minLength(10)]),
            nomor_handphone: Validator_1.schema.string({ trim: true }, [Validator_1.rules.minLength(10)]),
            pengalaman: Validator_1.schema.string({ trim: true }, []),
        });
        this.messages = {
            minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
            maxLength: '{{ field }} must be less then {{ options.maxLength }} characters long',
            required: '{{ field }} is required',
            unique: '{{ field }} must be unique, and this value is already taken',
        };
    }
}
exports.default = UpdateValidator;
//# sourceMappingURL=UpdateValidator.js.map