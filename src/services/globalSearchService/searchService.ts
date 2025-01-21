import { Feed } from "../../models/newsFeed/newsFeed";
import { User } from "../../models/user/user";

const SearchService = {

    globalSearch: async (keyword: string) => {
        try {
            const userList = await User.find({
                $or: [
                  { name: { $regex: keyword, $options: "i" } }, // Case-insensitive regex
                  { latestWorkDesignation: { $regex: keyword, $options: "i" } },
                ]
              });

            const feedList =  await Feed.find({
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { location: { $regex: keyword, $options: "i" } },
                    { caption: { $regex: keyword, $options: "i" } },
                ]
            })

            const combinedResult = [...userList,...feedList];

            return combinedResult;
        } catch (err: any) {

        }
    }
}

export default SearchService;