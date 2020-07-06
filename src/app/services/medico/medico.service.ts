import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { URL_SERVICIO } from '../../config/config';

import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;
  constructor( public http: HttpClient,
               public _usuarioService: UsuarioService ) {

  }
  cargarMedicos() {
    let url = URL_SERVICIO + '/medico';
    return this.http.get( url )
                .pipe(
                  map( (resp: any) => {
                    this.totalMedicos = resp.total;
                    return resp.medicos;
                  })
                );
  }
  buscarMedicos( termino: string ) {
    let url = URL_SERVICIO + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get( url )
              .pipe(
                map( (resp: any) => {
                   return resp.medicos;
                })
              );
  }
  cargarMedico( id: string ) {
    let url = URL_SERVICIO + '/medico/' + id;
    return this.http.get( url )
              .pipe(
                map( (resp: any) => {
                   return resp.medico;
                })
              );
  }
  borrarMedico( id: string ) {
    let url = URL_SERVICIO + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url )
              .pipe(
                map( (resp: any) => {

                  Swal.fire({
                    title: 'Médico borrado',
                    text: 'El médico ha sido eliminado correctamente',
                    icon: 'success'
                  });

                })
              );
  }
  guardarMedico( medico: Medico ) {
    let url = URL_SERVICIO + '/medico';
    if ( medico._id ) {
      // actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put( url, medico )
                 .pipe(
                   map( (resp: any) => {
                      Swal.fire({
                        title: 'Medico actualizado',
                        text: medico.nombre,
                        icon: 'success'
                      });
                      return resp.medico;
                   })
                 );
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      console.log( url );
      console.log( medico );
      return this.http.post( url, medico )
                 .pipe(
                   map( (resp: any) => {
                      Swal.fire({
                        title: 'Medico creado',
                        text: medico.nombre,
                        icon: 'success'
                      });
                      return resp.medico;
                   })
                 );
    }
  }
}
