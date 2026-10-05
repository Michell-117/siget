import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';

export const crearUsuario = defineAction({

    accept: 'form',

    input: z.object({

        nombre_usuario: z
        .string({message: 'El usuario es obligatorio'})
        .min(3,'El usuario no puede estar vacío'),

        clave: z
        .string({message: 'La contraseña es obligatoria'})
        .min(4,'La contraseña no puede estar vacia'),
    }),

    handler: async ({nombre_usuario,clave})=>{

        // verificar si el usuario existe
        const existeUsuario = await prisma.operadores.findUnique({
            where: {nombre_usuario}
        });

        // si ya existe un usuario mandamos un error
        if (existeUsuario) {
            throw new ActionError({
                code: 'BAD_REQUEST',
                message: 'El usuario ya existe'
            })
        };

        //Si el usuario no existe, hasheamos la contraseña
        const claveHasheada = await bcrypt.hash(clave,10);

        // Creamos el usuario en la base de datos
        const nuevoUsuario = await prisma.operadores.create({
            data:{
                nombre_usuario,
                clave: claveHasheada
            }
        });

        // retornamos un objeto con el userId y un message

        return {
            message: 'Usario registrado exitosamente.',
            userID: nuevoUsuario.id_operadores,
        };
    }
    
});
