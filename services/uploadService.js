const { v4: uuidv4 } = require('uuid');

const uploadFile = async (file) => {

    // Validar que exista el archivo
    if (!file) {
        return {
            ok: false,
            message: "No hay ningún archivo para subir.",
            data: null
        };
    }

    const fileNameSegments = file.name.split('.'); // archivo.ejemplo.ext
    const fileExtension = fileNameSegments[fileNameSegments.length - 1]; // .ext

    // Generar el nombre del archivo
    const filename = `${uuidv4()}.${fileExtension}`;
    const path = `uploads/${filename}`;

    try {
        // Mover la imagen
        await file.mv(path);

        // Si todo está correcto, devuelve la ruta de donde se guardó
        return {
            ok: true,
            message: "archivo guardado correctamente.",
            data: path
        };
    } catch (error) {
       console.log(error)
        return {
            ok: false,
            message: `No se puede cargar el archivo`,
            data: null
        };
    }
}

module.exports = {
    uploadFile,
}