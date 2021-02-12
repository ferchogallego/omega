export interface EmpleadoI {
    id?: string;
    rol: string;
    direccion: string;
    documento: string;
    email: string;
    estado: string;
    fechaCreacion: number;
    fechaNac: number;
    nombre: string;
    sucursal: string;
    telefono: string;
    imagen?: any;
    fileRef?: string;
    registrado: string;
}
