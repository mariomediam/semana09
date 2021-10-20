import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { Model } from "sequelize";
import { Usuarios } from "../config/models";
import { TipoUsuario } from "../models/usuarios.models";


export interface RequestUser extends Request{
    usuario?: Model | undefined
}

export const authValidator = async(req:RequestUser, res:Response, next: NextFunction) => {
    if (!req.headers.authorization){
        return res.status(401).json({
            message: "Se neceita una token valida",
            content: null,
        })
    }

    const token = req.headers.authorization.split(" ")[1]

    try {
        const payload = verify(token, process.env.JWT_TOKEN ?? "")   
        
        if (typeof payload === "object"){
            const usuario = await Usuarios.findByPk(payload.usuarioId, {attributes: {exclude: ["usuarioPassword"]},})

            if (!usuario){
                return res.status(400).json({
                    message: "Uusuario no existe en la bd"
                })
            }
            req.usuario = usuario
        }

        console.log(payload);
        
        next();
    } catch (error: unknown) {
        if (error instanceof Error){
            return res.status(401).json({
                message: error.message,
                content: null
            })            
        }
    }
}

export const adminValidator = async (
    req: RequestUser,
    res: Response,
    next: NextFunction
) => {
    const tipo: TipoUsuario = req.usuario?.getDataValue("usuarioTipo")

    console.log(tipo)
    if (tipo===TipoUsuario.CLIENTE){
        return res.status(401).json({
            message: "El usuario no tiene privilegios suficientes",
            content:null
        })
    }
    else{
        next()
    }

}