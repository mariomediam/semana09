import { plainToClass } from "class-transformer"
import { Request, Response } from "express"
import { validate } from "class-validator"
import { CrearProductoDto } from "../dtos/request/producto.dto"
import { Productos } from "../config/models"

export const crearProducto = async (req: Request, res: Response) => {
    const validador = plainToClass(CrearProductoDto, req.body)
    const errores = await validate(validador)

    if (errores.length!==0){
        const informacion_errores = errores.map((error) => error.constraints)

        return res.status(400).json({
            content: informacion_errores,
            message: "Error al crear el producto"
        })
    }

    const nuevoProducto = await Productos.create(validador)
    return res.status(201).json({
        contente:  nuevoProducto,
        message: "Producto creado exitosamente"
    })
}

export const listarProducto = async (req:Request, res:Response) => {
    const productos = await Productos.findAll()
    return res.json({
        content: productos,
        message: null
    })
}