import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { ChatNavComponent } from './chat-nav/chat-nav.component';



@NgModule({
  declarations: [ChatNavComponent],
  imports: [
    CommonModule
  ]
})
export class ChatModule { }
