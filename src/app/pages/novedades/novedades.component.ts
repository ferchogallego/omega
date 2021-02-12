import { Component, OnInit } from '@angular/core';
import { ActionsService } from '../../services/actions.service';
import { EmpresaService } from '../../services/empresa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss']
})
export class NovedadesComponent implements OnInit {
  sucs: any;
  lista: any;
  novedades: any;
  pedido: any;
  alimentador: string;
  fecha: number;
  sucursal: string;
  novedad: string;
  productos: any;
  constructor(private actionSvc: ActionsService,
              private empresaSvc: EmpresaService) { }

  ngOnInit(): void {
    this.empresaSvc.cargarSucursales()
    .subscribe (suc => {
      this.sucs = suc;
    });

    this.actionSvc.cantidadNovedades()
                  .subscribe(nov => {
                    this.novedades = nov;
                  });
  }

  selectSucursal(event: string){
    if (event === 'todos') {
      this.actionSvc.cargarPedidosAdministrador()
                  .subscribe(suc => {
                    this.lista = '';
                    this.lista = suc;
                    // console.log(suc);
                  });
    } else {
      this.actionSvc.cargarPedidosPorSucursal(event)
                  .subscribe(suc => {
                    this.lista = '';
                    this.lista = suc;
                    // console.log(suc);
                  });
    }
  }

  cargarPedidoId(idDis: string){
    this.actionSvc.loadDistributionById(idDis)
                  .subscribe(res => {
                    this.pedido = res;
                    this.alimentador = this.pedido.alimentador;
                    this.fecha = this.pedido.fecha;
                    this.sucursal = this.pedido.sucursal;
                    this.productos = this.pedido.productos;
                    console.log(this.productos);
                  });
  }

  gestionar(idNov: string){
    Swal.fire({
      title: 'Esta seguro?',
      text: 'La novedad se va a gestionar a favor de la sucursal',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aceptar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actionSvc.gestionarNovedarPorId(idNov);
        Swal.fire(
          'Aceptado!',
          'La novedad en la entrega ha sido gestionada a favor de la sucursal.',
          'success'
        );
      }
    });
  }

  denegar(idNov: string){
    Swal.fire({
      title: 'Esta seguro?',
      text: 'La novedad va a ser rechazada',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, rechazar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actionSvc.rechazarNovedarPorId(idNov);
        Swal.fire(
          'Rechazado!',
          'La novedad en la entrega ha sido rechazada a la sucursal.',
          'success'
        );
      }
    });
  }

}
