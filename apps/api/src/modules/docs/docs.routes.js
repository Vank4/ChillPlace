import { Router } from "express";
import { apiDocs, openApi } from "./docs.controller.js";

export const docsRouter = Router();

docsRouter.get("/docs", apiDocs);
docsRouter.get("/docs/openapi.json", openApi);
