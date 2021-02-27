import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  cliente: any;
  idClient: string;

  editarClientForm = new FormGroup ({
    nombre: new FormControl('', Validators.required),
    tipoCliente: new FormControl('', Validators.required),
    tipoDocumento: new FormControl('', Validators.required),
    numero: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(8)]),
    direccion: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
  });

  constructor(private actionSvc: ActionsService,
              private clienteSvc: ClientesService) { }

  ngOnInit(): void {
    this.actionSvc.listaClientes()
                  .subscribe(lista => {
                    this.listaClientes = lista;
                  });
  }

  private initValuesForm(){
    this.editarClientForm.patchValue({
      id: this.cliente.id,
      nombre: this.cliente.nombre,
      direccion: this.cliente.direccion,
      tipoCliente: this.cliente.tipoCliente,
      tipoDocumento: this.cliente.tipoDocumento,
      numero: this.cliente.numero,
      email: this.cliente.email,
      telefono: this.cliente.telefono,
      fecha: this.cliente.fecha,
    });
  }

  editarCliente(client: any){
    console.log(client);
    this.cliente = client;
    this.idClient = client.id;
    this.initValuesForm();
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
          'El registro de cliente fué eliminado.',
          'success'
        );
      }
    });
  }

  editClient(cliente: any){
    console.log(cliente);
    console.log(this.idClient);
    Swal.fire({
      title: 'Está seguro?',
      text: 'Se va a actualizar este cliente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteSvc.actualizarCliente(this.idClient, cliente).then(() => {
          Swal.fire(
            'Actualizado!',
            'El registro de cliente fué actualizado.',
            'success'
          );
          window.location.reload();
        });
      }
    });
  }

}
