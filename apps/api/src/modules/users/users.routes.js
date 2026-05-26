import { Router } from "express";
import { updateMe } from "./users.controller.js";

export const usersRouter = Router();

usersRouter.patch("/me", updateMe);
