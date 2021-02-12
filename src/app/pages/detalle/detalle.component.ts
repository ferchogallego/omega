import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  factura: any;
  numFac: string;
  fecha: string;
  cliente: any;
  nombre: string;
  documento: string;
  estado: string;
  referencia: string;
  tipoCompra: string;
  valor: string;
  usuario: string;
  listaPrd: any;

  constructor(private route: ActivatedRoute,
              private actionSvc: ActionsService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.actionSvc.cargarDetalleFactura(id)
                  .subscribe(res => {
                    this.factura = res;
                    this.numFac = this.factura.factura;
                    this.fecha = this.factura.fecha;
                    this.documento = this.factura.documento;
                    this.estado = this.factura.estado;
                    this.referencia = this.factura.refCompra;
                    this.tipoCompra = this.factura.tipoCompra;
                    this.usuario = this.factura.usuario;
                    this.valor = this.factura.total;
                    console.log(this.factura);
                    this.actionSvc.datosCliente(this.factura.clienteId)
                                  .subscribe(cl => {
                                    this.cliente = cl;
                                    this.nombre = this.cliente.nombre;
                                  });
                    this.actionSvc.cargarProductosFactura(this.referencia)
                                  .subscribe(prds => {
                                    this.listaPrd = prds;
                                  });
                  });
  }

}
