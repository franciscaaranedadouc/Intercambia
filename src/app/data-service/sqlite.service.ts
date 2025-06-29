//src/app/data-service/sqlite.service.ts

import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private dbName = 'usuarios_db'; // Nombre de la base de datos

  // Inicializa la base de datos y la tabla si no existe
  async inicializarBaseDatos(): Promise<void> {
    await this.initDB();
  }

  // Método interno para crear o recuperar la conexión
  private async initDB(): Promise<void> {
    try {
      let db: SQLiteDBConnection;

      const isConn = (await this.sqlite.isConnection(this.dbName, false)).result;

      if (isConn) {
        db = await this.sqlite.retrieveConnection(this.dbName, false);
      } else {
        db = await this.sqlite.createConnection(this.dbName, false, 'no-encryption', 1, false);
      }

      // Verifica si ya está abierta
      const isOpen = (await db.isDBOpen()).result;
      if (!isOpen) {
        await db.open();
      }

      await db.execute(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          apellido TEXT,
          email TEXT UNIQUE,
          password TEXT,
          objetivo TEXT,
          fechaNacimiento TEXT
        );
      `);

      this.db = db;
    } catch (error: any) {
      console.error('Error al inicializar base de datos:', error.message || error);
    }
  }

  // Guarda un nuevo usuario
  async guardarUsuario(user: any): Promise<boolean> {
    if (!this.db) return false;

    try {
      await this.db.run(`
        INSERT INTO usuarios (nombre, apellido, email, password, objetivo, fechaNacimiento)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        user.nombre,
        user.apellido,
        user.email,
        user.password,
        user.objetivo,
        user.fechaNacimiento
      ]);
      return true;
    } catch (error: any) {
      console.error('Error al guardar en SQLite:', error.message || error);
      return false;
    }
  }

  // Verifica si un correo ya existe
  async existeCorreo(email: string): Promise<boolean> {
    if (!this.db) return false;

    try {
      const res = await this.db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
      return Array.isArray(res.values) && res.values.length > 0;
    } catch (error: any) {
      console.error('Error al verificar correo:', error.message || error);
      return false;
    }
  }
  
  // loginUsuario, autenticar con email y password
  async loginUsuario(email: string, password: string): Promise<{
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    objetivo: string;
    fechaNacimiento: string;
  } | null> {
    // Asegura la conexión
    if (!this.db) {
      await this.initDB();
    }

    try {
      const res = await this.db!.query(
        `SELECT id, nombre, apellido, email, objetivo, fechaNacimiento
         FROM usuarios
         WHERE email = ? AND password = ?`,
        [ email.trim(), password ]
      );

      if (Array.isArray(res.values) && res.values.length > 0) {
        // devolvemos la primera fila como objeto
        return res.values[0] as any;
      } else {
        return null;
      }
    } catch (error: any) {
      console.error('Error en loginUsuario:', error.message || error);
      return null;
    }
  }

  // Obtiene un usuario por ID
  async obtenerUsuarioPorId(userId: number) {
  // abre la base si hace falta
  if (!this.db) { await this.initDB(); }
  try {
    const res = await this.db!.query(
      `SELECT nombre FROM usuarios WHERE id = ?`,
      [userId]
    );
    if (Array.isArray(res.values) && res.values.length > 0) {
      // res.values[0] es un objeto { nombre: string }
      return { nombre: (res.values[0] as any).nombre };
    }
    return null;
  } catch (err: any) {
    console.error('Error al leer nombre de usuario:', err);
    return null;
  }
  }


  // Elimina la base de datos (solo en desarrollo)
  async borrarBaseDatos(): Promise<void> {
    try {
      const res = await CapacitorSQLite.deleteDatabase({ database: this.dbName });
      console.log('Base de datos eliminada:', res);
    } catch (error: any) {
      console.error('Error al borrar base de datos:', error.message || error);
    }
  }
}
