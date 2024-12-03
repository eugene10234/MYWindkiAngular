import { Component, OnInit } from '@angular/core';
import { TProductService } from '../service/help.shop.service'; // 確保路徑正確
import { CartService } from '../service/cart.service'; // 確保路徑正確


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  public helpShopItems: any[] = []; // 將 helpShopItems 設置為 public
  public filteredItems: any[] = []; // 用於存儲篩選後的商品
  public searchQuery: string = ''; // 用於存儲搜尋查詢
  searchResults: any[] = []; // 用於暫存搜尋結果
  itemsPerPage: number = 12;  // 預設每頁顯示12項
  currentPage: number = 1;    // 當前頁碼
  totalPages: number = 1;     // 總頁數

  // 排序選項枚舉
  readonly SortOptions = {
    PRICE_ASC: 'price_asc',
    PRICE_DESC: 'price_desc',
    NAME_ASC: 'name_asc',
    NAME_DESC: 'name_desc'
  } as const;

  currentSort: string | null = null;

  // 加入追蹤目前分類
  currentCategory: number = 0;

  constructor(
    public tProductService: TProductService,
    public cartService: CartService

  ) { } // 注入 TProductService
  ngOnInit(): void {
    this.tProductService.getTProducts().subscribe(
      (data) => {
        console.log('API data:', data); // 添加日誌檢查 API 資料
        this.helpShopItems = data.map(item => ({
          id: item.fProductId,
          description: item.fDescription,
          name: item.fProductName,
          category: item.fProductCategoryId,
          price: item.fUnitlHelpPoint,
          image: item.fImagePath,
          quantity: 1 // 默認數量為 1
        }));
        this.filteredItems = this.helpShopItems; // 初始化篩選後的商品
        this.calculateTotalPages();
      },
      (error) => {
        console.error('Error fetching help shop items', error);
        if (error.status === 0) {
          console.error('Network error - make sure API is running and CORS is enabled');
        } else {
          console.error(`Backend returned code ${error.status}, body was: ${error.message}`);
        }
      }
    );
  }
  ngOnDestroy(): void {
    this.searchResults = []; // 清空暫存的搜尋結果
    this.filteredItems = this.helpShopItems; // 重置顯示的商品為所有商品
    this.searchQuery = ''; // 清空搜尋查詢
  }

  clearSearchResults(): void {
    this.ngOnDestroy(); // 呼叫 ngOnDestroy 方法來清空搜尋結果
  }

  filterItems(category: number): void {
    this.currentCategory = category;
    if (category === 0) {
      this.filteredItems = this.searchResults.length > 0 ? this.searchResults : this.helpShopItems; // 顯示所有商品或搜尋結果
    } else {
      const itemsToFilter = this.searchResults.length > 0 ? this.searchResults : this.helpShopItems;
      this.filteredItems = itemsToFilter.filter(item => item.category === category);
    }

    // 保持排序狀態
    if (this.currentSort) {
      this.sortProducts(this.currentSort);
    }

    this.currentPage = 1;  // 重置到第一頁
    this.calculateTotalPages();
  }


  addToCart(item: any): void {
    this.cartService.addToCart(item);
    console.log('Item added to cart:', item);
    // 清空該商品的暫存資料
    item.quantity = 1; // 重置數量為 1
    alert('已成功加入購物車');
  }

   searchItems(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredItems = this.helpShopItems; // 如果搜尋查詢為空，顯示所有商品
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredItems = this.helpShopItems.filter(item =>
        item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
      );
    }

    // 保持排序狀態
    if (this.currentSort) {
      this.sortProducts(this.currentSort);
    }

    this.searchQuery = ''; // 清空搜尋欄
    this.currentPage = 1;  // 重置到第一頁
    this.calculateTotalPages();
  }

  // 計算總頁數
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }

  // 當每頁顯示數量改變時
  onItemsPerPageChange() {
    this.currentPage = 1;  // 重置到第一頁
    this.calculateTotalPages();
  }

  // 切換頁面
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // 取得要顯示的頁碼陣列
  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;  // 最多顯示5個頁碼

    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    // 調整起始頁碼
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // 排序方法
  sortProducts(sortOption: string): void {
    this.currentSort = sortOption;

    this.filteredItems.sort((a, b) => {
      switch (sortOption) {
        case this.SortOptions.PRICE_ASC:
          return a.price - b.price;
        case this.SortOptions.PRICE_DESC:
          return b.price - a.price;
        case this.SortOptions.NAME_ASC:
          return a.name.localeCompare(b.name);
        case this.SortOptions.NAME_DESC:
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }

  // 重置排序
  resetSort(): void {
    this.currentSort = null;
    this.filteredItems = [...this.helpShopItems];

    // 如果有搜尋結果，保持搜尋結果
    if (this.searchResults.length > 0) {
      this.filteredItems = [...this.searchResults];
    }

    // 如果有分類篩選，保持分類
    if (this.currentCategory) {
      this.filterItems(this.currentCategory);
    }
  }

  // 取得排序狀態
  isSortActive(sortOption: string): boolean {
    return this.currentSort === sortOption;
  }
}
