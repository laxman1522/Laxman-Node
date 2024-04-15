
import UserController from "../../controller/userController/userController";
import TaskController from "../../controller/taskController/taskController";
import { Request, Response } from "express";

const routeConstants = require('../../constants/routeConstants');
const express = require('express');
const TaskRoute = express.Router();
const userController = UserController();
const taskController = TaskController();


TaskRoute.post('',userController.verifyToken, async (req:Request,res: Response) => {
    await taskController.createTask(req,res);
 });
 
TaskRoute.get('',userController.verifyToken, async (req:Request,res: Response) => {
    await taskController.fetchTask(req,res);
});
 
 TaskRoute.get(routeConstants.TASK_ID,userController.verifyToken, async (req:Request,res: Response) => {
    await taskController.fetchTask(req,res)
  });
 
TaskRoute.patch(routeConstants.TASK_ID,userController.verifyToken, async (req:Request,res: Response) => {
    await taskController.updateTask(req,res)
  });
 
TaskRoute.delete(routeConstants.TASK_ID,userController.verifyToken, async (req:Request,res: Response) => {
   await taskController.deleteTask(req,res)
 });

 export default TaskRoute;