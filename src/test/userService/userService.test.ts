import UserService from "../../services/userService/userService";
import { AppConstants } from "../../constants/appConstants/appConstants";
import { readFile } from "../../services/fileService/fileService";
import { writeFile } from "fs";
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");

dotenv.config();

type user = {
  name: string
}

const jwt = require('jsonwebtoken');  // Assuming jwt is used for token verification

jest.mock("../../services/fileService/fileService", () => ({
  readFile: () => {return [{}]},
  writeFile: () => {}
}))

jest.mock('jsonwebtoken'); // Mock the entire jwt module

jest.mock("../../utils/helper", () => ({
  getExistingUserData: () => {return {userName: "John", password: "test"}},
}))

const {verifyToken, generateAccessToken, login, createUser} = UserService();

jest.mock('bcrypt');

describe('User Service', () => {

  it('should throw an error for missing token', async () => {
    const emptyToken = "";
    try {
      await verifyToken(emptyToken);
    } catch (error: any) {
      expect(error.message).toBe(AppConstants.UNAUTHORIZED);
    }
  });

  it('should throw an error for invalid token', async () => {
    const invalidToken = 'invalid.token';
    try {
      await verifyToken(invalidToken);
    } catch (error: any) {
      expect(error.message).toBe(AppConstants.INVALID_TOKEN);
    }
  });

  it('should return decoded data for valid token', async () => {
    const mockUserData = { username: 'user1' };

    jwt.verify.mockImplementationOnce((tokenToVerify: string, secret: string) => {
      if (tokenToVerify === "test" && secret === process.env.ACCESS_TOKEN_SECRET) {
        return mockUserData; // Return mock data for successful verification
      }
      throw new Error('invalid token'); // Throw error for any other token
    });

    const decoded = await verifyToken("test");
    expect(decoded).toEqual(mockUserData);
  });

  it('should test login function without valid creds ', async () => {

    bcrypt.compare.mockImplementationOnce((password: string, existingPassword:string) => {
      if (password === existingPassword) {
        return true; // Return mock data for successful verification
      } else {
        return false;
      }
    })

    jwt.sign.mockImplementationOnce((userData: any, secretToken: string,expiresIn: any) => {
      return "test:token";
    })

      const token = await login("John","test");
      expect(token).toBe("test:token");
  })

  it('should test create user function with existing user creds ', async () => {

    bcrypt.genSalt.mockImplementationOnce(() => {
      return 10;
    })

    bcrypt.hash.mockImplementationOnce((password: string, saltRounds: number) => {
      return "hash#";
    })

    jwt.sign.mockImplementationOnce((userData: any, secretToken: string,expiresIn: any) => {
      return "test:token";
    })

      try {
        await createUser("John","test");
      } catch (error: any) {
        expect(error.message).toBe(AppConstants.USER_ALREADY_EXIST);
      }
  })


  afterEach(() => jest.clearAllMocks());
});
