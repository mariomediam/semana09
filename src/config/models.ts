import comprasModels from "../models/compras.models";
import detallesModels from "../models/detalles.models";
import productosModels from "../models/productos.models";
import usuariosModels from "../models/usuarios.models";

//RELACIONES
export const Compras = comprasModels()
export const Detalles = detallesModels()
export const Productos = productosModels()
export const Usuarios = usuariosModels()

//Producto tiene muchos detalles
Productos.hasMany(Detalles, {foreignKey:{name:"productoId", allowNull:false, field:"producto_id"}})
//Detalle pertenece a un producto
Detalles.belongsTo(Productos, {foreignKey:{name:"productoId", allowNull:false, field:"producto_id"}})

Compras.hasMany(Detalles, {foreignKey:{name:"compraId", allowNull:false, field:"compra_id"}})

Detalles.belongsTo(Compras, {foreignKey:{name:"compraId", allowNull:false, field:"compra_id"}})

Usuarios.hasMany(Compras, {foreignKey:{name:"usuarioId", allowNull:false, field:"usuario_id"}})

Compras.belongsTo(Usuarios, {foreignKey:{name:"usuarioId", allowNull:false, field:"usuario_id"}})
