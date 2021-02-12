import { EmpleadosPipe } from './empleados.pipe';

describe('EmpleadosPipe', () => {
  it('create an instance', () => {
    const pipe = new EmpleadosPipe();
    expect(pipe).toBeTruthy();
  });
});
