// Social Module
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';


// PrimeNG Modules
import { CardModule } from 'primeng/card';

import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
// Components
// import { SocialComponent } from '../social/pages/index/social.component';
import { FinancialService } from '../social/pages/services/financial.service';
import { SharemodulesModule } from '../../sharemodules/sharemodules.module';
import { MainComponent } from './pages/main/main.component';
import { PersonComponent } from './pages/person/person.component';
import { MessageComponent } from './pages/message/message.component';
import { SignalRService } from './pages/services/signalr.service';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'person', component: PersonComponent },
  { path: 'message', component: MessageComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: 'main' },
];

@NgModule({
  declarations: [
    // SocialComponent,
    MainComponent,
    PersonComponent,
    MessageComponent,
    SearchComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    // 共用模組
    CommonModule,
    FormsModule,
    // PrimeNG 模組
    CardModule,
    ButtonModule,
    BadgeModule,
    RippleModule,
    AvatarModule,
    InputTextModule,
    CarouselModule,
    HttpClientModule,
    // 共用模組
    SharemodulesModule,
    PickerModule,
    DialogModule,
    InputTextareaModule,
    ButtonModule,
    TableModule,
    ChartModule
  ],
  exports: [RouterModule],
  providers: [
    // 服務
    FinancialService,
    SignalRService,
  ],
})
export class SocialModule {}
