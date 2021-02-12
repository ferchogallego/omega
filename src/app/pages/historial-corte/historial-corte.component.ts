import { Component, OnInit } from '@angular/core';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'app-historial-corte',
  templateUrl: './historial-corte.component.html',
  styleUrls: ['./historial-corte.component.scss']
})
export class HistorialCorteComponent implements OnInit {
  list: any;
  prods: any;
  constructor(private actionSvc: ActionsService) { }

  ngOnInit(): void {
    this.actionSvc.cargarListadoCargaInventarioCorte()
                  .subscribe(res => {
                    this.list = res;
                  });
  }

  detalleInventario(inventario: any){
    this.prods = inventario;
  }

}
