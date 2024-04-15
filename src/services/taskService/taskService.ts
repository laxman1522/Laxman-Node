import { getExistingUserData, sortData, filterData, parseData, checkIfTaskAvailable, setResponse, findIndexHelper, isValidParams} from '../../utils/helper';
import { readFile, writeFile } from '../fileService/fileService';
import logger from '../../logger/logger';
import { AppConstants } from '../../constants/appConstants/appConstants';

const TaskService: any = () => {

  /**
   * Method for handling the logic for creating a new task
   * @param req 
   * @param res 
   * @returns 
   */
    const createTask = (req: any, res: any) => {
      try{
        logger.info(AppConstants.CREATE_TASK.SERVICE);
        // Validate the request body
        const error = isValidParams(req?.body);

        const {title, description, priority, dueDate, taskComments} = req?.body;

        if(!error && !!Object.keys(req?.body)?.length) {
          const name = req?.user?.name;

          let tasks: any = readFile(AppConstants.TASK_FILE_NAME);

          tasks = parseData(tasks);

          // Check if username already exists
          const existingUser = getExistingUserData(name,tasks,AppConstants.NAME);

          const task = constructTask(title,description,priority,dueDate,taskComments,existingUser);

          if(existingUser) {
            for(let data of tasks) {
                data?.name === name && data?.tasks?.push(task);
            }
          } else {
            tasks.push({name : name, tasks: [task] });
          }
            writeFile(AppConstants.TASK_FILE_NAME,tasks);
            return setResponse(res,200,AppConstants.MESSAGE, AppConstants.TASK_CREATED_SUCCESSFULLY)
        } else {
          return setResponse(res,400,AppConstants.ERROR,error?.details[0]?.message);
        }
      } catch (err) {
        logger.error(AppConstants.CREATE_TASK.ERROR);
        return setResponse(res,500,AppConstants.ERROR,AppConstants.INTERNAL_SERVER_ERROR);
      }
    }

    /**
     * Method for constructing the task from the request body details
     * @param title 
     * @param description 
     * @param priority 
     * @param dueDate 
     * @param taskComments 
     * @param existingUser 
     * @returns 
     */
    const constructTask = (title: string,description: string,priority: string,dueDate: any,taskComments: any, existingUser: any) => {
        const task = {
          id: existingUser ? existingUser?.tasks[existingUser?.tasks?.length-1]?.id + 1 : 1,
          title: title,
          description: description,
          priority: priority,
          dueDate: dueDate,
          timeStamp: Date.now(),
          taskComments: taskComments
        }
        return task;
    }

    /**
     * method to construct the pagination request response
     * @param tasks 
     * @param totalTasks 
     * @param currentPage 
     * @param limit 
     * @param totalPages 
     * @returns 
     */
    const constructPaginationResponse = (tasks: Array<any>,totalTasks: number,currentPage: number, limit: number, totalPages: number) => {
      return {
        tasks: tasks,
        totalTasks: totalTasks,
        currentPage: currentPage,
        limit: limit,
        totalPages: totalPages
      }
    }

    /**
     * Method Handles the logic for fetching all the tasks, tasks based on the id, filter and sort tasks
     * @param req 
     * @param res 
     * @returns 
     */
    const fetchTask = (req: any, res: any) => {
      try {
        logger.info(AppConstants.FETCH_TASK.SERVICE);
        const name = req?.user?.name;
        const taskId = req?.params?.id;
        const sortBy = req?.query?.sortBy;
        const page = Number(req?.query?.page);
        const limit = Number(req?.query?.limit);
        const filterParams = AppConstants.FILTER_PARAMS;
        const filterParam = Object.keys(req?.query)[0];
        const filterParamValue = req?.query[filterParam];

        let tasks: any = readFile(AppConstants.TASK_FILE_NAME);
        tasks = parseData(tasks);

        const existingUser = getExistingUserData(name,tasks,AppConstants.NAME);

        if(sortBy) { //Sorting Logic
          if(!AppConstants.SORTBY_PARAMS.includes(sortBy.toLowerCase())) {
            return setResponse(res,400,AppConstants.MESSAGE,AppConstants.INVALID_PARAMS);
          } else {
            tasks = sortData(existingUser?.tasks, sortBy);
          }
        } else if(filterParamValue) { //Filter Logic

          if(filterParams.includes(filterParam)) {
            tasks = filterData(existingUser?.tasks, filterParam,filterParamValue);
          } else if(page && limit) {

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            tasks = existingUser?.tasks?.slice(startIndex, endIndex);
            const paginationResponse = constructPaginationResponse(tasks,existingUser?.tasks?.length,page,limit,Math.ceil(existingUser?.tasks?.length / limit));
            return setResponse(res,200,AppConstants.MESSAGE,paginationResponse);

          } else {
            return setResponse(res,400,AppConstants.MESSAGE,AppConstants.INVALID_PARAMS);
          }
         
        } else if(taskId) { // fetching the tasks based on the individual tasks id
          tasks =  filterData(existingUser?.tasks, AppConstants.ID, Number(taskId)) ;
        } else {
          tasks = existingUser?.tasks;
        }

        if(!tasks || !tasks?.length || !existingUser) {
            return setResponse(res,404,AppConstants.MESSAGE,AppConstants.TASK_NOT_FOUND);
        } else {
          return setResponse(res,200,AppConstants.TASK_DATA,tasks);
        }
      } catch (err) {
        logger.error(AppConstants.FETCH_TASK.ERROR);
        return setResponse(res,500,AppConstants.ERROR, AppConstants.INTERNAL_SERVER_ERROR);
      }
    }

    /**
     * Method that handles the logic for updating the task
     * @param req 
     * @param res 
     */
    const updateTask = (req: any, res: any) => {
      try {
        logger.info(AppConstants.UPDATE_TASK.SERVICE);
        const name = req?.user?.name;
        const taskId = req?.params?.id;
        const updatedTasks = req?.body;

        // Validate the request body
        const error = isValidParams(req?.body);

        if(!Object.keys(updatedTasks)?.length || error) {
          return setResponse(res,400,AppConstants.ERROR,!error ? AppConstants.INVALID_REQUEST : error?.details[0]?.message);
        }

        for(let key of Object.keys(updatedTasks)) {
            if(!AppConstants.TASK_KEYS.includes(key)) {
              return setResponse(res,400,AppConstants.ERROR,AppConstants.INVALID_REQUEST);
            }
        }
        let tasks: any = readFile(AppConstants.TASK_FILE_NAME);
        tasks = parseData(tasks);

        const existingUser = getExistingUserData(name,tasks,AppConstants.NAME);
        const taskIndex = findIndexHelper(existingUser?.tasks,AppConstants.ID,Number(taskId));

        if(existingUser && taskIndex >= 0) {
            for(let data of tasks) {
              if(data?.name === name) {
                data.tasks[taskIndex] = {...data.tasks[taskIndex],...updatedTasks};
                data.tasks[taskIndex].timeStamp = Date.now();
              }
            }
            writeFile(AppConstants.TASK_FILE_NAME,tasks);
            return setResponse(res,200,AppConstants.MESSAGE,AppConstants.UPDATED);
        } else {
          return setResponse(res,404,AppConstants.MESSAGE,AppConstants.TASK_NOT_FOUND);
        } 
      }catch(err) {
        logger.error(AppConstants.UPDATE_TASK.ERROR)
        return setResponse(res,500,AppConstants.ERROR,AppConstants.INTERNAL_SERVER_ERROR);
      }
    }

    /**
     * Method handles the logic to delete the individual tasks based on the ID
     * @param req 
     * @param res 
     * @returns 
     */
    const deleteTask = (req: any, res: any) => {
      logger.info(AppConstants.DELETE_TASK.SERVICE)
      try {
        const name = req?.user?.name;
        const taskId = req?.params?.id;
        let isTaskAvailable = false;
        let tasks: any = readFile(AppConstants.TASK_FILE_NAME);
        tasks = parseData(tasks);

        tasks = tasks?.map((task: any) =>  {
          if(task?.name === name) {
            //Checking whether the particular task is available 
            isTaskAvailable = checkIfTaskAvailable(task?.tasks,AppConstants.ID,Number(taskId));
            return {
              name: name,
              tasks: filterData(task?.tasks,AppConstants.ID,Number(taskId),false)
            }
          }else {
            return task;
          }});

        if(isTaskAvailable) {
          writeFile(AppConstants.TASK_FILE_NAME, tasks);
          res.status(200).json({message: AppConstants.TASK_DELETED});
        } else {
          res.status(404).json({message: AppConstants.TASK_NOT_FOUND});
        }
      } catch (err) {
        logger.error(AppConstants.DELETE_TASK.ERROR)
        return res.status(500).json({ error: AppConstants.INTERNAL_SERVER_ERROR });
      }  
    }

    return{createTask,fetchTask, updateTask, deleteTask}
}

export default TaskService;