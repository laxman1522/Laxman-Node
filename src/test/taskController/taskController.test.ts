import TaskController from "../../controller/taskController/taskController";
import TaskService from "../../services/taskService/taskService";

const httpMocks = require('node-mocks-http');

const jwt = require('jsonwebtoken'); 

jest.mock('jsonwebtoken');

const mockTasks2: any = [
    {
        name: "test",
        tasks: [
        {
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


describe("it should test Task Controller", () => {

    let mockFetchTask: any;
    let mockFetchTaskById: any;

    beforeAll(() => {
        const mockUserData = { name: 'test' };

        jwt.verify.mockImplementation((tokenToVerify: string, secret: string) => {
              return mockUserData; // Return mock data for successful verification
        });

        mockFetchTask = jest.spyOn(TaskService,'fetchTask').mockReturnValue(mockTasks2[0]?.tasks);

        mockFetchTaskById = jest.spyOn(TaskService, 'fetchTaskById').mockReturnValue(mockTasks2[0]?.tasks[1]);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it("should test getTask with proper creds", async () => {

        let req = httpMocks.createRequest({
            method: 'GET',
            url: '/tasks',
            user: { name: 'test' }
        });

        let res = httpMocks.createResponse();
    
        const mockFetchTask = jest.spyOn(TaskService,'fetchTask').mockReturnValue(mockTasks2[0]?.tasks);

        const taskController = TaskController();

        taskController.fetchTask(req, res);

        const data = res._getJSONData()

        expect(data?.data?.tasks.length).toBe(3);

        expect(mockFetchTask).toHaveBeenCalled();

    })


    it("should test getTask with proper creds along with Task ID", async () => {

        let req = httpMocks.createRequest({
            method: 'GET',
            url: '/tasks',
            user: { name: 'test' },
            params: {
                id: 2,
            }
        });

        let res = httpMocks.createResponse();

        const taskController = TaskController();

        taskController.fetchTask(req, res);

        const data = res._getJSONData();

        expect(data?.data?.tasks.id).toBe(2); 

        expect(mockFetchTask).toHaveBeenCalled();
        expect(mockFetchTaskById).toHaveBeenCalled();
    })


    it("should test getTask with invalid query params", async () => {

        let req = httpMocks.createRequest({
            method: 'GET',
            url: '/tasks',
            user: { name: 'test' },
            query: {
                test: 2,
            }
        });

        let res: any = httpMocks.createResponse();

        const taskController = TaskController();

        taskController.fetchTask(req, res);

        const data = res._getData();

        expect(JSON.parse(data).message).toEqual("Invalid Request");
        
    })

    it("should test getTask with filter query", async () => {

        let req = httpMocks.createRequest({
            method: 'GET',
            url: '/tasks',
            user: { name: 'test' },
            query: {
                priority: "high",
            }
        });

        let res: any = httpMocks.createResponse();

        const taskController = TaskController();

        taskController.fetchTask(req, res);

        const data = res._getJSONData();

        expect(data?.data?.tasks.length).toBe(1);
        
    })
})