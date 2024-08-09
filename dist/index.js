"use strict";
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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const schema_1 = __importDefault(require("./db/schema"));
// import { CreateChannelCallback } from "./../node_modules/@google-cloud/storage/build/cjs/src/bucket.d";
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
console.log(port);
const upload = (0, multer_1.default)({ dest: path_1.default.join(__dirname, "uploads") });
app.post("/uploads", upload.single("file"), (req, res) => {
    console.log("Here is the field");
    console.log(req.file);
    if (!req.file) {
        return res.status(401).send("No file uploaded");
    }
    const results = [];
    const filePath = path_1.default.resolve(__dirname, "uploads", req.file.filename);
    console.log(filePath);
    fs_1.default.createReadStream(filePath)
        .pipe((0, csv_parser_1.default)())
        .on("data", (data) => {
        results.push(data);
    })
        .on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        fs_1.default.unlinkSync(filePath);
        console.log("Parsed CSV Data:", results);
        try {
            const trades = results.map(function (row) {
                const [baseCoin, quoteCoin] = row.Market.split("/");
                return new schema_1.default({
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
            yield schema_1.default.insertMany(trades);
            res.status(200).send("Data successfully saved to the database!");
        }
        catch (e) {
            console.error(e);
        }
    }))
        .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        res.status(500).send("Error parsing CSV file");
    });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
