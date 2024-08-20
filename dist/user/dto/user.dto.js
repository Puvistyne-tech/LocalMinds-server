"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
class UserDto {
    constructor(user, accessToken) {
        this.user = {
            id: user.id,
            username: user.username,
            email: user.email,
        };
        this.accessToken = accessToken;
    }
}
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map