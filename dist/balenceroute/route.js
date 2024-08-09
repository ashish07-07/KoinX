"use strict";
// import express from "express";
// import { Request, Response } from "express";
// import Trade from "../db/schema";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.use(express.json());
// router.post("/", async function (req: Request, res: Response) {
//   const timestamp1 = req.body;
//   const timestamp = timestamp1.timestamp;
//   const parsedTimestamp = new Date(timestamp);
//   console.log(parsedTimestamp);
//   console.log(timestamp);
//   const trades = await Trade.find({
//     utcTime: { $lte: parsedTimestamp },
//   });
//   console.log("the trade that occures below or on give timestamp is");
//   console.log(trades);
//   const balances: { [key: string]: number } = {};
//   trades.forEach((trade) => {
//     const { basecoin, operation, amount } = trade;
//     console.log(basecoin);
//   });
//   res.status(201).json({
//     balances,
//   });
// });
// export default router;
const express_1 = __importDefault(require("express"));
const schema_1 = __importDefault(require("../db/schema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const timestamp1 = req.body;
        const timestamp = timestamp1.timestamp;
        const parsedTimestamp = new Date(timestamp);
        console.log("Parsed Timestamp:", parsedTimestamp);
        const trades = yield schema_1.default.find({
            utcTime: { $lte: parsedTimestamp },
        });
        console.log("Trades found:", trades);
        const balances = {};
        trades.forEach((trade) => {
            const { baseCoin, operation, amount } = trade;
            console.log(`Processing Trade - Coin: ${baseCoin}, Operation: ${operation}, Amount: ${amount}`);
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
});
exports.default = router;