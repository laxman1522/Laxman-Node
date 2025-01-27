import express, {Express} from 'express';
import mongoose from 'mongoose';
import UserRoute from './routes/userRoute';
import { APP_CONSTANTS } from './constants/appContants';
import logger from './logger/logger';
import errorHandler from './middlewares/errorHandler';
import { ROUTE_CONSTANTS } from './constants/routeConstants';
import ProfileRoute from './routes/profileRoute';
import FeedRoute from './routes/feedRoute';
import SearchRoute from './routes/searchRoute';
import SchedulerService from './services/scheduler/schedulerService';
import dotenv from 'dotenv';
const schedule = require("node-schedule");
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 3000;

//retrieving the MongoDB connection string from the .env file
const MONGODB_URI: string = process.env.MONGODB_URI!;

app.use('/', UserRoute);
app.use(ROUTE_CONSTANTS.PROFILE, ProfileRoute);
app.use(ROUTE_CONSTANTS.NEWS_FEED,FeedRoute );
app.use(ROUTE_CONSTANTS.SEARCH, SearchRoute);

// Error-handling middleware should come last
app.use(errorHandler); 

// Function to connect to the database
const connectToDatabase = async (): Promise<void> => {
    try {
      await mongoose.connect(MONGODB_URI);
      app.listen(port, () => {
        logger.info(`${APP_CONSTANTS.SERVER_STARTED} ${port}`); 
      }); 
    } catch (error) {
      logger.info(APP_CONSTANTS.MONGODB_ERROR, error);
      process.exit(1); // Exit process with failure
    }
};

connectToDatabase();  


// Load Swagger document
const swaggerDocument = YAML.load(
  fs.readFileSync(path.join(__dirname, APP_CONSTANTS.SWAGGER_PATH),'utf8')
);


// Serve Swagger UI
app.use(ROUTE_CONSTANTS.API_DOCS, swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Schedule the task (e.g., every day at midnight)
schedule.scheduleJob(APP_CONSTANTS.SCHEDULER_INTERVAL, SchedulerService.removeInactiveEmployee);



 

