import { ProductService } from './pages/service/ProductService';
import { ProductComponent } from './pages/product/ProductComponent';
import { CartComponent } from './pages/cart/cart.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharemodulesModule } from 'src/app/sharemodules/sharemodules.module';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ShopComponent } from './pages/main/shop.component';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { CategoryPipe } from './pages/service/category.pipe';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from './pages/detail/detail.component';
import { OrderService } from './pages/service/ordercheck';
import { OrderDetailComponent } from './pages/order/order.component';
import { AppComponent } from 'src/app/app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderStatusPipe } from './pipes/order-status.pipe';
import { ExecStatusPipe } from './pipes/exec-status.pipe';
import { authGuard } from 'src/app/login-helper/guard/auth.guard';
import { HttpClientModule } from '@angular/common/http';



const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'cart', component: ShopComponent },
  { path: 'detail', component: DetailComponent},
  { path: 'order', component: OrderDetailComponent,
    canActivate: [authGuard]
  },
  { path: 'order-detail/:orderId', component: OrderDetailComponent }

];
@NgModule({
  declarations: [
   ShopComponent,
   CartComponent,
  CategoryPipe,
  OrderDetailComponent,
  ProductComponent,
  OrderStatusPipe,
  ExecStatusPipe
  ],
  imports: [
    RouterModule.forChild(routes),
    SharemodulesModule,
    CommonModule,
    FormsModule,
    [NgbPaginationModule, NgbAlertModule],
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [RouterModule],
  providers: [CurrencyPipe,OrderService,ProductService],
  bootstrap: [AppComponent],
})
export class ShopModule { }
