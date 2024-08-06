import "dotenv/config";
import express, {Request, Response, NextFunction} from "express";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();

//logging middleware
app.use(morgan("dev"));

//middleware that tells express what kind of data to accept: json
app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

//route handler middleware that catches any requests to this endpoint
app.use("/api/users", userRoutes);
app.use("/api/notes", requiresAuth, notesRoutes);

// fallback route middleware
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

//error handler (middleware)
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({error: errorMessage});
});

export default app;
