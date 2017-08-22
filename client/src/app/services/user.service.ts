import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/observable';
import  {GLOBAL} from './global';

@Injectable()
export class UserService {

  public url: string;
  public identity;
  public token;

  constructor(private  _http: Http) {
    this.url = GLOBAL.url;
  }

  singUp(userToLogin, getHash = null) {
    if (getHash != null) {
      userToLogin.getHash = getHash;
    }
    let json = JSON.stringify(userToLogin);
    let params = json;

    let headers = new Headers({'Content-Type': 'application/json'});

    return this._http.post(this.url + 'login', params, {headers: headers}).map(res => res.json());
  }

  register(userToRegister) {

    let params = JSON.stringify(userToRegister);
    let headers = new Headers({'Content-Type': 'application/json'});

    return this._http.post(this.url + 'register', params, {headers: headers}).map(res => res.json());
  }

  updateUser(userToUpdate) {

    let params = JSON.stringify(userToUpdate);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });

    return this._http.put(this.url + 'update-user/' + userToUpdate._id, params, {headers: headers})
      .map(res => res.json());
  }

  getIdentity() {
    let identity = JSON.parse(localStorage.getItem('identity'));
    this.identity = null;
    if (identity != "undefined") {
      this.identity = identity;
    }

    return this.identity;
  }

  getToken() {
    let token = localStorage.getItem('token');
    this.token = null;
    if (token != "undefined") {
      this.token = token;
    }

    return this.token;
  }

}
