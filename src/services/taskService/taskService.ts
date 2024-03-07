import fs from 'fs';
import logger from '../../logger/logger';
import isValidDate from '../../utils/helper';

const TaskService: any = () => {

    const createTask = (req: any, res: any) => {
        const {title, description, priority, dueDate, taskComments} = req?.body;
        if(title && description && priority && dueDate && taskComments) {
          const name = req?.user?.name;
          let tasks: any = fs.readFileSync('tasks.json', 'utf8');
          tasks = tasks && JSON.parse(tasks);
          // Check if username already exists
          const existingUser = tasks && tasks?.find((user: any) => user?.name === name);
          const task = {
            id: existingUser ? existingUser?.tasks[existingUser?.tasks?.length-1]?.id + 1 : 1,
            title: title,
            description: description,
            priority: priority,
            dueDate: dueDate,
            timeStamp: Date.now(),
            taskComments: taskComments
        }
         if(isValidDate(dueDate)) {
          if(existingUser) {
            for(let data of tasks) {
              if(data?.name === name) {
                data?.tasks?.push(task);
              }
            }
          } else {
            tasks.push({name : name, tasks: [task] });
          }
            fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
            res.status(200).json({ message: req?.user?.name })
         } else {
            res.status(400).json({ error: 'Invalid Date' })
         } 
        } else {
          res.status(400).json({ error: 'Invalid Request' })
        }
    }

    const fetchTask = (req: any, res: any) => {
        const name = req?.user?.name;
        const taskId = req?.params?.id;
        const sortBy = req?.query?.sortBy;
        const filterParams = ["title","priority","dueDate"]
        const filterParam = Object.keys(req?.query)[0];
        const filterParamValue = req?.query[filterParam];
        let tasks: any = fs.readFileSync('tasks.json', 'utf8');
        tasks = tasks && JSON.parse(tasks);
        const existingUser = tasks && tasks?.find((user: any) => user?.name === name);
        if(sortBy) {
           tasks = existingUser?.tasks?.sort((task1:any,task2: any) => {
              if(typeof(task1[sortBy]) === "string") {
                return task1[sortBy]?.localeCompare(task2[sortBy]);
              } else if(typeof(task1[sortBy] instanceof Date)) {
                return task1[sortBy]-task2[sortBy];
              }
           });
        } else if(filterParamValue) {
          !filterParams.includes(filterParam) && res.status(400).json({ message: "Invalid params" });
          tasks = existingUser?.tasks?.filter((task: any) => task[filterParam] === filterParamValue);
        } else {
          tasks = taskId ? existingUser?.tasks?.filter((task: any) =>  task?.id === Number(taskId)) : existingUser?.tasks;
        }
        if(!tasks || !tasks?.length || !existingUser) {
            res.status(404).json({ message: "Tasks Not Found" })
        } else {
            res.status(200).json({ taskData: tasks })
        }
    }

    const updateTask = (req: any, res: any) => {
        const name = req?.user?.name;
        const taskId = req?.params?.id;
        const updatedTasks = req?.body;
        const taskKeys = [
            'title',
            'description',
            'priority',
            'dueDate',
            'taskComments'
        ]
        !Object.keys(updatedTasks)?.length && res.status(400).json({ message: "Invalid Request" });
        for(let key of Object.keys(updatedTasks)) {
            !taskKeys.includes(key) && res.status(400).json({ message: "Invalid Request" })
        }
        let tasks: any = fs.readFileSync('tasks.json', 'utf8');
        tasks = tasks && JSON.parse(tasks);
        const existingUser = tasks && tasks?.find((user: any) => user?.name === name);
        const taskIndex = existingUser?.tasks?.findIndex((task: any) =>  task?.id === Number(taskId));
        if(existingUser && taskIndex > 0) {
            for(let data of tasks) {
              if(data?.name === name) {
                data.tasks[taskIndex] = {...data.tasks[taskIndex],...updatedTasks};
                data.tasks[taskIndex].timeStamp = Date.now();
              }
            }
            fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
            res.status(200).json({message: "updated"});
        } else {
            res.status(404).json({ message: "Tasks Not Found" })
        } 
    }

    const deleteTask = (req: any, res: any) => {
        const name = req?.user?.name;
        const taskId = req?.params?.id;
        let isTaskAvailable = false;
        let tasks: any = fs.readFileSync('tasks.json', 'utf8');
        tasks = tasks && JSON.parse(tasks);

        tasks = tasks?.map((task: any) =>  {
          if(task?.name === name) {
            let taskList = task?.tasks?.filter((task: any) => {
              if(task?.id === Number(taskId)) {
                  isTaskAvailable = true;
                  return false;
              } else {
                return true
              }
            })
            return {
              name: name,
              tasks: task?.tasks?.filter((task: any) => task?.id !== Number(taskId))
            }
          }else {
            return task;
          }});
        if(isTaskAvailable) {
          fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
          res.status(200).json({message: "deleted"});
        } else {
          res.status(404).json({message: "Task Not Found"});
        }
        
    }

    const sortTask = (req: any, res: any) => {
      const name = req?.user?.name;
      let tasks: any = fs.readFileSync('tasks.json', 'utf8');
      tasks = tasks && JSON.parse(tasks);
      const existingUser = tasks && tasks?.find((user: any) => user?.name === name);
      console.log(existingUser);
      res.end("heyy");
    }

    return{createTask,fetchTask, updateTask, deleteTask, sortTask}
}

export default TaskService;