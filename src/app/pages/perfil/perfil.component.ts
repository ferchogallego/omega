import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario: any;
  data: any;
  nombre: string;
  identificacion: string;
  cargo: string;
  imagen: string;
  correo: string;
  telefono: string;
  direccion: string;
  sucursal: string;
  idUsrData: string;
  nuevaDir: string;
  nuevoTel: string;
  imgLoad = false;
  image: any;
  imageSrc: any;
  public user = this.authSvc.afAuth.user;
  constructor(private authSvc: AuthService) { }

  ngOnInit(): void {
    this.user.subscribe(usr => {
      this.usuario = usr;
      this.authSvc.userData(this.usuario.uid)
                  .subscribe(res => {
                    this.data = res;
                    // console.log(this.data);
                    this.nombre = this.data[0].nombre;
                    this.identificacion = this.data[0].documento;
                    this.cargo = this.data[0].rol;
                    this.imagen = this.data[0].imageProd;
                    this.correo = this.data[0].email;
                    this.telefono = this.data[0].telefono;
                    this.direccion = this.data[0].direccion;
                    this.sucursal = this.data[0].sucursal;
                    this.idUsrData = this.data[0].id;
                  });
    });
  }

  handleImage(event: any){
    this.imgLoad = true;
    this.image = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(this.image);
  }

  nuevaDireccion(event: string){
    this.nuevaDir = event;
  }
  nuevoTelefono(event: string){
    this.nuevoTel = event;
  }

  cambiarDireccion(){
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a cambiar la dirección',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cambiar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authSvc.actualizarDireccionUsuario(this.idUsrData, this.nuevaDir);
        Swal.fire(
          'Cambiado!',
          'La dirección ha sido actualizada.',
          'success'
        );
      }
    });
  }
  cambiarTelefono(){
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a cambiar el teléfono del usuario',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cambiar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authSvc.actualizarTelefonoUsuario(this.idUsrData, this.nuevoTel);
        Swal.fire(
          'Cambiado!',
          'El teléfono ha sido actualizado.',
          'success'
        );
      }
    });
  }

  cambiarImagen(){
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a cambiar la imagen de perfil',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cambiar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authSvc.uploadImage(this.idUsrData, this.image);
        Swal.fire(
          'Cambiado!',
          'La imagen ha sido actualizada.',
          'success'
        );
      }
    });
  }
}
