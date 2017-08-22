import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from "./models/user";
import {UserService} from './services/user.service';
import {GLOBAL} from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit() {
    this._userService.singUp(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if (!this.identity._id) {
          alert("NO indetificado");
        } else {
          localStorage.setItem('identity', JSON.stringify(identity));

          this._userService.singUp(this.user, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;

              if (this.token.length <= 0) {
                alert("NO indetificado");
              } else {
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }
            },
            error => {
              var errorMessage = <any>error;
              if (errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
        }
      }
    );
  }

  public logOut() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
  }

  public onSubmitRegister() {
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if (!user._id) {
          this.alertRegister = "error en registro";
        } else {
          this.alertRegister = "Regsitro correcto " + this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
        }
      }
    )
  }
}
