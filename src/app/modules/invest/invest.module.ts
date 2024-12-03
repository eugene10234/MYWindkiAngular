import { WandkifooterComponent } from './../../sharemodules/footer/wandkifooter/wandkifooter.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // 用於支援 [(ngModel)] 雙向綁定
import { HttpClientModule } from '@angular/common/http';

import { GeneralInvestComponent } from './general-invest/general-invest.component';
import { InvestmentReportComponent } from './investment-report/investment-report.component';
import { WandkinavbarComponent } from 'src/app/sharemodules/navbar/wandkinavbar/wandkinavbar.component';
import { Router, Routes } from '@angular/router';
import { TBroker } from './Models/tbroker.module';
import { MarketDataService } from './services/market-data.service';
import { MarketInfoComponent } from './market-info/market-info.component';
import { StockQuoteComponent } from './stock-quote/stock-quote.component';
import { TestComponent } from './test/test.component';
import { SimilateOrderComponent } from './similate-order/similate-order.component';
import { StockInventoryComponent } from './stock-inventory/stock-inventory.component';
import { TranRecordComponent } from './tran-record/tran-record.component';
import { MarketIndexComponent } from './market-index/market-index.component';

const routes: Routes = [
  { path: 'general-invest', component: GeneralInvestComponent },
  { path: 'invest-report', component: InvestmentReportComponent },
  {path:'market-info', component: MarketInfoComponent},
  {path:'stock-quote', component: StockQuoteComponent},
  {path:'test', component: TestComponent},
  {path:'similate-order', component: SimilateOrderComponent},
  {path:'stock-inventory', component: StockInventoryComponent},
  {path:'tran-record', component:TranRecordComponent},
  {path:'market-index', component:MarketIndexComponent}

];


@NgModule({
  declarations: [

    GeneralInvestComponent,
    MarketInfoComponent,
    StockQuoteComponent,
    TestComponent,
    SimilateOrderComponent,
    StockInventoryComponent,
    TranRecordComponent,
    MarketIndexComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    //InvestRoutingModule  // 若此模組有專屬路由模組，則需匯入
  ]
})
export class InvestModule { }
