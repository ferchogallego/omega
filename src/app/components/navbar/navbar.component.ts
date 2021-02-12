import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  admin: boolean;
  despachador: boolean;
  vendedor: boolean;
  alimentador: boolean;
  cortador: boolean;
  usuario: any;
  data: any;
  novedades: any;
  cant: number;
  pedidos: number;
  pedidosAl: number;
  imagen: string;
  sucursal: string;
  listaEntrega: number;
  public user = this.authSvc.afAuth.user;

  constructor(private authSvc: AuthService,
              private actionSvc: ActionsService,
              private router: Router) { }

  ngOnInit(): void {
    this.user.subscribe(usr => {
      this.usuario = usr;
      this.authSvc.userData(this.usuario.uid)
                  .subscribe(res => {
                    this.data = res;
                    this.actionSvc.usuario = this.data;
                    this.imagen = this.data[0].imageProd;
                    this.sucursal = this.data[0].sucursal;
                    if (this.data[0].rol === 'admin') {
                      this.admin = true;
                    }
                    if (this.data[0].rol === 'despachador') {
                      this.despachador = true;
                    }
                    if (this.data[0].rol === 'Vendedor') {
                      this.vendedor = true;
                    }
                    if (this.data[0].rol === 'Alimentador') {
                      this.alimentador = true;
                    }
                    if (this.data[0].rol === 'Cortador') {
                      this.cortador = true;
                    }
                    this.actionSvc.loadDistributionBySucursal(this.sucursal)
                                  .subscribe(list => {
                                    this.listaEntrega = list.length;
                                  });
                  });
    });

    this.actionSvc.cantidadNovedades()
                  .subscribe(res => {
                  this.novedades = res;
                  this.cant = this.novedades.length;
                  });

    this.actionSvc.cargarPedidosAdministrador()
                  .subscribe(ped => {
                    this.pedidos = ped.length;
                  });
    this.actionSvc.cargarPedidosAlimentador()
                  .subscribe(ped => {
                    this.pedidosAl = ped.length;
                  });
  }

  async onLogout(){
    try {
      await this.authSvc.logout();
      this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);
    }
   }

}
