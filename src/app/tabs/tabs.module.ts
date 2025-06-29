//src/app/tabs/tabs.module.ts

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { CompanyNameComponent } from '../company-name/company-name.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    CompanyNameComponent
  ],
  declarations: [TabsPage]
})
export class TabsModule {}
