import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActionsService } from 'src/app/services/actions.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { SaleI } from 'src/app/shared/sale.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta-sucursal',
  templateUrl: './venta-sucursal.component.html',
  styleUrls: ['./venta-sucursal.component.scss']
})
export class VentaSucursalComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  fecha = new Date().getTime();
  datos: any;
  usuario: any;
  lista: any;
  producto: string;
  // venta
  sale: SaleI;
  saleObj: {};
  cantidad = false;
  facturar = false;
  carrito = false;
  nombre: string;
  sucursal: string;
  nomProd: string;
  cant = 0;
  metodoPago: string;
  precio: number;
  totalFactura = 0;
  impuesto = 0.19;
  total: number;
  cambio: number;
  contado = false;
  enviar = false;
  // cliente
  listClient: any;
  clienteId: string;
  // compra por artículo
  tipoCompra: string;
  cantParcial: number;
  reference = Math.ceil(Math.random() * 958524);
  solicitud: any = {
    compra: [],
    estado: 'Pendiente',
    fecha: new Date().getTime(),
    usuario: '',
    refCompra: this.reference
  };
  // consecutivo de factura
  consecutivo: any;
  imp: number;
  factura: number;
  cliente: any;
  dcmt: string;
  nwFct: number;
  // lista productos factura
  listaPrd: any;
  actual: number;
  venta: number;
  prdelt: string;
  csId: string;
  itemCar: number;
  recibido: number;
  pagado = false;

  // actualizacin de inventario
  cantProd: number;
  idProd: string;
  prdto: any;
  cntd = 0;
  public user = this.authSvc.afAuth.user;
  constructor(private authSvc: AuthService,
              private router: Router,
              private actionSvc: ActionsService,
              private clienteSvc: ClientesService) { }

  ngOnInit(): void {
   this.subscription.add(
    this.user.subscribe(usr => {
      this.usuario = usr;
      this.authSvc.userLoginMonitor(this.usuario.uid);
      this.authSvc.userData(this.usuario.uid)
                  .subscribe(res => {
                    this.datos = res;
                    this.nombre = this.datos[0].nombre;
                    this.sucursal = this.datos[0].sucursal;
                    console.log(this.sucursal);
                    this.subscription.add(
                      this.actionSvc.verCatalogoBySucursal(this.sucursal)
                      .subscribe(list => {
                        this.lista = list;
                        console.log(this.lista);
                      })
                     );
                  });
    })
   );
   this.loadClientList();
   this.numFactura();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  numFactura(){
    this.subscription.add(
      this.actionSvc.invoice().subscribe(res => {
        this.consecutivo = res;
        this.factura = this.consecutivo.factura + 1;
        this.imp = this.consecutivo.impuesto;
      })
    );
  }

  itemSelected(producto: any){
    this.total = 0;
    this.cant = 0;
    this.nomProd = producto.nombre;
    this.precio = producto.precio;
    this.cantidad = true;
    this.carrito = true;
    this.idProd = producto.id;
    this.cantProd = producto.cantidad;
  }

  liquidar(cant: number){
    this.cantParcial = cant;
    this.total = (this.precio + (this.precio * this.impuesto)) * cant;
  }

  retorno(pago: number){
    if (pago > this.total) {
      this.pagado = true;
      this.cambio = pago - this.totalFactura;
      this.recibido = pago;
    }
    else {
      this.cambio = 0;
      Swal.fire(
        'Error',
        'El valor ingresado no cubre el pago total, verifique',
        'error'
      );
    }
  }

  activateMetodo(metodo: string){
    if (metodo === 'contado') {
      this.contado = true;
      this.tipoCompra = metodo;
      this.enviar = true;
    }
    if (metodo === 'credito') {
      this.contado = false;
      this.enviar = true;
      this.tipoCompra = metodo;
    }
  }

  loadClientList(){
    this.subscription.add(
      this.clienteSvc.listClient()
                   .subscribe(res => {
                      this.listClient = res;
                   })
    );
  }

  clientSelected(idClient: string){
    this.clienteId = idClient;
    this.solicitud.usuario = this.clienteId;
    this.subscription.add(
      this.actionSvc.cargarDataCliente(idClient)
                  .subscribe(clt => {
                    this.cliente = clt;
                    this.dcmt = this.cliente.numero;
                  })
    );
  }

  sendPurchase(){
    if (this.clienteId === undefined) {
      this.clienteId = 'Jmtdho6FgCsaJqIfa7Xt';
      this.dcmt = '0';
    }
    this.solicitud.compra = [];
    this.solicitud.usuario = this.clienteId;
    this.solicitud.compra.push(this.idProd, this.nomProd, this.precio, this.cantParcial, this.total);
    this.totalFactura = this.totalFactura + this.total;
    if (this.cantProd > this.cantParcial) {
      const cantActual = this.cantProd - this.cantParcial;
      this.actionSvc.actualizaInventarioSuc(this.sucursal, this.idProd, cantActual)
                    .then (() => {
                      this.actionSvc.cargarPedido(this.solicitud)
                      .then(result => {
                        if (result) {
                          this.total = 0;
                          this.nomProd = '';
                          this.precio = 0;
                          this.facturar = true;
                          this.subscription.add(
                            this.actionSvc.comprasFactura(this.solicitud.refCompra)
                                        .subscribe(productos => {
                                          this.listaPrd = productos;
                                        })
                          );
                        }
                      });
                    });
    } else {
      Swal.fire(
        'Inventario Insuficiente',
        'Verifique la cantidad de producto disponible',
        'error'
      );
    }
  }

  charge(){
    this.actionSvc.actualizaConsecutivo(this.factura);
    const generada = this.factura;
    this.saleObj = {
          usuario: this.nombre,
          sucursal: this.sucursal,
          factura: this.factura,
          clienteId: this.clienteId,
          documento: this.dcmt,
          tipoCompra: this.tipoCompra,
          total: this.totalFactura,
          refCompra: this.reference,
          fecha: new Date().getTime()
        };
    this.actionSvc.facturar(this.saleObj)
        .then(() => {
          Swal.fire(
            'Factura: ' + generada,
            'Generada correctamente',
            'success'
          );
        });
  }

  loadProd(producto: any){
    this.prdelt = producto.compra[0];
    this.csId = producto.id;
    this.itemCar = producto.compra[4];
    this.subscription.add(
      this.actionSvc.cargarInventarioProductoSuc(this.sucursal, this.prdelt)
                  .subscribe(cnt => {
                    this.prdto = cnt;
                    this.actual = Number(this.prdto.cantidad);
                    this.venta = Number(producto.compra[3]);
                    this.cntd = this.actual + this.venta;
                  })
    );
  }

  itemDelete(){
    this.actionSvc.actualizaInventarioSuc(this.sucursal, this.prdelt, this.cntd);
    this.actionSvc.borrarProductoCompra(this.csId);
    this.totalFactura = this.totalFactura - this.itemCar;
  }

}
