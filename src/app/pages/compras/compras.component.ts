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
  factura: string;
  product = '';
  conceptProd = '';
  cantProd = 0;
  precioProd = 0;
  compras = [];
  prodList = {
    producto: '',
    concepto: '',
    cantidad: 0,
    precio: 0
  };

  compraLista = {
    factura: '',
    proveedor: '',
    telefono: '',
    fecha: '',
    total: '',
    empleado: '',
    listaProductos: [],
  };

  detalleProds: any;

  comprasForm = new FormGroup ({
    proveedor: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    total: new FormControl('', [Validators.required]),
    fechaCompra: new FormControl(new Date().getTime()),
    empleado: new FormControl(''),
  });
  get proveedorNoValido() {
    return this.comprasForm.get('proveedor').invalid && this.comprasForm.get('proveedor').touched;
  }
  get telefonoNoValido() {
    return this.comprasForm.get('telefono').invalid && this.comprasForm.get('telefono').touched;
  }
  get totalNoValido() {
    return this.comprasForm.get('total').invalid && this.comprasForm.get('total').touched;
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
                    // console.log(this.datos);
                  });
    });

    this.actionSvc.cargarCompras().subscribe(res => {
      this.comprasList = res;
    });
  }

  numFactura(fact: string){
    this.factura = fact;
  }

  producto(producto: string){
    this.product = producto;
  }

  concepto(concepto: string){
    this.conceptProd = concepto;  }

  cantidad(cantidad: number){
    this.cantProd = cantidad;
  }

  precioUnidad(precio: number){
    this.precioProd = precio;
  }

  agregarProductoCompra(){
    if (this.product === '' || this.conceptProd === '' || this.cantProd === 0 || this.precioProd === 0) {
      Swal.fire(
        'Error',
        'Por favor indique la información de los productos de la compra',
        'error'
      );
    }
    if (this.factura === '' || this.factura === undefined) {
      this.factura = 'N/A';
    }
    this.prodList = {
      producto: '',
      concepto: '',
      cantidad: 0,
      precio: 0
    };
    this.prodList.producto = this.product;
    this.prodList.concepto = this.conceptProd;
    this.prodList.cantidad = this.cantProd;
    this.prodList.precio = this.precioProd;
    this.compras.push(this.prodList);
    console.log(this.prodList);
    this.product = '';
    this.conceptProd = '';
    this.cantProd = 0;
    this.precioProd = 0;
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
      this.compraLista.factura = this.factura;
      this.compraLista.proveedor = compra.proveedor;
      this.compraLista.telefono = compra.telefono;
      this.compraLista.fecha = compra.fechaCompra;
      this.compraLista.total = compra.total;
      this.compraLista.empleado = this.nombre;
      this.compraLista.listaProductos = this.compras;
      // console.log(this.compraLista);
      this.actionSvc.crearCompraCentral(this.compraLista).then(() => {
        Swal.fire(
          'Hecho',
          'La compra se cargó correctamente',
          'success'
        );
        window.location.reload();
      });
    }
  }
  delete(item){
    Swal.fire({
      title: 'Está Seguro?',
      text: 'Va a eliminar un producto de la lista!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.compras.splice(item, 1);
        Swal.fire(
          'Eliminado',
          'El producto se borró de la lista',
          'success'
        );
      }
    });
  }

  detalle(detalle: any){
    this.detalleProds = detalle.listaProductos;
  }

}
