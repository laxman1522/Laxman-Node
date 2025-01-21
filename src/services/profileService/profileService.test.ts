import { User } from '../../models/user/user'; // Replace with the actual path to your User model
import ProfileService from './profileService';
import { APP_CONSTANTS } from '../../constants/appContants'; // Replace with the actual path to your constants file

jest.mock('../../models/user/user'); // Mock the User model

describe("fetchProfile", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it("should fetch and return approved profile information", async () => {
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
            },
            {
                name: "John Doe 2",
                gender: "Male",
                profilePicture: "https://example.com/profile-picture.jpg",
                profileBio: "A passionate software engineer with a focus on developing scalable web applications.",
                latestWorkDesignation: "Senior Software Engineer",
                certifications: "AWS Certified Developer, Scrum Master",
                yearsOfExperiance: "5",
                bu: "Digital Transformation",
                workLocation: "Bangalore, India",
                employeeId: 12346,
                email: "john.doe2@example.com",
                password: "hashed_password_example", // Replace with a hashed password in real cases
                role: "User", // Optional field
                approvalStatus: "Approved", // Optional field
            }
        ]

        jest.spyOn(User, 'find').mockReturnValueOnce({
            lean: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValueOnce(mockProfileInfo),
        } as any);

        const result = await ProfileService.fetchProfile();

        expect(User.find).toHaveBeenCalledWith({
            approvalStatus: APP_CONSTANTS.APPROVAL_STATUS.APPROVED,
        });
        expect(result).toEqual(mockProfileInfo);
    });

    it("should throw an error if User.find fails", async () => {
        const mockError = new Error("Database error");

        jest.spyOn(User, 'findOne').mockReturnValueOnce({
            lean: jest.fn().mockReturnThis(),
            select: jest.fn().mockRejectedValueOnce(mockError),
        } as any);

        await expect(ProfileService.fetchProfile(1836)).rejects.toThrow(
            APP_CONSTANTS.ERROR.ERROR_FETCHING_PROFILE_INFO
        );
        expect(User.findOne).toHaveBeenCalledWith({
            approvalStatus: APP_CONSTANTS.APPROVAL_STATUS.APPROVED, employeeId: 1836
        });
    });
});
