import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { FileI } from '../shared/file.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuario: any;
  private filePath: any;
  private downloadURL: string;
  constructor(public afAuth: AngularFireAuth,
              private storage: AngularFireStorage,
              private db: AngularFirestore) { }

  login(email: string, password: string){
    try{
      return this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
    }
  }

  register(email: string, password: string){
    try {
      return this.afAuth.createUserWithEmailAndPassword(email, password);
     } catch (error) {
      console.log(error);
    }
  }

  userData(idusr: any){
    return this.db.collection('usuarios/', ref => ref
                  .where('idReg', '==', idusr))
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

  userLoginMonitor(id: any){
    return this.db.collection('usuarios').doc(id).update({
      ingreso: new Date().getTime()
    });
  }

  logout(){
    try {
      this.afAuth.signOut();
    } catch (error) {
      console.log(error);
    }
  }

  userVerify(documento){
    return this.db.collection('usuarios/', ref => ref
                  .where('documento', '==', documento))
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

  confirmarRegistroUsuario(idUser: string, idSist: string){
    return this.db.collection('usuarios').doc(idUser).update({
      registrado: 'Si',
      idReg: idSist
    });
  }

  actualizarDireccionUsuario(id: string, address: string){
    return this.db.collection('usuarios').doc(id).update({direccion: address});
  }
  actualizarTelefonoUsuario(id: string, tel: string){
    return this.db.collection('usuarios').doc(id).update({telefono: tel});
  }

  actualizarImagenUsuario(id: string){
    return this.db.collection('usuarios').doc(id).update({imageProd: this.downloadURL});
  }

  uploadImage(id: string, image: FileI){
    this.filePath = `usuarios/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          this.downloadURL = urlImage;
          this.actualizarImagenUsuario(id);
        });
      })
    ).subscribe();
 }
}
