import express, { Router } from "express";
import verifyUser from "../middlewares/verifyUser";
import ProfileController from "../controllers/profileController/profileController";
import verifyToken from "../middlewares/verifyToken";
import validateProfileUpdateFields from "../middlewares/profileUpdateFieldValidation";

const ProfileRoute: Router = express.Router();

const profileController = ProfileController();


ProfileRoute.get("/",verifyToken,verifyUser,profileController.fetchProfile);

ProfileRoute.patch("/", verifyToken, verifyUser,validateProfileUpdateFields,profileController.updateProfile);


export default ProfileRoute;