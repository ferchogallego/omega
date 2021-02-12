export interface SucursalI {
    id: string;
    nombre: string;
    email: string;
    razonSocial: string;
    telefono: string;
    direccion: string;
    fechaCreacion: number;
    encargado: string;
    estado: string;
    imageSuc?: any;
    fileRef?: string;
}
