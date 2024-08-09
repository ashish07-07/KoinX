import mongoose, { Schema, Document } from "mongoose";

mongoose.connect(
  "mongodb+srv://bkashishh07:n639X8O6lwqR5Nfz@cluster0.irerf.mongodb.net/"
);

interface ITrade extends Document {
  userId: string;
  utcTime: string;
  operation: "Buy" | "Sell";
  baseCoin: string;
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
