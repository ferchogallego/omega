import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { EmpleadoI } from '../shared/empleado.interface';
import { FileI } from '../shared/file.interface';
import { SucursalI } from '../shared/sucursal.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private filePath: any;
  private downloadURL: string;
  private updateImg: string;
  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage) { }

  filterProd(usuario: EmpleadoI, image: FileI){
    this.uploadImage(usuario, image);
  }

  private uploadImage(usuario: EmpleadoI, image: FileI){
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          this.downloadURL = urlImage;
          this.agregarUsuarios(usuario);
        });
      })
    ).subscribe();
 }

 private agregarUsuarios(usuario: EmpleadoI){
  const prodObj = {
    rol: usuario.rol,
    direccion: usuario.direccion,
    documento: usuario.documento,
    email: usuario.email,
    estado: usuario.estado,
    fechaCreacion: usuario.fechaCreacion,
    fechaNac: usuario.fechaNac,
    nombre: usuario.nombre,
    sucursal: usuario.sucursal,
    telefono: usuario.telefono,
    imageProd: this.downloadURL,
    fileRef: this.filePath,
    registrado: usuario.registrado
  };
  if (usuario.id) {
    return this.db.collection('usuarios').doc(usuario.id).update(prodObj);
  } else {
    return this.db.collection('usuarios').add(prodObj);
  }
}

agregaUsuarioSinImagen(usuario: EmpleadoI){
  return this.db.collection('usuarios').add(usuario);
}

CargarUsuarios(){
  return this.db.collection('usuarios')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                       const data = resp.payload.doc.data() as EmpleadoI;
                       const id = resp.payload.doc.id;
                       return {id, ...data};
                     }))
                  );
}
CargarUsuariosPorSucursal(sucursal: string){
  return this.db.collection('usuarios/', ref => ref
                .where('sucursal', '==', sucursal)  )
                .snapshotChanges()
                .pipe(
                  map(actions =>
                    actions.map(resp => {
                      const data = resp.payload.doc.data() as EmpleadoI;
                      const id = resp.payload.doc.id;
                      return {id, ...data};
                    }))
                );
}

eliminarEmpleado(idEmpleado: string){
  return this.db.collection('usuarios').doc(idEmpleado).delete();
}

cambiarEstadoEmpleado(id: string, state: string){
  return this.db.collection('usuarios').doc(id).update({estado: state});
}

cargarSucursales(){
  return this.db.collection('sucursales')
                .snapshotChanges()
                .pipe(
                  map(actions =>
                   actions.map(resp => {
                     const data = resp.payload.doc.data() as EmpleadoI;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                   }))
                );
}

filterSucursal(sucursal: SucursalI, image: FileI){
  this.uploadImageSucursal(sucursal, image);
}

private uploadImageSucursal(sucursal: SucursalI, image: FileI){
  this.filePath = `images/${image.name}`;
  const fileRef = this.storage.ref(this.filePath);
  const task = this.storage.upload(this.filePath, image);
  task.snapshotChanges().pipe(
    finalize(() => {
      fileRef.getDownloadURL().subscribe( urlImage => {
        this.downloadURL = urlImage;
        this.agregarSucursal(sucursal);
      });
    })
  ).subscribe();
}

private agregarSucursal(sucursal: SucursalI){
  const prodObj = {
    direccion: sucursal.direccion,
    email: sucursal.email,
    estado: sucursal.estado,
    fechaCreacion: sucursal.fechaCreacion,
    nombre: sucursal.nombre,
    razonSocial: sucursal.razonSocial,
    encargado: sucursal.encargado,
    telefono: sucursal.telefono,
    imageSuc: this.downloadURL,
    fileRef: this.filePath,
  };
  if (sucursal.id) {
    return this.db.collection('sucursales').doc(sucursal.id).update(prodObj);
  } else {
    return this.db.collection('sucursales').add(prodObj);
  }
}

agregarSucursalSinImagen(sucursal: any){
  return this.db.collection('sucursales').add(sucursal);
}

desactivarSucursal(id: string, state: string){
  return this.db.collection('sucursales').doc(id).update({estado: state});
}

eliminarSucursal(id: string){
  return this.db.collection('sucursales').doc(id).delete();
}

cargarSucursal(){
  return new Promise((resolve, reject) => {
    this.db.collection('sucursales').get().forEach(res => {
      if (res.empty){
        reject('error');
      }else{
        const dataSuc = [];
        res.forEach(res1 => {
          dataSuc.push([res1.data(), res1.id]);
        });
        resolve(dataSuc);
        // console.log(dataSuc);
      }
    }).catch();
  });
}
cargarVendedores(){
  return new Promise((resolve, reject) => {
    this.db.collection('usuarios/', ref => ref
        .where('rol', '==', 'Vendedor')).get().forEach(res => {
      if (res.empty){
        reject('error');
      }else{
        const dataSuc = [];
        res.forEach(res1 => {
          dataSuc.push([res1.data(), res1.id]);
        });
        resolve(dataSuc);
        // console.log(dataSuc);
      }
    }).catch();
  });
}
cargarDatosEmpresa(){
  return this.db.collection('empresa').doc('mU6wQdkZYn6c8nZMk2x5').valueChanges();
}

actualizarRepresentante(repre: string){
  return this.db.collection('empresa').doc('mU6wQdkZYn6c8nZMk2x5').update({representante: repre});
}

actualizarCorreo(correo: string){
  return this.db.collection('empresa').doc('mU6wQdkZYn6c8nZMk2x5').update({email: correo});
}

actualizarDireccion(location: string){
  return this.db.collection('empresa').doc('mU6wQdkZYn6c8nZMk2x5').update({direccion: location});
}

actualizarTelefono(cel: string){
  return this.db.collection('empresa').doc('mU6wQdkZYn6c8nZMk2x5').update({telefono: cel});
}

actualizarImagenEmpresa(imagen: FileI){
  this.filePath = `images/${imagen.name}`;
  const fileRef = this.storage.ref(this.filePath);
  const task = this.storage.upload(this.filePath, imagen);
  task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          this.updateImg = urlImage;
          // this.updateImgEmpresa();
          console.log(this.downloadURL);
        });
      })
  ).subscribe();
}

private updateImgEmpresa(){
  return this.db.collection('empresa').doc('mU6wQdkZYn6c8nZMk2x5').update({imagen: this.downloadURL});
}

actualizarNit(idEmpresa: string){
  return this.db.collection('empresa').doc('mU6wQdkZYn6c8nZMk2x5').update({nit: idEmpresa});
}

cargarIvaConsecutivo(){
  return this.db.collection('consecutivo').doc('3GWxx2XGbS90in8FNXFN').valueChanges();
}

actualizarIva(iva: number){
  return this.db.collection('consecutivo').doc('3GWxx2XGbS90in8FNXFN').update({impuesto: iva});
}

actualizarConsecutivo(incre: number){
  return this.db.collection('consecutivo').doc('3GWxx2XGbS90in8FNXFN').update({factura: incre});
}

cargarSucursalPorNombre(suc: string){
  return this.db.collection('sucursales', ref => ref
                .where('nombre', '==', suc))
                .snapshotChanges()
                .pipe(
                  map(actions =>
                   actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                   }))
                );
}

}
