import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { payHandler } from './pay';

const app = express();
const PORT = process.env.PORT || 6969;

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'STAC Server is running',
    version: '1.0.0'
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

// payment route
app.get("/pay", payHandler);

app.listen(PORT, () => {
  console.log(`STAC Server listening on port ${PORT}`);
});
