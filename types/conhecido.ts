export interface Conhecido {
    id: number;
    nome: string;
    idade: number;
    dataConheceu: string;
    ocasiao: string;
    imagem: string;
    genero: string;
    coordenada: {
        id: number;
        latitude: number;
        longitude: number;
        altitude: number;
        precisao: number;
    }
}