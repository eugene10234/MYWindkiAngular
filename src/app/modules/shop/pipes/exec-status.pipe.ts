import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'execStatus'
})
export class ExecStatusPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return '未執行';
      case 2:
        return '執行中';
      case 3:
        return '已完成';
      default:
        return '未知狀態';
    }
  }
}
