import express from "express";
import multer from "multer";
import path from "path";
import csv from "csv-parser";
import fs from "fs";
import { Request, Response } from "express";
import Trade from "./db/schema";
import balancerouter from "./balenceroute/route";
const app = express();
const port = process.env.PORT || 3000;
console.log(port);

const upload = multer({ dest: path.join(__dirname, "uploads") });

app.post("/uploads", upload.single("file"), (req: Request, res: Response) => {
  console.log("Here is the field");
  console.log(req.file);

  if (!req.file) {
    return res.status(401).send("No file uploaded");
  }

  const results: any[] = [];
  const filePath = path.resolve(__dirname, "uploads", req.file.filename);
  console.log(filePath);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      fs.unlinkSync(filePath);
      console.log("Parsed CSV Data:", results);
      try {
        const trades = results.map(function (row) {
          const [baseCoin, quoteCoin] = row.Market.split("/");

          return new Trade({
            userID: row.User_ID,
            utcTime: new Date(row.UTC_Time),

            operation: row.Operation,
            baseCoin,
            quoteCoin,
            amount: parseFloat(row["Buy/Sell Amount"]),
            price: parseFloat(row.Price),
            market: row.Market,
          });
        });

        await Trade.insertMany(trades);
        res.status(200).send("Data successfully saved to the database!");
      } catch (e) {
        console.error(e);
      }
    })

    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
      res.status(500).send("Error parsing CSV file");
    });
});

app.use("/balence", balancerouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
