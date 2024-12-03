import { HelpClass, HelpRequest } from './../../help.service';
import { Component, OnInit,ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from '../../help.service';
import { GeocodingService } from '../../geocoding.service';
import { HelperService ,HelperRequest} from '../../helper.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('contentSection') contentSection!: ElementRef;
  @HostListener('window:scroll', ['$event'])
  formData: HelpRequest = {
    name: '',
    email: '',
    phone: '',
    helpClass: 0,
    helpContent: '',
    address: '',
    points: 0,
    status: 0, // 添加狀態欄位
    createTime: new Date(), // 添加創建時間
    districtId: 0,
    latitude: 0,
    longitude: 0,
    helpId: 0
  };

  helperData: HelperRequest = {
    name: '',
    email: ''
  };

  constructor(
    private router: Router,  // 通过构造函数注入 Router
    private helpClassService: HelpService,
    private geocodingService: GeocodingService, // 注入 GeocodingService
    private helperService: HelperService
  ) { }

  // 滾動到內容區域
  scrollToContent(event: Event) {
    event.preventDefault();
    this.contentSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
//視差效果
  onWindowScroll() {
    const scrollPosition = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section') as HTMLElement;

    if (heroSection) {
      // 調整背景位置
      heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;

      // 添加模糊效果
      const blur = Math.min(scrollPosition / 200, 30); // 最大模糊 5px
      const scale = 1 + scrollPosition / 2000; // 緩慢放大效果
      heroSection.style.transform = `scale(${scale})`;
      heroSection.style.filter = `brightness(0.9) contrast(1.1) saturate(1.2) blur(${blur}px)`;
    }
  }
  //
  navigateToSearch() {
    this.router.navigate(['/help/maindetail'], {
      queryParams: {
        lat: this.formData.latitude,
        lng: this.formData.longitude
      }
    });
  }

  id: string = '測試1';
  HelpClass: HelpClass[] = [];

  ngOnInit(): void {
    this.loadHelpClasses();
  }

  loadHelpClasses() {
    this.helpClassService.getHelpClasses().subscribe({
      next: (data) => {
        this.HelpClass = data;
      },
      error: (error) => {
        console.error('獲取類別失敗:', error);
      }
    });
  }

  // 添加表單驗證邏輯
  isFormValid(): boolean {
    // 假設 name, email, phone, helpClass, address 是必填欄位
    if (
      !this.formData.name ||
      !this.formData.email ||
      !this.formData.phone ||
      !this.formData.helpClass ||
      !this.formData.address
    ) {
      return false;
    }
    return true;
  }

  // 修改為非同步方法
  async executeActions() {
    // if (!this.isFormValid()) {
    //   alert('請填寫所有欄位');
    //   return;
    // }

    try {
      // 等待地理編碼完成
      await this.convertAddressToGPS(this.formData.address);
      // 將helperData設置到helperService中
      this.helperService.setHelperData(this.helperData);
      // 地理編碼成功後再導航
      this.navigateToSearch();
    }
    catch
    (error) {
      console.error('執行動作時發生錯誤:', error);
      alert(`發生錯誤: ${error}`); // 提示用戶錯誤訊息
    }
  }

  // 自動取得位置
  getCurrentLocation(locationInput: HTMLInputElement) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        locationInput.value = `${position.coords.latitude}, ${position.coords.longitude}`;
        this.formData.address = locationInput.value; // 更新 formData.address
      }, (error) => {
        console.error('取得位置失敗:', error);
        alert('無法取得目前位置，請檢查定位權限');
      });
    } else {
      alert('此瀏覽器不支援地理位置功能');
    }
  }

  // 將地址轉換為 GPS 座標
  convertAddressToGPS(location: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!location) {
        reject('請輸入地址');
        return;
      }

      // 改進經緯度格式的判斷
      const coordinatePattern = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;

      if (coordinatePattern.test(location)) {
        // 當輸入符合經緯度格式時，直接解析並設置緯度和經度
        const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
        this.formData.latitude = lat;
        this.formData.longitude = lng;
        console.log('使用現在位置取得的經緯度:', lat, lng);
        resolve();
      } else {
        // 當輸入為中文地址時，調用地理編碼服務
        this.geocodingService.getCoordinates(location).subscribe({
          next: (data) => {
            if (data.latitude && data.longitude) {
              this.formData.latitude = data.latitude;
              this.formData.longitude = data.longitude;
              console.log('經由地理編碼取得的經緯度:', data.latitude, data.longitude);
              resolve();
            } else {
              reject('無法找到對應的經緯度資訊');
            }
          },
          error: (error) => {
            console.error('地理編碼錯誤:', error);
            reject('無法轉換地址');
          }
        });
      }
    });
  }
  fillDemoData() {
    this.formData.address = '台北市中正區重慶南路一段3號';
    this.helperData = {
      name: '葉仲仁',
      email: 'loveyoubabe@gmail.com'
    };
  }
}
