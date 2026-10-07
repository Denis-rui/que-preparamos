import { useState } from "react";

export interface Ingrediente {
    id: number;
    nombre: string;
}

export const useIngredientes =()=>{

    const[ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

    const agregarIngrediente =(ingrediente: Ingrediente)=>{
        const yaExiste = ingredientes.some(
            (i) => i.id === ingrediente.id
        );

        if(yaExiste) return; // ayuda a evitar duplicados

        setIngredientes((prev)=> [...prev, ingrediente]);
    };

    const quitarIngrediente = (id: number) => {
        setIngredientes((prev) => prev.filter((i) => i.id !== id));
    };

    const limpiarTodo = () => setIngredientes([]);

    return { ingredientes, agregarIngrediente, quitarIngrediente, limpiarTodo };
}