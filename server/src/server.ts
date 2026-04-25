import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import dotenv from "dotenv";
import auth_routes from "./routes/auth_routes";
import transaction_routes from "./routes/transaction_routes";
import categories_routes from "./routes/categories_routes";
import payment_methods_routes from "./routes/payment_methods_routes";
import curriencies_routes from "./routes/currencies_routes";
import { errorHandler } from "./middlewares/middleware";
import { requestLogger, responseLogger } from "./utils/logger";

// dotenv.config();    

const app = express();

const root = path.resolve(__dirname, "../../");

app.use(requestLogger);

app.use(responseLogger);

// Middleware
app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5500",
            "https://budget-manager-2.onrender.com"
            
        ],
        credentials: true,
    })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(root, "client/dist")));

app.use("/api/auth", auth_routes);

app.use("/api/transactions", transaction_routes)
app.use("/api/categories", categories_routes)
app.use("/api/paymentmethods", payment_methods_routes)
app.use("/api/currencies", curriencies_routes)


// Start servernpm i @types/cors
app.listen(process.env.PORT || 3001, () => {
    console.log(`Run on ${process.env.PORT || 3001}`);
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(root, "client/dist", "index.html"));
});

app.use(errorHandler);