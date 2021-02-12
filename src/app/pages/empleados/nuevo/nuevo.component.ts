import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmpleadoI } from '../../../shared/empleado.interface';
import { EmpresaService } from '../../../services/empresa.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.scss']
})
export class NuevoComponent implements OnInit {
  imageSrc: any;
  image: any;
  sucursales: any;
  constructor(private empresaSvc: EmpresaService,
              private route: Router) { }

  newEmployeeForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    sucursal: new FormControl('', Validators.required),
    telefono: new FormControl('', [Validators.required, Validators.minLength(8)]),
    documento: new FormControl('', [Validators.required, Validators.minLength(8)]),
    direccion: new FormControl('', Validators.required),
    fechaCreacion: new FormControl(new Date().getTime()),
    rol: new FormControl('Vendedor', Validators.required),
    fechaNac: new FormControl('', Validators.required ),
    estado: new FormControl('Activo', Validators.required ),
    registrado: new FormControl('No', Validators.required )
  });

  get nombreNoValido() {
    return this.newEmployeeForm.get('nombre').invalid && this.newEmployeeForm.get('nombre').touched;
  }
  get emailNoValido() {
    return this.newEmployeeForm.get('email').invalid && this.newEmployeeForm.get('email').touched;
  }
  get sucursalNoValido() {
    return this.newEmployeeForm.get('sucursal').invalid && this.newEmployeeForm.get('sucursal').touched;
  }
  get telefonoNoValido() {
    return this.newEmployeeForm.get('telefono').invalid && this.newEmployeeForm.get('telefono').touched;
  }
  get documentoNoValido() {
    return this.newEmployeeForm.get('documento').invalid && this.newEmployeeForm.get('documento').touched;
  }
  get direccionNoValido() {
    return this.newEmployeeForm.get('direccion').invalid && this.newEmployeeForm.get('direccion').touched;
  }
  get fechaNacNoValido() {
    return this.newEmployeeForm.get('fechaNac').invalid && this.newEmployeeForm.get('fechaNac').touched;
  }

  ngOnInit(): void {
    this.empresaSvc.cargarSucursal().then(suc => {
      this.sucursales = suc;
      // console.log('Sucursales: ', this.sucursales);
    });
  }

  addNewEmployee(empleado: EmpleadoI){
    if (empleado.sucursal === '') {
      Swal.fire({
        title: 'Error...',
        text: 'Debe seleccionar una sucursal',
        icon: 'error',
        allowOutsideClick: false,
        showCloseButton: true
      });
    } else {
      if ( this.newEmployeeForm.invalid ) {
        Swal.fire({
          title: 'Error...',
          text: 'Debe ingresar la información requerida',
          icon: 'error',
          allowOutsideClick: false,
          showCloseButton: true
        });
        return Object.values( this.newEmployeeForm.controls ).forEach( control => {
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
          title: 'Se va a registrar el empleado: ',
          text: empleado.nombre,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, registrarlo'
        }).then((result) => {
          if (result.isConfirmed) {
            this.empresaSvc.filterProd(empleado, this.image);
            this.enrutar();
            Swal.fire(
              'Registrado',
              empleado.nombre + ' Guardado en sistema',
              'success'
            );
          }
        });
      }
      if (!this.image) {
        Swal.fire({
          title: 'Se va a registrar el empleado: ',
          text: empleado.nombre,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, registrarlo'
        }).then((result) => {
          if (result.isConfirmed) {
            this.empresaSvc.agregaUsuarioSinImagen(empleado);
            this.enrutar();
            Swal.fire(
              'Registrado',
              empleado.nombre + ' Guardado en sistema',
              'success'
            );
          }
        });
      }
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

  enrutar(){
    this.route.navigate(['/usuarios']);
  }

}
