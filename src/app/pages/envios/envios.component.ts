import { Component, OnInit } from '@angular/core';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'app-envios',
  templateUrl: './envios.component.html',
  styleUrls: ['./envios.component.scss']
})
export class EnviosComponent implements OnInit {

  envios: any;
  recibidos: any;
  todos: any;
  verTodo = false;
  constructor(private actionSvc: ActionsService) { }

  ngOnInit(): void {
    this.actionSvc.verDespachos()
                  .subscribe(res => {
                    this.envios = res;
                    this.recibidos = res;
                  });
  }

  recibirPedido(idPedido: string){
    this.actionSvc.despachosRecibidos(idPedido);
  }

  verTodos(){
    this.envios = [];
    this.actionSvc.verTodosDespachos()
    .subscribe(res => {
      this.todos = res;
      this.envios = this.todos;
      this.verTodo = true;
    });
  }

  verPendientes(){
    this.envios = [];
    this.envios = this.recibidos;
    this.verTodo = false;
  }
}
