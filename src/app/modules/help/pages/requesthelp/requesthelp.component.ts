import { District, HelpClass, HelpRequest } from './../../help.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from '../../help.service';
import { GeocodingService } from '../../geocoding.service';





@Component({
  selector: 'app-requesthelp',
  templateUrl: './requesthelp.component.html',
  styleUrls: ['./requesthelp.component.css']
})
export class RequesthelpComponent implements OnInit{
  showMainContent: boolean = true;
  selectedDistrictName: string = '';

  formData: HelpRequest= {
    name: '',
    email: '',
    phone: '',
    helpClass: 0,
    helpContent: '',
    address: '',
    points:0,
    status: 0,  // 添加狀態欄位
    createTime: new Date(),  // 添加創建時間
    districtId: 0,
    latitude: 0,
    longitude: 0,
    helpId: 0
  };

  districtclass: District[] = [];
  helpclass: HelpClass[] = [];



  constructor(
    private router: Router,
    private helpService: HelpService,
    private districtService:HelpService,
    private helpClassService:HelpService,
    private geocodingService: GeocodingService
  ){}



  ngOnInit(): void {
    this.loadDistrictClasses();
    this.loadHelpClasses();
  }
  loadDistrictClasses() {
    this.districtService.getDistrictClasses().subscribe({
      next: (data) => {
        this.districtclass = data;
      },
      error: (error) => {
        console.error('獲取類別失敗:', error);
      }
    });
  }


  loadHelpClasses(){
    this.helpClassService.getHelpClasses().subscribe({
      next: (data) => {
        this.helpclass = data;
      },
      error: (error) => {
        console.error('獲取類別失敗:', error);
      }
    });
  }

  toggleContent() {
    this.showMainContent = !this.showMainContent;
  }

   // 檢查必填欄位
   async onSubmit() {
    if (!this.formData.name || !this.formData.email ||
        !this.formData.phone || !this.formData.helpClass ||
        !this.formData.helpContent || !this.formData.address) {
      alert('請填寫所有必填欄位');
      return;
    }
    try {
      // 獲取選中的行政區名稱
      const selectedDistrict = this.districtclass.find(d => d.fDistrictId === +this.formData.districtId);
      if (selectedDistrict) {
        this.selectedDistrictName = selectedDistrict.fDistrict;
      }

      // 組合完整地址
      const fullAddress = `台北市 ${this.selectedDistrictName} ${this.formData.address}`;
      console.log('完整地址:', fullAddress);

      // 呼叫 API 轉換地址為經緯度
      this.geocodingService.getCoordinates(fullAddress).subscribe({
        next: (response) => {
          // 更新表單資料中的經緯度
          this.formData.latitude = response.latitude;
          this.formData.longitude = response.longitude;
          console.log('獲取到的經緯度:', response);

          // 儲存表單資料並導航
          this.helpService.setFormData(this.formData);
          console.log('表單資料:', this.formData);
          this.router.navigate(['/help/requesthelpsure']);
        },
        error: (error) => {
          console.error('地址轉換失敗:', error);
          alert('地址轉換失敗，請檢查地址是否正確');
        }
      });
    } catch (error) {
      console.error('處理表單時發生錯誤:', error);
      alert('處理表單時發生錯誤，請稍後再試');
    }
  }

  // 當選擇行政區時更新選中的行政區名稱
  onDistrictChange(event: any) {
    const selectedDistrict = this.districtclass.find(d => d.fDistrictId === +event.target.value);
    if (selectedDistrict) {
      this.selectedDistrictName = selectedDistrict.fDistrict;
    }
  }
  fillDemoData() {
    this.formData = {
        ...this.formData,  // 保留原有的其他屬性
        name: '李多慧',
        email: 'solarsystem910@gmail.com',
        phone: '0912345678',
        helpClass: 3,
        helpContent: '需要協助搬運一張雙人床從一樓搬到三樓，床好重QQ...時間預計需要30分鐘。',
        address: '建國南路一段275號',
        points: 30,
        districtId: 5,



    };
}
 }




