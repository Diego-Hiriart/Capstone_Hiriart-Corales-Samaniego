import express, { Request, Response } from "express";

import { healthCheck } from "./data/user";
import { debugLog, serverLog } from "./utils/logs";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Request" + req.body);
});

app.listen(port, async () => {
  serverLog(`Running on: https://localhost:${port}`);
  debugLog(`Database check: ${await healthCheck()}`);
});
