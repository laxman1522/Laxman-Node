"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isValidDate = (date) => {
    const currentDate = new Date();
    const dateParts = date.split("/");
    // Ensure correct number of parts
    if (dateParts.length !== 3) {
        return false;
    }
    const [day, month, year] = dateParts;
    // Validate individual parts
    if (!Number.isInteger(parseInt(year)) ||
        !Number.isInteger(parseInt(month)) ||
        !Number.isInteger(parseInt(day))) {
        return false;
    }
    // Attempt to create a Date object with manual parsing
    const parsedDate = new Date(year, parseInt(month) - 1, day); // Adjust month for 0-based indexing
    // Check for valid Date object and reasonable year range
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) && (parsedDate.getTime() > currentDate.getTime());
};
exports.default = isValidDate;
