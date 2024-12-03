import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return '確認中';
      case 2:
        return '已確認';
      default:
        return '未知狀態';
    }
  }
}
