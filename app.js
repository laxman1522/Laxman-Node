import express from 'express';
import UserRoute from './src/routes/userRoute.js';

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

// dotenv.config();

app.use('/', UserRoute);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`); 
}); 