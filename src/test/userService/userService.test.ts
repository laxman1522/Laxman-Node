import UserService from "../../services/userService/userService";
import { AppConstants } from "../../constants/appConstants/appConstants";

describe('verifyToken function', () => {
  it('should throw an error for missing token', async () => {
    const {verifyToken} = UserService();
    expect(verifyToken('')).toThrow(AppConstants.UNAUTHORIZED);
  });
});
