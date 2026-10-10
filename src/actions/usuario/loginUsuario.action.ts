import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export const loginUsuario = defineAction({
    accept:'form',

    input: z.object({
        nombre_usuario: z
        .string({message: 'El usuario es obligatorio'})
        .min(3,'El usuario no puede estar vacío'),

        clave: z
        .string({message: 'La contraseña es obligatoria'})
        .min(4,'La contraseña no puede estar vacia'),
    }),

    handler: async ({nombre_usuario,clave}, context)=>{

        const operador = await prisma.operadores.findUnique({
            where: {nombre_usuario}
        });

        if (!operador) {
            throw new ActionError({
                code: 'UNAUTHORIZED',
                message: 'Usuario incorrecto'
            });
        }

        const validacionClave = await bcrypt.compare(clave, operador.clave);

        if (!validacionClave) {
            throw new ActionError({
                code:'UNAUTHORIZED',
                message: 'Contraseña incorrecto'
            })
        }

        context.cookies.set(
            'session_user',
            JSON.stringify({
                id:operador.id_operadores,
                usuario: operador.nombre_usuario
            }),
            {
                path:'/',
                httpOnly: true,
                secure: import.meta.env.PROD,
                sameSite: 'lax',
                maxAge: 60 * 60 * 8
            }
        );

        return {
            success: true,
            message: 'Inicio de sesión exitoso'
        };

    }
})
