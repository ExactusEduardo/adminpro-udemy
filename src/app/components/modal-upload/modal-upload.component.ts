import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: [
  ]
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;


  constructor(public _subirArchivoService: SubirArchivoService,
              public _modalUploadService: ModalUploadService ) { 

  }

  ngOnInit(): void {
  }
  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this._modalUploadService.ocultarModal();
  }
  subirImagen(){
    this._subirArchivoService.subirArchivo( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id )
          .then( resp => {
            console.log( resp );
            this._modalUploadService.notificacion.emit( resp );
            this.cerrarModal();
          })
          .catch( err => {
            console.log('Error en la carga... ');
          });
  }
  seleccionImagen( archivo: File ) {
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    console.log( event );
    // console.log( archivo );
    if ( archivo.type.indexOf('image') < 0 ) {
      Swal.fire({
        title: 'Solo imágenes',
        text: 'El archivo seleccionado no es una imagen',
        icon: 'error'
      });
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;

    let reader = new FileReader();
    reader.readAsDataURL( archivo );
    reader.onloadend = () => {
      //console.log( reader.result );
      this.imagenTemp = reader.result.toString();
    };
  }

}
