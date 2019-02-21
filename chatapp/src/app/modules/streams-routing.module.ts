import { NgModule } from '@angular/core';
import { StreamsComponent } from '../components/streams/streams.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  {
    path: 'streams',
    component: StreamsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule {}
