import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../service/cart.service';
import { OrderService } from '../service/OrderService';
import { LoginService } from 'src/app/login-helper/services/login.service';
import { MemberService } from '../service/member.service';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  total: number;
}

interface OrderData {
  fPersonSId: string;
  fTotalHelpPoint: number;
  fStatus: number;
  fOrderTime: string;
  fExecStatus: number;
  originalTotal: number;
  usedPoints: number;
  finalTotal: number;
}

// 狀態常數
const ORDER_STATUS = {
  CONFIRMING: 1,
  CONFIRMED: 2,
  COMPLETED: 3
} as const;

const EXEC_STATUS = {
  PENDING: 1,
  PROCESSING: 2,
  SUCCESS: 3,
  ISSUE: 4
} as const;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  // 購物車相關
  cartItems: CartItem[] = [];
  finalTotal: number = 0;

  // 會員相關
  userId: string = '';
  userAccount: string = '';
  memberMId: string = '';
  userPoint: number = 0;
  isMemberLoggedIn: boolean = false;

  // 訂單相關
  orderSuccess: boolean = false;
  orderDetails: any = null;
  errorMessage: string = '';

  // 對話框相關
  showConfirmDialog: boolean = false;

  private subscriptions = new Subscription();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private memberService: MemberService,
    private loginService: LoginService
  ) {
    const payload = this.loginService.getpayload();
    this.userId = payload?.UserId || '';
    this.userAccount = payload?.UserAccount || '';
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // 初始化方法
  private async initializeComponent(): Promise<void> {
    this.loadCartItems();
    this.checkLoginStatus();
    await this.loadMemberData();
    this.loadMemberPoints();

  }

  // 載入會員資料
  private async loadMemberData(): Promise<void> {
    try {
      const memberData = await this.memberService.getMemberByUserId(this.userId).toPromise();
      this.memberMId = memberData.fMemberId;
    } catch (error) {
      console.error('獲取會員資料失敗:', error);
    }
  }

  // 購物車相關方法
  loadCartItems(): void {
    try {
      this.cartItems = this.cartService.getCartItems() || [];
    } catch (error) {
      console.error('Error loading cart items:', error);
      this.cartItems = [];
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  updateQuantity(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuantity = parseInt(input.value, 10);

    // 確保數量不小於 0
    if (newQuantity < 0) {
      alert('數量不得小於 0'); // 提示用戶
      // 恢復為原始數量
      input.value = this.cartItems[index].quantity.toString(); // 恢復輸入框的值
      return; // 不更新數量
    }

    // 更新數量
    this.cartItems[index].quantity = newQuantity;
    this.calculateFinalTotal(); // 重新計算總點數
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
    this.updateCart();
  }

  private updateCart(): void {
    sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateFinalTotal();
  }

  // 會員相關方法
  private checkLoginStatus(): void {
    const payload = this.loginService.getpayload();
    this.isMemberLoggedIn = Boolean(payload?.UserId);
    if (!this.isMemberLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  loadMemberPoints(): void {
    this.orderService.getMemberByPersonSId('M0000000003').subscribe({
      next: (response) => {
        this.userPoint = response.fTotalHelpPoint;
        this.calculateFinalTotal();
      },
      error: (error) => console.error('Failed to load points:', error)
    });
  }

  // 結帳相關方法
  checkout(): void {
    if (this.validateCheckout()) {
      this.showConfirmDialog = true;
    }
  }

  confirmCheckout(): void {
    this.showConfirmDialog = false;
    this.processOrder();
  }

  cancelCheckout(): void {
    this.showConfirmDialog = false;
  }

  private validateCheckout(): boolean {
    if (!this.isMemberLoggedIn) {
      this.errorMessage = '請先登入';
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.cartItems.length) {
      this.errorMessage = '購物車是空的';
      return false;
    }

    return true;
  }

  private processOrder(): void {
    const orderData = this.createOrderData();

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => this.handleOrderSuccess(response),
      error: (error) => this.handleOrderError(error)
    });
  }

  private createOrderData(): OrderData {
    const date = new Date();
    date.setHours(date.getHours() + 8);

    return {
      fPersonSId: this.memberMId,
      fTotalHelpPoint: this.getTotal(),
      fStatus: 1,
      fOrderTime: date.toISOString(),
      fExecStatus: 1,
      originalTotal: this.getTotal(),
      usedPoints: this.userPoint,
      finalTotal: this.finalTotal
    };
  }

  private async handleOrderSuccess(response: any): Promise<void> {
    try {
      await this.saveOrderDetails(response.fOrderId);
      this.completeOrder(response);
    } catch (error) {
      console.error('訂單明細儲存失敗', error);
      this.errorMessage = '訂單明細儲存失敗，請稍後再試';
    }
  }

  private async saveOrderDetails(orderId: string): Promise<void> {
    const savePromises = this.cartItems.map(item =>
      this.orderService.createOrderDetail({
        fOrderDetailId: 0,
        fOrderId: orderId,
        fProductId: item.id,
        fAmount: item.quantity,
        fHelpPoint: item.price
      }).toPromise()
    );

    await Promise.all(savePromises);
  }

  private completeOrder(orderResponse: any): void {
    this.orderSuccess = true;
    this.orderDetails = orderResponse;
    this.cartItems = [];
    sessionStorage.removeItem('cartItems');
    this.cartService.clearCart();
    this.loadMemberPoints();
  }

  private handleOrderError(error: any): void {
    console.error('訂單建立失敗', error);
    this.errorMessage = '訂單建立失敗，請稍後再試';
  }

  // 輔助方法
  calculateFinalTotal() {
    this.finalTotal = this.cartItems.reduce((total, item) => {
      // 確保 item.price 不小於 0
      const price = item.price < 0 ? 0 : item.price; // 如果小於 0，則設為 0
      return total + (price * item.quantity); // 計算總點數
    }, 0);
  }

  getOrderStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      [ORDER_STATUS.CONFIRMING]: '確認中',
      [ORDER_STATUS.CONFIRMED]: '已確認',
      [ORDER_STATUS.COMPLETED]: '已完成'
    };
    return statusMap[status] || '未知狀態';
  }

  getExecStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      [EXEC_STATUS.PENDING]: '未執行',
      [EXEC_STATUS.PROCESSING]: '執行中',
      [EXEC_STATUS.SUCCESS]: '執行成功!',
      [EXEC_STATUS.ISSUE]: '執行有狀況待回報'
    };
    return statusMap[status] || '未知狀態';
  }

  goToShop(): void {
    this.router.navigate(['/shop']);
  }
}
