import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosAlimentadorComponent } from './pedidos-alimentador.component';

describe('PedidosAlimentadorComponent', () => {
  let component: PedidosAlimentadorComponent;
  let fixture: ComponentFixture<PedidosAlimentadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosAlimentadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosAlimentadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
