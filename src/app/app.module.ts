import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TableComponent} from './table/table.component';
import {DataEmojisService} from './data-emojis.service';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {NotFoundComponent} from './not-found/not-found.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {HeaderComponent} from './header/header.component';
import {StorageServiceModule} from 'angular-webstorage-service';
import {EmojiFilterPipe} from './emoji-filter.pipe';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        TableComponent,
        NotFoundComponent,
        SidebarComponent,
        HeaderComponent,
        EmojiFilterPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ScrollingModule,
        AppRoutingModule,
        StorageServiceModule,
        FormsModule
    ],
    providers: [DataEmojisService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
