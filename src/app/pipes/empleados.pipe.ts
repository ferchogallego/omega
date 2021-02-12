import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'empleados'
})
export class EmpleadosPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const empleadoRes = [];
    for (const prdto of value) {
      if ((prdto.documento.toLowerCase().indexOf(arg.toLowerCase()) > -1)
          || (prdto.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1)) {
            empleadoRes.push(prdto);
      }
    }
    return empleadoRes;
  }

}
