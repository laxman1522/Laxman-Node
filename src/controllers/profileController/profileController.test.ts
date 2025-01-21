import { Request, Response, NextFunction } from 'express';
import ProfileController from './profileController';
import ProfileService from '../../services/profileService/profileService';
import * as Utils from '../../utils/helper';

const profileController:any = ProfileController();

jest.mock("../../services/profileService/profileService");


describe('fetchProfile Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    const mockProfileInfo  = [
        {
            name: "John Doe",
            gender: "Male",
            profilePicture: "https://example.com/profile-picture.jpg",
            profileBio: "A passionate software engineer with a focus on developing scalable web applications.",
            latestWorkDesignation: "Senior Software Engineer",
            certifications: "AWS Certified Developer, Scrum Master",
            yearsOfExperiance: "5",
            bu: "Digital Transformation",
            workLocation: "Bangalore, India",
            employeeId: 12345,
            email: "john.doe@example.com",
            password: "hashed_password_example", // Replace with a hashed password in real cases
            role: "User", // Optional field
            approvalStatus: "Approved", // Optional field
        }
    ]


    beforeEach(() => {
        req = {
            params: { employeeId: "12345" },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return profile info when profile is found', async () => {
        jest.spyOn(ProfileService, 'fetchProfile').mockResolvedValue(mockProfileInfo);

        jest.spyOn(Utils,'setResponse').mockImplementationOnce((res) => {
            return res.status(200).json({});
        });

        await profileController.fetchProfile(req as Request, res as Response, next);

        expect(Utils.setResponse).toHaveBeenCalledWith(res,200,true,false,"Profile Information fetched successfully",mockProfileInfo);
        expect(ProfileService.fetchProfile).toHaveBeenCalledWith(12345);
    });

    it('should return "No profile found" when profile is not found', async () => {
        jest.spyOn(ProfileService, 'fetchProfile').mockResolvedValue(null);

        await profileController.fetchProfile(req as Request, res as Response, next);

        expect(ProfileService.fetchProfile).toHaveBeenCalledWith(12345);
        expect(Utils.setResponse).toHaveBeenCalledWith(res, 404, false, true, 'No profiles were found', []);
    });

    it('should call next with error if there is an exception', async () => {
        const error = new Error('Some error');
        jest.spyOn(ProfileService, 'fetchProfile').mockRejectedValue(error);

        await profileController.fetchProfile(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});


describe('updateProfile Controller', () => {
    let req: Partial<any>;
    let res: Partial<Response>;
    let next: NextFunction;

    const mockProfileInfo  = [
        {
            name: "John Doe",
            gender: "Male",
            profilePicture: "https://example.com/profile-picture.jpg",
            profileBio: "A passionate software engineer with a focus on developing scalable web applications.",
            latestWorkDesignation: "Senior Software Engineer",
            certifications: "AWS Certified Developer, Scrum Master",
            yearsOfExperiance: "5",
            bu: "Digital Transformation",
            workLocation: "Bangalore, India",
            employeeId: 12345,
            email: "john.doe@example.com",
            password: "hashed_password_example", // Replace with a hashed password in real cases
            role: "User", // Optional field
            approvalStatus: "Approved", // Optional field
        }
    ]

    beforeEach(() => {
        req = {
            email: 'john.doe@example.com',
            body: { name: 'John Doe Updated' },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update profile and return success', async () => {
        jest.spyOn(ProfileService, 'updateProfile').mockResolvedValue(mockProfileInfo as any);

        await profileController.updateProfile(req as Request, res as Response, next);

        expect(ProfileService.updateProfile).toHaveBeenCalledWith('john.doe@example.com', req.body);
        expect(Utils.setResponse).toHaveBeenCalledWith(res, 200, true, false, 'Profile Information Updated successfully', mockProfileInfo);
    });

    it('should call next with error if there is an exception', async () => {
        const error = new Error('Update failed');
        jest.spyOn(ProfileService, 'updateProfile').mockRejectedValue(error);

        await profileController.updateProfile(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
