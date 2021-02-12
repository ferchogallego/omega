import { Component, OnInit } from '@angular/core';
import { ActionsService } from 'src/app/services/actions.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-novedades-secursales',
  templateUrl: './novedades-secursales.component.html',
  styleUrls: ['./novedades-secursales.component.scss']
})
export class NovedadesSecursalesComponent implements OnInit {

  sucs: any;
  lista: any;
  novedades: any;
  pedido: any;
  alimentador: string;
  fecha: number;
  sucursal: string;
  novedad: string;
  productos: any;
  usuario: any;
  data: any;
  public user = this.authSvc.afAuth.user;
  constructor(private actionSvc: ActionsService,
              private empresaSvc: EmpresaService,
              private authSvc: AuthService) { }

  ngOnInit(): void {
    this.user.subscribe(usr => {
      this.usuario = usr;
      this.authSvc.userData(this.usuario.uid)
                  .subscribe(res => {
                    this.data = res;
                    this.sucursal = this.data[0].sucursal;
                    console.log(this.sucursal);
                    this.actionSvc.novedadesSucursal(this.sucursal)
                                  .subscribe(nov => {
                                    this.novedades = nov;
                                  });
                  });
    });
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
}
