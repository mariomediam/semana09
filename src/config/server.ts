import express, { Express, json } from "express";
import usuarioRouter from "../routes/usuario.routes";
import conexion from "./sequelize";
import imagenRouter from "../routes/imagen.routes";
import { v2 } from "cloudinary";
import { env } from "process";
import productoRouter from "../routes/producto.routes";
import compraRouter from "../routes/compras.routes";
import cors from "cors";

export class Server {
  // private => no podra ser accedido desde fuera de la clase
  // readonly => no podra ser modificado su valor afuera del constructor
  private readonly app: Express;
  private readonly puerto: number;

  constructor() {
    this.app = express();
    this.puerto = 8000;
    this.app.use(cors())
    this.bodyParser();
    this.rutas();
    v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  private bodyParser() {
    this.app.use(json());
  }

  private rutas(){
    this.app.use(usuarioRouter)
    this.app.use(imagenRouter)
    this.app.use(productoRouter)
    this.app.use(compraRouter)
  }

  public start() {
    this.app.listen(this.puerto, async () => {
      console.log(
        `Servidor corriendo exitosamente en el puerto ${this.puerto}`
      );
      await conexion.sync();
      console.log("Base de datos conectada exitosamente");
    });
  }
}