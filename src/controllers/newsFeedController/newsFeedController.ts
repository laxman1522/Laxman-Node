import { NextFunction, Response } from "express";
import NewsFeedService from "../../services/newsFeedService/newsFeedService";
import { setResponse } from "../../utils/helper";
import { APP_CONSTANTS } from "../../constants/appContants";
import logger from "../../logger/logger";

const NewsFeedController: any = () => {

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    const createFeed = async (req: any, res: Response, next: NextFunction) => {
            try{
                logger.info(APP_CONSTANTS.FEED_CONTROLLER.CREATE_FEED.START);
                await NewsFeedService.createFeed(req?.body, req?.email);
                logger.info(APP_CONSTANTS.FEED_CONTROLLER.CREATE_FEED.ENDED);
                return setResponse(res,APP_CONSTANTS.STATUS_CODES.CREATED, true, false, APP_CONSTANTS.SUCCESS.FEED_CREATED, []);
            } catch(err) {
                logger.info(APP_CONSTANTS.FEED_CONTROLLER.CREATE_FEED.ERROR);
                next(err);
            }
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    const fetchFeed =  async (req: any, res: Response, next: NextFunction) => {
        try {
            logger.info(APP_CONSTANTS.FEED_CONTROLLER.FETCH_FEED.START);
            const feedId = Number(req?.params?.id);
            const email = req?.query?.email;
            let feedData: any;

            if(feedId) {
              feedData =  await NewsFeedService.fetchFeedByID(feedId);
            } else if(email) {
                feedData = await NewsFeedService.fetchFeedByEmail(email);
            } else {
                feedData = await NewsFeedService.fetchFeed();
            }
            logger.info(APP_CONSTANTS.FEED_CONTROLLER.FETCH_FEED.ENDED, feedData);
            if(feedData && (!!Object.keys(feedData)?.length || !!feedData?.length)) {
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, true, false, APP_CONSTANTS.SUCCESS.FEED_FETCHED, feedData);
            } else {
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, false, true, feedId ? APP_CONSTANTS.ERROR.NO_FEED_AVAILABLE_FOR_ID : APP_CONSTANTS.ERROR.NO_FEED_AVAILABLE, []);
            }
            
        } catch(err) {
            logger.info(APP_CONSTANTS.FEED_CONTROLLER.FETCH_FEED.ERROR);
            next(err);
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    const deleteFeed = async (req: any, res: Response, next: NextFunction) => {
        try {
            const deletedFeed = await NewsFeedService.deleteFeed(req?.params?.id, req?.email);
            if(deletedFeed?.deletedCount) {
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, true, false, APP_CONSTANTS.SUCCESS.FEED_DELETED, []);
            } else {
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, false, true, APP_CONSTANTS.ERROR.FEED_DELETE_ERROR, []);
            } 
        } catch(err) {
            logger.info(APP_CONSTANTS.FEED_CONTROLLER.FETCH_FEED.ERROR);
            next(err);
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    const likeFeed = async (req: any, res: Response, next: NextFunction) => {
        try {
            logger.info(APP_CONSTANTS.FEED_CONTROLLER.LIKE_FEED.START);
            const updatedDocument = await NewsFeedService.likeFeed(req?.params?.id, req?.email);
            if(updatedDocument) {
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, true, false, APP_CONSTANTS.SUCCESS.FEED_LIKE_UPDATED, updatedDocument);
            } else {
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR, false, true, APP_CONSTANTS.ERROR.FEED_LIKE_ERROR,[]);
            }
        } catch(err: any) {
            logger.info(APP_CONSTANTS.FEED_CONTROLLER.LIKE_FEED.ERROR);
            next(err);
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    const feedComment = async (req: any, res: Response, next: NextFunction) => {
        try {
            logger.info(APP_CONSTANTS.FEED_CONTROLLER.COMMENT_FEED.START);
            const commentData = {
                description: req?.body?.comment,
                commentedBy: req?.email,
                currentTime: new Date()
            }
            const updatedDocument = await NewsFeedService.feedComment(req?.params?.id,commentData);
            logger.info(APP_CONSTANTS.FEED_CONTROLLER.COMMENT_FEED.ENDED);
            if(updatedDocument) {
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.SUCCESS, true, false, APP_CONSTANTS.SUCCESS.FEED_COMMENT_UPDATED, updatedDocument);
            } else {
                return setResponse(res, APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR, false, true, APP_CONSTANTS.ERROR.FEED_COMMENT_ERROR,[]);
            }
        } catch (err) {
            logger.info(APP_CONSTANTS.FEED_CONTROLLER.COMMENT_FEED.ERROR);
            next(err);
        }
    }

    return {createFeed, fetchFeed, deleteFeed, likeFeed, feedComment};
}

export default NewsFeedController;