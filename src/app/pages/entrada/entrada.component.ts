import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionsService } from 'src/app/services/actions.service';
import { AuthService } from 'src/app/services/auth.service';
import { Enter } from '../../shared/ingreso.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.scss']
})
export class EntradaComponent implements OnInit {

  usuario: any;
  nombre: string;
  data: any;
  fecha = new Date().getTime();
  public user = this.authSvc.afAuth.user;

  constructor(private authSvc: AuthService,
              private actionSvc: ActionsService) { }

  newEntryForm = new FormGroup({
    alimentador: new FormControl(''),
    fecha: new FormControl(this.fecha, Validators.required),
    unidades: new FormControl('1', Validators.required),
    peso: new FormControl('1', Validators.required)
  });

  get unidadesNoValido() {
    return this.newEntryForm.get('unidades').invalid && this.newEntryForm.get('unidades').touched;
  }
  get pesoNoValido() {
    return this.newEntryForm.get('peso').invalid && this.newEntryForm.get('peso').touched;
  }

  ngOnInit(): void {
    this.user.subscribe(usr => {
      this.usuario = usr;
      this.authSvc.userLoginMonitor(this.usuario.uid);
      this.authSvc.userData(this.usuario.uid)
                  .subscribe(res => {
                    this.data = res;
                    this.nombre = this.data[0].nombre;
                    console.log(this.data);
                  });
    });
  }

  addNewEntry(entrada: Enter){
    entrada.alimentador = this.nombre;
    this.actionSvc.entradas(entrada).then(() => {
      Swal.fire(
        'Ingresado',
        'Productos entrados satisfactoriamente',
        'success'
      );
    }).catch(err => {
      Swal.fire(
        'Error',
        'Algo salió mal, intente de nuevo',
        'error'
      );
    });
  }

}
