import mongoose, { Schema, Document } from "mongoose";

interface ITrade extends Document {
  userId: string;
  utcTime: string;
  operation: "Buy" | "Sell";
  basecoin: string;
  quotecoin: string;
  amount: number;
  price: number;
  platform?: string;
  fee?: number;
  isDeleted?: boolean;
}

const tradeSchema: Schema = new Schema(
  {
    userID: { type: String, required: true },
    utcTime: { type: Date, required: true },
    operation: { type: String, required: true, enum: ["Buy", "Sell"] },
    baseCoin: { type: String, required: true },
    quoteCoin: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    market: { type: String, required: true },
    platform: { type: String },
    fee: { type: Number },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Trade = mongoose.model<ITrade>("Trade", tradeSchema);

export default Trade;
