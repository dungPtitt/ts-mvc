import express from 'express';
import configViewEngine from './configs/viewEngine';
import { AppDataSource } from './database/data-source';
import initWebRoute from './routes/web';
import initAdminRoute from './routes/admin';
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path';
import { runSeed } from './database/seeds/seeds';

const app = express();
const port = 3001;

app.use(cookieParser());

app.use(cors({
  origin: true
}));


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
configViewEngine(app)
initWebRoute(app)
initAdminRoute(app)

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connection success - Seeds imported")
  })
  .then(() => runSeed())
  .catch((err) => console.error(err));


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});