import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;

  imagenSubir: File;
  imagenTemp: string;

  constructor( public _usuarioService: UsuarioService ) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit(): void {
  }

  guardar( usuario: Usuario ) {
    console.log(usuario);
    this.usuario.nombre = usuario.nombre;
    if ( !this.usuario.google ) {
      this.usuario.email = usuario.email;
    }
    this._usuarioService.actualizarUsuario( this.usuario )
          .subscribe( resp => {
            console.log( resp );
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

  cambiarImagen() {
    this._usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id );
  }
}
