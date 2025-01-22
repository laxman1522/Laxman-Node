import { APP_CONSTANTS } from "../../constants/appContants";
import { Feed } from "../../models/newsFeed/newsFeed";
import { User } from "../../models/user/user";

const SearchService = {

    /**
     * Responsible for handling the Global search 
     * @param keyword 
     * @returns 
     */
    globalSearch: async (keyword: string) => {
        try {
            const matchingNameList = await User.find({
                $or: [
                  { name: { $regex: keyword, $options: "i" } }, // Case-insensitive regex
                ]
            });

            const matchingDestinationList = await User.find({
                $or: [
                    { latestWorkDesignation: { $regex: keyword, $options: "i" } }, // Case-insensitive regex
                ]
            });


            const matchingTitleList =  await Feed.find({
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                ]
            })

            const matchingLocationList =  await Feed.find({
                $or: [
                    { location: { $regex: keyword, $options: "i" } },
                ]
            })

            const matchingCaptionList =  await Feed.find({
                $or: [
                    { caption: { $regex: keyword, $options: "i" } },
                ]
            })

            return {username: matchingNameList, destination: matchingDestinationList, postTitle: matchingTitleList, postLocation: matchingLocationList, postCaption: matchingCaptionList };
        } catch (err: any) {
             const error: any = new Error(err?.message);
             error.statusCode = APP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
             throw error;
        }
    }
}

export default SearchService;