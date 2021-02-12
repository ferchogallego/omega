import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {
  rps = false;
  mls = false;
  dir = false;
  tel = false;
  img = false;
  nit = false;
  tax = false;
  cst = false;
  newImag: any;
  empresa: any;
  imagen: any;
  direccion: string;
  telefono: string;
  representante: string;
  email: string;
  consecutivo: any;
  imp: number;
  incremento: number;
  gerente: string;
  correoel: string;
  location: string;
  contacto: string;
  empresaNit: string;
  idEmp: string;
  percent: number;
  consec: number;
  constructor(private empresaSvc: EmpresaService) { }

  ngOnInit(): void {
    this.empresaSvc.cargarDatosEmpresa().subscribe(res => {
      this.empresa = res;
      this.imagen = this.empresa.imagen;
      this.direccion = this.empresa.direccion;
      this.telefono = this.empresa.telefono;
      this.representante = this.empresa.representante;
      this.email = this.empresa.email;
      this.idEmp = this.empresa.nit;
    });

    this.empresaSvc.cargarIvaConsecutivo().subscribe(res => {
      this.consecutivo = res;
      this.incremento = this.consecutivo.factura;
      this.imp = this.consecutivo.impuesto;
    });
  }

  enableImg(){
    this.img = true;
  }

  handleImage(event: any){
    this.newImag = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      this.imagen = reader.result;
    };
    reader.readAsDataURL(this.newImag);
  }

  udptImage(){
    this.empresaSvc.actualizarImagenEmpresa(this.imagen);
  }

  enableNit(){
    this.nit = true;
  }

  updateNit(){
    if (this.empresaNit) {
      this.empresaSvc.actualizarNit(this.empresaNit);
      this.nit = false;
    } else {
      Swal.fire(
        'Error',
        'Ingrese el Nit y luego presione actualizar',
        'question'
      );
    }
  }

  changeNit(event){
    this.empresaNit = event;
  }

  enableRps(){
    this.rps = true;
  }

  updateRps(){
    if (this.gerente) {
      this.empresaSvc.actualizarRepresentante(this.gerente);
      this.rps = false;
    } else {
      Swal.fire(
        'Error',
        'Ingrese el nombre completo y luego presione actualizar',
        'question'
      );
    }
  }
  manager(event){
    this.gerente = event;
  }

  enableCorreo(){
    this.mls = true;
  }

  updateCorreo(){
    if (this.correoel) {
      this.empresaSvc.actualizarCorreo(this.correoel);
      this.mls = false;
    } else {
      Swal.fire(
        'Error',
        'Ingrese el correo electrónico y luego presione actualizar',
        'question'
      );
    }
  }

  correo(event){
    this.correoel = event;
  }

  enableDireccion(){
    this.dir = true;
  }

  updateDireccion(){
    if (this.location) {
      this.empresaSvc.actualizarDireccion(this.location);
      this.dir = false;
    } else {
      Swal.fire(
        'Error',
        'Ingrese el correo la dirección y luego presione actualizar',
        'question'
      );
    }
  }

  address(event){
    this.location = event;
  }

  enableTelefono(){
    this.tel = true;
  }

  updateTelefono(){
    if (this.contacto) {
      this.empresaSvc.actualizarTelefono(this.contacto);
      this.tel = false;
    } else {
      Swal.fire(
        'Error',
        'Ingrese el correo teléfono y luego presione actualizar',
        'question'
      );
    }
  }

  phone(event){
    this.contacto = event;
  }

  enableIva(){
    this.tax = true;
  }

  updateIva(){
    let prct = 0;
    prct = Number(this.percent);
    if (prct) {
      this.empresaSvc.actualizarIva(prct);
      this.tax = false;
    } else {
      Swal.fire(
        'Error',
        'Ingrese el porcentaje y luego presione actualizar',
        'question'
      );
    }
  }

  iva(event){
    this.percent = event;
  }

  enableBill(){
    this.cst = true;
  }

  updateBill(){
    let fct = 0;
    fct = Number(this.consec);
    if (fct) {
      this.empresaSvc.actualizarConsecutivo(fct);
      this.cst = false;
    } else {
      Swal.fire(
        'Error',
        'Ingrese el consecutivo y luego presione actualizar',
        'question'
      );
    }
  }

  bill(event){
    this.consec = event;
  }

}
