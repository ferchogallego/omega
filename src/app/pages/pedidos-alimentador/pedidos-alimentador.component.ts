import { Component, OnInit } from '@angular/core';
import { ActionsService } from 'src/app/services/actions.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos-alimentador',
  templateUrl: './pedidos-alimentador.component.html',
  styleUrls: ['./pedidos-alimentador.component.scss']
})
export class PedidosAlimentadorComponent implements OnInit {

  lista: any;
  prods: any;
  idProd: string;
  constructor(private actionSvc: ActionsService,
              private empresaSvc: EmpresaService) { }

  ngOnInit(): void {
    this.actionSvc.cargarPedidosAlimentador()
                  .subscribe(res => {
                    this.lista = res;
                  });
  }

  detallePedido(productos: any, id: string){
    this.prods = productos;
    this.idProd = id;
  }

  aceptarPedido(id){
    Swal.fire({
      title: 'Está seguro?',
      text: 'El pedido quedará en estado de entrega a sucursal',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, enviarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actionSvc.aceptarPedidoAlimentador(id);
        Swal.fire(
          'Enviado!',
          'El pedido se cargó a la sucursal.',
          'success'
        );
      }
    });
  }
}
