import express, {Express} from 'express';
import mongoose from 'mongoose';
import UserRoute from './routes/userRoute';
import { APP_CONSTANTS } from './constants/appContants';
import logger from './logger/logger';
import errorHandler from './middlewares/errorHandler';
import { ROUTE_CONSTANTS } from './constants/routeConstants';
import ProfileRoute from './routes/profileRoute';
import FeedRoute from './routes/feedRoute';
import { readFile, writeFile } from './services/fileService/fileService';
const schedule = require("node-schedule");
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const path = require('path');


const app: Express = express();
app.use(express.json());
const PORT = process.env.PORT;

//retrieving the MongoDB connection string from the .env file
const MONGODB_URI: string = process.env.MONGODB_URI!;

app.use('/', UserRoute);
app.use(ROUTE_CONSTANTS.PROFILE, ProfileRoute);
app.use(ROUTE_CONSTANTS.NEWS_FEED,FeedRoute );

// Error-handling middleware should come last
app.use(errorHandler); 

// Function to connect to the database
const connectToDatabase = async (): Promise<void> => {
    try {
      await mongoose.connect(MONGODB_URI);
      app.listen(PORT, () => {
        logger.info(`${APP_CONSTANTS.SERVER_STARTED} ${PORT}`); 
      }); 
    } catch (error) {
      logger.info(APP_CONSTANTS.MONGODB_ERROR, error);
      process.exit(1); // Exit process with failure
    }
};

connectToDatabase();  


// Load Swagger document
const swaggerDocument = YAML.load(
  fs.readFileSync(path.join(__dirname, './docs/swagger.yaml'), 'utf8')
);


// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/**
 * 
 */
const cdwMockJsonHandler = async () => {

    let cdwMockJson = await readFile(APP_CONSTANTS.FILE_PATH.USER_ROLES);
    let removedUserList = await readFile(APP_CONSTANTS.FILE_PATH.REMOVED_USER);

    removedUserList = removedUserList?.map((removedUser: any) => removedUser?.employeeId );

    cdwMockJson = cdwMockJson?.filter((user: any) => !removedUserList?.includes(user?.employeeId));

    writeFile(APP_CONSTANTS.FILE_PATH.USER_ROLES, cdwMockJson);
   
}

// Schedule the task (e.g., every day at midnight)
schedule.scheduleJob("0 0 20 * * *", cdwMockJsonHandler);



 

