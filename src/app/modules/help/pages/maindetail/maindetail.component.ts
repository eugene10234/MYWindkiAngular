import { GeocodingService, GpsCoordinate, HelpDTO } from './../../geocoding.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapInfoWindow } from '@angular/google-maps';
import { NavigationEnd, RouterModule } from '@angular/router';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HelpService, HelpClass, HelpRequest } from '../../help.service';
import { GeocodeResponse } from '../../geocoding.service';
import { HelperService } from '../../helper.service';
interface CardPosition {
  top: string;
  left?: string;
  right?: string;
}

@Component({
  selector: 'app-maindetail',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, RouterModule, HttpClientJsonpModule],
  templateUrl: './maindetail.component.html',
  styleUrls: ['./maindetail.component.css'],

})
export class MaindetailComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild(GoogleMap) map!: GoogleMap;


  // 也可以添加一个 getter 来获取所有交通模式
  get travelModes() {
    return {
      DRIVING: google.maps.TravelMode.DRIVING,
      WALKING: google.maps.TravelMode.WALKING,
      BICYCLING: google.maps.TravelMode.BICYCLING,
      TRANSIT: google.maps.TravelMode.TRANSIT
    };
  }

  // 添加一个属性来存储当前选择的交通模式
  currentTravelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING;

  selectedRecordDuration?: string;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  selectedRecordDistance?: number;
  currentContent: string = 'match'; // 默認顯示媒合區
  requestRecords: HelpDTO[] = [];
  loading: boolean = false;
  error: string = '';
  filteredRecords: HelpDTO[] = []; // 過濾後的記錄
  selectedCategory: number | null = null; // 當前選中的類別
  markers: google.maps.LatLngLiteral[] = []; // 用來保存標記列表
  markerTitle: string = "";
  HelpClass: HelpClass[] = [];
  markerDetails: {
    position: google.maps.LatLngLiteral,
    options: google.maps.marker.AdvancedMarkerElementOptions
    helpClassName: string,
    districtName: string,
    name: string
  }[] = [];

  showCardsContainer: boolean = false; // 初始設置為不顯示
  apiLoaded: Observable<boolean>;
  showConfirmCard: boolean = false; // 控制確認卡片的顯示
  confirmCardPosition: CardPosition = { right: '20px', top: '50%' }; // 確認卡片的位置
  selectedRecord: HelpDTO | null = null; // 保存當前選中的記錄

  center: google.maps.LatLngLiteral = {
    lat: 25.0330,
    lng: 121.5654
  };


  options: google.maps.MapOptions = {
    zoom: 12,
    maxZoom: 20,// 改為更大的值，通常 20 就足夠了
    minZoom: 8,
    mapTypeControl: true,
    streetViewControl: true,
    mapId: '715e0643f35b4180',
    scrollwheel: true,  // 啟用滑鼠滾輪縮放
    gestureHandling: 'auto'  // 允許所有手勢操作
  };

  markerPosition: google.maps.LatLngLiteral = {
    lat: 25.0330,
    lng: 121.5654
  };




  constructor(
    httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public helpService: HelpService,
    public GeocodingService: GeocodingService,
    public helperService: HelperService
  ) {
    // 修改 API 載入方式
    this.apiLoaded = httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAVCDcCRj_MRVQmZ9a2afJF8AM1MIdFmLc&libraries=places',
        'callback'
      )
      .pipe(
        map(() => true),
        catchError((err) => {
          console.error('Google Maps API 載入失敗', err);
          return of(false);
        })
      );

    // 添加全局點擊事件監聽
    document.addEventListener('click', (e: MouseEvent) => {
      // 檢查點擊的元素是否在確認卡片內或是標記
      const target = e.target as HTMLElement;
      const isConfirmCard = target.closest('.confirm-card');
      const isMarker = target.closest('.marker-card-container');

      // 如果點擊的不是確認卡片或標記，則隱藏確認卡片
      if (!isConfirmCard && !isMarker) {
        this.hideConfirmCard();
      }
    });
    document.addEventListener('wheel', () => {
      if (this.showConfirmCard) {
        this.hideConfirmCard();
      }
    });


    // 初始化 DirectionsService 和 DirectionsRenderer
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,  // 不顯示 A-B 標記
      polylineOptions: {
        strokeColor: '	#0000C6',      // 路徑顏色
        strokeWeight: 12,             // 路徑寬度
        strokeOpacity: 1,          // 路徑透明度
        geodesic: true,              // 使用大圓路徑

        // icons: [{                    // 添加箭頭圖標
        //     icon: {
        //         path: google.maps.SymbolPath.CIRCLE,
        //         scale: 4,
        //         strokeColor: '	#F9F900',
        //         fillColor: '#F9F900',
        //     },
        //     offset: '100%',
        //     repeat: '200px'
        // }]
      }
    });

  }

  ngOnInit(): void {

    this.loadHelpClasses();
    this.loadHelpRequest();

    this.route.queryParams.subscribe(params => {
      if (params['lat'] && params['lng']) {
        const lat = parseFloat(params['lat']);
        const lng = parseFloat(params['lng']);

        // 更新地圖中心點
        this.center = {
          lat: lat,
          lng: lng
        };
        // 更新標記位置
        this.markerPosition = {
          lat: lat,
          lng: lng
        };
        // 可選：調整縮放級別以更好地顯示位置
        this.options = {
          ...this.options,
          zoom: 15
        };
      }
    });

    // 增加地圖縮放動畫效果
    this.animateMapZoom();


    // 原有的路由事件監聽
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    // 監聽地圖縮放事件
    this.apiLoaded.subscribe(() => {
      this.map?.googleMap?.addListener('zoom_changed', () => {
        // 縮放時直接隱藏確認卡片
        this.hideConfirmCard();
      });
    });
    // 監聽地圖拖動事件
    this.map?.googleMap?.addListener('drag', () => {
      if (this.showConfirmCard && this.selectedRecord) {
        this.updateConfirmCardPosition(this.selectedRecord);
      }
    });

    // 設置 DirectionsRenderer 到地圖上
    this.apiLoaded.subscribe(() => {
      if (this.map?.googleMap) {
        this.directionsRenderer.setMap(this.map.googleMap);
      }
    });
  }
  // 添加更新確認卡片位置的方法
  private updateConfirmCardPosition(record: HelpDTO) {
    if (!record.latitude || !record.longitude) return;

    // 獲取標記在地圖上的像素位置
    const latLng = new google.maps.LatLng(record.latitude, record.longitude);
    const overlayView = new google.maps.OverlayView();

    overlayView.draw = () => { };
    overlayView.setMap(this.map.googleMap!);

    const projection = overlayView.getProjection();
    if (!projection) return;

    const point = projection.fromLatLngToContainerPixel(latLng);
    if (!point) return;

    // 更新確認卡片位置
    // this.confirmCardPosition = {
    //   top: `${point.y}px`,
    //   left: `${point.x - 220}px`  // 220px 是確認卡片的寬度加上一些間距
    // };
  }

  createCurrentLocationMarkerOptions(): google.maps.marker.AdvancedMarkerElementOptions {
    // 創建標記容器
    const markerContainer = document.createElement('div');
    markerContainer.style.display = 'flex';
    markerContainer.style.flexDirection = 'column';
    markerContainer.style.alignItems = 'center';

    // 創建卡片部分（文字顯示）
    const textContainer = document.createElement('div');
    textContainer.style.width = '100px';
    textContainer.style.borderRadius = '8px';
    textContainer.style.backgroundColor = '#D3FF93';
    textContainer.style.border = '2px solid #ddd';
    textContainer.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
    textContainer.style.padding = '8px';
    textContainer.style.fontSize = '16px';
    textContainer.style.fontFamily = 'Arial, sans-serif';
    textContainer.style.display = 'flex';
    textContainer.style.flexDirection = 'column'; // 垂直排列
    textContainer.style.alignItems = 'center';
    textContainer.style.textAlign = 'center';
    textContainer.style.marginBottom = '5px'; // 與圖標的間距
    textContainer.style.color = '#4A4AFF	'; // 統一的字體顏色
    textContainer.style.fontWeight = 'bold'; // 標題文字加粗

    // 創建"目前位置"的文字標示
    const currentPositionText = document.createElement('div');
    currentPositionText.textContent = "目前位置";
    textContainer.appendChild(currentPositionText);

    // 創建圖標部分
    const img = document.createElement('img');
    img.src = 'assets/helping1/images/yourlocation.gif';
    img.alt = 'Marker';
    img.style.width = '70px'; // 調整圖標大小
    img.style.height = '70px';

    // 將卡片部分和圖標部分加入到容器中
    markerContainer.appendChild(textContainer);
    markerContainer.appendChild(img);

    // 返回標記的選項配置
    return {
      content: markerContainer,
      gmpDraggable: false,
    } as google.maps.marker.AdvancedMarkerElementOptions;
  }


  createCardLocationMarkerOptions(helpClassName: string, districtName: string, name: string, record: HelpDTO): google.maps.marker.AdvancedMarkerElementOptions {
    const markerContainer = document.createElement('div');
    markerContainer.className = 'marker-card-container';  // 添加類名以便識別
    markerContainer.style.display = 'flex';
    markerContainer.style.flexDirection = 'column';
    markerContainer.style.alignItems = 'center';

    // 創建卡片容器
    const cardContainer = document.createElement('div');
    cardContainer.className = 'floating-card';
    cardContainer.style.width = '150px';
    cardContainer.style.borderRadius = '12px';
    cardContainer.style.backgroundColor = '#fff';
    cardContainer.style.border = '2px solid #ddd';
    cardContainer.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    cardContainer.style.padding = '10px';
    cardContainer.style.marginBottom = '5px';
    cardContainer.style.display = 'flex';
    cardContainer.style.flexDirection = 'column';
    cardContainer.style.alignItems = 'center';
    cardContainer.style.textAlign = 'center';
    cardContainer.style.cursor = 'pointer';

    // 使用 createElement 而不是 innerHTML
    const titleDiv = document.createElement('div');
    titleDiv.style.marginBottom = '8px';

    const titleH3 = document.createElement('h3');
    titleH3.style.color = '#005757';
    titleH3.style.margin = '0';
    titleH3.style.fontSize = '20px';
    titleH3.style.fontWeight = 'bold';
    titleH3.textContent = helpClassName;

    const infoDiv = document.createElement('div');
    infoDiv.style.display = 'flex';
    infoDiv.style.flexDirection = 'row';
    infoDiv.style.gap = '4px';

    const districtSpan = document.createElement('span');
    districtSpan.style.color = '#4682b4';
    districtSpan.style.fontSize = '20px';
    districtSpan.textContent = districtName;

    const nameSpan = document.createElement('span');
    nameSpan.style.color = '#4682b4';
    nameSpan.style.fontSize = '20px';
    nameSpan.textContent = name;

    // 組裝 DOM 元素
    titleDiv.appendChild(titleH3);
    infoDiv.appendChild(districtSpan);
    infoDiv.appendChild(nameSpan);
    cardContainer.appendChild(titleDiv);
    cardContainer.appendChild(infoDiv);

    // 添加點擊事件處理器
    const handleClick = (e: Event) => {
      e.stopPropagation();

      // 獲取地圖容器
      const mapContainer = document.querySelector('.map-container');
      // 獲取點擊的標記元素
      const markerElement = (e.currentTarget as HTMLElement).closest('.marker-card-container');

      if (markerElement && mapContainer) {
        const markerRect = markerElement.getBoundingClientRect();
        const mapRect = mapContainer.getBoundingClientRect();
        // 如果已經顯示確認卡片且是同一個記錄，則隱藏它
        if (this.showConfirmCard && this.selectedRecord === record) {
          this.hideConfirmCard();
          this.clearRoute();
          return;
        }

        this.selectedRecord = record;
        this.showConfirmCard = true;
        this.updateConfirmCardPosition(record);
        // 繪製新的路徑
        this.drawRoute(record);

        // 設置新的確認卡片位置
        this.confirmCardPosition = {
          top: `${markerRect.top - mapRect.top}px`,
          left: `${markerRect.left - mapRect.left - 220}px`
        };

        // 更新選中的記錄和顯示狀態
        this.selectedRecord = record;
        this.showConfirmCard = true;

        // 計算相對於地圖的位置
        this.confirmCardPosition = {
          top: `${markerRect.top - mapRect.top}px`,
          left: `${markerRect.left - mapRect.left - 220}px`  // 220px 是確認卡片的寬度加上一些間距
        };
        // 計算距離
        if (record.latitude && record.longitude) {
          const distance = this.calculateDistance(
            this.markerPosition.lat,
            this.markerPosition.lng,
            record.latitude,
            record.longitude
          );
          this.selectedRecordDistance = distance;
        }
      }

      this.showConfirmCard = true;
      this.selectedRecord = record;
      // 更新確認卡片位置
      this.updateConfirmCardPosition(record);
    };

    // 將點擊事件綁定到所有元素
    cardContainer.addEventListener('click', handleClick);
    titleDiv.addEventListener('click', handleClick);
    infoDiv.addEventListener('click', handleClick);

    // 創建圖標
    const img = document.createElement('img');
    img.src = 'assets/helping1/images/locate.gif';
    img.alt = 'Marker';
    img.style.width = '90px';
    img.style.height = '90px';
    img.style.cursor = 'pointer';
    img.addEventListener('click', handleClick);

    // 組裝最終容器
    markerContainer.appendChild(cardContainer);
    markerContainer.appendChild(img);

    return {
      content: markerContainer
    };
  }




  // 點擊卡片時調用的程式碼
  handleCardClick(record: HelpDTO) {
    if (record.latitude && record.longitude) {
      const newCenter: google.maps.LatLngLiteral = {
        lat: record.latitude,
        lng: record.longitude
      };

      // 設置地圖中心為點擊的卡片位置
      this.map.panTo(newCenter);

      // 可以選擇性地縮放地圖以更好地查看該位置
      this.map.googleMap!.setZoom(15); // 設置為適合的縮放級別
    }
  }

  // 在 class 中添加新方法來調整地圖邊界
  adjustMapBounds() {
    if (!this.map || this.markers.length === 0) {
      // 如果地圖或標記尚未加載，則不進行任何操作
      return;
    }


    // 創建地圖邊界對象
    const bounds = new google.maps.LatLngBounds();

    // 將目前位置添加到邊界對象
    bounds.extend(this.markerPosition);

    // 將所有其他標記的位置添加到邊界對象
    for (let marker of this.markers) {
      bounds.extend(marker);
    }

    // 使用 fitBounds() 調整地圖以包含所有標記
    this.map.googleMap!.fitBounds(bounds);

    // 設置地圖的中心為目前位置
    this.map.panTo(this.markerPosition);
  }




  // 動畫縮放地圖的方法
  animateMapZoom() {
    let currentZoom = 8; // 從最小縮放級別開始
    const targetZoom = 20; // 目標縮放級別
    const zoomInterval = 80; // 每次縮放的時間間隔，單位毫秒

    const zoomIn = () => {
      if (currentZoom < targetZoom) {
        currentZoom++;
        this.options = {
          ...this.options,
          zoom: currentZoom
        };
        setTimeout(zoomIn, zoomInterval);
      }
    };

    zoomIn();
  }

  navigateToSearch() {
    this.router.navigate(['/help/makesure']);
  }


  loadHelpClasses() {
    this.helpService.getHelpClasses().subscribe({
      next: (data) => {
        this.HelpClass = data;
      },
      error: (error) => {
        console.error('獲取類別失敗:', error);
      }
    });
  }

  // 排序方法
  sortRecords(order: 'asc' | 'desc' = 'desc') {
    this.requestRecords.sort((a, b) => {
      const dateA = new Date(a.createTime || 0);
      const dateB = new Date(b.createTime || 0);
      return order === 'desc'
        ? dateB.getTime() - dateA.getTime()  // 新到舊
        : dateA.getTime() - dateB.getTime(); // 舊到新
    });
  }

  // 載入求助紀錄
  private loadHelpRequest() {
    this.loading = true;
    this.helpService.getAllHelps().subscribe({
      next: (records: HelpDTO[]) => {
        console.log('成功獲取資料:', records); // 添加日誌
        this.requestRecords = records;
        this.filteredRecords = records;
        this.sortRecords('desc'); // 預設排序為新到舊
        setTimeout(() => {
          this.filteredRecords = records; // 使用 setTimeout 延遲初始化以觸發動畫
        }, 100); // 延遲 100ms
        this.loading = false;
        console.log('記錄數量:', this.requestRecords.length);
        console.log('當前顯示內容:', this.currentContent);
      },
      error: (error) => {
        console.error('獲取求助紀錄失敗:', error);
        this.error = `載入資料失敗: ${error.message || '未知錯誤'}`;
        if (error.status === 0) {
          this.error = '無法連接到伺服器，請確認後端服務是否啟動';
        } else if (error.status === 404) {
          this.error = 'API 路徑不存在';
        } else if (error.status === 500) {
          this.error = '伺服器內部錯誤';
        }
        this.loading = false;
      }
    });
  }




  // 根據選擇的類別過濾求助卡片
  filterByCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    this.showCardsContainer = true;

    if (categoryId === -1) {
      this.filteredRecords = this.requestRecords;
      this.markers = [];
    } else {
      this.GeocodingService.getCoordinatesByHelpClassId(categoryId).subscribe({
        next: (results: HelpDTO[]) => {
          this.filteredRecords = results;

          // 更新標記列表
          this.markerDetails = results
            .filter((location: HelpDTO) => location.latitude !== null && location.longitude !== null)
            .map((location: HelpDTO) => {
              const districtName = this.helpService.getDistrictName(location.districtId);
              const helpClassName = this.helpService.getHelpClassName(location.helpClass);

              const position: google.maps.LatLngLiteral = {
                lat: location.latitude!,
                lng: location.longitude!
              };

              // 修改這裡，傳入完整的 location 對象
              return {
                position,
                options: this.createCardLocationMarkerOptions(
                  districtName,
                  helpClassName,
                  location.name,
                  location  // 添加完整的 location 對象
                ),
                helpClassName,
                districtName,
                name: location.name
              };
            });

          this.markers = this.markerDetails.map(detail => detail.position);
          this.adjustMapBounds();
        },
        error: (error) => {
          console.error('獲取 GPS 坐標失敗:', error);
        }
      });
    }
  }



  // 在標記點擊時顯示卡片並繪製路徑
  onMarkerClick(marker: any, record: HelpDTO, event: any) {
    event.stopPropagation();

    // 如果已經顯示確認卡片且是同一個記錄，則隱藏它
    if (this.showConfirmCard && this.selectedRecord === record) {
      this.hideConfirmCard();
      return;
    }

    this.showConfirmCard = true;
    this.selectedRecord = record;

    // 計算距離
    if (record.latitude && record.longitude) {
      const distance = this.calculateDistance(
        this.markerPosition.lat,
        this.markerPosition.lng,
        record.latitude,
        record.longitude
      );
      this.selectedRecordDistance = distance;

      // 繪製路徑
      this.drawRoute(record);
    }

    // 更新確認卡片位置
    this.updateConfirmCardPosition(record);
  }


  // 添加確認和取消的方法
  confirmMatch() {
    if (this.selectedRecord) {
      // 先從helperService中取得helperData的資料
      const helperData = this.helperService.getHelperData();
      // 將selectedRecord返還ID到後端
      const requestHelpData = {
        HelpId: this.selectedRecord.helpId,
        HelperName: helperData.name,
        HelperEmail: helperData.email,

        MatchDateTime: new Date().toISOString(), // 設置當前時間
      };
      this.sendToBackend(requestHelpData);//將ID送回後端
      console.log('確認資料發送:', this.selectedRecord);
      console.log('組合後的資料:', requestHelpData);
    }
    this.hideConfirmCard();
  }

  private sendToBackend(requestHelpData: any) {
  this.helperService.sendMatchData(requestHelpData).subscribe({
    next: (response) => {
      console.log('資料發送成功:', response);
      // 成功後導航到 doneone 頁面
      this.router.navigate(['/help/doneone']).then(() => {
          console.log('導航成功');
      }).catch(err => {
          console.error('導航失敗:', err);
      });
  },
    error: (error) => {
      console.error('資料發送失敗:', error);
    }
  });
  }

  cancelMatch() {
    this.hideConfirmCard();
  }

  hideConfirmCard() {
    this.showConfirmCard = false;
    this.selectedRecord = null;
    this.selectedRecordDistance = undefined;
    this.confirmCardPosition = { top: '0px', left: '0px' };

  }

  //在地圖點擊時同時隱藏兩個卡片
  onMapClick() {
    this.hideConfirmCard();
    this.clearRoute();
  }


  // 添加計算距離的方法
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球半徑，單位是公里
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 距離，單位是公里
    return Math.round(distance * 10) / 10; // 四捨五入到小數點第一位
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }


  // 添加繪製路徑的方法
  private drawRoute(record: HelpDTO) {
    if (!record.latitude || !record.longitude || !this.map?.googleMap) return;

    // 确保 DirectionsRenderer 已设置到地图上
    this.directionsRenderer.setMap(this.map.googleMap);

    const origin = new google.maps.LatLng(
      this.markerPosition.lat,
      this.markerPosition.lng
    );

    const destination = new google.maps.LatLng(
      record.latitude,
      record.longitude
    );

    const request: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: this.currentTravelMode,
      optimizeWaypoints: true,
      provideRouteAlternatives: false
    };

    this.directionsService.route(request, (result, status) => {
      if (status === 'OK' && result) {
        this.directionsRenderer.setDirections(result);
        // 可以在这里添加路径信息的显示，比如距离和时间
        if (result.routes[0] && result.routes[0].legs[0]) {
          const leg = result.routes[0].legs[0];
          this.selectedRecordDistance = this.getDistanceInKm(leg.distance?.value);
          this.selectedRecordDuration = leg.duration?.text; //取得預計時間
          console.log('預計時間:', leg.duration?.text);
          console.log('距離:', leg.distance?.text);
        }
      } else {
        console.error('路徑繪製失敗:', status);
        this.clearRoute();
      }
    });
  }
  // 添加一個輔助方法來轉換距離
  private getDistanceInKm(meters: number | undefined): number {
    if (!meters) return 0;
    return Math.round((meters / 1000) * 10) / 10; // 轉換為公里並保留一位小數
  }
  // 清除路徑的方法
  private clearRoute() {
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#0000C6',
          strokeWeight: 8,
          strokeOpacity: 1,
          geodesic: true
        }
      });
    }
  }

  // 切换交通模式的方法
  changeTravelMode(mode: google.maps.TravelMode) {
    this.currentTravelMode = mode;
    if (this.selectedRecord) {
      // 先清除現有路徑
      this.clearRoute();
      // 重新繪製路徑
      this.drawRoute(this.selectedRecord);
    }
  }

}


