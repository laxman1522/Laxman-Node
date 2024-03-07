import bcrypt from "bcrypt";
import fs from 'fs';
const jwt = require("jsonWebToken");
import { Express, Request, Response } from "express";
import { readFile,writeFile } from "../fileService/fileService";

const UserService = () => {

    const createUser = async (req: any,res: any) => {
            const userName = req?.body?.username;
            const password = req?.body?.password;

            const Password = hashPassword(password);

            let users: any = readFile('users.json');

            users = users && JSON.parse(users);

            // Check if username already exists
            const existingUser = getExistingUserData(userName, users);

            if(!existingUser) {
                // Add new user to the list
                users.push({ userName, password: Password });

                // Update the JSON file with the new user list
                writeFile('users.json',users);
                const user = {name: userName};
                const accessToken = generateAccessToken(user, "30m");
                res.json({accessToken: accessToken});
            } else {
                res.end('user already exist')
            }
    }

    const hashPassword = async (password: string) => {
        const saltRounds = await bcrypt.genSalt(); // Adjust as needed for security
        const Password = await bcrypt.hash(password, saltRounds);
        return Password;
    }

    const generateAccessToken = (data: any, expiresIn: string) => {
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET,{expiresIn: expiresIn});
        return accessToken;
    }

    const login = async (req: Request,res: Response) => {
        const userName = req?.body?.username;
        const password = req?.body?.password;

        let users: any = readFile('users.json');
        users = users && JSON.parse(users);

        // Check if username already exists
        const existingUser = getExistingUserData(userName, users);

        if(existingUser) {
            bcrypt.compare(password, existingUser?.password, (err, isMatch) => {
                if(err) {
                    res.end("Please verify the credentials");
                } else {
                    const user = {name: userName};
                    const accessToken = generateAccessToken(user, "30m");
                    res.json({accessToken: accessToken});
                }
            })
        } else {
            res.end("user doesn't exist")
        }
    }

    const getExistingUserData = (userName: string, usersData: any) => {
        // Check if username already exists
        const existingUser = usersData && usersData?.find((user: any) => user.userName === userName);
        return existingUser;
    }

    const verifyToken = (req: any, res: any, next: any) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Extract token from header
      
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
      
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err:any, decoded: any) => {
          if (err) {
            return res.status(403).json({ error: 'Invalid token' });
          }
      
          req.user = decoded; // Attach decoded user data to request
          next();
        });
      };

    return {createUser, login, verifyToken};
}

export default UserService;