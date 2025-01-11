import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import resourceRoutes from './routes/resource.routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/resources', resourceRoutes);

export default app;
