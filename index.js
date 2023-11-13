import config from "dotenv/config";
import express from "express";
import sequelize from "./sequelize.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import router from "./routers/index.js";
import ErrorHandlingMiddlewere from "./middlewere/ErrorHandlingMiddlewere.js";
import path from "path";
//import models from './models/models.js'

// const corsOption = {
//   origin: ["http://localhost:5173"],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
// };
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors()); //для того чтобы можно было отправлять запросы к БД
app.use(express.json()); //что бы можно было парсить json формат
app.use(express.static(path.resolve(__dirname, "static")));
//app.use(express.static('static'))
app.use(fileUpload()); //Для того чтобы можно работать с файлами
app.use("/api/v1/", router);
app.use(ErrorHandlingMiddlewere);

// app.listen(PORT, ()=>console.log('server worked in the port', PORT));

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log("server worked in the port", PORT));
  } catch (e) {
    console.log(e);
  }
};

start();
