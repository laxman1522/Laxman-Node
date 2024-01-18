import buddyController from "../../controllers/BuddyController/buddyController";
const {routeConstants} = require('../../constants/routeConstants');
const express = require('express');
const router = express.Router();

const buddiesController =  new buddyController();

router.get(routeConstants.BUDDY_ROUTES.ALL,async (req: Request,res: Response) => {
    await buddiesController.getBuddiesData(req,res);
});
router.get(routeConstants.BUDDY_ROUTES.ID, async (req: Request,res: Response) => {
    await buddiesController.getBuddyData(req,res);
});
router.post(routeConstants.GENERAL,async (req: Request,res: Response) => {
    await buddiesController.addBuddyDetails(req,res);
});
router.put(routeConstants.GENERAL,async (req: Request,res: Response) => {
    await buddiesController.updateBuddyDetails(req,res);
})

module.exports = router;