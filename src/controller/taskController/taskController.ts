import { AppConstants } from '../../constants/appConstants/appConstants';
import logger from '../../logger/logger';
import TaskService from '../../services/taskService/taskService';

const taskService = TaskService();

const TaskController: any = () => {

    const createTask = (req: any, res: any) => {
        logger.info(AppConstants.CREATE_TASK.CONTROLLER);
        taskService.createTask(req,res);
    }

    const fetchTask = (req: Request, res: Response) => {
        logger.info(AppConstants.FETCH_TASK.CONTROLLER);
        taskService.fetchTask(req,res);
    }

    const updateTask = (req: Request, res: Response) => {
        logger.info(AppConstants.UPDATE_TASK.CONTROLLER);
        taskService.updateTask(req,res);
    }

    const deleteTask = (req: Request, res: Response) => {
        logger.info(AppConstants.DELETE_TASK.CONTROLLER);
        taskService.deleteTask(req,res);
    }

    const sortTask = (req: any, res: any) => {
        taskService.sortTask(req,res);
    }

    return{createTask,fetchTask, updateTask, deleteTask, sortTask}
}

export default TaskController;