import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActionsService } from '../../services/actions.service';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  listaClientes: any;

  constructor(private actionSvc: ActionsService,
              private clienteSvc: ClientesService) { }

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
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a eliminar este cliente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteSvc.eliminarCliente(idCliente);
        Swal.fire(
          'Borrado!',
          'El registro de cliente dué eliminado.',
          'success'
        );
      }
    });
  }

}
