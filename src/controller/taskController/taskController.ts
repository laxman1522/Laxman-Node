
import fs from 'fs';
import logger from '../../logger/logger';
import isValidDate from '../../utils/helper';
import TaskService from '../../services/taskService/taskService';

const taskService = TaskService();

const TaskController: any = () => {

    const createTask = (req: any, res: any) => {
      try {
        taskService.createTask(req,res);
      } catch(err) {
        res.status(500).json("Internal Server error");
      } 
    }

    const fetchTask = (req: any, res: any) => {
      try {
        taskService.fetchTask(req,res);
      } catch(err) {
        res.status(500).json("Internal Server error");
      } 
    }

    const updateTask = (req: any, res: any) => {
      try {
        taskService.updateTask(req,res);
      } catch(err) {
        res.status(500).json("Internal Server error");
      } 
    }

    const deleteTask = (req: any, res: any) => {
      try {
        taskService.deleteTask(req,res);
      } catch(err) {
        res.status(500).json("Internal Server error");
      } 
    }

    const sortTask = (req: any, res: any) => {
      try {
        taskService.sortTask(req,res);
      } catch(err) {
        res.status(500).json("Internal Server error");
      } 
    }

    return{createTask,fetchTask, updateTask, deleteTask, sortTask}
}

export default TaskController;