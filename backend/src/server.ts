import 'reflect-metadata';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import express, { Express } from 'express';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import { env } from './env';
import routes from './api/routes';
import ormconfig from './config/ormconfig';
import { handlers as socketHandlers } from './socket/handlers';
import { logger } from './common/utils/logger.util';
import {
  errorHandlerMiddleware,
  auth as authorizationMiddleware,
  socketInjector as socketMiddleware,
} from './api/middlewares';
import { SocketEvents } from './common/enums/socket';

const { port, socketPort } = env.app;

const app: Express = express();
const socketServer = createServer(app);

const io = new Server(socketServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on(SocketEvents.CONNECTION, socketHandlers);

app.use(cors());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/', authorizationMiddleware, socketMiddleware(io));

routes(app);

app.use(errorHandlerMiddleware);

app.use('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(port, async () => {
  try {
    await createConnection(ormconfig);
  } catch (error) {
    logger.info(`'App started with error: ${error}`);
  }
  logger.info(`Server is running at ${port}.`);
});

socketServer.listen(socketPort);

export default app;
