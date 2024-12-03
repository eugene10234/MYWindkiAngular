import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from 'src/app/login-helper/services/login.service';
import { CartService } from 'src/app/modules/shop/pages/service/cart.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navlog',
  templateUrl: './navlog.component.html',
  styleUrls: ['./navlog.component.css']
})
export class NavlogComponent implements OnInit, OnDestroy {
  islogin: boolean = false;
  userName: string = 'Eugene';//使用者名稱
  cartItemCount: number = 0;
  memberPoints: number = 0;
  private cartItemCountSubscription!: Subscription;

  constructor(
    private loginService: LoginService,
    private cartService: CartService,
    private http: HttpClient
  ) {
    this.loginService.loginstatus$.subscribe(status => {
      this.islogin = status;
      if (status) {
        const payload = this.loginService.getpayload();
        this.userName = payload?.UserAccount ?? '使用者名稱';
        if (payload?.UserId) {
          this.getMemberPoints(payload.UserId);
        }
      } else {
        this.userName = '使用者名稱';
        this.memberPoints = 0;
      }
    });
  }

  getMemberPoints(userId: string) {
    this.http.get<number>(`https://localhost:7012/api/TPersonMembers/points/person/${userId}`)
      .subscribe({
        next: (points) => {
          this.memberPoints = points;
          console.log('會員點數:', points);
        },
        error: (error) => {
          console.error('獲取點數失敗:', error);
        }
      });
  }

  ngOnInit(): void {
    this.cartItemCountSubscription = this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
      console.log('Cart item count:', this.cartItemCount);
    });
  }

  ngOnDestroy(): void {
    if (this.cartItemCountSubscription) {
      this.cartItemCountSubscription.unsubscribe();
    }
  }

  openLoginpopup() {
    this.loginService.toggleLoginForm(true);
  }

  navloglogout() {
    this.loginService.JWTLogout();
  }
}
