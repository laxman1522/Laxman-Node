import logger from "../../logger/logger"
import bcrypt from "bcrypt";
import fs from 'fs';
import { Express, Request, Response } from "express";
import UserService from "../../services/userService/userService";
const jwt = require("jsonWebToken");
const dotenv = require("dotenv");

const userService = UserService();

const UserController: any = () => {

    const createUser = async (req: Request,res: Response) => {
      try {
        userService.createUser(req,res);
      } catch (err) {
        res.status(500).json("Internal Server Error");
      }
    }

    const login = async (req: Request,res: Response) => {
      try {
        userService.login(req,res);
      } catch (err) {
        res.status(500).json("Internal Server Error");
      }
    }

    const verifyToken = (req: any, res: any, next: any) => {
      try {
        userService.verifyToken(req,res,next);
      } catch (err) {
        res.status(500).json("Internal Server Error");
      }
    };

    return {createUser, login, verifyToken};

}

export default UserController;