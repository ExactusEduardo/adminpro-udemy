import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

import Swal from 'sweetalert2';

import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIO } from '../../config/config';

import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor( public http: HttpClient,
               public router: Router,
               public _subirArchivoService: SubirArchivoService  ) {
    console.log('Servicio de usuario listo');
    this.cargarStorage();
  }
  renuevaToken() {
    let url = URL_SERVICIO + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get( url )
              .pipe(
                map( ( resp: any ) => {
                  this.token = resp.token;
                  localStorage.setItem('token', this.token );
                  console.log('Token renovado');
                  return true;
                }),
                catchError(err =>  {
                  console.error('statusCode', err.status);
                  this.router.navigate(['/login']);
                  Swal.fire({
                    icon: 'error',
                    title: 'No se pudo renovar el token',
                    text: 'No fue posible renovar el token'
                  });
                  return throwError(err.error);
                })
              );
  }
  estaLogueado() {
    return ( this.token.length > 5) ? true : false;
  }
  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = null;
    }
  }
  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {
    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    localStorage.setItem('menu', JSON.stringify(menu) );

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }
  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }
  loginGoogle( token: string ) {
    let url = URL_SERVICIO + '/login/google';
    return this.http.post( url, { token: token })
              .pipe(
                map( ( resp: any ) => {
                  this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
                  console.log(resp);
                  return true;
                })
              );
  }

  login( usuario: Usuario, recordar: boolean = false ) {
    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    let url = URL_SERVICIO + '/login';
    return this.http.post( url, usuario )
              .pipe(
                map( (( resp: any ) => {
                  this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
                  console.log(resp);
                  return true;
                })
               ),
                catchError(err =>  {
                  console.error('statusCode', err.status);
                  Swal.fire({
                    icon: 'error',
                    title: 'Login incorrecto',
                    text: err.error.mensaje
                  });
                  return throwError(err.error);
                })
              );
  }

  crearUsuario( usuario: Usuario ) {
    let url = URL_SERVICIO + '/usuario';

    return this.http.post( url, usuario )
               .pipe(
                 map( (resp: any) => {
                    Swal.fire({
                      title: 'Usuario creado',
                      text: usuario.email,
                      icon: 'success'
                    });
                    return resp.usuario;
                 })
                 , catchError(err =>  {
                   console.error('statusCode', err.status);
                   Swal.fire({
                     icon: 'error',
                     title: err.error.mensaje,
                     text: err.error.errors.message
                   });
                   return throwError(err.error);
                 })
               );
  }

  actualizarUsuario( usuario: Usuario ) {
    let url = URL_SERVICIO + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    console.log( url );
    return this.http.put( url, usuario)
                  .pipe(
                    map( (resp: any) => {

                       if ( usuario._id === this.usuario._id ) {
                          let usuarioDB: Usuario = resp.usuario;
                          this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu);
                       }
                       Swal.fire({
                         title: 'Usuario actualizado',
                         text: usuario.nombre,
                         icon: 'success'
                       });
                       return true;
                    })
                  );
  }

  cambiarImagen( archivo: File, id: string) {
    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
          .then( (resp: any ) => {
            console.log( resp );

            let usuarioDB: Usuario = resp.usuario;
            this.usuario.img = usuarioDB.img;
            this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu);

            Swal.fire({
              title: 'Imagen actualizada',
              text: usuarioDB.nombre,
              icon: 'success'
            });

          })
          .catch( resp => {
            console.log( resp );
          });
  }
  cargarUsuarios( desde: number = 0 ) {
    let url = URL_SERVICIO + '/usuario?desde=' + desde;
    return this.http.get( url );
  }
  buscarUsuario( termino: string ) {
    let url = URL_SERVICIO + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get( url )
              .pipe(
                map( (resp: any) => {
                   return resp.usuarios;
                })
              );
  }
  borrarUsuario( id: string ) {
      let url = URL_SERVICIO + '/usuario/' + id;
      url += '?token=' + this.token;
      return this.http.delete( url )
                .pipe(
                  map( (resp: any) => {

                    Swal.fire({
                      title: 'Usuario borrado',
                      text: 'El usuario ha sido eliminado correctamente',
                      icon: 'success'
                    });

                  })
                );
  }
}
