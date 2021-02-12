import { Component, OnInit } from '@angular/core';
import { ActionsService } from '../../services/actions.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-ventas',
  templateUrl: './lista-ventas.component.html',
  styleUrls: ['./lista-ventas.component.scss']
})
export class ListaVentasComponent implements OnInit {

  list: any;
  canceladas = false;
  credito = true;
  filterProducto = '';
  constructor(private actionSvc: ActionsService,
              private router: Router) { }

  ngOnInit(): void {
    this.actionSvc.listaFacturas()
                  .subscribe(res => {
                    this.list = res;
                    console.log(this.list);
                  });
  }

  cancelaFatura(factura){
    Swal.fire({
      title: 'Cancelar la factura: ' + factura.factura,
      text: 'Confirmar para continuar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.value) {
        this.actionSvc.cancelarFacturaById(factura.id)
                      .then(() => {
                        Swal.fire(
                          'Cancelada!',
                          'La factura quedó cancelada.',
                          'success'
                        );
                      });
      }
    });
  }

  listaCanceladas(){
    this.list = '';
    this.canceladas = true;
    this.actionSvc.listaFacturasCanceladas()
                  .subscribe(res => {
                    this.list = res;
                  });
  }

  listaCompleta(){
    this.list = '';
    this.canceladas = false;
    this.actionSvc.listaFacturas()
    .subscribe(res => {
      this.list = res;
      console.log(this.list);
    });
  }

  abrirFactua(factura){
    this.router.navigate([`/detalle/${factura.id}`]);
  }

  listaCredito(){
    this.list = '';
    this.credito = false;
    this.actionSvc.listaFacturasCredito()
                  .subscribe(res => {
                    this.list = res;
                  });
  }

  listaContado(){
    this.list = '';
    this.credito = true;
    this.actionSvc.listaFacturasContado()
                  .subscribe(res => {
                    this.list = res;
                  });
  }
}
