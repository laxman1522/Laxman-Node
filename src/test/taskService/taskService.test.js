"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const mockTasks2 = [
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
            }
        ]
    }
];
jest.mock("../../services/fileService/fileService", () => ({
    readFile: () => { return mockTasks2; },
    writeFile: () => { }
}));
// jest.mock("../../utils/helper", () => ({
//     getExistingUserData: () => {return {tasks: mockTasks2}},
//     checkIfTaskAvailable: (data: any, param: any,paramValue: any) => {
//         return data?.some((data: any) => data[param] === paramValue)
//        },
//     findIndexHelper: (data: Array<any>, param: string, paramValue: any) => {
//         return data?.findIndex((data: any) => data[param] === paramValue)
//        },
//     sortData: (data: any, param: string) => 
//         {
//             const sortData = data?.sort((data1:any,data2: any) => {
//             if(typeof(data1[param]) === "string") {
//                 return data1[param]?.localeCompare(data2[param]);
//             } else if(typeof(data1[param] instanceof Date)) {
//                 return data1[param]-data2[param];
//             }
//         });
//         return sortData;
//     },
//     filterData: (data: any,filterParam: string , filterParamValue: any, equal:boolean = true ) => {
//         return data?.filter((data: any) => {
//          if(typeof filterParamValue === "string") {
//            return data[filterParam].includes(filterParamValue);
//          } else {
//            return equal ? data[filterParam] === filterParamValue : data[filterParam] !== filterParamValue;
//          }
//         });
//       }
// }))
describe('task service testing', () => {
    it(' should test create Task with proper task params', () => {
    });
});
// describe('task service test cases', () => {
//     let getExistingUserDataSpy: any;
//     beforeAll(() => {
//         getExistingUserDataSpy = jest.spyOn(Utils, 'getExistingUserData').mockReturnValue(mockTasks2[0]);
//     });
//     afterAll(() => {
//         getExistingUserDataSpy.mockRestore();
//     });
//     it("should test create task with proper task params", () => {
//             // const spy1 = jest.spyOn(Test,'readFile').mockReturnValue(mockTasks2); 
//             // const spy2 = jest.spyOn(Test,'writeFile').mockImplementationOnce(() => {})
//             const taskParams = mockTasks[0];
//             const tasks = TaskService.createTask(taskParams,"test");
//             expect(tasks[0]?.tasks?.length).toEqual(4);   
//     })
//     it("should test fetch task without valid user name", () => {
//        try {
//             const tasks = TaskService.fetchTask("Test1");
//        } catch(error: any) {
//             expect(error.message).toBe(AppConstants.TASK_NOT_FOUND);
//        }
//     })
//     it("should test fetch task with valid user name", () => {
//         const tasks = TaskService.fetchTask("test");
//         expect(tasks).toBeTruthy();
//      })
//     it("should test sortBy task with valid query param", () => {
//              const tasks = TaskService.sortTask(mockTasks,"priority");
//              expect(tasks[0].priority).toBe('high');
//      })
//     it("should test sortBy task without valid query param", () => {
//         try {
//             const tasks = TaskService.sortTask(mockTasks,"prior");
//         } catch(error: any) {
//             expect(error.message).toBe(AppConstants.INVALID_PARAMS);
//         }       
//     })
//     it("should test delete task with valid task id and user", () => {
//             const tasks = TaskService.deleteTask("test",1);
//             expect(tasks[0]?.tasks[0].id).not.toBe(1);     
//     })
//     it("should test delete task without valid user", () => {
//         try {
//             const tasks = TaskService.deleteTask("tes",1);
//         } catch(error: any) {
//             expect(error.message).toBe(AppConstants.TASK_NOT_FOUND);
//         }       
//     })
//     it("should test update task without valid user", () => {
//         try {
//             const tasks = TaskService.updateTask("tes",1, mockTasks[1]);
//         } catch(error: any) {
//             expect(error.message).toBe(AppConstants.TASK_NOT_FOUND);
//         }       
//     })
//     it("should test create task with valid user", () => {
//         const tasks = TaskService.createTask(mockTasks[0],"test");
//         expect(tasks).not.toBe(null);     
//     })
// })
