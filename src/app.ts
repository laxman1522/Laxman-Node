import express, {Express} from 'express';
import mongoose from 'mongoose';
import UserRoute from './routes/userRoute';
import { APP_CONSTANTS } from './constants/appContants';
import logger from './logger/logger';
import errorHandler from './middlewares/errorHandler';

const app: Express = express();
app.use(express.json());
const PORT = process.env.PORT;

//retrieving the MongoDB connection string from the .env file
const MONGODB_URI: string = process.env.MONGODB_URI!;

app.use('/', UserRoute);

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



 

