import { Router } from "express";
import app from "../index";
import Auth from "../routers/api/auth";
import User from "../routers/api/user";

const routerApi = Router();

export default class Routers {
  constructor() {
    this.apiRoutes();
  }

  private apiRoutes() {
    routerApi.use("/auth", new Auth().build());
    routerApi.use("/user", new User().build());
  }

  public Build() {
    app.use("/api", routerApi);
  }
}
