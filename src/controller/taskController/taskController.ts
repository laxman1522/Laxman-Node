import { AppConstants } from '../../constants/appConstants/appConstants';
import logger from '../../logger/logger';
import TaskService from '../../services/taskService/taskService';
import { isValidParams, setResponse } from '../../utils/helper';

const taskService = TaskService();

const TaskController: any = () => {

    /**
     * Method for creating a task for individual user
     * @param req 
     * @param res 
     */
    const createTask = (req: any, res: any) => {
        logger.info(AppConstants.CREATE_TASK.CONTROLLER);
        try {
            const error = isValidParams(req?.body);
            if(!error && !!Object.keys(req?.body)?.length) {
               const tasks = taskService.createTask(req?.body, req?.user?.name);
               setResponse(res,AppConstants.STATUS_CODES.CREATED,true,false,AppConstants.RESPONSE_MESSAGES.TASK_CREATED_SUCCESSFULLY,{})
            } else {
                setResponse(res,AppConstants.STATUS_CODES.BAD_REQUEST,false,true,AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST,{})
            }    
        } catch (error: any) {
            setResponse(res,AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR,false,true,error?.message,{})
        }
       
    }

    /**
     * Method for fetching all the tasks which the individual user has created 
     * @param req 
     * @param res 
     */
    const fetchTask = (req: Request, res: Response) => {
        logger.info(AppConstants.FETCH_TASK.CONTROLLER);
        taskService.fetchTask(req,res);
    }

    const updateTask = (req: Request, res: Response) => {
        logger.info(AppConstants.UPDATE_TASK.CONTROLLER);
        taskService.updateTask(req,res);
    }

    /**
     * Method for deleting the task which the individual user has created based on the ID
     * @param req 
     * @param res 
     */
    const deleteTask = (req: any, res: any) => {
        logger.info(AppConstants.DELETE_TASK.CONTROLLER);
        try {
            taskService.deleteTask(req?.user?.name,req?.params?.id);
            setResponse(res,AppConstants.STATUS_CODES.SUCCESS,true,false,AppConstants.RESPONSE_MESSAGES.TASK_DELETED_SUCCESSFULLY,{});
        } catch (error: any) {
            if(error?.message === AppConstants.TASK_NOT_FOUND) {
                setResponse(res,AppConstants.STATUS_CODES.SUCCESS, false,true,AppConstants.RESPONSE_MESSAGES.TASK_NOT_FOUND,{});
            } else {
                setResponse(res,AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false,true,error?.message,{});
            }
        }
    }

    const sortTask = (req: any, res: any) => {
        taskService.sortTask(req,res);
    }

    return{createTask,fetchTask, updateTask, deleteTask, sortTask}
}

export default TaskController;