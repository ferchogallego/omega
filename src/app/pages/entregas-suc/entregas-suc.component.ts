import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActionsService } from '../../services/actions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entregas-suc',
  templateUrl: './entregas-suc.component.html',
  styleUrls: ['./entregas-suc.component.scss']
})
export class EntregasSucComponent implements OnInit {

  public user = this.authSvc.afAuth.user;
  private subscription: Subscription = new Subscription();
  usuario: any;
  datos: any;
  nombre: string;
  sucursal: string;
  listaEntrega: any;
  productos: any;
  idSuc: string;
  listProdSuc: any;
  prodsAct: any;
  cantAct: number;
  prodInv: string;
  idList: string;
  novedad: string;
  prodName: string;
  prodListState: any;
  constructor(private authSvc: AuthService,
              private actionSvc: ActionsService) {
  this.loadIdSucStorage();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.user.subscribe(usr => {
        this.usuario = usr;
        this.authSvc.userData(this.usuario.uid)
                    .subscribe(res => {
                      this.datos = res;
                      this.nombre = this.datos[0].nombre;
                      this.sucursal = this.datos[0].sucursal;
                      this.subscription.add(
                        this.actionSvc.loadDistributionBySucursal(this.sucursal)
                                      .subscribe(list => {
                                        this.listaEntrega = list;
                                        // console.log(this.listaEntrega);
                                      })
                       );
                    });
      })
     );
  }

  listaProductos(prodList: any, id: string){
    this.productos = prodList;
    this.idList = id;
  }

  cargarInventarioSucursal(producto: any){
    const scrsal = this.sucursal;
    this.prodInv = producto.id;
    this.prodName = producto.nombre;
    // console.log(this.idList);
    this.actionSvc.crearColleccionPrueba(scrsal, this.prodInv)
                  .subscribe(res => {
                    this.prodsAct = res;
                    this.cantAct = Number(this.prodsAct.cantidad) + Number(producto.cantidad);
                    // console.log(this.prodsAct);
                  });
    this.actionSvc.viewStateDistribution(this.idList, this.prodName, this.prodInv)
    .subscribe(res => {
      this.prodListState = res;
      // tslint:disable-next-line: forin
      for (const key in this.prodListState.productos){
        if (this.prodListState.productos[key].id === this.prodInv) {
          this.prodListState.productos[key].cargado = 'si';
        }
      }
      console.log(this.prodListState.productos);
    });
  }

  updateProdSuc(){
    this.actionSvc.updateProductSucursal(this.sucursal, this.prodInv, this.cantAct);
    this.actionSvc.updateStateProdDist(this.idList, this.prodListState.productos);
  }

  textNovedad(event){
    this.novedad = event;
    console.log(this.novedad);
  }

  loadNovedad(){
    this.actionSvc.updateNoteByDist(this.idList, this.novedad);
    this.actionSvc.cargarNovedades(this.idList, this.novedad, this.sucursal);
  }

  changeState(){
    Swal.fire({
      title: 'Está seguro?',
      text: 'Cambiará el estado de la entrega, asegúserse de haber cargado todos los productos primero y registrar novedades, luego no podrá',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, finalizar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actionSvc.changeStateDistributionList(this.idList);
        Swal.fire(
          'Finalizado!',
          'La entrega ha finalizado correctamente.',
          'success'
        );
      }
    });
  }

  loadIdSucStorage(){
    if (localStorage.getItem('scrl')) {
      this.idSuc =  localStorage.getItem('scrl');
    }
  }

}
