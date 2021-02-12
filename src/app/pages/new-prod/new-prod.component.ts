import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ActionsService } from '../../services/actions.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-new-prod',
  templateUrl: './new-prod.component.html',
  styleUrls: ['./new-prod.component.scss']
})
export class NewProdComponent implements OnInit {
  central = false;
  sucursales: any;
  imageSrc: any;
  image: any;
  sucursalSeleccionada: string;
  productoNuevo: any;
  constructor(private empresaSvc: EmpresaService,
              private actionSvc: ActionsService,
              private route: Router) { }

newProductForm = new FormGroup({
  nombre: new FormControl('', Validators.required),
  codigo: new FormControl('', Validators.required),
  precio: new FormControl('', Validators.required),
  cantidad: new FormControl(''),
  imagen: new FormControl(''),
  actualizado: new FormControl(new Date().getTime()),
});

get nombreNoValido() {
  return this.newProductForm.get('nombre').invalid && this.newProductForm.get('nombre').touched;
}
get codigoNoValido() {
  return this.newProductForm.get('codigo').invalid && this.newProductForm.get('codigo').touched;
}
get precioNoValido() {
  return this.newProductForm.get('precio').invalid && this.newProductForm.get('precio').touched;
}

ngOnInit(): void {
  this.empresaSvc.cargarSucursal().then(suc => {
    this.sucursales = suc;
    // console.log('Sucursales: ', this.sucursales);
  });
}

addNewProduct(producto: any){
  producto.cantidad = 0;
  this.productoNuevo = producto;
  Swal.fire({
    title: 'Está seguro?',
    text: 'Se va a crear este producto',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, crearlo'
  }).then((result) => {
    if (result.isConfirmed) {
      this.actionSvc.filterProd(producto, this.image);
      Swal.fire(
        'Creado!',
        'El producto ha sido creado.',
        'success'
      );
    }
  });
}
sucSelect(event: string){
    if (event) {
      if (event === 'Central') {
        this.central = true;
        Swal.fire(
          'Para la Central',
          'Desde el botón que indica "Guardar Producto Central"',
          'question'
        );
      } else {
      this.central = false;
      this.sucursalSeleccionada = event;
    }
  }
}

addProductSucursales(){
 console.log(this.sucursalSeleccionada);
 console.log(this.productoNuevo);
 Swal.fire({
  title: 'Ingresar producto a la sucursal: ' + this.sucursalSeleccionada,
  text: 'Se va a crear este producto en la sucursal seleccionada',
  icon: 'question',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, crearlo'
}).then((result) => {
  if (result.isConfirmed) {
    this.actionSvc.agregarProductoSucursales(this.productoNuevo, this.sucursalSeleccionada);
    Swal.fire(
      'Creado!',
      'El producto ha sido creado.',
      'success'
    );
  }
});
}

handleImage(event){
  this.image = event.target.files[0];
  const reader = new FileReader();
  reader.onload = e => {
      this.imageSrc = reader.result;
    };
  reader.readAsDataURL(this.image);
}

}
