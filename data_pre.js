(function () {
    // Lista base de profesionales con atributos completamente en espa�ol
    const listaEmpleados = [
        { nombre: 'Maria Lopez', rol: 'Ingeniera Senior', equipo: 'Infraestructura', puntaje: 9.3, carga: 'alta', disponibilidad: 5 },
        { nombre: 'Jorge Osei', rol: 'Diseniador de Producto', equipo: 'Equipo de Crecimiento', puntaje: 8.6, carga: 'media', disponibilidad: 4 },
        { nombre: 'Rafael Souza', rol: 'Ingeniero Backend', equipo: 'Infraestructura', puntaje: 7.4, carga: 'alta', disponibilidad: 3 },
        { nombre: 'Aisha Mendez', rol: 'Investigadora UX', equipo: 'Proyecto Horizonte', puntaje: 9.0, carga: 'baja', disponibilidad: 6 },
        { nombre: 'Carlos Ruiz', rol: 'Desarrollador Frontend', equipo: 'Proyecto Horizonte', puntaje: 8.2, carga: 'media', disponibilidad: 5 },
        { nombre: 'Elena Torres', rol: 'Cientifica de Datos', equipo: 'Equipo de Crecimiento', puntaje: 8.8, carga: 'baja', disponibilidad: 7 },
        { nombre: 'Luis Chen', rol: 'Ingeniero QA', equipo: 'Equipo de Crecimiento', puntaje: 7.8, carga: 'media', disponibilidad: 4 },
        { nombre: 'Nadia Brooks', rol: 'Gestora de Producto', equipo: 'Proyecto Horizonte', puntaje: 8.9, carga: 'alta', disponibilidad: 6 },
        { nombre: 'Samuel Park', rol: 'Ingeniero DevOps', equipo: 'Infraestructura', puntaje: 8.1, carga: 'alta', disponibilidad: 5 },
        { nombre: 'Amira Yusuf', rol: 'Analista de Datos', equipo: 'Equipo de Crecimiento', puntaje: 8.4, carga: 'baja', disponibilidad: 6 },
        { nombre: 'Mina Lin', rol: 'Arquitecta Cloud', equipo: 'Infraestructura', puntaje: 8.7, carga: 'alta', disponibilidad: 4 },
        { nombre: 'Hector Salazar', rol: 'Escritor Tecnico', equipo: 'Equipo de Crecimiento', puntaje: 7.9, carga: 'baja', disponibilidad: 7 },
        { nombre: 'Nora Ali', rol: 'Lider Frontend', equipo: 'Proyecto Horizonte', puntaje: 9.1, carga: 'media', disponibilidad: 5 },
        { nombre: 'Diego Morales', rol: 'Seguridad Informaica', equipo: 'Infraestructura', puntaje: 8.5, carga: 'alta', disponibilidad: 4 },
        { nombre: 'Sara Vega', rol: 'Operaciones de Talento', equipo: 'Equipo de Crecimiento', puntaje: 8.0, carga: 'baja', disponibilidad: 8 },
        { nombre: 'Tomas Ekstrom', rol: 'Ingeniero Mobile', equipo: 'Sin equipo', puntaje: 8.3, carga: 'media', disponibilidad: 5 }
    ];

    window.obtenerEmpleados = () => [...listaEmpleados];

    // Algoritmo simplificado de filtrado y ordenaci�n selectiva
    window.generarPropuesta = function (empleados, opciones) {
        const { criterio, carga, disponibilidad, tamanio } = opciones;
        let filtro = [...empleados];

        if (carga && carga !== 'cualquiera') filtro = filtro.filter(e => e.carga === carga);
        if (disponibilidad && disponibilidad !== 'cualquiera') {
            if (disponibilidad === 'alta') filtro = filtro.filter(e => e.disponibilidad >= 6);
            if (disponibilidad === 'media') filtro = filtro.filter(e => e.disponibilidad >= 4);
            if (disponibilidad === 'baja') filtro = filtro.filter(e => e.disponibilidad <= 3);
        }
        if (filtro.length === 0) filtro = [...empleados];

        // Clasificacion de orden en base a los criterios definidos
        if (criterio === 'puntaje') {
            filtro.sort((a, b) => b.puntaje - a.puntaje || b.disponibilidad - a.disponibilidad);
        } else if (criterio === 'disponibilidad') {
            filtro.sort((a, b) => b.disponibilidad - a.disponibilidad || b.puntaje - a.puntaje);
        } else if (criterio === 'carga') {
            const pesos = { baja: 0, media: 1, alta: 2 };
            filtro.sort((a, b) => pesos[a.carga] - pesos[b.carga] || b.puntaje - a.puntaje);
        } else {
            filtro.sort(() => Math.random() - 0.5);
        }

        // Seleccion de los primeros N elementos y calculo del promedio de puntaje
        const seleccionados = filtro.slice(0, tamanio);
        const promedio = seleccionados.length ? (seleccionados.reduce((acc, e) => acc + e.puntaje, 0) / seleccionados.length).toFixed(1) : 0;

        // Retorno de datos de la propuesta generada
        return {
            equipo: seleccionados,
            puntaje: promedio,
            miembros: seleccionados.length,
            nombre: `Propuesta por ${criterio}`
        };
    };
}());