import { actions } from "astro:actions";

const formulario = document.getElementById("formulario_creacion_usuario") as HTMLFormElement;
const divMensaje = document.getElementById("mensaje-estado") as HTMLDivElement;

formulario?.addEventListener("submit", async (evento)=>{
    evento.preventDefault();

    if (divMensaje) {
        divMensaje.textContent = "Procesando...";
        divMensaje.style.color = "#333";
    }

    const dataFormulario = new FormData(formulario);

    // llamamos la action crearUsuario y pasamos los datos del formulario
     const { data, error } = await actions.crearUsuario(dataFormulario)

    if(error){
        
        if (divMensaje) {
            divMensaje.textContent = error.message;
            divMensaje.style.color = "red";
        }

        return;
    }

    if(divMensaje){
        divMensaje.textContent = data.message;
        divMensaje.style.color = "green";
    }

    formulario.reset();

});