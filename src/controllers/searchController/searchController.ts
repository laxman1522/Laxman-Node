import { NextFunction, Request, Response } from "express"
import logger from "../../logger/logger"
import SearchService from "../../services/globalSearchService/searchService";
import { setResponse } from "../../utils/helper";


const SearchController: any = () => {

    const globalSearch = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const keyword = req?.params?.searchKeyword;

            const result: any = await SearchService.globalSearch(keyword);

            return setResponse(res, 200, true, true, result,"");

        } catch(err: any) {
            logger.error(err?.message);
            next(err);
        }

    }

    return {globalSearch};

}

export default SearchController;