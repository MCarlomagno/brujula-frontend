export interface Reservation {
    id?: number;
    id_user: number;
    id_sala: number;
    hora_desde: string;
    hora_hasta: string;
    fecha: Date;
}
