import { Component, OnInit } from '@angular/core';
import { ActionsService } from '../../services/actions.service';
import Swal from 'sweetalert2';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-pedidos-admin',
  templateUrl: './pedidos-admin.component.html',
  styleUrls: ['./pedidos-admin.component.scss']
})
export class PedidosAdminComponent implements OnInit {
  lista: any;
  sucs: any;
  prods: any;
  idProd: string;
  constructor(private actionSvc: ActionsService,
              private empresaSvc: EmpresaService) { }

  ngOnInit(): void {
    this.actionSvc.cargarPedidosAdministrador()
                  .subscribe(res => {
                    this.lista = res;
                  });
    this.empresaSvc.cargarSucursales()
    .subscribe (suc => {
      this.sucs = suc;
    });
  }

  detallePedido(productos: any, id: string){
    this.prods = productos;
    this.idProd = id;
  }

  aceptarPedido(id){
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a enviar el pedido para distribución',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, enviarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actionSvc.aceptarPedidoAdmin(id);
        Swal.fire(
          'Enviado!',
          'El producto se envió al alimentador.',
          'success'
        );
      }
    });
  }

  historico(){
    this.lista = '';
    this.actionSvc.cargarPedidosAdministradorTodos()
                  .subscribe(res => {
                    this.lista = res;
                  });
  }

  selectSucursal(event: string){
    if (event === 'todos') {
      this.actionSvc.cargarPedidosAdministrador()
                  .subscribe(suc => {
                    this.lista = '';
                    this.lista = suc;
                    console.log(suc);
                  });
    } else {
      this.actionSvc.cargarPedidosPorSucursal(event)
                  .subscribe(suc => {
                    this.lista = '';
                    this.lista = suc;
                    console.log(suc);
                  });
    }
  }
}
