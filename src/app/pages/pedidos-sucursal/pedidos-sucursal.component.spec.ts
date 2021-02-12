import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosSucursalComponent } from './pedidos-sucursal.component';

describe('PedidosSucursalComponent', () => {
  let component: PedidosSucursalComponent;
  let fixture: ComponentFixture<PedidosSucursalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosSucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
