import { useEffect, useState } from "react";
import { getRecetaPorId } from "../api/recetas";

export const useReceta = (id: string)=>{
    const [receta, setReceta] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=> {
        if(!id) return;

        const controller = new AbortController();

        const cargarDatos = async () =>{
            try {
                setLoading(true);
                const json = await getRecetaPorId(id, controller.signal);
                setReceta(json.data);
            } catch (err){
                if (err instanceof Error && err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();

        return ()=> controller.abort();
    }, [id]);

    return {receta, loading, error};
};