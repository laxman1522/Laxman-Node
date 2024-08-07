import { AppConstants } from '../../constants/appConstants/appConstants';
import logger from '../../logger/logger';
import TaskService from '../../services/taskService/taskService';
import { filterParamsByValue, isValidParams, setResponse } from '../../utils/helper';

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
               const tasks = TaskService.createTask(req?.body, req?.user?.name);
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
            const taskId = Number(req?.params?.id);
            const sortBy = req?.query?.sortBy;
            const page = Number(req?.query?.page);
            const limit = Number(req?.query?.limit);
            const queryParam = req?.query; 

            const queryParamKeys = Object.keys(queryParam);

            //Checking for any invalid query params
            for (const queryParam of queryParamKeys) {
                if(!AppConstants.FILTER_PARAMS.includes(queryParam) && !AppConstants.PAGINATION_PARAMS.includes(queryParam) && queryParam !== AppConstants.SORTBY) {
                    return setResponse(res,AppConstants.STATUS_CODES.BAD_REQUEST,false,true,AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST,{});
                }
            }

            //filtering the filter query param list
            const filterQueryParamList = filterParamsByValue(queryParamKeys, AppConstants.FILTER_PARAMS);

            //fetching all the task created by the user
            let tasks = TaskService.fetchTask(name);

            let totalTasks = 0;

            //Logic for filtering the tasks based on the filter param
            filterQueryParamList?.forEach((filterQueryParam: string) => {
                    queryParam[filterQueryParam] && (tasks = TaskService.filterTask(tasks,filterQueryParam,queryParam[filterQueryParam]));
            })

            //Fetching task based on the individual id
            if(taskId) {
                tasks = TaskService.fetchTaskById(tasks,taskId);
            } else {
                sortBy && (tasks = TaskService.sortTask(tasks, sortBy));
            }

            let data = {};
            totalTasks = tasks?.length;

            if(page && limit) {
                (page && limit) && (tasks = TaskService.fetchTaskBasedOnPagination(tasks,page,limit));
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

            if(tasks && !!tasks.length) {
                return setResponse(res,AppConstants.STATUS_CODES.SUCCESS,true,false,AppConstants.RESPONSE_MESSAGES.TASK_FETCH,data)
            } else {
                return setResponse(res,AppConstants.STATUS_CODES.SUCCESS,true,false,AppConstants.RESPONSE_MESSAGES.INVALID_REQUEST,data)
            }

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
                TaskService.updateTask(name,Number(taskId),updatedTasks);
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
            TaskService.deleteTask(name,Number(taskId));
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