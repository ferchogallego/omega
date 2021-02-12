import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/shared/producto.interface';
import { ActionsService } from '../../services/actions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss']
})
export class EditarProductoComponent implements OnInit {

  producto: Producto;
  imageSrc: any;
  image: any;
  imageOriginal: any;
  constructor(private route: ActivatedRoute,
              private actionsSvc: ActionsService,
              private router: Router) { }

  editProductForm = new FormGroup({
    id: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    codigo: new FormControl('', Validators.required),
    precio: new FormControl('', Validators.required),
    cantidad: new FormControl('', Validators.required),
    imagen: new FormControl(''),
    actualizado: new FormControl(new Date().getTime()),
  });

  get nombreNoValido() {
    return this.editProductForm.get('nombre').invalid && this.editProductForm.get('nombre').touched;
  }
  get codigoNoValido() {
    return this.editProductForm.get('codigo').invalid && this.editProductForm.get('codigo').touched;
  }
  get precioNoValido() {
    return this.editProductForm.get('precio').invalid && this.editProductForm.get('precio').touched;
  }
  get cantidadNoValido() {
    return this.editProductForm.get('cantidad').invalid && this.editProductForm.get('cantidad').touched;
  }
  private initValuesForm(){
    this.editProductForm.patchValue({
      id: this.producto.id,
      nombre: this.producto.nombre,
      codigo: this.producto.codigo,
      precio: this.producto.precio,
      cantidad: this.producto.cantidad,
      actualizado: this.producto.actualizado,
      imagen: this.producto.imagen
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // console.log(this.actionsSvc.sedeSeleccionada);
    if (!this.actionsSvc.sedeSeleccionada) {
      Swal.fire(
        'No se detecta la sucursal donde se modificará el producto',
        'Seleccione el producto y la sede de nuevo por favor',
        'question'
      );
      this.router.navigate(['/productos']);
    }
    if (this.actionsSvc.sedeSeleccionada === 'Central') {
      this.actionsSvc.verProductoPorIdCentral(id)
                     .subscribe((prod: Producto) => {
                        this.producto = prod;
                        this.producto.id = id;
                        this.image = this.producto.imagen;
                        this.imageOriginal = this.producto.imagen;
                        this.initValuesForm();
                     });
    } else {
      this.actionsSvc.verProductoPorIdSucursal(this.actionsSvc.sedeSeleccionada, id)
                     .subscribe((prod: Producto) => {
                      this.producto = prod;
                      this.producto.id = id;
                      this.image = this.producto.imagen;
                      this.imageOriginal = this.producto.imagen;
                      this.initValuesForm();
                     });
    }
  }

  editarProducto(prod: Producto){
    prod.actualizado = new Date().getTime();
    Swal.fire({
      title: 'Actualización de producto',
      text: `Actualizando datos del producto`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar'
    }).then(result => {
      if (result.value) {
        if (this.actionsSvc.sedeSeleccionada === 'Central') {
          if (this.image === this.imageOriginal) {
            prod.imagen = this.imageOriginal;
            this.actionsSvc.updateProductById(prod).then(() => {
              Swal.fire('Actualizado!', 'El producto ha sido editado.', 'success');
            }).catch((error) => {
              Swal.fire('Error!', 'Error al editar el producto', 'error');
            });
          } else {
            this.actionsSvc.updateProductById(prod, this.image).then(() => {
              Swal.fire('Actualizado!', 'El producto ha sido editado.', 'success');
            }).catch((error) => {
              Swal.fire('Error!', 'Error al editar el producto', 'error');
            });
          }
        } else {
          console.log(this.actionsSvc.sedeSeleccionada);
          console.log(prod);
          this.actionsSvc.updateProducSucursaltById(this.actionsSvc.sedeSeleccionada, prod);
        }
        this.router.navigate(['/productos']);
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
