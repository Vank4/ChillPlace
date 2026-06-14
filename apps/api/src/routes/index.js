import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes.js";
import { authRouter } from "../modules/auth/auth.routes.js";
import { usersRouter } from "../modules/users/users.routes.js";
import { categoriesRouter } from "../modules/places/categories.routes.js";
import { mapRouter } from "../modules/places/map.routes.js";
import { placesRouter } from "../modules/places/places.routes.js";
import { feedRouter, postsRouter } from "../modules/posts/posts.routes.js";
import { tagsRouter } from "../modules/tags/tags.routes.js";
import {
  recommendationsRouter,
  searchRouter
} from "../modules/discovery/discovery.routes.js";
import {
  favoritesRouter,
  placeInteractionsRouter,
  postInteractionsRouter,
  reportsRouter,
  reviewsRouter,
  savedRouter
} from "../modules/interactions/interactions.routes.js";
import {
  analyticsRouter,
  creatorRouter
} from "../modules/creator/creator.routes.js";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/places", placesRouter);
apiRouter.use("/map", mapRouter);
apiRouter.use("/feed", feedRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/tags", tagsRouter);
apiRouter.use("/recommendations", recommendationsRouter);
apiRouter.use("/posts", postInteractionsRouter);
apiRouter.use("/places", placeInteractionsRouter);
apiRouter.use("/favorites", favoritesRouter);
apiRouter.use("/users", savedRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/reports", reportsRouter);
apiRouter.use("/creator", creatorRouter);
apiRouter.use("/analytics", analyticsRouter);
