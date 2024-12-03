import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/ProductService';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: []
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  newProduct: any = {};
  editingProduct: any = null;
  errorMessage: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (      data: any[]) => {
        this.products = data;
      },
      (      error: any) => {
        this.errorMessage = '無法加載產品';
        console.error('Error loading products', error);
      }
    );
  }

  addProduct(): void {
    this.productService.addProduct(this.newProduct).subscribe(
      () => {
        this.loadProducts();
        this.newProduct = {};
      },
      (      error: any) => {
        this.errorMessage = '無法新增產品';
        console.error('Error adding product', error);
      }
    );
  }

  editProduct(product: any): void {
    this.editingProduct = { ...product };
  }

  updateProduct(): void {
    this.productService.updateProduct(this.editingProduct).subscribe(
      () => {
        this.loadProducts();
        this.editingProduct = null;
      },
      (      error: any) => {
        this.errorMessage = '無法更新產品';
        console.error('Error updating product', error);
      }
    );
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(
      () => {
        this.loadProducts();
      },
      (      error: any) => {
        this.errorMessage = '無法刪除產品';
        console.error('Error deleting product', error);
      }
    );
  }

  cancelEdit(): void {
    this.editingProduct = null;
  }
}
