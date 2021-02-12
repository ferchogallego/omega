import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.scss']
})
export class NuevoClienteComponent implements OnInit {

  constructor(private clienteSvc: ClientesService,
              private router: Router) { }

  registerClientForm = new FormGroup ({
    nombre: new FormControl('', Validators.required),
    tipoCliente: new FormControl('', Validators.required),
    tipoDocumento: new FormControl('', Validators.required),
    numero: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(8)]),
    direccion: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
  }

  addNewClient(cliente: any){
    cliente.fecha = new Date().getTime();
    this.clienteSvc.addClient(cliente)
                   .then(clt => {
                     if (clt) {
                      Swal.fire(
                        cliente.nombre,
                        'Se ha creado correctamente',
                        'success'
                      );
                      window.location.reload();
                     }
                   });
  }

  cancelar(){
    this.router.navigate(['/clientes']);
  }

}
