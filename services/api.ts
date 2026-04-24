import { req } from "@/libs/req";
import { Conhecido } from "@/types/conhecido";

export const api = {
    
    // Não precisa do id, o back gera um ao cadastrar
    cadastrar: (dados: Omit<Conhecido, 'id'>) => {
        return req.post("conhecidos/cadastrar", dados);
    },

    listar: () => {
        return req.get<Conhecido[]>("conhecidos");
    },

    buscar: (id: string) => {
        return req.get<Conhecido>(`conhecidos/${id}`);
    },

    editar: (dados: Conhecido) => {
        return req.put("conhecidos", dados)
    },

    excluir: (id: string) => {
        return req.delete(`conhecidos/${id}`);
    }
};