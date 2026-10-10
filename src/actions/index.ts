import { crearUsuario } from './usuario/crearUsuario.action.ts'
import { loginUsuario } from './usuario/loginUsuario.action.ts';
import { logoutUsuario } from './usuario/logoutUsuario.action.ts';

export const server = {
    crearUsuario,
    loginUsuario,
    logoutUsuario
}