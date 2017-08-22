import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {Artist} from "../models/artist";
import {error} from "util";

@Component({
  selector: 'artist-add',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public token;
  public errorMessage;
  public url: string;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _userService: UserService,
              private _artistService: ArtistService) {
    this.titulo = 'Crear nuevo artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('', '', '');
  }

  ngOnInit() {

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
