import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { userComponent } from './user/user.component';
import { AuthService } from './core/auth/auth.service';
import { AuthGuard } from './core/auth/auth.guard';
import { TokenInterceptorService } from './core/auth/token-interceptor.service';
import { AdminService } from './admin/admin.service';
import { DeveloperService } from './developer/developer.service';
import { UserService } from './user/user.service';
import { developerEditComponent } from './developer/developer-register/developer-edit.component';
import { userRegisterComponent } from './user/user-register/user-register.component';
import { LoadingPipe } from './loading.pipe';

const components = [
  AppComponent,
  LoginComponent,
  AdminComponent,
  DeveloperService,
  UserService,
  userComponent,
  developerEditComponent,
  userRegisterComponent,
];

const pipes = [
  LoadingPipe
];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbTooltipModule
  ],
  providers: [ AuthService, AuthGuard, SearchService, AdminService, DeveloperService, UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
