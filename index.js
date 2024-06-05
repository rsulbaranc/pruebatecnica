/*
    * Para ejecutar el programa, se debe correr el siguiente comando en la terminal: node index.js
    * El programa recibe 3 parámetros: Array1, Array2 y config
    * Prueba tecnica
     
    * Autor: Ricardo Sulbaran
    * Fecha: 04/06/2024
    * Email: ricardodjsc@gmail.com
*/

//Importación de archivos JSON
import Array1 from "./array1.json" assert { type: "json" };
import Array2 from "./array2.json" assert { type: "json" };

//Objeto de configuración
const config = {
    clavePrimaria1: "idProducto",
    clavePrimaria2: "codigo",
    emparejamientos: { nombreProducto: 'descripcion', precio: 'costo' }
}

//Función para emparejar los datos
const emparejarDatos = (array1, array2, config) => {

    try {

    //Validación de los datos
    if (!array1 || !array2 || !config) {
        throw new Error('Los datos no pueden ser nulos');
    }

    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        throw new Error('Los datos deben ser arreglos');
    }

    if (typeof config !== 'object') {
        throw new Error('La configuración debe ser un objeto');
    }

    //Desestructuración de la configuración
    const { clavePrimaria1, clavePrimaria2, emparejamientos, ordenarPor } = config;

    //Declaración arreglos
    let emparejados = [];
    let faltantes = [];
    let sobrantes = []
    let procesados = [];

    //Valores de los emparejamientos
    const valores = Object.values(emparejamientos)

    //Recorrido del arreglo 2, obj2 es cada objeto del arreglo 2
    for (const obj2 of array2){
        
        //Recorrido del arreglo 1, obj1 es cada objeto del arreglo 1
        array1.forEach(obj1 => {

            //Si el valor de la clave primaria de obj1 es igual al valor de la clave primaria de obj2
            if(obj1[clavePrimaria1] === obj2[clavePrimaria2]) {
        
                //vairable auxiliar. Esta variable se utiliza para guardar los valores que se van a emparejar
                let aux = {};
                for (const clave2 in obj2) {
                    if (valores.includes(clave2)) {
                        const valor2 = obj2[clave2];
                        aux[clave2] = valor2;
                    }
                }

                //Se comparan los valores de obj1 y aux para encontrar las diferencias
                const diferencias = Object.keys(aux).filter(key => aux[key] !== obj1[key])

                //Se crea un nuevo objeto con los valores de obj1 y los valores de aux y se guarda en el arreglo emparejados
                const emparejado = {...obj1, ...aux, diferencias: JSON.stringify(diferencias)};
                emparejados.push(emparejado);

                //Se marca el objeto como procesado
                procesados[obj1[clavePrimaria1]] = true;
            }
        });
    }

    //Se recorren los arreglos 1 y 2 y se compran con el arreglo de procesador para buscar los faltantes y sobrantes
    array1.forEach(obj1 => {
        if (!procesados[obj1[clavePrimaria1]]) {
            sobrantes.push(obj1);
        }
    });
    
    array2.forEach(obj2 => {
        if (!procesados[obj2[clavePrimaria2]]) {
            faltantes.push(obj2);
        }
    });

    //Si se especifica un ordenamiento, se ordena el arreglo emparejados
    if (ordenarPor) {
        emparejados.sort((a, b) => {
            if (a[ordenarPor] < b[ordenarPor]) {
                return -1;
            }
            if (a[ordenarPor] > b[ordenarPor]) {
                return 1;
            }
            return 0;
        });
    }

    //Para efectos de la prueba, se muestran solo los primeros 4 elementos de cada arreglo para que puedan ser visualizados en la consola
    //Para ver el resultado completo, comentar las siguientes 3 líneas de código
    emparejados = emparejados.slice(0, 4);
    faltantes = faltantes.slice(0, 4);
    sobrantes = sobrantes.slice(0, 4);

    console.log({emparejados, faltantes, sobrantes});

} catch (error) {
    console.error(error.message);
}

}

emparejarDatos(Array1, Array2, config);