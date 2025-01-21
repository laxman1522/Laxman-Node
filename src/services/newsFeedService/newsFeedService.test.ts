import NewsFeedService from "./newsFeedService";
import { Feed } from "../../models/newsFeed/newsFeed";
import { APP_CONSTANTS } from "../../constants/appContants";

jest.mock('../../models/newsFeed/newsFeed');


describe("NewsFeedService", () => {

    describe("createFeed", () => {
        it("should create a new feed", async () => {
          // Sample feed data and email
          const feedData = {
            title: "Laxman's feed",
            location: "chennai",
            link: "www.laxis1598.com",
            caption: "Dummy caption",
          };
          const email = "test@example.com";

            // Mock select() and sort() methods to return the query object (for chaining)
            const mockSelect = jest.fn().mockReturnThis();
            const mockSort = jest.fn().mockReturnThis();
            const mockExec = jest.fn().mockResolvedValueOnce({ id: 5 });

            // Mock the findOne method to return the query object with chained methods
            const mockFindOne = jest.spyOn(Feed, 'findOne').mockReturnValue({
                select: mockSelect,
                sort: mockSort,
                exec: mockExec,
            } as any); 


            // Mock the save method to do nothing (since we're not testing it here)
            jest.spyOn(Feed.prototype, 'save').mockResolvedValueOnce({});
        
            // Call the createFeed method
            const result = await NewsFeedService.createFeed(feedData, email);
        
            // Check if the result is null as expected
            expect(result).toBeNull();
        
            // Check that save was called to persist the new feed
            expect(Feed.prototype.save).toHaveBeenCalled();
        });

        it("should throw an error if feed creation fails", async () => {

            // Mock the findOne method to return the query object with chained methods
            jest.spyOn(Feed, 'findOne').mockImplementationOnce(() => {
                throw new Error("Error while creating a feed")
            });

            const feedData = {
                title: "Laxman's feed",
                location: "chennai",
                link: "www.laxis1598.com",
                caption: "Dummy caption",
            };

            await expect(NewsFeedService.createFeed(feedData, "test@example.com")).rejects.toThrow(
                APP_CONSTANTS.ERROR.FEED_CREATION_ERROR
            );
        });
      });


      describe("likeFeed", () => {
        afterEach(() => {
            jest.clearAllMocks(); // Clear mocks after each test
        });
    
        it("should throw an error if the feed is not found", async () => {
            jest.spyOn(Feed, 'findOne').mockResolvedValueOnce(null); // Mock no feed found
    
            await expect(NewsFeedService.likeFeed(1, "test@example.com"))
                .rejects.toThrow(APP_CONSTANTS.ERROR.NO_FEED_AVAILABLE);
            expect(Feed.findOne).toHaveBeenCalledWith({ id: 1 });
        });
    
        it("should like a feed when the user has not already liked it", async () => {
            const mockFeed = { id: 1, likedBy: [], likes: 0 };
            const updatedFeed = { id: 1, likedBy: ["test@example.com"], likes: 1 };
    
            jest.spyOn(Feed, 'findOne').mockResolvedValueOnce(mockFeed);
            jest.spyOn(Feed, 'findOneAndUpdate').mockResolvedValueOnce(updatedFeed);
    
            const result = await NewsFeedService.likeFeed(1, "test@example.com");
    
            expect(Feed.findOne).toHaveBeenCalledWith({ id: 1 });
            expect(Feed.findOneAndUpdate).toHaveBeenCalledWith(
                { id: 1 },
                { $inc: { likes: 1 }, $push: { likedBy: "test@example.com" } },
                { new: true }
            );
            expect(result).toEqual(updatedFeed);
        });
    
        it("should unlike a feed when the user has already liked it", async () => {
            const mockFeed = { id: 1, likedBy: ["test@example.com"], likes: 1 };
            const updatedFeed = { id: 1, likedBy: [], likes: 0 };
    
            jest.spyOn(Feed, 'findOne').mockResolvedValueOnce(mockFeed);
            jest.spyOn(Feed, 'findOneAndUpdate').mockResolvedValueOnce(updatedFeed);
    
            const result = await NewsFeedService.likeFeed(1, "test@example.com");
    
            expect(Feed.findOne).toHaveBeenCalledWith({ id: 1 });
            expect(Feed.findOneAndUpdate).toHaveBeenCalledWith(
                { id: 1 },
                { $inc: { likes: -1 }, $pull: { likedBy: "test@example.com" } },
                { new: true }
            );
            expect(result).toEqual(updatedFeed);
        });
    
        it("should handle errors and throw an internal server error", async () => {
            const mockError = new Error("Database error");
            jest.spyOn(Feed, 'findOne').mockImplementationOnce(() => {
                throw mockError;
            });
    
            await expect(NewsFeedService.likeFeed(1, "test@example.com"))
                .rejects.toThrow(mockError);
            expect(Feed.findOne).toHaveBeenCalledWith({ id: 1 });
        });
    });

    describe("feedComment", () => {
        afterEach(() => {
            jest.clearAllMocks(); // Clear mocks after each test
        });
    
        it("should add a comment to the feed and return the updated document", async () => {
            const feedId = 1;
            const comment = { user: "test@example.com", text: "This is a comment" };
            const mockUpdatedFeed = {
                id: 1,
                comments: [comment],
            };
    
            jest.spyOn(Feed, 'findOneAndUpdate').mockResolvedValueOnce(mockUpdatedFeed);
    
            const result = await NewsFeedService.feedComment(feedId, comment);
    
            expect(Feed.findOneAndUpdate).toHaveBeenCalledWith(
                { id: feedId },
                { $push: { comments: comment } },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedFeed);
        });
    
        it("should throw an error if the update fails", async () => {
            const feedId = 1;
            const comment = { user: "test@example.com", text: "This is a comment" };
            const mockError = new Error("Database error");
    
            jest.spyOn(Feed, 'findOneAndUpdate').mockImplementationOnce(() => {
                throw mockError;
            });
    
            await expect(NewsFeedService.feedComment(feedId, comment)).rejects.toThrow(mockError);
            expect(Feed.findOneAndUpdate).toHaveBeenCalledWith(
                { id: feedId },
                { $push: { comments: comment } },
                { new: true }
            );
        });
    });


    describe("findFeed", () => {
        afterEach(() => {
            jest.clearAllMocks(); // Clear mocks after each test
        });
    
        it("should find and return the feed document", async () => {
            const feedId = 1;
            const email = "test@example.com";
            const mockFeed = { id: feedId, createdBy: email, title: "Test Feed" };
    
            jest.spyOn(Feed, 'findOne').mockReturnValueOnce({
                lean: jest.fn().mockResolvedValueOnce(mockFeed),
            } as any);
    
            const result = await NewsFeedService.findFeed(feedId, email);
    
            expect(Feed.findOne).toHaveBeenCalledWith({ id: feedId, createdBy: email });
            expect(result).toEqual(mockFeed);
        });
    
        it("should throw an error if Feed.findOne fails", async () => {
            const feedId = 1;
            const email = "test@example.com";
            const mockError = new Error("Database error");
    
            jest.spyOn(Feed, 'findOne').mockReturnValueOnce({
                lean: jest.fn().mockRejectedValueOnce(mockError),
            } as any);
    
            await expect(NewsFeedService.findFeed(feedId, email)).rejects.toThrow(mockError);
            expect(Feed.findOne).toHaveBeenCalledWith({ id: feedId, createdBy: email });
        });
    });


    describe("deleteFeed", () => {
        afterEach(() => {
            jest.clearAllMocks(); // Clear mocks after each test
        });
    
        it("should delete the feed document", async () => {
            const feedId = 1;
            const email = "lax@gmail.com"
    
            jest.spyOn(Feed, 'deleteOne').mockReturnValueOnce({
                lean: jest.fn().mockResolvedValueOnce({}),
            } as any);
    
            await NewsFeedService.deleteFeed(feedId, email );
    
            expect(Feed.deleteOne).toHaveBeenCalledWith({ id: feedId, createdBy: email });
        });
    
        it("should throw an error if Feed.deleteOne fails", async () => {
            const feedId = 1;
            const mockError = new Error("Database error");
            const email = "lax@gmail.com"
    
            jest.spyOn(Feed, 'deleteOne').mockReturnValueOnce({
                lean: jest.fn().mockRejectedValueOnce(mockError),
            } as any);
    
            await expect(NewsFeedService.deleteFeed(feedId, email)).rejects.toThrow(mockError);
            expect(Feed.deleteOne).toHaveBeenCalledWith({ id: feedId, createdBy: email });
        });
    });

    
      
});