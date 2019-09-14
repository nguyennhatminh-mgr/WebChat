import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { ChatNavComponent } from './chat-nav/chat-nav.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ChatListComponent } from './chat-list/chat-list.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ChatNavComponent,ChatDetailComponent, ChatListComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule
  ]
})
export class ChatModule { }
