import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from 'body-parser';

const app = express()
dotenv.config();

app.use(express.json({ limit: "10kb" }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

import { connectDB, sequelize } from "./config/db.js";
import noteRoutes from './routes/noteRoutes.js';

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/note", noteRoutes);

app.listen(process.env.PORT, async () => {
    console.log(`🚀Server started Successfully on port ${process.env.PORT} in ${process.env.NODE_ENV}`);
    await connectDB();
    sequelize.sync({ force: false }).then(() => {
        console.log("✅Synced database successfully...");
    });
});
