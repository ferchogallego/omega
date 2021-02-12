import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit, OnDestroy {
  distri = true;
  listaDist: any;
  inList: any;
  producto: any;
  detalleDist: any;
  private subscription: Subscription = new Subscription();
  constructor(private actionSvc: ActionsService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.actionSvc.loadDistributionList()
                    .subscribe(res => {
                      this.listaDist = res;
                    })
    );

    this.subscription.add(
      this.actionSvc.loadEntryProducts()
                    .subscribe(prod => {
                      this.inList = prod;
                    })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onDisabled(){
    this.distri = false;
  }

  onEnabled(){
    this.distri = true;
  }

  detalleDistribucion(idDist: string){
    console.log(idDist);
    for (const index in this.listaDist){
      if (this.listaDist[index].id === idDist) {
        this.producto = this.listaDist[index];
        this.detalleDist = this.producto.productos;
        console.log(this.detalleDist);
      }
    }
  }

}
