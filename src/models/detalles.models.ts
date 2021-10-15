import { DataTypes } from "sequelize"
import conexion from "../config/sequelize"
import { v4 } from "uuid"

export default()=> conexion.define(
    "detalles",{
        detalleId:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            field: "id",
        },
        detalleCantidad: {
            type: DataTypes.INTEGER,
            field: "cantidad",
            allowNull: false,
            validate:{
                min: 1
            }
        },
        detalleTotal: {
            type: DataTypes.DECIMAL(5, 2),
            field: "total",
            validate: {
                min: 0
            },
            allowNull: false
        },        
    },
    {
        tableName: "detalles",
        timestamps: false,
    }
)