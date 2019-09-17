import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { HomeComponent } from './views/home/home.component';
import { ChatDetailComponent } from './views/chat/chat-detail/chat-detail.component';
import { AuthGuard } from '../app/service/authentication/auth.guard';
import {ChatNavComponent} from './views/chat/chat-nav/chat-nav.component';
import { UpfileComponent } from './test/upfile/upfile.component';
const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['login']);
const redirectLoggedInToChat = redirectLoggedInTo(['chat']);

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent},
  { path: 'chats/:id', component: ChatNavComponent, canActivate: [AuthGuard] }
  // {
  //   path:'',redirectTo:'login',pathMatch:'full'
  // },
  // {
  //   path:'login', component: LoginComponent, 
  //   // canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToChat }
  // },
  // {
  //   path:'chat', 
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
