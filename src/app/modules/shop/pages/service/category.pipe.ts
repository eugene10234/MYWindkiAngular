import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return '幫人';
      case 2:
        return '幫動物';
      case 3:
        return '幫環境';
      case 4:
        return '其他';
      default:
        return '未知';
    }
  }
}
