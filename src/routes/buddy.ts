import buddyController from "../controllers/buddyController";
const express = require('express');
const router = express.Router();

const buddiesController =  new buddyController();

router.get('/',async (req: Request,res: Response) => {
    await buddiesController.getBuddiesData(req,res);
});
router.get('/:id', async (req: Request,res: Response) => {
    await buddiesController.getBuddyData(req,res);
});
router.post('/',async (req: Request,res: Response) => {
    await buddiesController.addBuddyDetails(req,res);
});
router.put('/',async (req: Request,res: Response) => {
    await buddiesController.updateBuddyDetails(req,res);
})

module.exports = router;