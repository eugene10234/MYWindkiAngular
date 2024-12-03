import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../service/ordercheck';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/login-helper/services/login.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartService } from '../service/cart.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-order-detail',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: any;
  orderDetails: any[] = [];
  errorMessage: string = '';
  memberId: string = '';
  orders: any[] = [];
  startDate: string = '';
  endDate: string = '';
  originalOrders: any[] = [];
  showHistoryForm: boolean = false;
  expandedOrderId: string | null = null;
  isMemberLoggedIn: boolean = false;
  orderCount: number = 0;
  selectedOrderId: string | null = null;
  isNewestFirst: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private loginService: LoginService,
    private http: HttpClient,
    private cartService: CartService
  ) {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.startDate = lastMonth.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const payload = this.loginService.getpayload();
    if (payload && payload.UserId) {
      this.memberId = payload.UserId;
      this.isMemberLoggedIn = true;
      this.getMemberDetails(this.memberId);
    } else {
      this.isMemberLoggedIn = false;
    }
  }

  getMemberDetails(memberId: string): void {
    const apiUrl = `https://localhost:7012/api/TPersonMembers/${memberId}`;
    this.http.get<{ fMemberId: string }>(apiUrl).subscribe(
      (response) => {
        this.memberId = response.fMemberId;
        this.getOrdersByMemberId(this.memberId);
      },
      (error) => {
        console.error('Error fetching member details:', error);
        this.errorMessage = '無法取得會員資料';
      }
    );
  }

  getOrdersByMemberId(fMemberId: string): void {
    const apiUrl = `https://localhost:7012/api/TOrder/byPersonSid/${fMemberId}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.orders = response.sort((a, b) =>
          this.isNewestFirst
            ? new Date(b.fOrderTime).getTime() - new Date(a.fOrderTime).getTime()
            : new Date(a.fOrderTime).getTime() - new Date(b.fOrderTime).getTime()
        );
        this.orderCount = this.orders.length;
        this.originalOrders = [...this.orders];
      },
      (error) => {
        console.error('Error fetching orders:', error);
        this.errorMessage = '無法取得訂單資料';
      }
    );
  }

  toggleHistoryForm(): void {
    this.showHistoryForm = !this.showHistoryForm;
    if (this.showHistoryForm) {

    }
  }


  loadProductNames(): void {
    this.orderDetails.forEach(detail => {
      this.orderService.getProductById(detail.fProductId).subscribe(
        (product) => {
          detail.productName = product.fProductName;
          detail.productId = product.fProductId; // 儲存產品 ID 以便導航
        },
        (error) => {
          console.error('Error fetching product details', error);
        }
      );
    });
  }

  viewOrderDetails(orderId: string): void {
    if (this.selectedOrderId === orderId) {
      this.selectedOrderId = null;
      this.orderDetails = [];
      return;
    }

    this.orderService.getOrderDetailsByOrderId(orderId).subscribe(
      ([order, orderDetails]) => {
        if (order && orderDetails) {
          this.order = order;
          this.orderDetails = orderDetails;
          this.selectedOrderId = orderId;
          this.loadProductNames();
          this.errorMessage = '';
        } else {
          this.errorMessage = '無法獲取訂單詳細資訊';
        }
      },
      (error) => {
        this.errorMessage = '查無歷史訂單明細';
        console.error('Error fetching order details:', error);
        this.selectedOrderId = null;
        this.orderDetails = [];
      }
    );
  }

  searchByDateRange(): void {
    if (!this.startDate || !this.endDate) {
      this.errorMessage = '請選擇完整的日期範圍';
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    end.setHours(23, 59, 59);

    if (start > end) {
      this.errorMessage = '開始日期不能大於結束日期';
      return;
    }

    this.orders = this.originalOrders.filter(order => {
      const orderDate = new Date(order.fOrderTime);
      return orderDate >= start && orderDate <= end;
    }).sort((a, b) =>
      new Date(b.fOrderTime).getTime() - new Date(a.fOrderTime).getTime()
    );

    if (this.orders.length === 0) {
      this.errorMessage = '該日期範圍內無訂單記錄';
    } else {
      this.errorMessage = '';
    }

    // 存儲用戶的選擇
    sessionStorage.setItem('startDate', this.startDate);
    sessionStorage.setItem('endDate', this.endDate);
  }

  loadMemberOrders(): void {
    this.orderService.getOrdersByPersonSid(this.memberId).subscribe(
      (orders) => {
        if (Array.isArray(orders)) {
          this.orders = orders;
          this.originalOrders = orders;
          this.searchByDateRange();
          this.errorMessage = '';
        } else {
          this.errorMessage = '查無歷史訂單';
        }
      },
      (error) => {
        this.errorMessage = '查無歷史訂單';
        console.error('Error loading orders', error);
      }
    );
  }

  resetSearch(): void {
    this.startDate = '';
    this.endDate = '';
    this.ngOnInit();
  }

  openLoginForm(): void {
    this.loginService.toggleLoginForm(true);
  }

  toggleSort(): void {
    this.isNewestFirst = !this.isNewestFirst;
    this.orders = this.orders.reverse();
    this.originalOrders = this.originalOrders.reverse();
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

}
