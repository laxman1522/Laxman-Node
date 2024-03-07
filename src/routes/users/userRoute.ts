import UserController from "../../controller/userController/userController";
import TaskController from "../../controller/taskController/taskController";
import logger from "../../logger/logger";
import { Express, Request, Response } from "express";

const routeConstants = require('../../constants/routeConstants');
const express = require('express');
const router = express.Router();
const userController = UserController();
const taskController = TaskController();

router.post(routeConstants.SIGNUP,async (req: Request,res: Response) => {
    userController.createUser(req,res);
});

router.post(routeConstants.LOGIN,async (req: Request,res: Response) => {
    userController.login(req,res);
});

router.post('/task',userController.verifyToken, async (req:any,res: Response) => {
   taskController.createTask(req,res)
});

router.get('/task',userController.verifyToken, async (req:any,res: Response) => {
    taskController.fetchTask(req,res)
 });

 router.get('/task/:id',userController.verifyToken, async (req:any,res: Response) => {
    taskController.fetchTask(req,res)
 });

 router.patch('/task/:id',userController.verifyToken, async (req:any,res: Response) => {
    taskController.updateTask(req,res)
 });

 router.delete('/task/:id',userController.verifyToken, async (req:any,res: Response) => {
   taskController.deleteTask(req,res)
});

export default router;