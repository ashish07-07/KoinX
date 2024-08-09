import express from "express";
import { Request, Response } from "express";
import Trade from "../db/schema";

const router = express.Router();

router.use(express.json());

router.post("/", async function (req: Request, res: Response) {
  const timestamp1 = req.body;

  const timestamp = timestamp1.timestamp;

  const parsedTimestamp = new Date(timestamp);

  console.log("Parsed Timestamp:", parsedTimestamp);

  const trades = await Trade.find({
    utcTime: { $lte: parsedTimestamp },
  });

  console.log("Trades found:", trades);

  const balances: { [key: string]: number } = {};

  trades.forEach((trade) => {
    const { baseCoin, operation, amount } = trade;

    console.log(
      ` Trade - Coin: ${baseCoin}, Operation: ${operation}, Amount: ${amount}`
    );

    if (!balances[baseCoin]) {
      balances[baseCoin] = 0;
    }

    balances[baseCoin] += operation === "Buy" ? amount : -amount;
  });

  console.log("Calculated Balances:", balances);

  res.status(201).json({
    balances,
  });
});

export default router;
