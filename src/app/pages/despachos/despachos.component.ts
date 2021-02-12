import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionsService } from '../../services/actions.service';
import { Shipping } from '../../shared/despacho.interface';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-despachos',
  templateUrl: './despachos.component.html',
  styleUrls: ['./despachos.component.scss']
})
export class DespachosComponent implements OnInit {

  usuario: any;
  nombre: string;
  data: any;
  fecha = new Date().getTime();
  public user = this.authSvc.afAuth.user;

  constructor(private authSvc: AuthService,
              private actionSvc: ActionsService) { }

  newSendForm = new FormGroup({
    despachador: new FormControl(''),
    fecha: new FormControl(this.fecha, Validators.required),
    unidades: new FormControl('1', Validators.required),
    peso: new FormControl('1', Validators.required)
  });

  get unidadesNoValido() {
    return this.newSendForm.get('unidades').invalid && this.newSendForm.get('unidades').touched;
  }
  get pesoNoValido() {
    return this.newSendForm.get('peso').invalid && this.newSendForm.get('peso').touched;
  }

  ngOnInit(): void {
    this.user.subscribe(usr => {
      this.usuario = usr;
      this.authSvc.userLoginMonitor(this.usuario.uid);
      this.authSvc.userData(this.usuario.uid)
                  .subscribe(res => {
                    this.data = res;
                    this.nombre = this.data[0].nombre;
                  });
    });
  }

  addNewSend(send: Shipping){
    send.despachador = this.nombre;
    this.actionSvc.despachos(send).then(() => {
      Swal.fire(
        'Despachado',
        'Envío cargado satisfactoriamente',
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
