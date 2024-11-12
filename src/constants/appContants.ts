export const APP_CONSTANTS = {
    SERVER_STARTED: "Server is running on port",
    MONGODB_ERROR: "Error connecting to MongoDB:",
    USER_CONTROLLER: {
        START: 'User Controller started',
        END: 'User Controller Ended',
        ERROR: 'User Controller Error'
    },
    ERROR: {
        USER_ALREADY_EXISTS: "User Already Exists ",
        CREATE_USER_ERROR: "Error Creating user",
        INTERNAL_SERVER_ERROR: "Internal Server Error"
    },
    SUCCESS: {
        USER_REGISTER: "User registered successfully"
    },
    STATUS_CODES: {
        BAD_REQUEST: 400,
        CREATED: 201,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        SUCCESS: 200,
        INTERNAL_SERVER_ERROR: 500,
        CONFLICT: 409
    },
    ROLES: {
        ADMIN: 'admin',
        COWORKER: 'coworker',
    },
    FILE_PATH: {
        USER_ROLES: './json/userRole.json'
    }
}

export const SIGN_UP_REQUIRED_FIELDS = [
    'name',
    'gender',
    'profilePicture',
    'profileBio',
    'latestWorkDesignation',
    'certifications',
    'yearsOfExperiance',
    'bu',
    'workLocation',
    'employeeId',
    'email'
  ];