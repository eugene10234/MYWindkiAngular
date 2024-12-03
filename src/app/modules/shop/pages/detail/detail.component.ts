import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TProductService } from '../service/help.shop.service';
import { CartService } from '../service/cart.service';
import { LoginService } from 'src/app/login-helper/services/login.service';
import { JwtPayload } from 'src/app/login-helper/services/interfaces/jwt-payload.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewInit {
  product: any = {};
  isLoggedIn: boolean = false;
  memberId: string = '';
  memberPoints: number = 0;
  private readonly MEMBER_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

  constructor(
    private route: ActivatedRoute,
    private productService: TProductService,
    private cartService: CartService,
    private loginService: LoginService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getTProduct(Number(productId)).subscribe(
        (data) => {
          this.product = data;
          setTimeout(() => this.adjustTitleSize(), 0);
        },
        (error) => {
          console.error('Error fetching product details', error);
        }
      );
    } else {
      console.error('Product ID is null');
    }
    this.checkLoginStatus();
  }

  ngAfterViewInit() {
    this.adjustTitleSize();
    window.addEventListener('resize', () => this.adjustTitleSize());
  }

  adjustTitleSize() {
    const titleElement = document.querySelector('.product-title') as HTMLElement;
    if (!titleElement) return;

    const container = titleElement.parentElement;
    if (!container) return;

    const maxWidth = container.offsetWidth;
    let fontSize = 24;

    titleElement.style.fontSize = `${fontSize}px`;

    while (titleElement.scrollWidth > maxWidth && fontSize > 12) {
      fontSize--;
      titleElement.style.fontSize = `${fontSize}px`;
    }
  }

  checkLoginStatus() {
    const payload = this.loginService.getpayload();
    if (payload) {
      this.isLoggedIn = true;
      this.memberId = payload.UserId;

      console.log('會員已登入');
      console.log('會員ID:', this.memberId);
      console.log('使用者帳號:', payload.UserAccount);
      console.log('使用者類型:', payload.UserType);

      this.getMemberPoints();
    } else {
      console.log('未登入狀態');
    }
  }

  getMemberPoints() {
    if (this.memberId) {
      this.http.get<number>(`https://localhost:7012/api/TPersonMembers/points/person/${this.memberId}`)
        .subscribe({
          next: (points) => {
            this.memberPoints = points;
            console.log('會員點數:', this.memberPoints);
          },
          error: (error) => {
            console.error('獲取點數失敗:', error);
          }
        });
    }
  }

  addToCart(product: any): void {
    const cartItem = {
      category: product.fProductCategoryId,
      description: product.fDescription,
      id: product.fProductId,
      image: product.fImagePath,
      name: product.fProductName,
      price: product.fUnitlHelpPoint,
      quantity: 1
    };
    this.cartService.addToCart(cartItem);
    console.log('Item added to cart:', cartItem);
    product.quantity = 1;
  }

  getCategoryName(categoryId: number): string {
    const categories: { [key: number]: string } = {
      1: '幫人',
      2: '幫動物',
      3: '幫環境',
      4: '幫其他東西'
    };
    return categories[categoryId] || '未分類';
  }

  getSponsorName(sponsorId: number): string {
    const sponsors: { [key: number]: string } = {
      1: '慈濟慈善事業基金會',
      2: '台灣之心愛護動物協會',
      3: '弘道老人福利基金會',
      4: '荒野保護協會',
      5: '中華民國紅十字會',
      6: '台灣世界展望會',
      7: '台灣動物保護協會',
      8: '環境資訊協會',
      9: '伊甸社會福利基金會',
      10: '台灣兒童暨家庭扶助基金會'
    };
    return sponsors[sponsorId] || '未知贊助商';
  }

  getStatusName(status: number): string {
    const statuses: { [key: number]: string } = {
      1: '上架中',
      2: '暫停'
    };
    return statuses[status] || '未知狀態';
  }

}

