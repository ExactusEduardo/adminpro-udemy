import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import Swal from 'sweetalert2';

import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];

  constructor( public _hospitalService: HospitalService,
               public _modalUploadService: ModalUploadService ) {

  }

  ngOnInit(): void {
    this.cargarHospitales();
    this._modalUploadService.notificacion
          .subscribe( resp => {
            this.cargarHospitales();
          });
  }
  actualizarImagen( hospital: Hospital ) {
    this._modalUploadService.mostrarModal( 'hospitales', hospital._id );
  }

  cargarHospitales() {
    this._hospitalService.cargarHospitales()
          .subscribe( hospitales => {
              this.hospitales = hospitales;
          })
  }
  buscarHospitales( termino: string ) {
    if ( termino.length <= 0) {
      this.cargarHospitales();
      return;
    }
    this._hospitalService.buscarHospital( termino )
          .subscribe( hospitales => {
            this.hospitales = hospitales;
          });
  }
  guardarHospital( hospital: Hospital ) {
    this._hospitalService.actualizarHospital( hospital )
          .subscribe();
  }
  borrarHospital( hospital: Hospital ) {
    this._hospitalService.borrarHospital( hospital._id )
          .subscribe( () => {
            this.cargarHospitales();
          });
  }
  crearHospital() {

    Swal.fire({
      title: 'Crear hospital',
      input: 'text',
      text: 'Ingrese el nombre del hospital',
      showCancelButton: true
    }).then( (valor: any) => {
        const nombre: string = valor.value;
        if ( !nombre || nombre.length === 0) {
          return;
        }
        console.log( nombre );
        this._hospitalService.crearHospital( nombre )
              .subscribe( () => this.cargarHospitales() );
    });

  }
}
