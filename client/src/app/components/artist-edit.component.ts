import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {Artist} from "../models/artist";
import {error} from "util";

@Component({
  selector: 'artist-edit',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService]
})

export class ArtistEditComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public token;
  public errorMessage;
  public url: string;
  public is_edit;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _userService: UserService,
              private _artistService: ArtistService) {
    this.titulo = 'Crear nuevo artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('', '', '');
    this.is_edit = true;
  }

  ngOnInit() {
    this.getArtist();
  }

  getArtist() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      console.log(id);
      this._artistService.getArtist(this.token, id).subscribe(
        response => {
          if (!response.artist) {
            this._router.navigate(['/']);
          } else {
            this.errorMessage = 'Insertado correctamente';
            this.artist = response.artist;
          }
        }, error => {
          var errorMessage = <any>error;
          if (errorMessage != null) {
            var body = JSON.parse(error._body);
            this.errorMessage = body.message;
          }
        }
      )
    });
  }

  ngOnSubmit() {
    this._artistService.addArtist(this.token, this.artist).subscribe(
      response => {
        if (!response.artist) {
        } else {
          this.errorMessage = 'Insertado correctamente';
          this.artist = response.artist;
        }
      }, error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
        }
      }
    )
  }
}
