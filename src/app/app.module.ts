import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AdministradorComponent } from './pages/administrador/administrador.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DespachosComponent } from './pages/despachos/despachos.component';
import { EnviosComponent } from './pages/envios/envios.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { NuevoClienteComponent } from './pages/nuevo-cliente/nuevo-cliente.component';
import { Select2Module } from 'ng-select2-component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { VentasComponent } from './pages/ventas/ventas.component';
import { ListaVentasComponent } from './pages/lista-ventas/lista-ventas.component';
import { FilterPipe } from './pipes/filter.pipe';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { NuevoComponent } from './pages/empleados/nuevo/nuevo.component';
import { EmpleadosPipe } from './pipes/empleados.pipe';
import { CrearComponent } from './pages/sucursales/crear/crear.component';
import { EmpresaComponent } from './pages/empresa/empresa.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VendedorComponent } from './pages/vendedor/vendedor.component';
import { VentaSucursalComponent } from './pages/venta-sucursal/venta-sucursal.component';
import { EntradaComponent } from './pages/entrada/entrada.component';
import { DistribucionComponent } from './pages/distribucion/distribucion.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { PedidosSucursalComponent } from './pages/pedidos-sucursal/pedidos-sucursal.component';
import { EntregasSucComponent } from './pages/entregas-suc/entregas-suc.component';
import { PedidosAdminComponent } from './pages/pedidos-admin/pedidos-admin.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { CorteComponent } from './pages/corte/corte.component';
import { NewProdComponent } from './pages/new-prod/new-prod.component';
import { NovedadesComponent } from './pages/novedades/novedades.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { EditarProductoComponent } from './pages/editar-producto/editar-producto.component';
import { PedidosAlimentadorComponent } from './pages/pedidos-alimentador/pedidos-alimentador.component';
import { NovedadesSecursalesComponent } from './pages/novedades-secursales/novedades-secursales.component';
import { HistorialCorteComponent } from './pages/historial-corte/historial-corte.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    AdministradorComponent,
    NavbarComponent,
    DespachosComponent,
    EnviosComponent,
    ProductosComponent,
    ClientesComponent,
    NuevoClienteComponent,
    VentasComponent,
    ListaVentasComponent,
    FilterPipe,
    DetalleComponent,
    UsuariosComponent,
    NuevoComponent,
    EmpleadosPipe,
    CrearComponent,
    EmpresaComponent,
    RegistroComponent,
    VendedorComponent,
    VentaSucursalComponent,
    EntradaComponent,
    DistribucionComponent,
    HistorialComponent,
    PedidosSucursalComponent,
    EntregasSucComponent,
    PedidosAdminComponent,
    ComprasComponent,
    CorteComponent,
    NewProdComponent,
    NovedadesComponent,
    PerfilComponent,
    EditarProductoComponent,
    PedidosAlimentadorComponent,
    NovedadesSecursalesComponent,
    HistorialCorteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    Select2Module,
    NgxBarcodeModule
  ],
  providers: [
    AngularFireAuth
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
