import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  filterEmpleado = '';
  empleados: any;
  sucursales: any;

  nombre: string;
  imagen: string;
  documento: string;
  direccion: string;
  telefono: string;
  email: string;
  fechaN: string;
  sucursal: string;
  estado: string;
  registrado: string;
  rol: string;
  idEmpleado: string;

  constructor(private empresaSvc: EmpresaService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.empresaSvc.CargarUsuarios().subscribe(res => {
        this.empleados = res;
      })
    );
    this.empresaSvc.cargarSucursal().then(suc => {
      this.sucursales = suc;
      console.log('Sucursales: ', this.sucursales);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  borrarEmpleado(empleado: any){
    console.log(empleado);
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Eliminará el empleado del sistema',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      this.empresaSvc.eliminarEmpleado(empleado.id);
      if (result.isConfirmed) {
        Swal.fire(
          'Eliminado!',
          'Registro borrado del sistema.',
          'success'
        );
      }
    });
  }

  verEmpleado(empleado: any){
    // console.log(empleado);
    this.nombre = empleado.nombre;
    this.imagen = empleado.imageProd;
    this.documento = empleado.documento;
    this.direccion = empleado.direccion;
    this.telefono = empleado.telefono;
    this.email = empleado.email;
    this.fechaN = empleado.fechaNac;
    this.sucursal = empleado.sucursal;
    this.estado = empleado.estado;
    this.registrado = empleado.fechaCreacion;
    this.rol = empleado.rol;
    this.idEmpleado = empleado.id;
  }

  cambiarEstado(id: string, orden: string){
    Swal.fire({
      title: 'Cambio de estado.',
      text: 'Se cambiará el estado en el sistema del empleado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
       this.empresaSvc.cambiarEstadoEmpleado(id, orden);
       Swal.fire(
          'Cambiado',
          'Se ha modificado el estado del empleado.',
          'success'
        );
      }
    });
  }

  flitroSucursal(event: string){
    console.log(event);
    if (event === 'Seleccione Sucursal:') {
      this.subscription.add(
        this.empresaSvc.CargarUsuarios().subscribe(res => {
          this.empleados = res;
        })
      );
    } else {
      this.empleados = '';
      this.subscription.add(
        this.empresaSvc.CargarUsuariosPorSucursal(event)
                     .subscribe(res => {
                       console.log(res);
                       this.empleados = res;
                     })
      );
    }
  }

}
