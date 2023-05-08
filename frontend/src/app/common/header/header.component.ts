import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CartService } from 'src/app/user/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  isAuth:Boolean = false
  Uname:string=''
  usermail:string = ''
  cartItemLen:number
  currentUserRole:string = ""
  cartSubscription: Subscription
  authSubscription:Subscription
  constructor(private cartService:CartService, private authService: AuthService) { }
  ngOnDestroy(): void {
    if(this.cartSubscription)this.cartSubscription.unsubscribe()

    this.authSubscription.unsubscribe()
  }


  ngOnInit(): void {
    const { isAuthenticated,Uname, usermail, currentUserRole}= this.authService.getAuthdetails()
    this.usermail = usermail
    this.Uname=Uname
    this.currentUserRole = currentUserRole
      this.isAuth = isAuthenticated

      this.addCartSubscription();
    
    this.authSubscription = this.authService.getAuthSubject()
    .subscribe(result=>{
      this.usermail = result.usermail
      this.Uname=result.Uname
      this.currentUserRole = result.currentUserRole
      this.isAuth = result.isAuthenticated
      this.addCartSubscription()
    })

  }
  private addCartSubscription() {
    if (this.cartSubscription)
      this.cartSubscription.unsubscribe();

    if (this.currentUserRole == "user") {
      // console.log('inner subscription called');

      this.cartSubscription = this.cartService.getCartUpdate().
        subscribe(result => {
          this.cartItemLen = result.cartItemLength;
        });
    }
  }

  logout(){
    this.authService.logoutUser()
  }

}
