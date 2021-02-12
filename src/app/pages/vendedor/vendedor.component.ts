import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { EmpresaService } from '../../services/empresa.service';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.scss']
})
export class VendedorComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  public user = this.authSvc.afAuth.user;
  usuario: any;
  datos: any;
  nombre: string;
  sucursal: string;
  sucr: any;
  idSuc: string;
  constructor(private authSvc: AuthService,
              private empresaSvc: EmpresaService,
              private actionSvc: ActionsService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.user.subscribe(usr => {
        this.usuario = usr;
        // this.authSvc.userLoginMonitor(this.usuario.uid);
        this.authSvc.userData(this.usuario.uid)
                    .subscribe(res => {
                      this.datos = res;
                      this.nombre = this.datos[0].nombre;
                      this.sucursal = this.datos[0].sucursal;
                      // console.log(this.sucursal);
                      this.subscription.add(
                        this.empresaSvc.cargarSucursalPorNombre(this.sucursal)
                                       .subscribe(suc => {
                                         this.sucr = suc;
                                         this.idSuc = this.sucr[0].id;
                                         this.actionSvc.idSucursal = this.idSuc;
                                         localStorage.setItem('scrl', this.idSuc);
                                         // console.log(this.actionSvc.idSucursal);
                                       })
                      );
                    });
      })
     );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
