import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActionsService } from '../../services/actions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos-sucursal',
  templateUrl: './pedidos-sucursal.component.html',
  styleUrls: ['./pedidos-sucursal.component.scss']
})
export class PedidosSucursalComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  envio = false;
  usuario: any;
  datos: any;
  nombre: string;
  sucursal: string;
  lista: any;
  idProd: string;
  cantEnviar = 1;
  prodList: any;
  prd: any = {
    nombre: '',
    cantidad: 0,
  };
  pedido: any = {
    sucursal: '',
    fecha: new Date().getTime(),
    productos: [],
    estado: 'Pendiente',
    vendedor: '',
  };

  public user = this.authSvc.afAuth.user;

  constructor(private authSvc: AuthService,
              private actionSvc: ActionsService) {
    this.loadProductsStorage();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.user.subscribe(usr => {
        this.usuario = usr;
        // this.authSvc.userLoginMonitor(this.usuario.uid);
        this.authSvc.userData(this.usuario.uid)
                    .subscribe(res => {
                      this.datos = res;
                      this.nombre = this.datos[0].nombre;
                      this.sucursal = this.datos[0].sucursal;
                    });
      })
     );

    this.subscription.add(
      this.actionSvc.verCatalogo()
      .subscribe(list => {
        this.lista = list;
        // console.log('Productos: ', this.lista);
      })
     );

    if (this.prodList) {
      if (this.prodList.length === 0) {
        this.envio = false;
      } else {
        this.envio = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  verificaInventario(event){
    this.idProd = event;
  }

  calcularInventario(event){
    this.cantEnviar = event;
  }

  cargarProductoPedido(){
    this.envio = true;
    this.prd.nombre = this.idProd;
    this.prd.cantidad = this.cantEnviar;
    this.pedido.productos.push(this.prd);
    this.prodList = this.pedido.productos;
    console.log(this.prodList);
    this.prd = {
      nombre: '',
      cantidad: 0,
    };
    this.cantEnviar = 1;
    localStorage.setItem('pedidos', JSON.stringify(this.prodList));
  }

  devolucion(indx: number){
    this.prodList.splice(indx, 1);
    localStorage.setItem('pedidos', JSON.stringify(this.prodList));
  }

  loadProductsStorage(){
    if (localStorage.getItem('pedidos')) {
      this.prodList = JSON.parse( localStorage.getItem('pedidos'));
      this.pedido.productos = this.prodList;
    }
  }

  enviarPedido(){
    if (this.prodList.length === 0) {
      Swal.fire(
        'Error!',
        'No hay producto seleccionados para pedido.',
        'error'
      );
     } else {
        Swal.fire({
          title: 'Está seguro?',
          text: 'Se va a enviar este pedido',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, enviar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.pedido.sucursal = this.sucursal;
            this.pedido.vendedor = this.nombre;
            this.actionSvc.sendSucursalOrder(this.pedido).then(res => {
              if (res) {
                this.envio = false;
                this.prodList = [];
                localStorage.removeItem('pedidos');
              }
            });
            Swal.fire(
              'Enviado!',
              'El pedido ha sido enviado a la central.',
              'success'
            );
          }
        });
     }
  }

}
