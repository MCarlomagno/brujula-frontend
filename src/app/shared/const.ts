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
  }, {
    id: 5,
    horas_sala: 4,
    is_custom: true,
    nombre: 'Personalizado',
    descripcion: 'Personalizado',
  }];

export const ROLES: MatSelectOption[] = [
    { value: 'leader', viewValue: 'Lider' },
    { value: 'member', viewValue: 'Miembro' },
];

export const TIMES_SALA: MatSelectOption[] = [
    { value: '08:00', viewValue: '8:00' },
    { value: '08:20', viewValue: '8:20' },
    { value: '08:40', viewValue: '8:40' },
    { value: '09:00', viewValue: '9:00' },
    { value: '09:20', viewValue: '9:20' },
    { value: '09:40', viewValue: '9:40' },
    { value: '10:00', viewValue: '10:00' },
    { value: '10:20', viewValue: '10:20' },
    { value: '10:40', viewValue: '10:40' },
    { value: '11:00', viewValue: '11:00' },
    { value: '11:20', viewValue: '11:20' },
    { value: '11:40', viewValue: '11:40' },
    { value: '12:00', viewValue: '12:00' },
    { value: '12:20', viewValue: '12:20' },
    { value: '12:40', viewValue: '12:40' },
    { value: '13:00', viewValue: '13:00' },
    { value: '13:20', viewValue: '13:20' },
    { value: '13:40', viewValue: '13:40' },
    { value: '14:00', viewValue: '14:00' },
    { value: '14:20', viewValue: '14:20' },
    { value: '14:40', viewValue: '14:40' },
    { value: '15:00', viewValue: '15:00' },
    { value: '15:20', viewValue: '15:20' },
    { value: '15:40', viewValue: '15:40' },
    { value: '16:00', viewValue: '16:00' },
    { value: '16:20', viewValue: '16:20' },
    { value: '16:40', viewValue: '16:40' },
    { value: '17:00', viewValue: '17:00' },
    { value: '17:20', viewValue: '17:20' },
    { value: '17:40', viewValue: '17:40' },
    { value: '18:00', viewValue: '18:00' },
    { value: '18:20', viewValue: '18:20' },
    { value: '18:40', viewValue: '18:40' },
    { value: '19:00', viewValue: '19:00' },
    { value: '19:20', viewValue: '19:20' },
    { value: '19:40', viewValue: '19:40' },
    { value: '20:00', viewValue: '20:00' },
];

export const TIMES_PUESTO: MatSelectOption[] = [
  { value: '08:00', viewValue: '8:00' },
  { value: '09:00', viewValue: '9:00' },
  { value: '10:00', viewValue: '10:00' },
  { value: '11:00', viewValue: '11:00' },
  { value: '12:00', viewValue: '12:00' },
  { value: '13:00', viewValue: '13:00' },
  { value: '14:00', viewValue: '14:00' },
  { value: '15:00', viewValue: '15:00' },
  { value: '16:00', viewValue: '16:00' },
  { value: '17:00', viewValue: '17:00' },
  { value: '18:00', viewValue: '18:00' },
  { value: '19:00', viewValue: '19:00' },
  { value: '20:00', viewValue: '20:00' },
];
