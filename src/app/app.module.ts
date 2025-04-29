import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageInputComponent } from './components/message-input/message-input.component';

import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { ScrollToBottomDirective } from './directives/scroll-to-bottom.directive';
import { RouterModule, RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [
    // AppComponent,
    // LoginComponent,
    // ChatRoomComponent,
    // MessageListComponent,
    // MessageInputComponent,
    // TimeAgoPipe,
    // ScrollToBottomDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterOutlet,

    AppComponent,
    LoginComponent,
    ChatRoomComponent,
    MessageListComponent,
    MessageInputComponent,
    TimeAgoPipe,
    ScrollToBottomDirective
  ],
  providers: [],
  // bootstrap: [AppComponent]
})
export class AppModule { }