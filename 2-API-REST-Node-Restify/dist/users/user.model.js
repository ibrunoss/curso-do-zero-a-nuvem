"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users = [
    { id: "1", name: "Peter Parker", email: "peter@marvel.com" },
    { id: "2", name: "Bruce Wayne", email: "bruce@dc.com" },
];
class User {
    static findAll() {
        return Promise.resolve(users);
    }
    static findByID(id) {
        return new Promise((resolve) => {
            const filtered = users.filter((user) => user.id === id);
            resolve(filtered[0]);
        });
    }
}
exports.default = User;
