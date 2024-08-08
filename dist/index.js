"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
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
        .on("end", () => {
        fs_1.default.unlinkSync(filePath);
        console.log("Parsed CSV Data:", results);
        res.send(results);
    })
        .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        res.status(500).send("Error parsing CSV file");
    });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
