import { APP_CONSTANTS } from "../../constants/appContants";
import { newsFeed } from "../../interface/newsFeed"
import { Feed } from "../../models/newsFeed/newsFeed";


const NewsFeedService = {

    /**
     * 
     * @param feedData 
     * @returns 
     */
    createFeed : async (feedData: newsFeed, email: string) => {
        try {

            const feedDetails: any = await Feed.findOne().select('id -_id').sort({ id: -1 });
            const feed = new Feed({...feedData, currentTime: new Date(), id: (feedDetails?.id || 0) + 1, createdBy: email, likes: 0, comments: [] });
            await feed.save();
            return null;
        } catch(err) {
            const error: any = new Error(APP_CONSTANTS.ERROR.FEED_CREATION_ERROR);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
    },

    /**
     * 
     * @param email 
     */
    fetchFeedByEmail: async (email: string) => {
        try {
            const feedData = await Feed.find({createdBy: email});
            return feedData;
        } catch(err) {
            const error: any =  new Error(APP_CONSTANTS.ERROR.FEED_FETCHING_ERROR);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
    },

    /**
     * 
     * @param feedId 
     */
    fetchFeed: async () => {
        try {
            const  feedData = await Feed.find().lean();
            return feedData;
        } catch(err) {
            const error: any = new Error(APP_CONSTANTS.ERROR.FEED_FETCHING_ERROR);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
    },

    /**
     * 
     * @param feedId 
     * @returns 
     */
    fetchFeedByID: async (feedId: number) => {
        try {
            const feedData = await Feed.findOne({id: feedId}).lean();
            return feedData;
        } catch(err) {
            const error: any = new Error(APP_CONSTANTS.ERROR.FEED_FETCHING_ERROR);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
    },

    /**
     * 
     * @param feedId 
     * @param email 
     */
    findFeed: async (feedId: number, email: string) => {
        try {
            const document = await Feed.findOne({ id: feedId, createdBy: email }).lean();
            return document;
        } catch(err: any) {
            const error: any = new Error(err?.message);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
    },

    /**
     * 
     * @param feedId 
     */
    deleteFeed: async (feedId: number, email: string) => {
        try {
             const deletedFeed = await Feed.deleteOne({ id: feedId, createdBy: email }).lean();
             return deletedFeed;
        } catch(err: any) {
            const error: any = new Error(err?.message);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
    },

   /**
     * Like or unlike a feed item based on the user's interaction.
     * 
     * @param feedId - The ID of the feed item.
     * @param email - The email of the user liking/unliking the feed.
     * @returns The updated feed document.
     */
    likeFeed: async (feedId: number, email: string) => {
        try {
            // Find the document to check if the user has already liked it
            const feed: any = await Feed.findOne({ id: feedId });

            if (!feed) {
                const error: any = new Error(APP_CONSTANTS.ERROR.NO_FEED_AVAILABLE);
                error.statusCode = APP_CONSTANTS.STATUS_CODES.NOT_FOUND;
                throw error;
            }

            // Check if the user has already liked the feed
            const hasLiked = feed?.likedBy?.includes(email);

            // Update operation
            const update = hasLiked
                ? {
                    $inc: { likes: -1 },
                    $pull: { likedBy: email }
                }
                : {
                    $inc: { likes: 1 },
                    $push: { likedBy: email }
                };

            // Update the document and return the result
            const updatedDocument = await Feed.findOneAndUpdate(
                { id: feedId }, // Query
                update,          // Update
                { new: true }    // Options: return the updated document
            );

            return updatedDocument;
        } catch (err: any) {
            const error: any = new Error(err?.message);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
    },


    /**
     * 
     * @param feedId 
     * @returns 
     */
    feedComment: async (feedId: number, comments: object) => {
        try {
            const document = await Feed.findOneAndUpdate(
                { id: feedId }, // Query
                { $push: { comments:  comments} }, // Update
                { new: true } // Options: return the updated document
              );
            return document;
        } catch(err: any) {
            const error: any = new Error(err?.message);
            error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
    }
}

export default NewsFeedService;