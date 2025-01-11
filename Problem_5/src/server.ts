import express from 'express';
import router from './routes/resource.routes';


const app = express();
const port = 3000;

// Middleware to handle JSON
app.use(express.json());  // Step to receive data JSON from client

// Using route for /api/resources
app.use('/api/resources', router);

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
