import buddyController from "./controllers/buddyController";
import fileService from "./services/fileService";
const express = require('express');
const { appConstants } = require('./constants/appConstants');

const app = express();

app.use(express.json());

const buddiesController =  new buddyController();

const PORT = appConstants.PORT;

const fileName = appConstants.FILE_PATH;
const fileContent = appConstants.FILE_CONTENT;

const file = new fileService();

file.fileCreation(fileName,fileContent);

app.get('/buddies',async (req: Request,res: Response) => {
    await buddiesController.getBuddiesData(req,res);
});
app.get('/buddy/:id', async (req: Request,res: Response) => {
    await buddiesController.getBuddyData(req,res);
});
app.post('/buddy',async (req: Request,res: Response) => {
    await buddiesController.addBuddyDetails(req,res);
});
app.put('/buddy',async (req: Request,res: Response) => {
    await buddiesController.updateBuddyDetails(req,res);
})


app.listen(PORT);