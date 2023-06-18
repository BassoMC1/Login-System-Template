import mongoose from "mongoose"
import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export default class CreateApp {

    public MongooseUrl: string;
    public CorsOrginUrl: string;
    public port: string;
   
    constructor({ port = "80", MongooseUrl = "null", CorsOrginUrl = "" } = {}) {
        this.MongooseUrl = MongooseUrl;
        this.CorsOrginUrl = CorsOrginUrl;
        this.port = port
    }
    
    private MongooseConnection() {
        if (this.MongooseUrl !== "null") {
            mongoose.connect(this.MongooseUrl)
                .then(() => {
                    console.log("[DB] - Database is online");
                }).catch((error) => {
                    console.error("[DB] - Database connection error:", error);
                });
        } else {
            console.error("[DB] - Missing Database URL");
        }
    }

    private ExpressApp() {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());
      
        app.use(
          cors({
            origin: this.CorsOrginUrl,
            credentials: true,
          })
        );
        
        app.listen(this.port, () => console.log(`[Express] - Port ${this.port} is now active\n[Express] - http://localhost:${this.port} `));
        return app;
    }

    public run() {
       this.MongooseConnection()
       return this.ExpressApp()
    }
}
