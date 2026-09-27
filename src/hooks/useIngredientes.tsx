import { useState } from "react";

export interface Ingrediente {
    id: string;
    nombre: string;
}

export const useIngredientes =()=>{

    const[ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

    const agregarIngrediente =(nombre: string)=>{
        const yaExiste = ingredientes.some(
            (i) => i.nombre.toLowerCase() === nombre.toLowerCase()
        );

        if(yaExiste) return; // ayuda a evitar duplicados

        setIngredientes((prev)=> [...prev, {id: Date.now().toString(), nombre}]);
    };

    const quitarIngrediente = (id: string) => {
        setIngredientes((prev) => prev.filter((i) => i.id !== id));
    };

    const limpiarTodo = () => setIngredientes([]);

    return { ingredientes, agregarIngrediente, quitarIngrediente, limpiarTodo };
}