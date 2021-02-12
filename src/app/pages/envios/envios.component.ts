import { Component, OnInit } from '@angular/core';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'app-envios',
  templateUrl: './envios.component.html',
  styleUrls: ['./envios.component.scss']
})
export class EnviosComponent implements OnInit {

  envios: any;
  constructor(private actionSvc: ActionsService) { }

  ngOnInit(): void {
    this.actionSvc.verDespachos()
                  .subscribe(res => {
                    this.envios = res;
                  });
  }

}
