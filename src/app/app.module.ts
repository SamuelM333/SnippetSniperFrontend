// Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Plugins
import { AceEditorComponent } from 'ng2-ace-editor';
import { MaterializeDirective } from 'angular2-materialize';
import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { NgUploaderModule } from 'ngx-uploader';

// Routes
import { ROUTING } from './app.routing';

// Services
import { ApiService } from './api.service';

// Components
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FloatingNavComponent } from './homepage/floating-nav/floating-nav.component';
import { NavComponent } from './shared/nav/nav.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SlidesComponent } from './homepage/slides/slides.component';
import { SignUpComponent } from './profile/sign-up/sign-up.component';
import { LoginComponent } from './profile/login/login.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { SnippetEditorComponent } from './snippets/snippet-editor/snippet-editor.component';
import { SnippetViewerComponent } from './snippets/snippet-viewer/snippet-viewer.component';
import { PublicSnippetsComponent } from './snippets/public-snippets/public-snippets.component';
import { BusyLoaderComponent } from './shared/busy-loader/busy-loader.component';
import { MySnippetsComponent } from './profile/user-profile/my-snippets/my-snippets.component';
import { SharedWithMeComponent } from './profile/user-profile/shared-with-me/shared-with-me.component';
import { MyAccountComponent } from './profile/user-profile/my-account/my-account.component';
import { AdminPanelComponent } from './profile/user-profile/admin-panel/admin-panel.component';
import { SnippetsListComponent } from './snippets/snippets-list/snippets-list.component';
import { PublicProfileComponent } from './profile/public-profile/public-profile.component';
import { SupportedLanguagesComponent } from './homepage/supported-languages/supported-languages.component';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        DragulaModule,
        NgUploaderModule,
        ROUTING
    ],
    declarations: [
        AppComponent,
        MaterializeDirective,
        AceEditorComponent,
        MarkdownToHtmlPipe,
        HomepageComponent,
        FloatingNavComponent,
        NavComponent,
        FooterComponent,
        SlidesComponent,
        SignUpComponent,
        LoginComponent,
        UserProfileComponent,
        SnippetEditorComponent,
        SnippetViewerComponent,
        PublicSnippetsComponent,
        BusyLoaderComponent,
        MySnippetsComponent,
        SharedWithMeComponent,
        MyAccountComponent,
        AdminPanelComponent,
        SnippetsListComponent,
        PublicProfileComponent,
        SupportedLanguagesComponent,

    ],
    providers: [ApiService, DragulaService],
    bootstrap: [AppComponent]
})
export class AppModule { }
