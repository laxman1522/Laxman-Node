import { AppConstants } from "../../constants/appConstants/appConstants";
import { writeFile } from "../../services/fileService/fileService";
import TaskService from "../../services/taskService/taskService"
import { checkIfTaskAvailable, filterData, findIndexHelper, sortData } from "../../utils/helper";

const {createTask, fetchTask, sortTask, deleteTask, updateTask} = TaskService();

const mockTasks2: any = [
    {
        name: "test",
        tasks: [{
        id: 1,
        title: "test",
        description: "test",
        priority: "medium",
        dueDate: "2024-10-10",
        comments: []
        },
        {
            id: 2,
            title: "test",
            description: "test",
            priority: "high",
            dueDate: "2024-10-10",
            comments: []
        },
        {
            id: 3,
            title: "test",
            description: "test",
            priority: "low",
            dueDate: "2024-10-10",
            comments: []
        }]
}]

jest.mock("../../services/fileService/fileService", () => ({
    readFile: () => {return mockTasks2},
    checkIfTaskAvailable: () => true,
    writeFile: () => {}
}))


jest.mock("../../utils/helper", () => ({
    getExistingUserData: () => {return {tasks: mockTasks2.tasks}},
    findIndexHelper: () => {return 1},
    checkIfTaskAvailable: () => {return true},
    sortData: () => {},
    filterData: () => {}
}))



  const mockTasks = [
    {
        title: "test",
        description: "test",
        priority: "medium",
        dueDate: "2024-10-10",
        comments: []
    },
    {
        title: "test",
        description: "test",
        priority: "high",
        dueDate: "2024-10-10",
        comments: []
    },
    {
        title: "test",
        description: "test",
        priority: "low",
        dueDate: "2024-10-10",
        comments: []
    }
  ];

describe('task service test cases', () => {

    it("should test create task with proper task params", () => {
            const taskParams = mockTasks[0];
            const tasks = createTask(taskParams,"test");
            expect(tasks[0]?.tasks).not.toBeNull();   
    })

    it("should test fetch task without valid user name", () => {
       try {
            const tasks = fetchTask("test");
       }catch(error: any) {
            expect(error.message).toBe(AppConstants.TASK_NOT_FOUND);
       }
    })

    it("should test sortBy task with valid query param", () => {
             const tasks = sortTask(mockTasks,"priority");
             expect(tasks).not.toBeNull();
     })

    it("should test sortBy task without valid query param", () => {
        try {
            const tasks = sortTask(mockTasks,"prior");
        } catch(error: any) {
            expect(error.message).toBe(AppConstants.INVALID_PARAMS);
        }       
    })

    it("should test delete task with valid task id and user", () => {
        try {
            const tasks = deleteTask("test",1);
            expect(tasks).not.toBeNull();
        } catch(error: any) {
            expect(error.message).toBe(AppConstants.TASK_NOT_FOUND);
        }       
    })

    it("should test delete task without valid user", () => {
        try {
            const tasks = deleteTask("tes",1);
        } catch(error: any) {
            expect(error.message).toBe(AppConstants.TASK_NOT_FOUND);
        }       
    })

    it("should test update task without valid user", () => {
        try {
            const tasks = updateTask("tes",1);
        } catch(error: any) {
            expect(error.message).toBe(AppConstants.TASK_NOT_FOUND);
        }       
    })

    it("should test update task with valid user", () => {
            const tasks = updateTask("test",1);
            expect(tasks).not.toBe(null);     
    })

    it("should test create task with valid user", () => {
        const tasks = createTask(mockTasks[0],"test");
        expect(tasks).not.toBe(null);     
    })

})