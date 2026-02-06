# BioGym: Sistema de Gestión y Localización de Inventario 🏋️‍♂️📦

![Estado](https://img.shields.io/badge/Estado-Producción-success)
![Frontend](https://img.shields.io/badge/Frontend-Vercel-black)
![Backend](https://img.shields.io/badge/Backend-Render-purple)
![Licencia](https://img.shields.io/badge/Licencia-Open_Source-blue)

Solución web integral desarrollada para optimizar la logística interna de **BioGym**, eliminando la dependencia del conocimiento individual y agilizando el proceso de venta presencial mediante geolocalización visual de productos.

---

## 🎯 El Problema (Contexto)
En la operación diaria de BioGym, el conocimiento sobre la ubicación física de los productos residía casi exclusivamente en el encargado de bodega. Esto generaba cuellos de botella críticos:
1.  **Dependencia:** Si el encargado no estaba disponible, los vendedores no encontraban los productos.
2.  **Ineficiencia:** Tiempos de búsqueda excesivos por parte de vendedores intentando adivinar ubicaciones.
3.  **Pérdida de Ventas:** Oportunidades perdidas simplemente por no encontrar un stock existente.

## 💡 La Solución Propuesta
Este software democratiza la información de la bodega. Permite que cualquier trabajador (Vendedor o Bodeguero) pueda ubicar un producto en segundos.

### Funcionalidades Clave:
* **📸 Evidencia Visual:** Almacenamiento de fotos reales de la ubicación del producto para referencia rápida.
* **📍 Mapeo Granular:** Registro de Bodega > Estante > Descripción detallada.
* **👥 Roles Diferenciados:**
    * **Administrador:** Gestión total del sistema, usuarios y bodegas.
    * **Trabajador:** Registro de ingresos, movimientos y consultas de ubicación.
* **🔍 Búsqueda Rápida:** Interfaz optimizada para encontrar productos durante el proceso de venta.

---

## 🔗 Accesos y Demo
El proyecto se encuentra desplegado y funcional en la nube para pruebas y uso inmediato:

* 🌐 **Aplicación Web:** [https://gestion-productos-bodega-frontend.vercel.app/](https://gestion-productos-bodega-frontend.vercel.app/)
* 🛠️ **API Backend:** [https://biogym-backend.onrender.com/health](https://biogym-backend.onrender.com/health)

### 🔑 Credenciales de Acceso (Demo)
Para facilitar la evaluación y pruebas, el sistema cuenta con un usuario administrador por defecto:
* **Correo:** `admin@biogym.com`
* **Contraseña:** `admin123`

> **Nota:** El sistema recrea automáticamente este usuario si no existe en la base de datos al reiniciarse.

---

## 🚀 Ingeniería y Arquitectura Cloud
Este proyecto fue diseñado pensando en la **escalabilidad** y el **bajo costo** de mantenimiento, utilizando estrategias avanzadas para entornos *Serverless* gratuitos:

### ⚡ Alta Disponibilidad (Zero Downtime)
Implementación de **Cron Jobs externos** que ejecutan chequeos de salud (`/health`) cada 14 minutos en horario comercial (10:00 - 19:00). Esto evita el "Cold Start" (apagado por inactividad) de los servidores en Render, garantizando tiempos de respuesta inmediatos para los vendedores.

### 🛡️ Persistencia de Datos
Sistema automatizado (`/db-wake-up`) que realiza consultas de bajo impacto (`SELECT 1`) cada 6 días, previniendo la pausa automática de la base de datos en Supabase.

### 🔐 Seguridad y Optimización
* **BCrypt Optimizado:** Ajuste de "Salt Rounds" a 8 para equilibrar seguridad y rendimiento en hardware limitado.
* **JWT & Rate Limiting:** Protección contra ataques de fuerza bruta y manejo seguro de sesiones.
* **Frontend Fail-safe:** Detección proactiva de expiración de sesión en el cliente para evitar errores de carga.

---

## 🛠️ Stack Tecnológico
* **Frontend:** React + Vite + CSS Modules (Diseño Responsivo)
* **Backend:** Node.js + Express + TypeORM
* **Base de Datos:** PostgreSQL (Supabase)
* **Infraestructura:** Vercel (Front) + Render (Back) + Cron-job.org (Automatización)

## 📦 Instalación Local (Para Desarrolladores)
Si la empresa desea continuar el desarrollo o escalar el código:

1.  Clonar el repositorio.
2.  Configurar variables de entorno `.env` (basado en `.env.example`).
3.  Instalar dependencias y correr:
    ```bash
    npm install
    npm run dev
    ```

---
*Desarrollado como Proyecto de Práctica Profesional - Vicente Asmussen - 2026.*
