import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaSucursalComponent } from './venta-sucursal.component';

describe('VentaSucursalComponent', () => {
  let component: VentaSucursalComponent;
  let fixture: ComponentFixture<VentaSucursalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaSucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
