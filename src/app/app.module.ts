import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './authentication/login/login.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HomeComponent } from './views/home/home.component';
import { ChatDetailComponent } from './views/chat/chat-detail/chat-detail.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChatModule } from './views/chat/chat.module';
import { ScrollableDirective } from './service/scrollable.directive';
import { UpfileComponent } from './test/upfile/upfile.component';
import { DropZoneDirective } from './test/drop-zone.directive';
import { FileSizePipe } from './test/file-size.pipe';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ScrollableDirective,
    UpfileComponent,
    DropZoneDirective,
    FileSizePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ChatModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
