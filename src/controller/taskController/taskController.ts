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
               return setResponse(res,AppConstants.STATUS_CODES.CREATED,true,false,AppConstants.RESPONSE_MESSAGES.TASK_CREATED_SUCCESSFULLY,{})
            } else {
                return setResponse(res,AppConstants.STATUS_CODES.BAD_REQUEST,false,true,error?.message ? error?.message : AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST,{})
            }    
        } catch (error: any) {
            return setResponse(res,AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR,false,true,error?.message,{})
        }
       
    }

    /**
     * Method for fetching all the tasks which the individual user has created 
     * @param req 
     * @param res 
     */
    const fetchTask = (req: any, res: any) => {
        logger.info(AppConstants.FETCH_TASK.CONTROLLER);
        try {
            const name = req?.user?.name;
            const taskId = req?.params?.id;
            const sortBy = req?.query?.sortBy;
            const page = Number(req?.query?.page);
            const limit = Number(req?.query?.limit);
            const filterParams = AppConstants.FILTER_PARAMS;
            const paginationParams = AppConstants.PAGINATION_PARAMS;
            const queryParam = req?.query;

            let tasks = taskService.fetchTask(name);

            let totalTasks = 0;

            //filter task logic 
            for(let key of Object.keys(queryParam)) {
                if(!paginationParams.includes(key.toLocaleLowerCase()) && key !== AppConstants.SORTBY) {
                    if(filterParams.includes(key)) {
                        queryParam[key] && (tasks = taskService.filterTask(tasks,key,queryParam[key]));
                    } else {
                        return setResponse(res,AppConstants.STATUS_CODES.BAD_REQUEST,false,true,AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST,{});
                    }
                }
            }

            //Fetching task based on the individual id
            if(taskId) {
                tasks = taskService.fetchTaskById(tasks,taskId);
            } else {
                sortBy && (tasks = taskService.sortTask(tasks, sortBy));
            }

            let data = {};
            totalTasks = tasks?.length;

            if(page && limit) {
                (page && limit) && (tasks = taskService.fetchTaskBasedOnPagination(tasks,page,limit));
                data = {
                    tasks: tasks,
                    totalTasks: totalTasks,
                    currentPage: page,
                    limit: limit,
                    totalPages: Math.ceil(totalTasks / limit)
                }
            } else {
                data = {
                    tasks: tasks,
                    totalTasks: totalTasks
                }
            }

            return setResponse(res,AppConstants.STATUS_CODES.SUCCESS,true,false,AppConstants.RESPONSE_MESSAGES.TASK_FETCH,data)
        } catch(error: any) {
            if(error?.message === AppConstants.TASK_NOT_FOUND) {
                return setResponse(res,AppConstants.STATUS_CODES.SUCCESS, false,true,AppConstants.RESPONSE_MESSAGES.TASK_NOT_FOUND,{});
            } else {
                return setResponse(res,AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR,false,true,error?.message,{})
            }
        }

        
    }

    /**
     * Method for updating the tasks based on the ID
     * @param req 
     * @param res 
     */
    const updateTask = (req: any, res: any) => {
        logger.info(AppConstants.UPDATE_TASK.CONTROLLER);
        try {
            const name = req?.user?.name;
            const taskId = req?.params?.id;
            const updatedTasks = req?.body;
            const error = isValidParams(req?.body);
            if(!error && !!Object.keys(updatedTasks)?.length) {
                taskService.updateTask(name,Number(taskId),updatedTasks);
                return setResponse(res,AppConstants.STATUS_CODES.SUCCESS,true,false,AppConstants.RESPONSE_MESSAGES.TASK_UPDATE,{});
            } else {
                return setResponse(res,AppConstants.STATUS_CODES.BAD_REQUEST,false,true,error?.message ? error?.message : AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST,{})
            }
        } catch(error: any) {
            if(error?.message === AppConstants.TASK_NOT_FOUND) {
                return setResponse(res,AppConstants.STATUS_CODES.SUCCESS, false,true,AppConstants.RESPONSE_MESSAGES.TASK_NOT_FOUND,{});
            } else {
                return setResponse(res,AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR,false,true,error?.message,{});
            }
        }
    }

    /**
     * Method for deleting the task which the individual user has created based on the ID
     * @param req 
     * @param res 
     */
    const deleteTask = (req: any, res: any) => {
        logger.info(AppConstants.DELETE_TASK.CONTROLLER);
        try {
            const name = req?.user?.name;
            const taskId = req?.params?.id;
            taskService.deleteTask(name,Number(taskId));
            return setResponse(res,AppConstants.STATUS_CODES.SUCCESS,true,false,AppConstants.RESPONSE_MESSAGES.TASK_DELETED_SUCCESSFULLY,{});
        } catch (error: any) {
            if(error?.message === AppConstants.TASK_NOT_FOUND) {
                return setResponse(res,AppConstants.STATUS_CODES.SUCCESS, false,true,AppConstants.RESPONSE_MESSAGES.TASK_NOT_FOUND,{});
            } else {
               return setResponse(res,AppConstants.STATUS_CODES.INTERNAL_SERVER_ERROR, false,true,error?.message,{});
            }
        }
    }

    return{createTask,fetchTask, updateTask, deleteTask}
}

export default TaskController;