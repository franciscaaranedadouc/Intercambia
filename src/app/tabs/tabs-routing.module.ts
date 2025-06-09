import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:[
       {
          path: 'historial',
          loadChildren: () => import('./historial/historial.module').then( m => m.HistorialPageModule)
        },
        {
          path: 'recetas',
          loadChildren: () => import('./recetas/recetas.module').then( m => m.RecetasPageModule)
        },
        {
          path: 'blog',
          loadChildren: () => import('./blog/blog.module').then( m => m.BlogPageModule)
        }, 
        {
          path: '',
          redirectTo: '/tabs/historial',
          pathMatch: 'full'
        }
 
    ]
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
