
import express, { Router } from "express";
import { ROUTE_CONSTANTS } from "../constants/routeConstants";
import SearchController from "../controllers/searchController/searchController";
import verifyToken from "../middlewares/verifyToken";
import verifyUser from "../middlewares/verifyUser";

const SearchRoute = express.Router();

const searchController = SearchController();

SearchRoute.get(ROUTE_CONSTANTS.SEARCH_KEYWORD,verifyToken, verifyUser,searchController.globalSearch);

export default SearchRoute;