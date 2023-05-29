import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import RedisStore from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import { applyMiddleware } from "graphql-middleware";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import http from "http";
import path from "path";
import socket from "socket.io";
import type { SocketType } from "../typing";
import config from "./config";
import context, { redis } from "./context";
import socketAuthenticated from "./middleware/socketAuthenticated";
import permissions from "./permissions";
import { resolvers, typeDefs } from "./schema";
import socketHandler from "./socket";

/** @ts-ignore */
const redisStore = new RedisStore({
  /** @ts-ignore */
  client: redis,
  prefix: config.session_prefix,
  ttl: 60 * 60 * 24 * 7,
});

async function bootstrap() {
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
      methods: "GET, POST",
      optionsSuccessStatus: 200,
    })
  );
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: false }));
  app.use(express.static(path.resolve(__dirname, "../public")));
  app.use(cookieParser());

  let production = false;

  if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
    production = true;
  }

  const sessionMiddleware = session({
    name: config.session_name,
    secret: config.session_key,
    resave: false,
    store: redisStore,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 7 * 1000,
      sameSite: production ? "none" : false,
      httpOnly: true,
      secure: production,
    },
  });

  app.use(sessionMiddleware);

  const httpServer = http.createServer(app);

  const io = new socket.Server(httpServer, {
    path: "/subscriptions",
    cors: { origin: "http://localhost:3000" },
  });

  io.use(socketAuthenticated);
  io.on("connection", (socket: SocketType) => socketHandler(io, socket));

  const schema: any = makeExecutableSchema({ typeDefs, resolvers });

  const middlewareSchema = applyMiddleware(schema, permissions);

  const server = new ApolloServer({
    schema: middlewareSchema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    csrfPrevention: true,
    cache: "bounded",
  });

  await server.start();

  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10 * 1024 * 1024, maxFiles: 10 }),
    expressMiddleware(server, { context })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.port }, resolve)
  ).then(() => {
    console.log(`🚀 Server ready at http://localhost:${config.port}/graphql`);
    console.log(
      `🚀 Socket ready at ws://localhost:${config.port}/subscriptions\n`
    );
  });
}

bootstrap();
