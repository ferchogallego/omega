import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasSucComponent } from './entregas-suc.component';

describe('EntregasSucComponent', () => {
  let component: EntregasSucComponent;
  let fixture: ComponentFixture<EntregasSucComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntregasSucComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregasSucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
