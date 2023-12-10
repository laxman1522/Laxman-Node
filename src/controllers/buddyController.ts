import buddyService from "../services/buddyService";

export default class buddyController {
    private buddyService: any;
  
    constructor() {
      this.buddyService = new buddyService();
    }

    /**
   * Method : getBuddiesData
   */
  public async getBuddiesData(req : Request , res: Response) {
    await this.buddyService.getBuddiesDetails(req , res);
   }

   /**
   * Method : getBuddyData
   */
  public async getBuddyData(req : Request , res: Response) {
    await this.buddyService.getBuddyDetails(req , res);
   }

    /**
   * Method : addBuddyDetails
   */
  public async addBuddyDetails(req : Request , res: Response) {
    await this.buddyService.addBuddyDetails(req , res);
   }

     /**
   * Method : updateBuddyDetails
   */
  public async updateBuddyDetails(req : Request , res: Response) {
    await this.buddyService.updateBuddyDetails(req , res);
   }

}