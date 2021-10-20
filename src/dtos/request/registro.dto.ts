import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator"
import { TipoUsuario } from "../../models/usuarios.models"

export class RegsitroDto{
    @IsString()    
    @IsNotEmpty()
    usuarioNombre: string

    @IsEmail()
    @IsNotEmpty()
    usuarioCorreo: string
    
    @IsString()
    // @Matches(
    //     /(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%#&?])[A-Za-z\d@$!%#&?]{6,}/,
    //     {
    //         message:
    //         "Password invalida ......",
    //     }
    //   )
    @IsNotEmpty()    
    usuarioPassword: string

    @IsEnum(TipoUsuario)
    @IsOptional()
    usuarioTipo?: TipoUsuario

    @IsOptional()
    @IsString()
    usuarioFoto?: string;
}