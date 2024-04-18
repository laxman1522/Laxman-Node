import { getExistingUserData, sortData, filterData, parseData, checkIfTaskAvailable, setResponse, findIndexHelper, isValidParams} from '../../utils/helper';
import { readFile, writeFile } from '../fileService/fileService';
import logger from '../../logger/logger';
import { AppConstants } from '../../constants/appConstants/appConstants';

type TaskParams = {
  title: string, 
  description: string, 
  priority: string, 
  dueDate: Date, 
  taskComments: Array<any>
}

const TaskService: any = () => {

  /**
   * Method for handling the logic for creating a new task
   * @param req 
   * @param res 
   * @returns 
   */
    const createTask = (taskParams: TaskParams,name: string) => {
        logger.info(AppConstants.CREATE_TASK.SERVICE);

        const {title, description, priority, dueDate, taskComments} = taskParams;
        let tasks: any = readFile(AppConstants.TASK_FILE_NAME);

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
        return tasks;
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
      const id = existingUser && existingUser?.tasks?.length ?  existingUser?.tasks[existingUser?.tasks?.length-1]?.id + 1 : 1;
        const task = {
          id: id,
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
     * Method for fetching all the task which user has created
     * @param name 
     * @returns 
     */
    const fetchTask = (name: string) => {
      logger.info(AppConstants.FETCH_TASK.SERVICE);

      let tasks: any = readFile(AppConstants.TASK_FILE_NAME);
      const existingUser = getExistingUserData(name,tasks,AppConstants.NAME);
      if(!tasks || !tasks?.length || !existingUser) {
          throw new Error(AppConstants.TASK_NOT_FOUND);
      } else {
          return existingUser?.tasks;
      }
    }

    /**
     * method for sorting all the task based on the query params value
     * @param tasks 
     * @param sortBy 
     * @returns 
     */
    const sortTask = (tasks: any, sortBy: string) => {
      if(!AppConstants.SORTBY_PARAMS.includes(sortBy)) {
          throw new Error(AppConstants.INVALID_PARAMS);
      } else {
          return sortData(tasks, sortBy);
      }
    }

    /**
     * Method for fetching the indivudual task based on the given ID
     * @param tasks 
     * @param taskId 
     * @returns 
     */
    const fetchTaskById = (tasks: any, taskId: number) => {
      return filterData(tasks, AppConstants.ID, taskId)
    }

    /**
     * Mathod for filtering the task based on the query params value
     * @param tasks 
     * @param filterParam 
     * @param filterParamValue 
     * @returns 
     */
    const filterTask = (tasks: any,filterParam: string, filterParamValue: any) => {
      if(AppConstants.FILTER_PARAMS.includes(filterParam)) {
          return filterData(tasks, filterParam,filterParamValue);
      } else {
          throw new Error(AppConstants.INVALID_PARAMS);
      }
    }

    /**
     * Mathod for fetching the task based on the page number  and limit
     * @param tasks 
     * @param page 
     * @param limit 
     * @returns 
     */
    const fetchTaskBasedOnPagination = (tasks: any,page: number,limit: number) => {
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const taskList = tasks.slice(startIndex,endIndex);
            if(!taskList|| !taskList.length) {
              throw new Error(AppConstants.TASK_NOT_FOUND);
            } else {
              return taskList;
            }
    }

    /**
     * Method that handles the logic for updating the task
     * @param req 
     * @param res 
     */
    const updateTask = (name: string,taskId: number,updatedTasks: any) => {
        logger.info(AppConstants.UPDATE_TASK.SERVICE);

        let tasks: any = readFile(AppConstants.TASK_FILE_NAME);
        const existingUser = getExistingUserData(name,tasks,AppConstants.NAME);
        const taskIndex = findIndexHelper(existingUser?.tasks,AppConstants.ID,taskId);

        if(existingUser && taskIndex >= 0) {
            for(let data of tasks) {
              if(data?.name === name) {
                data.tasks[taskIndex] = {...data.tasks[taskIndex],...updatedTasks};
                data.tasks[taskIndex].timeStamp = Date.now();
              }
            }
            writeFile(AppConstants.TASK_FILE_NAME,tasks);
            return tasks;
        } else {
          throw new Error(AppConstants.TASK_NOT_FOUND);
        } 
    }

    /**
     * Method handles the logic to delete the individual tasks based on the ID
     * @param req 
     * @param res 
     * @returns 
     */
    const deleteTask = (name: string, taskId: number) => {
        logger.info(AppConstants.DELETE_TASK.SERVICE)
        let isTaskAvailable = false;
        let tasks: any = readFile(AppConstants.TASK_FILE_NAME);

        tasks = tasks?.map((task: any) =>  {
          if(task?.name === name) {
            //Checking whether the particular task is available 
            isTaskAvailable = checkIfTaskAvailable(task?.tasks,AppConstants.ID,Number(taskId));
            return {
              name: name,
              tasks: filterData(task?.tasks,AppConstants.ID,taskId,false)
            }
          }else {
            return task;
          }});

        if(isTaskAvailable) {
          writeFile(AppConstants.TASK_FILE_NAME, tasks);
          return tasks;
        } else {
          throw new Error(AppConstants.TASK_NOT_FOUND);
        } 
    }

    return{createTask,fetchTask, updateTask, deleteTask, sortTask, fetchTaskById, filterTask, fetchTaskBasedOnPagination}
}

export default TaskService;