export const APP_CONSTANTS = {
    SERVER_STARTED: "Server is running on port",
    MONGODB_ERROR: "Error connecting to MongoDB:",
    SCHEDULER_STARTED: 'Scheduler started',
    ERROR: {
        SAVE_USER_ERROR: "Unexpected Error while trying to save the user",
        USER_ALREADY_EXISTS: "User Already Exists ",
        USER_ALREADY_REGISTERED_PENDING: "User already registered and status is still pending",
        USER_ALREADY_REGISTERED_REJECTED: "User already registered and got rejected please try signup after 2 days from the rejected date",
        USER_ALREADY_APPROVED: "User has been approved earlier",
        USER_REREGISTERED: "User re registered successfully",
        CREATE_USER_ERROR: "Error Creating user",
        INTERNAL_SERVER_ERROR: "Internal Server Error",
        UNVERIFIED_USER: "User not verified yet",
        USER_NOT_EXIST: "User doesn't exist",
        EMAIL_PASSWORD_REQUIRED: "Email & Password is required",
        INVALID_PASSWORD: "Password is invalid",
        ONLY_ADMIN_ALLOWED: "Only Admin is allowed to make this request",
        INVALID_USER: 'Invalid User',
        APPROVAL_ERROR: 'Unexpected error happened while trying to approve user',
        ERROR_FETCHING_PROFILE_INFO: 'Error while fetching profile information',
        NO_PROFILE: 'No profiles were found' ,
        PROFILE_UPDATION_FAILED: "Error occured in profile updation",
        FEED_CREATION_ERROR: 'Error Happened while creating a feed',
        FEED_FETCHING_ERROR: 'Error Happened while fetching feed data',
        NO_FEED_AVAILABLE_FOR_ID: 'No feed available for the given id' ,
        NO_FEED_AVAILABLE: 'No feed available',
        FEED_DELETE_ERROR: 'Error occured while deleting the feed - requested Feed is not available or you are not authorised to delete the feed',
        FEED_LIKE_ERROR: 'Error occured while updating like for the given feed - requested feed is not available',
        FEED_COMMENT_ERROR: 'Error occured while updating comment for the given feed - requested feed is not available',
        REJECTED: 'User has been rejected, Please check whether the provided details are matching with CDW wallet credentials',
        INVALID_EMAIL_EMPLOYEE_ID: 'Invalid Email or Employee Id',
        ERROR_SENDING_EMAIL: 'Error sending email: '
    },
    SUCCESS: {
        USER_PENDING: "User registered successfully...Have to wait untill admin approve the request",
        USER_REGISTER: "User registered successfully...",
        USER_LOGIN: "User Logged in successfully",
        USER_FETCH: "User fetched successfully",
        USER_APPROVED: "User approved successfully",
        PROFILE_INFO_FETCH: "Profile Information fetched successfully",
        PROFILE_INFO_UPDATED: "Profile Information Updated successfully",
        FEED_CREATED: "Feed Created Successfully",
        FEED_FETCHED: "Feed fetched successfully",
        FEED_DELETED: "Feed Deleted Successfully",
        FEED_LIKE_UPDATED: "Feed likes updated successfully",
        FEED_COMMENT_UPDATED: "Feed comment updated successfully",
        SCHEDULER_UPDATE: 'User table updated successfully through Scheduler -',
        EMAIL_SENT: 'Email has been sent successfully'
    },
    STATUS_CODES: {
        BAD_REQUEST: 400,
        CREATED: 201,
        NO_CONTENT: 204,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
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
        CDW_WALLET_USERS: './json/cdwWalletUsers.json'
    },
    USER_CONTROLLER: {
        CREATE_USER: {
            START: "Create User controller started",
            ENDED: "Create User Controller ended",
            ERROR: "Create User Controller error"
        },
        PENDING_USER: {
            START: "Pending User controller started",
            ENDED: "Pending User controller ended",
            ERROR: "Pending User controller error"
        },
        LOGIN_USER:{
            START: "Login User controller started",
            ENDED: "Login User controller ended",
            ERROR: "Login User controller error"
        },
        APPROVE_USER:{
            START: "Approve User controller started",
            ENDED: "Approve User controller ended",
            ERROR: "Approve User controller error"
        }
    },
    FEED_CONTROLLER: {
        CREATE_FEED: {
            START: 'Create Feed Controller Started',
            ENDED: 'Create Feed Controller ended',
            ERROR: 'Create Feed Controller error'
        },
        FETCH_FEED: {
            START: 'Fetch Feed Controller Started',
            ENDED: 'Fetch Feed Controller ended',
            ERROR: 'Fetch Feed Controller error'
        },
        LIKE_FEED: {
            START: 'Like Feed Controller Started',
            ENDED: 'Like Feed Controller ended',
            ERROR: 'Like Feed Controller error'
        },
        COMMENT_FEED: {
            START: 'Comment Feed Controller Started',
            ENDED: 'Comment Feed Controller ended',
            ERROR: 'Comment Feed Controller error'
        },
    },
    USER_SERVICE: {
        CREATE_USER: {
            START: "Create User service started",
            ENDED: "Create User Service ended",
            ERROR: "Create User Service error"
        },
        LOGIN_USER:{
            START: "Login User Service started",
            ENDED: "Login User Service ended",
            ERROR: "Login User Service error"
        },
    },
    GENDER: {
        MALE: 'Male',
        FEMEALE: 'Female',
        OTHER: 'Other'
    },
    PROFILE_CONTROLLER: {
        FETCH_PROFILES: {
            START: "Fetch Profile controller started",
            ENDED: "Fetch Profile controller ended",
            ERROR: "Fetch Profile Controller error"
        },
        UPDATE_PROFILE: {
            START: "Update Profile controller started",
            ENDED: "Update Profile controller ended",
            ERROR: "Update Profile Controller error"
        }
    },
    APPROVAL_STATUS:{
        APPROVED: "approved",
        REJECTED: "rejected",
        PENDING: "pending"
    },
    SWAGGER_PATH: './docs/swagger.yaml',
    SCHEDULER_INTERVAL: "0 0 20 * * *",
    AUTHORIZATION: 'authorization',
    UNAUTHORIZED: "Unauthorized",
    INVALID_TOKEN: "Invalid Token",
    RESPONSE_MESSAGES: {
        USER_NOT_AUTHORIZED: "User not authorized",
        INVALID_TOKEN: "Invalid Token",
    },
    TOKEN_EXPIRATION: "30m",
    CDW_CONNECT_APPROVAL_STATUS: 'CDW Connect Approval Status',
    MOCK_EMAIL: "emmy.rath@ethereal.email"
}

  export const PROFILE_INFO_FIELDS = [
    'name',
    'gender',
    'profilePicture',
    'profileBio',
    'latestWorkDesignation',
    'certifications',
    'yearsOfExperiance',
    'bu',
    'workLocation',
    'employeeId'
  ];

  export const REQUEST_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    PUT: 'PUT'
  }

  export const COMMENT_FIELDS = ['comment'];

  export const NEWS_FEED_FIELDS = ['title', 'location', 'link','caption']

  export const LOGIN_REQUIRED_FIELDS = [
    "email",
    "password"
  ]

  export const NODE_MAIL_CREDS = {
    HOST: 'smtp.ethereal.email',
    PORT: 587,
    USER: 'emmy.rath@ethereal.email',
    PASSWORD: 'EZM8PNrGBsRmTDHBDT'
  }