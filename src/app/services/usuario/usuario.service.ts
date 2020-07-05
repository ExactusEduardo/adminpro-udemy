import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';
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

  constructor( public http: HttpClient,
               public router: Router,
               public _subirArchivoService: SubirArchivoService  ) {
    console.log('Servicio de usuario listo');
    this.cargarStorage();
  }
  estaLogueado() {
    return ( this.token.length > 5) ? true : false;
  }
  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }
  guardarStorage( id: string, token: string, usuario: Usuario ) {
    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );

    this.usuario = usuario;
    this.token = token;
  }
  logout() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }
  loginGoogle( token: string ) {
    let url = URL_SERVICIO + '/login/google';
    return this.http.post( url, { token: token })
              .pipe(
                map( ( resp: any ) => {
                  this.guardarStorage( resp.id, resp.token, resp.usuario );
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
                  this.guardarStorage( resp.id, resp.token, resp.usuario );
                  return true;
                })
              ));
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
                          this.guardarStorage( usuarioDB._id, this.token, usuarioDB);
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
            this.guardarStorage( usuarioDB._id, this.token, usuarioDB);

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
