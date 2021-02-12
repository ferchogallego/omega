import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmpresaService } from '../../services/empresa.service';
import { ActionsService } from '../../services/actions.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-distribucion',
  templateUrl: './distribucion.component.html',
  styleUrls: ['./distribucion.component.scss']
})
export class DistribucionComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  dvlucion = false;
  envio = false;
  sucursales: any;
  lista: any;
  producto: any;
  cantidad: number;
  cantEnviar: number;
  cantActual: number;
  idProd: string;
  prodNombre: string;
  prodPrecio: number;
  suc: string;
  codigo: number;
  prodList: any;
  listaDist: any = {
    id: '',
    nombre: '',
    cantidad: 0,
    precio: 0
  };
  distribucion: any = {
    sucursal: '',
    fecha: new Date().getTime(),
    productos: [],
    estado: 'Pendiente',
    codOrden: '',
    alimentador: '',
  };
  prodDevo: any;
  cantDevo: number;
  cantSumar: number;
  idDevolucion: string;
  indx: number;
  constructor(private empresaSvc: EmpresaService,
              private actionSvc: ActionsService) {
    this.loadProductsStorage();
    this.loadSucursalStorage();
  }

  ngOnInit(): void {
    this.empresaSvc.cargarSucursal().then(suc => {
      this.sucursales = suc;
      // console.log('Sucursales: ', this.sucursales);
    });

    this.subscription.add(
      this.actionSvc.verCatalogo()
      .subscribe(list => {
        this.lista = list;
        // console.log('Productos: ', this.lista);
      })
     );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  sucursal(event){
    this.suc = event;
    localStorage.setItem('sucursal', this.suc);
  }

  verificaInventario(event){
    this.idProd = event;
  }

  calcularInventario(event){
    this.cantEnviar = event;
  }

  cargarProductoDistribucion(){
   console.log(this.actionSvc.usuario);
   if (this.idProd === undefined) {
    Swal.fire(
      'Error',
      'No ha seleccionado producto para distribución',
      'error'
    );
   } else {
    if (this.suc === undefined) {
      Swal.fire(
        'Error',
        'No ha seleccionado sucursal para distribución',
        'error'
      );
     } else {
      this.envio = true;
      for (const index in this.lista){
        if (this.lista[index].id === this.idProd) {
          this.producto = this.lista[index];
          this.cantidad = this.producto.cantidad;
          this.idProd = this.producto.id;
          this.prodNombre = this.producto.nombre;
          this.prodPrecio = this.producto.precio;
        }
      }
      if (this.cantidad > this.cantEnviar) {
        this.cantActual = this.cantidad - this.cantEnviar;
        this.actionSvc.actualizaInventarioCompra(this.idProd, this.cantActual);
        this.listaDist.id = this.idProd;
        this.listaDist.nombre = this.prodNombre;
        this.listaDist.cantidad = this.cantEnviar;
        this.listaDist.precio = this.prodPrecio;
        this.distribucion.productos.push(this.listaDist);
        this.prodList = this.distribucion.productos;
        console.log(this.prodList);
        this.listaDist = {
          id: '',
          nombre: '',
          cantidad: 0,
          precio: 0
        };
        localStorage.setItem('distribucion', JSON.stringify(this.prodList));
        this.cantEnviar = 1;
        // console.log(this.prodList);
      } else {
        Swal.fire(
          'Inventario Insuficiente',
          'Verifique la orden de distribución con el administrador',
          'error'
        );
      }
     }
   }
  }

  devolucion(ind: number, id: string, cant: number){
    this.dvlucion = true;
    this.indx = ind;
    this.idDevolucion = id;
    this.subscription.add(
      this.actionSvc.cargarInventarioProducto(id)
      .subscribe(res => {
       this.prodDevo = res;
       this.cantDevo = this.prodDevo.cantidad;
       const dev = Number(cant);
       this.cantSumar = this.cantDevo + dev;
      })
    );
  }

  confirmar(){
   if (this.dvlucion) {
    this.actionSvc.actualizaInventarioCompra(this.idDevolucion, this.cantSumar);
    this.prodList.splice(this.indx, 1);
    localStorage.setItem('distribucion', JSON.stringify(this.prodList));
    this.dvlucion = false;
   }
  }

  loadProductsStorage(){
    if (localStorage.getItem('distribucion')) {
      this.prodList = JSON.parse( localStorage.getItem('distribucion'));
      this.distribucion.productos = this.prodList;
    }
  }
  loadSucursalStorage(){
    if (localStorage.getItem('sucursal')) {
      this.suc = localStorage.getItem('sucursal');
    }
  }

  finalizarDistribucion(){
    console.log(this.distribucion);
    Swal.fire({
      title: 'Está seguro?',
      text: 'Enviará estos productos a distribución',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, distribuir'
    }).then((result) => {
      if (result.isConfirmed) {
        this.distribucion.sucursal = this.suc;
        this.distribucion.alimentador = this.actionSvc.usuario;
        this.distribucion.codOrden = Math.ceil(Math.random() * 98752485657);
        this.actionSvc.sendProductsPoints(this.distribucion).then(dist => {
          if (dist) {
            this.prodList = [];
            localStorage.removeItem('distribucion');
            this.suc = '';
            localStorage.removeItem('sucursal');
            this.envio = false;
          }
        });
        Swal.fire(
          'Enviado!',
          'Su lista de distribución ha sido cargada.',
          'success'
        );
      }
    });
  }
}
