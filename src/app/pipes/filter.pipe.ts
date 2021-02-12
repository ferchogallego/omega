import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultProd = [];
    for (const prdto of value) {
      if ((prdto.factura.toString().indexOf(arg.toString()) > -1)
      || (prdto.documento.toString().indexOf(arg.toString()) > -1)) {
        resultProd.push(prdto);
      }
     }
    return resultProd;
  }

}
