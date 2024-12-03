import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: any[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCartItems();
    this.updateCartItemCount();
  }

  private loadCartItems(): void {
    const storedItems = sessionStorage.getItem('cartItems');
    this.items = storedItems ? JSON.parse(storedItems) : [];
  }



  addToCart(product: any): void {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      total: product.price
    };

    // 檢查商品是否已存在於購物車中
    const existingItemIndex = this.items.findIndex(item => item.id === product.id);

    if (existingItemIndex !== -1) {
      // 如果商品已存在，增加數量
      this.items[existingItemIndex].quantity += 1;
      this.items[existingItemIndex].total =
        this.items[existingItemIndex].quantity * this.items[existingItemIndex].price;
    } else {
      // 如果商品不存在，新增到購物車
      this.items.push(cartItem);
    }

    // 更新 sessionStorage
    sessionStorage.setItem('cartItems', JSON.stringify(this.items));

    // 更新購物車數量
    this.updateCartItemCount();
  }

  private updateCartItemCount(): void {
    const count = this.items.reduce((total, item) => total + item.quantity, 0);
    this.cartItemCount.next(count);
  }

  getCartItemCount(): BehaviorSubject<number> {
    return this.cartItemCount;
  }

  getCartItems(): CartItem[] {
    return this.items;
  }


  removeItem(index: number): void {
    this.items.splice(index, 1);
    sessionStorage.setItem('cartItems', JSON.stringify(this.items)); // 更新 sessionStorage
    this.updateCartItemCount();
  }

  clearCart(): void {
    this.items = [];
    sessionStorage.removeItem('cartItems'); // 清空 sessionStorage 中的購物車資料
    this.updateCartItemCount();
  }

}
