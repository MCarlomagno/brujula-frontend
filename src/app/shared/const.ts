import {Plan} from '../models/plan.model';

export interface MatSelectOption {
    value: string;
    viewValue: string;
}

export const PLANES: Plan[] = [{
    id: 1,
    horas_sala: 2,
    is_custom: false,
    nombre: 'Movil x 6',
    descripcion: 'Movil x 6',
  }, {
    id: 2,
    horas_sala: 4,
    is_custom: false,
    nombre: 'Movil x 12',
    descripcion: 'Movil x 12',
  }, {
    id: 3,
    horas_sala: 4,
    is_custom: false,
    nombre: 'Fijo x 12' ,
    descripcion: 'Fijo x 12' ,
  }, {
    id: 4,
    horas_sala: 4,
    is_custom: false,
    nombre: 'Oficina privada',
    descripcion: 'Oficina privada',
  }];

export const ROLES: MatSelectOption[] = [
    { value: '0', viewValue: 'Lider' },
    { value: '1', viewValue: 'Miembro' },
];

export const TIMES: MatSelectOption[] = [
    { value: '00', viewValue: '8:00' },
    { value: '01', viewValue: '8:20' },
    { value: '02', viewValue: '8:40' },
    { value: '10', viewValue: '9:00' },
    { value: '11', viewValue: '9:20' },
    { value: '12', viewValue: '9:40' },
    { value: '20', viewValue: '10:00' },
    { value: '21', viewValue: '10:20' },
    { value: '22', viewValue: '10:40' },
    { value: '30', viewValue: '11:00' },
    { value: '31', viewValue: '11:20' },
    { value: '32', viewValue: '11:40' },
    { value: '00', viewValue: '12:00' },
    { value: '01', viewValue: '12:20' },
    { value: '02', viewValue: '12:40' },
    { value: '10', viewValue: '13:00' },
    { value: '11', viewValue: '13:20' },
    { value: '12', viewValue: '13:40' },
    { value: '20', viewValue: '14:00' },
    { value: '21', viewValue: '14:20' },
    { value: '22', viewValue: '14:40' },
    { value: '30', viewValue: '15:00' },
    { value: '31', viewValue: '15:20' },
    { value: '32', viewValue: '15:40' },
    { value: '00', viewValue: '16:00' },
    { value: '01', viewValue: '16:20' },
    { value: '02', viewValue: '16:40' },
    { value: '10', viewValue: '17:00' },
    { value: '11', viewValue: '17:20' },
    { value: '12', viewValue: '17:40' },
    { value: '20', viewValue: '18:00' },
    { value: '21', viewValue: '18:20' },
    { value: '22', viewValue: '18:40' },
    { value: '30', viewValue: '19:00' },
    { value: '31', viewValue: '19:20' },
    { value: '32', viewValue: '19:40' },
    { value: '20', viewValue: '20:00' },
];
