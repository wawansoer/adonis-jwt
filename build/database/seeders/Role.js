"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Role_1 = __importDefault(require("../../app/Models/Role"));
class default_1 extends Seeder_1.default {
    async run() {
        const rolesData = [
            {
                slug: 'root',
                name: 'Root',
                description: 'Super user for developers, you can do anything with this user role :)',
            },
            {
                slug: 'administrator',
                name: 'Administrator',
                description: 'High Level role that can do CRUD All',
            },
            {
                slug: 'editor',
                name: 'Editor',
                description: 'Middle Level role that can do CRU all',
            },
            {
                slug: 'author',
                name: 'Author',
                description: 'Middle Level role that can do CR all',
            },
            {
                slug: 'contributor',
                name: 'Contributor',
                description: 'Low Level role that can do R all',
            },
            {
                slug: 'guest',
                name: 'Guest',
                description: 'Guest Level role that can do R something',
            },
        ];
        for (const roles of rolesData) {
            const role = new Role_1.default();
            role.description = roles.description;
            role.slug = roles.slug;
            role.name = roles.name;
            await role.save();
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=Role.js.map