import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  reg = false;
  verificar = true;
  user: any;
  nombre: string;
  correo: string;
  registrado: string;
  idUser: string;
  constructor(private authSvc: AuthService,
              private router: Router) { }
  registerForm = new FormGroup ({
    pass: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  get passwordNoValido() {
    return this.registerForm.get('password').invalid && this.registerForm.get('password').touched;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  verfica(event: string){
    if (this.verificar) {
      this.subscription.add(
        this.authSvc.userVerify(event).subscribe (res => {
          if (res.length > 0) {
            this.user = res;
            this.nombre = this.user[0].nombre;
            this.correo = this.user[0].email;
            this.registrado = this.user[0].registrado;
            this.idUser = this.user[0].id;
            if (this.registrado === 'No') {
              this.reg = true;
            } else {
              Swal.fire(
                'Usuario ya se encuentra resitrado en sistema',
                'Comuníquese con el administrador',
                'question'
              );
              this.router.navigate(['/home']);
            }
          } else {
            Swal.fire(
              'No se encuentra el número de cédula',
              'Aún no ha sido activado en sistema',
              'error'
            );
          }
        })
      );
    }
  }

  crearPass(passw: string){
    if (passw.length < 8) {
      Swal.fire(
        'Contraseña inválida',
        'Debe ingresar una contraseña de mínimo 8 caracteres',
        'error'
      );
    } else {
      this.verificar = false;
      const user = this.authSvc.register(this.correo, passw);
      if (user) {
          user.then(usr => {
            const idSist = usr.user.uid;
            this.authSvc.confirmarRegistroUsuario(this.idUser, idSist);
            Swal.fire(
              'Registrado',
              'Puedes iniciar sesión',
              'success'
            );
          });
      }
      this.router.navigate(['/home']);
    }
  }
}
