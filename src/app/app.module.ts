import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { MainPageComponent } from './main-page/main-page.component';
import { environment } from '../environments/environment';
import { CheckoutComponent } from './checkout/checkout.component';
import { SearchPipe } from './pipes/search.pipe';
import { ComparisonComponent } from './comparison/comparison.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import {CheckoutGuard} from './guards/checkout.guard';
import {ComparisonGuard} from './guards/comparison.guard';
import { FullSearchPipe } from './pipes/full-search.pipe';

@NgModule({
  imports: [
    RouterModule,
    BrowserModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    RouterModule.forRoot([
      {path: '', component: MainPageComponent},
      {path: 'products', component: ProductListComponent},
      {path: 'products/:productId', component: ProductDetailsComponent},
      {path: 'cart', component: CartComponent},
      {path: 'checkout', component: CheckoutComponent, canActivate: [CheckoutGuard]},
      {path: 'comparison', component: ComparisonComponent, canActivate: [ComparisonGuard]},
      {path: 'login', component: LoginComponent},
    ]),
    FormsModule,
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    ProductListComponent,
    ProductDetailsComponent,
    CartComponent,
    MainPageComponent,
    CheckoutComponent,
    SearchPipe,
    ComparisonComponent,
    LoginComponent,
    UserComponent,
    FullSearchPipe,
  ],
  providers: [
    FullSearchPipe,
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }

