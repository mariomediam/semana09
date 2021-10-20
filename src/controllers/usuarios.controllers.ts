import { plainToClass } from "class-transformer";
import { IsJWT, validate } from "class-validator";
import {Request, Response} from "express"
import { Usuarios } from "../config/models";
import { RegsitroDto } from "../dtos/request/registro.dto";
import { UsuarioDto } from "../dtos/response/usuario.dto";
import { sign, SignOptions } from "jsonwebtoken";
import { TipoUsuario } from "../models/usuarios.models";
import { LoginDto } from "../dtos/request/login.dto";
import { compareSync } from "bcrypt"
import { RequestUser } from "../middlewares/validator";
import { v2 } from "cloudinary";

const tokenOptions: SignOptions = {
    expiresIn: "1h"
}

interface Payload {
    usuarioNombre: string
    usuarioId: string
    usuarioFoto?: string
    usuarioTipo: TipoUsuario
}


export const registroController = async (req: Request, res: Response) => {
    try {
        const {body} = req;

        const data = plainToClass(RegsitroDto, body)
        const validacion = await validate(data)
        console.log(validacion)

        if (validacion.length !== 0){
            const mensajes = validacion.map((error) => {
                return error.constraints;
            })

            return res.status(400).json({
                content: mensajes,
                message: "Error en los valores"
            })
        }

        const usuarioEncontrado = await Usuarios.findOne({
            where: { usuarioCorreo: body.usuarioCorreo },
        })

        if (usuarioEncontrado){
            return res.status(400).json({
                content: null,
                message: "Usuario ya existe"
            })
        }

        const nuevoUsuario = await Usuarios.create(body)

        

        const payload: Payload = {
            usuarioId: nuevoUsuario.getDataValue("usuarioId"),
            usuarioNombre: nuevoUsuario.getDataValue("usuarioNombre"),
            usuarioTipo: nuevoUsuario.getDataValue("usuarioTipo"),
            usuarioFoto: nuevoUsuario.getDataValue("usuarioFoto"),
        }
        
        const jwt = sign(payload, process.env.JWT_TOKEN ?? "", tokenOptions)

        const content = plainToClass(UsuarioDto, {...nuevoUsuario.toJSON(), usuarioJwt: jwt,})


        return res.status(201).json({
            content,
            message: "Usuario creado exitosamente",
        })
    } catch (error) {
        return res.status(400).json({
            message: "Error al crear el usuario",
            content: error,
        })
    }
}

export const login = async (req: Request, res:Response) => {
    const validador = plainToClass(LoginDto, req.body)
    try {
        const resultado = await validate(validador)

        if (resultado.length!==0){
            return res.status(400).json({
                content: resultado.map((error) => error.constraints),
                message: "Informacion correcta"
            });            
        }

        const usuarioEncontrado = await Usuarios.findOne({where:{usuarioCorreo: validador.correo}})

        if (!usuarioEncontrado){
            return res.status(400).json({
                message: "Usuario incorrecto",
                content: null
            });            
        }

        const resultado_password = compareSync(validador.password, usuarioEncontrado.getDataValue("usuarioPassword"))

        if (!resultado_password){
            return res.status(400).json({
                message: "Usuario incorrecto",
                content: null
            });  
        }
        const payload: Payload = {
            usuarioId: usuarioEncontrado.getDataValue("usuarioId"),
            usuarioNombre: usuarioEncontrado.getDataValue("usuarioNombre"),
            usuarioTipo: usuarioEncontrado.getDataValue("usuarioTipo"),
            usuarioFoto: usuarioEncontrado.getDataValue("usuarioFoto"),
        }

        const jwt = sign(payload, process.env.JWT_TOKEN ?? "", tokenOptions)

        return res.json({
            content: jwt,
            message:null
        })


    } catch (error) {
        if (error instanceof Error){
            return res.status(400).json({
                message:"Error al hacer el login",
                content: error.message,
        })

        }
    }
}

export const perfil = (req: RequestUser, res: Response) => {
    
    const content = plainToClass(UsuarioDto, req.usuario)
    if (!content.usuarioFoto){
        let [nombre, apellido] = content.usuarioNombre.split(" ")
        content.usuarioFoto = `https://avatars.dicebear.com/api/initials/${nombre[0]}${apellido ? apellido[0] : ""}.svg`
    }
    else {
        const url = v2.url(content.usuarioFoto,{
            width:100,
            angle:45,
            transformation: {effect: "cartoonify"},
        })
        content.usuarioFoto=url
    }
    return res.json({
        message: "Hola desde endpoint final",
        content,
    })
}

