import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionsService } from 'src/app/services/actions.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../shared/producto.interface';

@Component({
  selector: 'app-corte',
  templateUrl: './corte.component.html',
  styleUrls: ['./corte.component.scss']
})
export class CorteComponent implements OnInit {
  fin = false;
  usuario: any;
  nombre: string;
  data: any;
  lista: any;
  idPrd: string;
  fecha = new Date().getTime();
  prod: string;
  cant: number;
  prdto: any;
  nombreProd: string;
  cantActual: number;
  listadoProd: any;
  prd: any = {
    nombre: '',
    cantidad: 0,
  };
  corte: any = {
    fecha: new Date().getTime(),
    productos: [],
    estado: 'Cargado',
    cortador: '',
  };
  public user = this.authSvc.afAuth.user;

  constructor(private authSvc: AuthService,
              private actionSvc: ActionsService) { }

  ngOnInit(): void {
    this.user.subscribe(usr => {
      this.usuario = usr;
      this.authSvc.userLoginMonitor(this.usuario.uid);
      this.authSvc.userData(this.usuario.uid)
                  .subscribe(res => {
                    this.data = res;
                    this.nombre = this.data[0].nombre;
                  });
    });

    this.actionSvc.verCatalogo()
    .subscribe(list => {
      this.lista = list;
    });
  }

  producto(event: string){
    if (event) {
      this.prod = event;
      this.actionSvc.verProductoPorIdCentral(this.prod)
                    .subscribe(res => {
                      this.prdto = res;
                      this.nombreProd = this.prdto.nombre;
                      this.cantActual = Number(this.prdto.cantidad);
                    });
    }
  }

  cantidad(event: number){
    this.cant = event;
  }

  addNewSend(){
    if (!this.prod || !this.cant) {
      Swal.fire(
        'Sin datos',
        'Seleccione el producto y la cantidad para continuar',
        'question'
      );
    } else {
      const cantidad = Number(this.cant) + Number(this.cantActual);
      Swal.fire({
      title: 'Está seguro?',
      text: 'Va a cargar' + ' ' + this.cant + '  ' + 'Kg' + '  ' + ' de ' + '  ' + this.nombreProd,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cargarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.corte.cortador = this.nombre;
        this.prd.nombre = this.nombreProd;
        this.prd.cantidad = this.cant;
        this.corte.productos.push(this.prd);
        this.listadoProd = this.corte.productos;
        this.actionSvc.actualizaInventarioCorte(this.prod, cantidad, this.fecha, this.nombre)
                      .then(crt => {
                        this.fin = true;
                        this.prd = {
                          nombre: '',
                          cantidad: 0,
                        };
                      });
        Swal.fire(
          'Cargado!',
          'El producto ha sido cargado al inventario.',
          'success'
        );
      }
    });
    }
  }

  finalizarCarga(){
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a finalizar la carga del inventario, asegúrese de haber cargado todos los productos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, finalizar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actionSvc.guardarInventarioCorte(this.corte);
        Swal.fire(
          'Finalizado!',
          'Inventario de la central ha sido cargado.',
          'success'
        );
        window.location.reload();
      }
    });
  }

}
