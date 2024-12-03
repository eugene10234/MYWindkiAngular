import { DetailComponent } from './modules/shop/pages/detail/detail.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpingComponent } from './modules/template/pages/helping/helping.component';
import { MainpageComponent } from './sharemodules/mainpage/mainpage.component';
import { ShopComponent } from './modules/shop/pages/main/shop.component';import { authGuard } from './login-helper/guard/auth.guard';
 './modules/template/pages/Social/social/index/social.component'
import { CartComponent } from './modules/shop/pages/cart/cart.component';
import { OrderDetailComponent } from './modules/shop/pages/order/order.component';
import { ProductComponent } from './modules/shop/pages/product/ProductComponent';


const routes: Routes = [
  // {
  //   path: 'template',
  //   loadChildren: () =>
  //     import('./modules/template/template.module').then(
  //       (m) => m.TemplateModule
  //     ),
  // },
  {
    path: 'help',
    loadChildren: () => import('./modules/help/help.module').then(m => m.HelpModule)
  },
  {
    path: 'mainpage',component:MainpageComponent
     //loadChildren: () => import('./sharemodules/sharemodules.module').then(m => m.SharemodulesModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./modules/shop/shop.module').then(m => m.ShopModule)
  },
  { path: 'shop', component: ShopComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order',component:OrderDetailComponent},
  { path: '', redirectTo: '/mainpage', pathMatch: 'full' },
  { path: 'detail/:id', component: DetailComponent },
  { path: 'product', component: ProductComponent },

  {
    path: 'social',
    loadChildren: () => import('./modules/social/social.module').then(m => m.SocialModule)
  },
  {
    path: 'member',

    loadChildren: () => import('./modules/member/member.module').then(m => m.MemberModule)
  },
  {
    path:'invest',
    loadChildren:()=>import('./modules/invest/invest.module').then(m =>m.InvestModule)
  },
  {
    path: 'detail',
    component: DetailComponent
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top' // 添加這個設置
    })
  ],
  exports: [RouterModule],

})
export class AppRoutingModule { }
