import { NgModule } from '@angular/core';
import { StreamsComponent } from '../components/streams/streams.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'streams',
    component: StreamsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule {}
