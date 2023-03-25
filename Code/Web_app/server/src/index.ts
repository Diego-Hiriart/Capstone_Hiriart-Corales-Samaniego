import express, { Request, Response } from "express";
import { serverLog } from "./utils/logs";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Request" + req.body);
});

app.listen(port, () => {
  serverLog(`Running on https://localhost:${port}`);
});
