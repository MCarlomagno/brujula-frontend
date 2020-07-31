export interface User {
    id?: number;
    nombre: string;
    apellido: string;
    email: string;
    is_coworker: boolean;
    dni: string;
    fecha_nacimiento: Date;
    direccion: string;
    celular: string;
    id_plan: number;
    id_grupo: number;
    is_leader: boolean;
}
