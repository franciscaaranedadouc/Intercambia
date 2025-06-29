//src/app/pages/login/login.page.ts
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DataServiceService } from '../../data-service/data-service.service';
import { Router } from '@angular/router';
import { SQLiteService } from '../../data-service/sqlite.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email: string = '';
  password: string = '';

  nuevoUsuario = { name: '', email: '', password: '' };
  users: any[] = [];

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private dataService: DataServiceService,
    private sqliteService: SQLiteService,
    private router: Router
  ) {}

  // Método para mostrar alertas genéricas
  private async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Validación de formato de email
  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Login de usuario
  async login() {
    //  Validaciones
    if (!this.email) {
      return this.mostrarAlerta('El correo no puede estar vacío.');
    }
    if (!this.validarEmail(this.email)) {
      return this.mostrarAlerta('Formato de correo inválido.');
    }
    if (!this.password) {
      return this.mostrarAlerta('La contraseña no puede estar vacía.');
    }
    if (this.password.length < 3 || this.password.length > 4) {
      return this.mostrarAlerta('La contraseña debe tener entre 3 y 4 caracteres.');
    }

    // Llamada al servicio de datos para autenticar al usuario
    const usuario = await this.sqliteService.loginUsuario(this.email, this.password);
    // 3) Según el resultado, rediriges o muestras error
    if (usuario) {
      console.log('Login OK, usuario:', usuario);
      localStorage.setItem('userId', usuario.id.toString());
      this.navCtrl.navigateRoot('/home');
    } else {
      await this.mostrarAlerta('Usuario no registrado. Por favor, regístrate primero.');
    }
  }

  // DataService para registro
  registro() {
    this.navCtrl.navigateForward(['/registro']);
  }

  // Agregar un nuevo usuario
async agregarUsuario() {
  const { name, email, password } = this.nuevoUsuario;
  // Si no usas apellido, nivelEducacion o fechaNacimiento, pásalos vacíos:
  const success = await this.dataService.registerUser(
    name,
    '',        // apellido
    email,
    password,
    '',        // nivelEducacion
    ''         // fechaNacimiento
  );

  if (success) {
    await this.mostrarAlerta('Usuario agregado: ' + name);
    this.users.push({ name, email, password });
    this.nuevoUsuario = { name: '', email: '', password: '' };
  } else {
    await this.mostrarAlerta('Error al agregar usuario');
  }
}
}
