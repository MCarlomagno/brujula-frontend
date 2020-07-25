export interface UsersPuestos {
        id_user: number;
        hora_desde: Time;
        hora_hasta: Time;
        fecha_desde: Date;
        fecha_hasta: Date;
        dias: boolean[];
}

export interface Time {
    hours: number;
    minutes: number;
}
