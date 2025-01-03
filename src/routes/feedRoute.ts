import express, {Router} from "express"
import verifyToken from "../middlewares/verifyToken";
import verifyUser from "../middlewares/verifyUser";
import validateNewsFeedFields from "../middlewares/newsFeedFieldValidation";
import NewsFeedController from "../controllers/newsFeedController/newsFeedController";
import { ROUTE_CONSTANTS } from "../constants/routeConstants";
import validateCommentFields from "../middlewares/commentFieldValidations";

const FeedRoute = express?.Router();

const newsFeedController = NewsFeedController();

FeedRoute.post('/',verifyToken, verifyUser, validateNewsFeedFields,newsFeedController.createFeed);

FeedRoute.get('/', verifyToken, verifyUser, newsFeedController.fetchFeed);

FeedRoute.get(ROUTE_CONSTANTS.FEED_ID,verifyToken, verifyUser, newsFeedController.fetchFeed);

FeedRoute.delete(ROUTE_CONSTANTS.FEED_ID,verifyToken, verifyUser, newsFeedController.deleteFeed);

FeedRoute.post(ROUTE_CONSTANTS.LIKES, verifyToken, verifyUser,newsFeedController.likeFeed);

FeedRoute.post(ROUTE_CONSTANTS.COMMENTS, verifyToken, verifyUser, validateCommentFields, newsFeedController.feedComment);

export default FeedRoute;