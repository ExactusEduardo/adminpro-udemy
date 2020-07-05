import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';

import { 
  SettingsService,
  SharedService,
  SidebarService,
  UsuarioService,
  LoginGuardGuard,
  SubirArchivoService
} from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SharedService,
    SidebarService,
    UsuarioService,
    LoginGuardGuard,
    SubirArchivoService,
    ModalUploadComponent
  ]
})
export class ServiceModule { }
