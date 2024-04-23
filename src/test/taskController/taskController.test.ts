import supertest from "supertest"
import { AppConstants } from "../../constants/appConstants/appConstants";
import UserService from "../../services/userService/userService";
import UserController from "../../controller/userController/userController";

const {app} = require('../../server');

const jwt = require('jsonwebtoken'); 

jest.mock('jsonwebtoken');


describe("it should test Task Controller", () => {

    it("should test getTask", async () => {
        await supertest(app).get('/task').expect(403).then((result: any) => {
            expect(result.text && JSON.parse(result.text).message).toBe(AppConstants.RESPONSE_MESSAGES.INVALID_TOKEN);
        })
    })

    it("should test getTask without valid creds", async () => {
        await supertest(app).get('/task').expect(403).then((result: any) => {
            expect(result.text && JSON.parse(result.text).message).toBe(AppConstants.RESPONSE_MESSAGES.INVALID_TOKEN);
        })
    })

    it("should test getTask with proper creds", async () => {

        const mockUserData = { name: 'test' };

        jwt.verify.mockImplementationOnce((tokenToVerify: string, secret: string) => {
              return mockUserData; // Return mock data for successful verification
        });

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTGF4bWFuYXBhbmRpIiwiaWF0IjoxNzEzMzIyNDIyLCJleHAiOjE3MTMzMjQyMjJ9.EVJUd4tR-NT86mW44gLAGSGn_Bf3v1lfoNDVqIQASbs"

        await supertest(app).get('/task').set('Authorization', `Bearer ${token}`).expect(200).then((result: any) => {
            expect(result.text && JSON.parse(result.text).message).toBe(AppConstants.RESPONSE_MESSAGES.TASK_FETCH);
        })

    })


    it("should test getTask with proper creds along with sortBy query", async () => {

        const mockUserData = { name: 'test' };

        const queryObject = {
            sortBy: "priority"
          };
          

        jwt.verify.mockImplementationOnce((tokenToVerify: string, secret: string) => {
              return mockUserData; // Return mock data for successful verification
        });

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTGF4bWFuYXBhbmRpIiwiaWF0IjoxNzEzMzIyNDIyLCJleHAiOjE3MTMzMjQyMjJ9.EVJUd4tR-NT86mW44gLAGSGn_Bf3v1lfoNDVqIQASbs"

        await supertest(app).get('/task').set('Authorization', `Bearer ${token}`).query(queryObject).expect(200).then((result: any) => {
            expect(result.text && JSON.parse(result.text).message).toBe(AppConstants.RESPONSE_MESSAGES.TASK_FETCH);
        })
    })


    it("should test getTask with proper creds along with taskID", async () => {

        const mockUserData = { name: 'test' };
          

        jwt.verify.mockImplementationOnce((tokenToVerify: string, secret: string) => {
              return mockUserData; // Return mock data for successful verification
        });

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTGF4bWFuYXBhbmRpIiwiaWF0IjoxNzEzMzIyNDIyLCJleHAiOjE3MTMzMjQyMjJ9.EVJUd4tR-NT86mW44gLAGSGn_Bf3v1lfoNDVqIQASbs"

        await supertest(app).get('/task/1').set('Authorization', `Bearer ${token}`).expect(200).then((result: any) => {
            expect(result.text && JSON.parse(result.text).message).toBe(AppConstants.RESPONSE_MESSAGES.TASK_FETCH);
        })
    })
})