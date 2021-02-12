import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AdministradorComponent } from './pages/administrador/administrador.component';
import { DespachosComponent } from './pages/despachos/despachos.component';
import { EnviosComponent } from './pages/envios/envios.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { NuevoClienteComponent } from './pages/nuevo-cliente/nuevo-cliente.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { ListaVentasComponent } from './pages/lista-ventas/lista-ventas.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { NuevoComponent } from './pages/empleados/nuevo/nuevo.component';
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


const routes: Routes = [
  { path: 'home', component: InicioComponent},
  { path: 'administrador', component: AdministradorComponent},
  { path: 'venta', component: VentasComponent},
  { path: 'lista', component: ListaVentasComponent},
  { path: 'despachos', component: DespachosComponent},
  { path: 'envios', component: EnviosComponent},
  { path: 'productos', component: ProductosComponent},
  { path: 'clientes', component: ClientesComponent},
  { path: 'agregar', component: NuevoClienteComponent},
  { path: 'detalle/:id', component: DetalleComponent},
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'nuevoEmpleado', component: NuevoComponent},
  { path: 'sucursales', component: CrearComponent},
  { path: 'empresa', component: EmpresaComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'vendedor', component: VendedorComponent},
  { path: 'ventas-suc', component: VentaSucursalComponent},
  { path: 'entrada', component: EntradaComponent},
  { path: 'distribucion', component: DistribucionComponent},
  { path: 'historial', component: HistorialComponent},
  { path: 'pedidosSucursal', component: PedidosSucursalComponent},
  { path: 'entregaSucursal', component: EntregasSucComponent},
  { path: 'pedidosAdmin', component: PedidosAdminComponent},
  { path: 'pedidosAlimentador', component: PedidosAlimentadorComponent},
  { path: 'compras', component: ComprasComponent},
  { path: 'corte', component: CorteComponent},
  { path: 'productos', component: ProductosComponent},
  { path: 'nuevoProducto', component: NewProdComponent},
  { path: 'novedades', component: NovedadesComponent},
  { path: 'novedadeSuc', component: NovedadesSecursalesComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'HistorialCorte', component: HistorialCorteComponent},
  { path: 'editar/:id', component: EditarProductoComponent},
  { path: '**', pathMatch: 'full', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
