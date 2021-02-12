import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActionsService } from '../../services/actions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

  comprasForm = new FormGroup ({
    producto: new FormControl('', [Validators.required]),
    concepto: new FormControl('', [Validators.required]),
    cantidad: new FormControl('', [Validators.required]),
    fechaCompra: new FormControl(new Date().getTime()),
    empleado: new FormControl(''),
  });
  get productoNoValido() {
    return this.comprasForm.get('producto').invalid && this.comprasForm.get('producto').touched;
  }
  get conceptoNoValido() {
    return this.comprasForm.get('concepto').invalid && this.comprasForm.get('concepto').touched;
  }
  get cantidadNoValido() {
    return this.comprasForm.get('cantidad').invalid && this.comprasForm.get('cantidad').touched;
  }

  nombre: string;
  datos: any;
  usuario: any;
  comprasList: any;

  public user = this.authSvc.afAuth.user;

  constructor(private authSvc: AuthService,
              private actionSvc: ActionsService) { }

  ngOnInit(): void {
    this.user.subscribe(usr => {
      this.usuario = usr;
      this.authSvc.userLoginMonitor(this.usuario.uid);
      this.authSvc.userData(this.usuario.uid)
                  .subscribe(res => {
                    this.datos = res;
                    this.nombre = this.datos[0].nombre;
                  });
    });

    this.actionSvc.cargarCompras().subscribe(res => {
      this.comprasList = res;
    });
  }

  addNewBuy(compra: any){
    if (this.comprasForm.invalid){
      Swal.fire({
        title: 'Error...',
        text: 'Debe ingresar la información requerida',
        icon: 'error',
        allowOutsideClick: false,
        showCloseButton: true
      });
      return Object.values( this.comprasForm.controls ).forEach( control => {
        if ( control instanceof FormGroup ) {
          // tslint:disable-next-line: no-shadowed-variable
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    } else {
      compra.empleado = this.nombre;
      this.actionSvc.crearCompraCentral(compra);
    }
  }

  delete(id){
    this.actionSvc.borrarCompra(id);
  }

}
