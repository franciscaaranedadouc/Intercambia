import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogPage } from './blog.page';

const routes: Routes = [
  {
    path: '',
    component: BlogPage
  },
  {
    path: 'image-viewer',
    loadChildren: () => import('./image-viewer/image-viewer.module').then( m => m.ImageViewerPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogPageRoutingModule {}
