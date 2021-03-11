import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";

import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl   : string = environment.baseUrl;
  private _usuario! : Usuario;

  get usuario(){
    return { ...this._usuario };
  }

  constructor( private http : HttpClient ) { }

  registro( name : string, email : string, password : string){
    const url : string = `${this.baseUrl}/auth/new`;
    const body = { name, email, password}
    return this.http.post<AuthResponse>( url, body )
    .pipe(
      tap( resp => {
        if ( resp.ok ) {
          localStorage.setItem('token', resp.token! )
          this._usuario = {
            name: resp.name!,
            uid: resp.uid!
          }
        }     
      }),
      map( resp => resp.ok ), //responsemos unicamente el valor booleano del ok
      catchError( err => of(err.error.msg) ) //capturamos el error enviado desde el backend
    );
  }

  login(email: string, password: string){
    const url : string = `${this.baseUrl}/auth`;
    const body = { email, password}

    return this.http.post<AuthResponse>( url, body )
    .pipe(
      tap( resp => {
        if ( resp.ok ) {
          localStorage.setItem('token', resp.token! )
          this._usuario = {
            name: resp.name!,
            uid: resp.uid!
          }
        }     
      }),
      map( resp => resp.ok ),
      catchError( err => of(err.error.msg) ) //capturamos el error enviado desde el backend
    );
  }

  validarToken(): Observable<boolean>{

    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders()
        .set('x-token', localStorage.getItem('token') || '');

    // return this.http.get( url, { headers : headers } );
    return this.http.get<AuthResponse>( url, { headers } )
                    .pipe(
                      map( resp => {
                        console.log(resp.token);                        
                        localStorage.setItem('token', resp.token! )
                        this._usuario = {
                          name: resp.name!,
                          uid: resp.uid!
                        }
                        return resp.ok;
                      }),
                      catchError( err => of(false) )
                    )

  }

  logout(){
    // localStorage.removeItem('token');
    localStorage.clear();
  }
}
