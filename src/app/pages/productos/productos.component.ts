import { Component, OnInit } from '@angular/core';
import { ActionsService } from '../../services/actions.service';
import Swal from 'sweetalert2';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  central = true;
  sucursales: any;
  sucsProd = false;
  lista: any;
  inventario = 'Sede Central';
  constructor(private actionSvc: ActionsService,
              private empresaSvc: EmpresaService) { }

  ngOnInit(): void {
    this.actionSvc.verCatalogo()
    .subscribe(list => {
      this.lista = list;
      // console.log(this.lista);

    });

    this.empresaSvc.cargarSucursales()
    .subscribe (res => {
      this.sucursales = res;
      // console.log(res);
      this.actionSvc.sedeSeleccionada = 'Central';
    });
  }

  borrarProductos(id: string){
   Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a eliminar este producto',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actionSvc.eliminarProductoPorId(id);
        Swal.fire(
          'Eliminado!',
          'El producto ha sido eliminado.',
          'success'
        );
      }
    });
  }

  borrarProductoSucursal(id: string){
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a eliminar este producto',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actionSvc.eliminarProductoPorIdSucursal(this.inventario, id);
        Swal.fire(
          'Eliminado!',
          'El producto ha sido eliminado.',
          'success'
        );
      }
    });
  }

  sucursalSeleccionada(suc: string){
    if (suc === '') {
      return;
    } else {
      if (suc === 'Central') {
        this.central = true;
        this.sucsProd = false;
        this.actionSvc.sedeSeleccionada = suc;
        this.inventario = suc;
        this.lista = [];
        this.actionSvc.verCatalogo()
        .subscribe(list => {
          this.lista = list;
          // console.log(this.lista);
        });
      }else {
        this.central = false;
        this.actionSvc.sedeSeleccionada = suc;
        this.sucsProd = true;
        this.inventario = suc;
        this.lista = [];
        this.actionSvc.cargarInventarioSucursal(suc)
                      .subscribe(sucs => {
                        // console.log(sucs);
                        this.lista = sucs;
                      });
      }
    }
  }

}
