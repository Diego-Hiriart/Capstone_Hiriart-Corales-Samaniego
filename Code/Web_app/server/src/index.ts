import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";

import router from "./routes";
import { healthCheck } from "./utils/database";
import { debugLog, serverLog } from "./utils/logs";

const app = express();
const port = process.env.PORT || 3000;
const client_port = process.env.CLIENT_PORT || 5173;

app.use(cors({
  origin: `http://localhost:${client_port}`,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Root URL is /api
app.use("/api", router);

// If route not found
app.use((req: Request, res: Response) => {
  return res.sendStatus(404);
});

app.listen(port, async () => {
  serverLog(`Running on: http://localhost:${port}`);
  debugLog(`Database check: ${await healthCheck()}`);
});
