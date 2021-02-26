import { Injectable } from '@angular/core';
import { finalize, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Shipping } from '../shared/despacho.interface';
import { Enter } from '../shared/ingreso.interface';
import { FileI } from '../shared/file.interface';
import { Producto } from '../shared/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private filePath: any;
  private downloadURL: string;
  usuario: string;
  idSucursal: string;
  sedeSeleccionada: string;
  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage) { }

  despachos(despacho: Shipping){
    return this.db.collection('despachos').add(despacho);
  }

  entradas(entra: Enter){
    return this.db.collection('entradas').add(entra);
  }

  verDespachos(){
    return this.db.collection('despachos', ref => ref
                  .where('estado', '==', 'Enviado'))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                       const data = resp.payload.doc.data() as any;
                       const id = resp.payload.doc.id;
                       return {id, ...data};
                     }))
                  );
  }

  verTodosDespachos(){
    return this.db.collection('despachos')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                       const data = resp.payload.doc.data() as any;
                       const id = resp.payload.doc.id;
                       return {id, ...data};
                     }))
                  );
  }

  despachosRecibidos(idPed: string){
    return this.db.collection('despachos').doc(idPed).update({estado: 'Recibido'});
  }

  verCatalogo(){
    return this.db.collection('productos')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                       const data = resp.payload.doc.data() as any;
                       const id = resp.payload.doc.id;
                       return {id, ...data};
                     }))
                  );
  }
  verCatalogoBySucursal(sucursal: string){
    return this.db.collection('inventarioSuc').doc(sucursal)
                  .collection('productosSuc')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                       const data = resp.payload.doc.data() as any;
                       const id = resp.payload.doc.id;
                       return {id, ...data};
                     }))
                  );
  }
  invoice(){
    return this.db.collection('consecutivo').doc('3GWxx2XGbS90in8FNXFN').valueChanges();
  }
  cargarPedido(order: any){
    return this.db.collection('carShop').add(order);
  }

  comprasFactura(refer: string){
    return this.db.collection('carShop/', ref => ref
                  .where('refCompra', '==', refer)
                  .where('estado', '==', 'Pendiente'))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  actualizaInventarioCompra(idProd: string, cant: number){
    return this.db.collection('productos').doc(idProd).update({
      cantidad: cant
    });
  }

  actualizaInventarioCorte(idProd: string, cant: number, fecha: any, cortador: string){
    return this.db.collection('productos').doc(idProd).update({
      cantidad: cant,
      actualizado: fecha,
      operario: cortador
    });
  }

  guardarInventarioCorte(corte: any){
    return this.db.collection('corte').add(corte);
  }

  actualizaInventarioSuc(sucursal: string, idProd: string, cant: number){
    return this.db.collection('inventarioSuc')
                  .doc(sucursal)
                  .collection('productosSuc')
                  .doc(idProd)
                  .update({
                    cantidad: cant
                  });
  }

  borrarProductoCompra(id: string){
    return this.db.collection('carShop').doc(id).delete();
  }

  cargarInventarioProducto(id: string){
    return this.db.collection('productos').doc(id).valueChanges();
  }
  cargarInventarioProductoSuc(sucursal: string, id: string){
    return this.db.collection('inventarioSuc')
                  .doc(sucursal)
                  .collection('productosSuc')
                  .doc(id)
                  .valueChanges();
  }

  cargarInventarioSucursal(sucursal: string){
    return this.db.collection('inventarioSuc')
                  .doc(sucursal)
                  .collection('productosSuc')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  cargarDataCliente(idClient: string){
    return this.db.collection('clientes').doc(idClient).valueChanges();
  }

  facturar(sale: any){
    return this.db.collection('facturas').add(sale);
  }
  actualizaConsecutivo(ftra: number){
    return this.db.collection('consecutivo').doc('3GWxx2XGbS90in8FNXFN').update({
      factura: ftra
    });
  }
  listaFacturas(){
    return this.db.collection('facturas/')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  listaFacturasCanceladas(){
    return this.db.collection('facturas/', ref => ref
                  .where('estado', '==', 'Cancelada'))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  listaFacturasCredito(){
    return this.db.collection('facturas/', ref => ref
                  .where('tipoCompra', '==', 'credito'))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  listaFacturasContado(){
    return this.db.collection('facturas/', ref => ref
                  .where('tipoCompra', '==', 'contado'))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  cancelarFacturaById(idFactura: string){
    return this.db.collection('facturas').doc(idFactura).update({
      estado: 'Cancelada'
    });
  }

  cargarDetalleFactura(idFactura: string){
    return this.db.collection('facturas').doc(idFactura).valueChanges();
  }

  datosCliente(idCliente){
    return this.db.collection('clientes').doc(idCliente).valueChanges();
  }

  cargarProductosFactura(refer: any){
    return this.db.collection('carShop/', ref => ref
                  .where('refCompra', '==', refer))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  listaClientes(){
    return this.db.collection('clientes')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  sendProductsPoints(distribucion: any){
    return this.db.collection('distribucion').add(distribucion);
  }

  sendSucursalOrder(pedido: any){
    return this.db.collection('pedidos').add(pedido);
  }

  loadDistributionList(){
    return this.db.collection('distribucion')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  loadDistributionById(idDist: string){
    return this.db.collection('distribucion')
                  .doc(idDist)
                  .valueChanges();
  }
  loadEntryProducts(){
    return this.db.collection('entradas')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  loadDistributionBySucursal(sucursal: string){
    return this.db.collection('distribucion', ref => ref
                  .where('sucursal', '==', sucursal)
                  .where('estado', '==', 'Pendiente'))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  crearColleccionPrueba(sucursal: string, prodId: string){
    return this.db.collection('inventarioSuc')
                  .doc(sucursal)
                  .collection('productosSuc')
                  .doc(prodId)
                  .valueChanges();
  }

  updateProductSucursal(sucursal: string, prodId: string, cantProd: number){
    return this.db.collection('inventarioSuc')
                  .doc(sucursal)
                  .collection('productosSuc')
                  .doc(prodId)
                  .update({
                    cantidad: cantProd
                  });
  }
  viewStateDistribution(idDist: string, prod: string, idProd: string){
    return this.db.collection('distribucion')
                  .doc(idDist)
                  .valueChanges();
  }

  updateStateProdDist(idDist: string, prods: any){
    return this.db.collection('distribucion')
                  .doc(idDist)
                  .update({productos: prods});
  }
  updateNoteByDist(idDist: string, note: string){
    return this.db.collection('distribucion')
                  .doc(idDist)
                  .update({novedad: note});
  }

  changeStateDistributionList(idDist: string){
    return this.db.collection('distribucion').doc(idDist).update({estado: 'Entregado'});
  }

  cargarPedidosAdministrador(){
    return this.db.collection('pedidos', ref => ref
                  .where('estado', '==', 'Pendiente'))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }
  cargarPedidosAlimentador(){
    return this.db.collection('pedidos', ref => ref
                  .where('estado', '==', 'Aceptado'))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }
  cargarPedidosAdministradorTodos(){
    return this.db.collection('pedidos')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  cargarPedidosPorSucursal(sucursal: string){
    return this.db.collection('pedidos', ref => ref
                  .where('estado', '==', 'Pendiente')
                  .where('sucursal', '==', sucursal))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  crearCompraCentral(compra: any){
    return this.db.collection('compras').add(compra);
  }

  cargarCompras(){
    return this.db.collection('compras')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  borrarCompra(idCompra: string){
    return this.db.collection('compras').doc(idCompra).delete();
  }

  aceptarPedidoAdmin(idPedido: string){
    return this.db.collection('pedidos').doc(idPedido).update({estado: 'Aceptado'});
  }

  aceptarPedidoAlimentador(idPedido: string){
    return this.db.collection('pedidos').doc(idPedido).update({estado: 'Enviado'});
  }

  updateProductById(producto: Producto, newImage?: FileI){
    if (newImage) {
      this.uploadImage(producto, newImage);
    } else {
      return this.db.collection('productos').doc(producto.id).update(producto);
    }
  }

  filterProd(producto: Producto, image: FileI){
    this.uploadImage(producto, image);
  }

  private uploadImage(producto: Producto, image: FileI){
    this.filePath = `productos/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          this.downloadURL = urlImage;
          this.agregarProductos(producto);
        });
      })
    ).subscribe();
 }

  agregarProductos(producto: Producto){
    const prodObj = {
      nombre: producto.nombre,
      codigo: producto.codigo,
      precio: producto.precio,
      cantidad: producto.cantidad,
      actualizado: producto.actualizado,
      imagen: this.downloadURL,
      fileRef: this.filePath,
    };
    if (producto.id) {
      return this.db.collection('productos').doc(producto.id).update(prodObj);
    } else {
      return this.db.collection('productos').add(prodObj);
    }
  }

  updateProducSucursaltById(sucursal: string, producto: Producto, newImage?: FileI){
    if (newImage) {
      this.uploadImageSucursal(sucursal, producto, newImage);
    } else {
      return this.db.collection('inventarioSuc')
                    .doc(sucursal)
                    .collection('productosSuc')
                    .doc(producto.id)
                    .update(producto);
    }
  }
  private uploadImageSucursal(sucursal: string, producto: Producto, image: FileI){
    this.filePath = `productos/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          this.downloadURL = urlImage;
          this.agregarProductoSucursales(producto, sucursal);
        });
      })
    ).subscribe();
 }

  agregarProductoSucursales(producto: Producto, sucursal: string){
    const prodObj = {
      nombre: producto.nombre,
      codigo: producto.codigo,
      precio: producto.precio,
      cantidad: producto.cantidad,
      actualizado: producto.actualizado,
      imagen: this.downloadURL,
      fileRef: this.filePath,
    };
    if (producto.id) {
      return this.db.collection('inventarioSuc').doc(sucursal)
                    .collection('productosSuc')
                    .doc(producto.id)
                    .update(prodObj);
    } else {
      return this.db.collection('inventarioSuc').doc(sucursal)
                    .collection('productosSuc')
                    .add(prodObj);
    }
  }

  cargarNovedades(idlist: string, novedad: string, suc: string){
    const prodNvd = {
      idDistribucion: idlist,
      note: novedad,
      sucursal: suc,
      estado: 'Enviada',
      fecha: new Date().getTime()
    };
    return this.db.collection('novedades').add(prodNvd);
  }

  seleccionarProductoCreado(producto: string){
    return this.db.collection('productos', ref => ref
                  .where('nombre', '==', producto))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  eliminarProductoPorId(idProd: string){
    return this.db.collection('productos').doc(idProd).delete();
  }

  eliminarProductoPorIdSucursal(sucursal: string, idProd: string){
    return this.db.collection('inventarioSuc')
                  .doc(sucursal)
                  .collection('productosSuc')
                  .doc(idProd)
                  .delete();
  }

  actualizarEncargadoSucursal(idSuc: string, nuevoEnc: string){
    return this.db.collection('sucursales').doc(idSuc).update({encargado: nuevoEnc});
  }

  cantidadNovedades(){
    return this.db.collection('novedades', ref => ref
                  .where('estado', '==', 'Enviada'))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }
  cantidadDespachos(){
    return this.db.collection('despachos', ref => ref
                  .where('estado', '==', 'Enviado'))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }
  novedadesSucursal(suc: string){
    return this.db.collection('novedades', ref => ref
                  .where('sucursal', '==', suc))
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

  gestionarNovedarPorId(idNov: string){
    return this.db.collection('novedades').doc(idNov).update({estado: 'Gestionado'});
  }

  rechazarNovedarPorId(idNov: string){
    return this.db.collection('novedades').doc(idNov).update({estado: 'Rechazado'});
  }

  verProductoPorIdCentral(idProd: string){
    return this.db.collection('productos').doc(idProd).valueChanges();
  }

  verProductoPorIdSucursal(sucursal: string, idProd: string){
    return this.db.collection('inventarioSuc')
                  .doc(sucursal)
                  .collection('productosSuc')
                  .doc(idProd)
                  .valueChanges();
  }

  cargarListadoCargaInventarioCorte(){
    return this.db.collection('corte')
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                     actions.map(resp => {
                     const data = resp.payload.doc.data() as any;
                     const id = resp.payload.doc.id;
                     return {id, ...data};
                     }))
                    );
  }

}
