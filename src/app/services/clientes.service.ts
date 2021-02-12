import { Injectable } from '@angular/core';
import { map, finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { ClienteI } from '../shared/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private db: AngularFirestore) { }

  addClient(cliente: ClienteI){
    const clientObj = {
      nombre: cliente.nombre,
      tipoCliente: cliente.tipoCliente,
      tipoDocumento: cliente.tipoDocumento,
      numero: cliente.numero,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      fecha: cliente.fecha,
    };
    return this.db.collection('clientes').add(clientObj);
  }

  listClient(){
    return this.db.collection('clientes')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                       const data = resp.payload.doc.data() as ClienteI;
                       const id = resp.payload.doc.id;
                       return {id, ...data};
                     }))
                  );
  }
}
