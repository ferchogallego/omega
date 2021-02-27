import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmpresaService } from '../../../services/empresa.service';
import { ActionsService } from '../../../services/actions.service';


@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit {

  lista: any;
  imageSrc: any;
  image: any;
  vendedores: any;
  sucursal: string;
  menu = false;
  boxEncargado = false;
  boxTelefono = false;
  boxDireccion = false;
  boxEmail = false;
  constructor(private empresaSvc: EmpresaService,
              private actionSvs: ActionsService) { }

  nuevaSucursalForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    razonSocial: new FormControl('', Validators.required),
    telefono: new FormControl('', [Validators.required, Validators.minLength(8)]),
    direccion: new FormControl('', Validators.required),
    fechaCreacion: new FormControl(new Date().getTime()),
    encargado: new FormControl('', Validators.required),
    estado: new FormControl('Activo', Validators.required)
  });

  get nombreNoValido() {
    return this.nuevaSucursalForm.get('nombre').invalid && this.nuevaSucursalForm.get('nombre').touched;
  }
  get emailNoValido() {
    return this.nuevaSucursalForm.get('email').invalid && this.nuevaSucursalForm.get('email').touched;
  }
  get razonNoValido() {
    return this.nuevaSucursalForm.get('razonSocial').invalid && this.nuevaSucursalForm.get('razonSocial').touched;
  }
  get telefonoNoValido() {
    return this.nuevaSucursalForm.get('telefono').invalid && this.nuevaSucursalForm.get('telefono').touched;
  }
  get direccionNoValido() {
    return this.nuevaSucursalForm.get('direccion').invalid && this.nuevaSucursalForm.get('direccion').touched;
  }
  get encargadoNoValido() {
    return this.nuevaSucursalForm.get('encargado').invalid && this.nuevaSucursalForm.get('encargado').touched;
  }
  ngOnInit(): void {
    this.empresaSvc.cargarSucursales()
                   .subscribe (res => {
                     this.lista = res;
                     // console.log(res);
                   });
  }

  onMenu(){
    if (this.menu) {
      this.menu = false;
    } else {
      this.menu = true;
    }
  }

  addNewcampus(sucursal: any){
    if ( this.nuevaSucursalForm.invalid ) {
      Swal.fire({
        title: 'Error...',
        text: 'Debe ingresar la información requerida',
        icon: 'error',
        allowOutsideClick: false,
        showCloseButton: true
      });
      return Object.values( this.nuevaSucursalForm.controls ).forEach( control => {
        if ( control instanceof FormGroup ) {
          // tslint:disable-next-line: no-shadowed-variable
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
    if (this.image) {
      Swal.fire({
        title: 'Se va a registrar la sucursal: ',
        text: sucursal.nombre,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, registrarlo'
      }).then((result) => {
        if (result.isConfirmed) {
          this.empresaSvc.filterSucursal(sucursal, this.image);
          Swal.fire(
            'Registrado',
            sucursal.nombre + ' Guardado en sistema',
            'success'
          );
        }
      });
    }
    if (!this.image) {
      Swal.fire({
        title: 'Se va a crear la sucursal: ',
        text: sucursal.nombre,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, crearla'
      }).then((result) => {
        if (result.isConfirmed) {
          this.empresaSvc.agregarSucursalSinImagen(sucursal);
          Swal.fire(
            'Creada',
            sucursal.nombre + ' Creada en sistema',
            'success'
          );
        }
      });
    }
  }
  handleImage(event: any){
    this.image = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(this.image);
  }

  disabled(id: string, estado: string){
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se cambiará el estado de la sucursal!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cambiar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empresaSvc.desactivarSucursal(id, estado);
        Swal.fire(
          'Actualizado!',
          'La sucursal cambió de estado.',
          'success'
        );
      }
    });
  }

  delete(id: string){
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se eliminará la sucursal!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empresaSvc.eliminarSucursal(id);
        Swal.fire(
          'Eliminado!',
          'La sucursal ha sido borrada.',
          'success'
        );
      }
    });
  }

  loadSales(){
    this.empresaSvc.cargarVendedores().then(sales => {
      this.vendedores = sales;
    });
  }

  editarSucursal(id: string, tipo){
    this.sucursal = id;
    if (tipo === 'encargado') {
      this.empresaSvc.cargarVendedores().then(sales => {
        this.vendedores = sales;
      });
      this.boxEncargado = true;
      this.boxTelefono = false;
      this.boxDireccion = false;
      this.boxEmail = false;
    }
    if (tipo === 'telefono') {
      this.boxEncargado = false;
      this.boxTelefono = true;
      this.boxDireccion = false;
      this.boxEmail = false;
    }
    if (tipo === 'direccion') {
      this.boxEncargado = false;
      this.boxTelefono = false;
      this.boxDireccion = true;
      this.boxEmail = false;
    }
    if (tipo === 'email') {
      this.boxEncargado = false;
      this.boxTelefono = false;
      this.boxDireccion = false;
      this.boxEmail = true;
    }
  }

  encargadoSeleccionado(encargado: string){
    if (encargado === '') {
      return;
    } else {
      Swal.fire({
        title: 'Está seguro?',
        text: 'Se cambiará el encargado de esta sucursal!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Cambiarlo!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.actionSvs.actualizarEncargadoSucursal(this.sucursal, encargado);
          Swal.fire(
            'Cambiado!',
            'Se ha actulizado el encargado de la sucursal.',
            'success'
          );
          window.location.reload();
        }
      });
    }
  }

  telefonoSeleccionado(telefono: string){
    if (telefono === '') {
      return;
    } else {
      Swal.fire({
        title: 'Está seguro?',
        text: 'Se cambiará el teléfono de esta sucursal!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Cambiarlo!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.actionSvs.actualizarTelefonoSucursal(this.sucursal, telefono);
          Swal.fire(
            'Cambiado!',
            'Se ha actulizado el teléfono de la sucursal.',
            'success'
          );
          window.location.reload();
        }
      });
    }
  }

  direccionSeleccionado(direccion: string){
    if (direccion === '') {
      return;
    } else {
      Swal.fire({
        title: 'Está seguro?',
        text: 'Se cambiará el dirección de esta sucursal!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Cambiarlo!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.actionSvs.actualizarDireccionSucursal(this.sucursal, direccion);
          Swal.fire(
            'Cambiado!',
            'Se ha actulizado el dirección de la sucursal.',
            'success'
          );
          window.location.reload();
        }
      });
    }
  }
  emailSeleccionado(email: string){
    if (email === '') {
      return;
    } else {
      Swal.fire({
        title: 'Está seguro?',
        text: 'Se cambiará el E-mail de esta sucursal!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Cambiarlo!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.actionSvs.actualizarEmailSucursal(this.sucursal, email);
          Swal.fire(
            'Cambiado!',
            'Se ha actulizado el E-mail de la sucursal.',
            'success'
          );
          window.location.reload();
        }
      });
    }
  }
}
