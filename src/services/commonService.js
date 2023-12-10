"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class commonService {
    isDateValid(date) {
        const updatedDate = new Date(date);
        return date instanceof Date && !isNaN(updatedDate);
    }
}
exports.default = commonService;
