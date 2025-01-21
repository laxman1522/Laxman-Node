import { NextFunction } from "express";
import NewsFeedController from "./newsFeedController";
import NewsFeedService from "../../services/newsFeedService/newsFeedService";
import * as Utils from '../../utils/helper';
import { APP_CONSTANTS } from "../../constants/appContants";

const newsFeedController = NewsFeedController();

jest.mock("../../services/newsFeedService/newsFeedService");

jest.mock("../../utils/helper");


// Mock dependencies
const mockRes = () => {
    const res: any = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };
  
  const mockNext: NextFunction = jest.fn();
  
  const mockReq = (overrides = {}) => ({
    params: {},
    query: {},
    body: {},
    email: "test@example.com",
    ...overrides,
  });


describe("createFeed Controller", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a feed with success response",async () => {

        const req = mockReq({body: {
            title: "Laxman's feed",
            location: "chennai",
            link: "www.laxis1598.com",
            caption: "Dummy caption"
        }})
        const res = mockRes();

        jest.spyOn(NewsFeedService,'createFeed').mockResolvedValueOnce(null);

        jest.spyOn(Utils,'setResponse').mockImplementationOnce((res) => {
            return res.status(200).json();
        })

        await newsFeedController.createFeed(req,res,mockNext);

        expect(NewsFeedService.createFeed).toHaveBeenCalledWith(req.body, req.email);
        expect(Utils.setResponse).toHaveBeenCalled();

    })

    it("should handle errors and call next", async () => {
        const req = mockReq();
        const res = mockRes();
        const error = new Error("Create feed failed");

        jest.spyOn(NewsFeedService, "createFeed").mockRejectedValueOnce(error);
  
        await newsFeedController.createFeed(req, res, mockNext);
  
        expect(NewsFeedService.createFeed).toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith(error);
      });

    })

    describe("fetchFeed", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

        it("should fetch feed by ID", async () => {
          const req = mockReq({ params: { id: 1 } });
          const res = mockRes();

          const feed: any = {
            title: "Laxman's feed",
            location: "chennai",
            link: "www.laxis1598.com",
            caption: "Dummy caption"
        }

          jest.spyOn(NewsFeedService, 'fetchFeedByID').mockResolvedValueOnce(feed)
    
          await newsFeedController.fetchFeed(req, res, mockNext);
    
          expect(NewsFeedService.fetchFeedByID).toHaveBeenCalledWith(1);
          expect(Utils.setResponse).toHaveBeenCalledWith(
            res,
            expect.any(Number),
            true,
            false,
            expect.any(String),
            feed
          );
        });
    
        it("should return no feed available error", async () => {
          const req = mockReq({ params: { id: 1 } });
          const res = mockRes();

          jest.spyOn(NewsFeedService, 'fetchFeedByID').mockResolvedValueOnce({} as any);
    
          await newsFeedController.fetchFeed(req, res, mockNext);
    
          expect(Utils.setResponse).toHaveBeenCalledWith(
            res,
            expect.any(Number),
            false,
            true,
            APP_CONSTANTS.ERROR.NO_FEED_AVAILABLE_FOR_ID,
            []
          );
        });
      });

      describe("deleteFeed", () => {
        it("should delete feed and return success response", async () => {
          const req = mockReq({ params: { id: 1 }, email: "lax@gmail.com" });
          const res = mockRes();

          const feed: any = [{
            id: 1,
            title: "Laxman's feed",
            location: "chennai",
            link: "www.laxis1598.com",
            caption: "Dummy caption"
          }]

          jest.spyOn(NewsFeedService, 'deleteFeed').mockResolvedValueOnce({deletedCount: 1} as any);
    
          await newsFeedController.deleteFeed(req, res, mockNext);
    
          expect(NewsFeedService.deleteFeed).toHaveBeenCalledWith(1,"lax@gmail.com");
          expect(Utils.setResponse).toHaveBeenCalledWith(
            res,
            200,
            true,
            false,
            APP_CONSTANTS.SUCCESS.FEED_DELETED,
            []
          );
        });
      });

      describe("likeFeed", () => {
        it("should like feed and return success response", async () => {
          const req = mockReq({ params: { id: 1 } });
          const res = mockRes();
    
          jest.spyOn(NewsFeedService, "likeFeed").mockResolvedValueOnce({ id: 1, likes: 1 } as any);
    
          await newsFeedController.likeFeed(req, res, mockNext);
    
          expect(NewsFeedService.likeFeed).toHaveBeenCalledWith(1, req.email);
          expect(Utils.setResponse).toHaveBeenCalledWith(
            res,
            200,
            true,
            false,
            expect.any(String),
            { id: 1, likes: 1 }
          );
        });
      });

      describe("feedComment", () => {
        it("should add comment to feed and return success response", async () => {
          const req = mockReq({ params: { id: 1 }, body: { comment: "Nice post!" } });
          const res = mockRes();

          jest.spyOn(NewsFeedService, 'feedComment').mockResolvedValueOnce({ id: 1, comments: ["Nice post!"] } as any);
    
          await newsFeedController.feedComment(req, res, mockNext);
    
          expect(NewsFeedService.feedComment).toHaveBeenCalledWith(1, {
            description: "Nice post!",
            commentedBy: req.email,
            currentTime: expect.any(Date),
          });
          expect(Utils.setResponse).toHaveBeenCalledWith(
            res,
            200,
            true,
            false,
            expect.any(String),
            { id: 1, comments: ["Nice post!"] }
          );
        });
});