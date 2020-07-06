import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { URL_SERVICIO } from '../../config/config';

import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';
import { Hospital } from 'src/app/models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales: number = 0;

  constructor( public http: HttpClient,
               public _usuarioService: UsuarioService ) {

  }
  cargarHospitales( desde: number = 0 ) {
    let url = URL_SERVICIO + '/hospital?desde=' + desde;
    return this.http.get( url )
              .pipe(
                map( (resp: any) => {
                   this.totalHospitales = resp.total;
                   return resp.hospitales;
                })
              );
  }
  obtenerHospital( id: string ) {
    let url = URL_SERVICIO + '/hospital/' + id;
    return this.http.get( url )
              .pipe(
                map( (resp: any) => {
                   return resp.hospital;
                })
              );
  }
  borrarHospital( id: string ) {
    let url = URL_SERVICIO + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url )
              .pipe(
                map( (resp: any) => {

                  Swal.fire({
                    title: 'Hospital borrado',
                    text: 'El hospital ha sido eliminado correctamente',
                    icon: 'success'
                  });

                })
              );
  }
  crearHospital( nombre: string ) {
    let url = URL_SERVICIO + '/hospital';
    url += '?token=' + this._usuarioService.token;

    return this.http.post( url, { nombre } )
               .pipe(
                 map( (resp: any) => {
                    Swal.fire({
                      title: 'Hospital creado',
                      text: resp.hospital.nombre,
                      icon: 'success'
                    });
                    return resp.hospital;
                 })
               );
  }
  buscarHospital( termino: string ) {
    let url = URL_SERVICIO + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get( url )
              .pipe(
                map( (resp: any) => {
                   return resp.hospitales;
                })
              );
  }
  actualizarHospital( hospital: Hospital) {
    let url = URL_SERVICIO + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;
    console.log( url );
    return this.http.put( url, hospital)
                  .pipe(
                    map( (resp: any) => {

                       Swal.fire({
                         title: 'Hospital actualizado',
                         text: resp.hospital.nombre,
                         icon: 'success'
                       });
                       return resp.hospital;
                    })
                  );
  }
}
