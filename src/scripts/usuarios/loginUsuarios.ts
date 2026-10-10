import { actions, isInputError } from "astro:actions";

const formulario = document.getElementById("formulario_login_usuario") as HTMLFormElement;
const divMensaje = document.getElementById("mensaje-estado") as HTMLDivElement;

formulario?.addEventListener("submit", async (evento)=>{

    evento.preventDefault();

    if (divMensaje) {
        divMensaje.textContent = "Procesando...";
        divMensaje.style.color = "#333";
    }

    const dataFormulario = new FormData(formulario);

     const { data, error } = await actions.loginUsuario(dataFormulario)

    if(error){
        
        if (divMensaje) {

            divMensaje.style.color = "red";

            if (isInputError(error)) {
                divMensaje.textContent = 
                    error.fields.nombre_usuario?.[0] ||
                    error.fields.clave?.[0] ||
                    'Completar campos correctamente'
            } else {
                divMensaje.textContent = error.message
            }
        }

        return;
    }

    if(data?.success){
        window.location.href = '/'
    }

});