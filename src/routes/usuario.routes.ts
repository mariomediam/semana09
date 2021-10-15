import { Router } from "express";
import * as UsuarioController from "../controllers/usuarios.controllers";
import { authValidator } from "../middlewares/validator";

const usuarioRouter = Router();

usuarioRouter.post("/registro", UsuarioController.registroController);
usuarioRouter.post("/login", UsuarioController.login);
usuarioRouter.get("/me", authValidator, UsuarioController.perfil)

export default usuarioRouter;
