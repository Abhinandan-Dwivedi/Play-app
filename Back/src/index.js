//require("dotenv").config({path : "./.env"}); 
import express from "express";
import dotenv from "dotenv";
import connectDB from "./DataB/index.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
.then(() => {
    console.log("Database connected successfully");
   app.listen(process.env.PORT, () => {
       console.log(`Server is running on port ${process.env.PORT}`);
   });
})
.catch((error) => {
    console.error("Failed to connect to the database:", error);
});