import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})

export class InicioComponent implements OnInit {

  passwordView = false;

  usuario: any;
  tipo: any;

  loginForm = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  get emailNoValido() {
    return this.loginForm.get('email').invalid && this.loginForm.get('email').touched;
  }
  get passwordNoValido() {
    return this.loginForm.get('password').invalid && this.loginForm.get('password').touched;
  }

  constructor(private authSvc: AuthService,
              private router: Router) { }

  ngOnInit(): void {}

  onLogin(){
    const {email, password } = this.loginForm.value;
    try {
      const user = this.authSvc.login(email, password);
      if (user) {
        // this.onLoginRedirect();
        user.then(usr => {
          this.usuario = usr.user.uid;
          this.authSvc.userData(this.usuario)
                      .subscribe(res => {
                        this.tipo = res;
                        console.log(this.tipo);
                        if (this.tipo) {
                          if (this.tipo[0].rol === 'admin') {
                            this.router.navigate(['/administrador']);
                          }
                          if (this.tipo[0].rol === 'Vendedor') {
                            this.router.navigate(['/vendedor']);
                          }
                          if (this.tipo[0].rol === 'despachador') {
                            this.router.navigate(['/despachos']);
                          }
                          if (this.tipo[0].rol === 'Alimentador') {
                            this.router.navigate(['/entrada']);
                          }
                          if (this.tipo[0].rol === 'Cortador') {
                            this.router.navigate(['/corte']);
                          }
                          if (this.tipo[0].rol === 'especial') {
                            this.router.navigate(['/remisiones']);
                          }
                        } else {
                          Swal.fire({
                            title: 'Error...',
                            text: 'Usuario no registra permisos',
                            icon: 'error',
                            allowOutsideClick: false,
                            showCloseButton: true
                          });
                        }
                      });
        }).catch(err => {
          Swal.fire({
            title: 'Error...',
            text: 'Email o contraseña inválidos',
            icon: 'error',
            allowOutsideClick: false,
            showCloseButton: true
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  viewPassActive(){
    this.passwordView = true;
    console.log(this.passwordView);
  }

  viewPassInActive(){
    this.passwordView = false;
    console.log(this.passwordView);
  }
}
