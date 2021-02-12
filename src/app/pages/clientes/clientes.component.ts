import { Component, OnInit } from '@angular/core';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  listaClientes: any;

  constructor(private actionSvc: ActionsService) { }

  ngOnInit(): void {
    this.actionSvc.listaClientes()
                  .subscribe(lista => {
                    this.listaClientes = lista;
                  });
  }

  editarCliente(idCliente: string){
    console.log(idCliente);
  }

  eliminarCliente(idCliente: string){
    console.log(idCliente);
  }

}
