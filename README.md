
README - FOOD / EL VANDALO GRILL
===========================

PROYECTO: FOOD (Sistema Fullstack de Restaurante – Inventario, Pedidos, Dashboard, Reportes)
BACKEND: Node.js + Express + MongoDB + Mongoose
FRONTEND: React + Tailwind + Recharts + Axios
REPORTES: PDFKit y XLSX
AUTENTICACIÓN: JWT + Bcrypt
EMAILS: Nodemailer

## 1. DESCRIPCIÓN GENERAL


Este proyecto implementa un sistema completo para la gestión de un restaurante:
- Administración de productos, ingredientes y empleados
- Manejo de usuarios con autenticación JWT
- Generación de reportes (PDF y Excel)
- Dashboard con estadísticas y gráficos
- Sistema de pedidos (frontend y backend)
- Módulo de movimientos y contabilidad básica
- Conexión con MongoDB Atlas
- API REST robusta, modular y escalable

El proyecto está dividido en dos partes:

BACKEND: carpeta raíz del repositorio (Express, MongoDB, rutas, lógica interna)
FRONTEND: carpeta "elvandalogrill" (React, dashboard administrativo, componentes UI)


## 2. CONFIGURACIÓN DEL PROYECTO


-------------------------------------------
2.1 Requisitos Previos
-------------------------------------------
- Node.js 18+
- MongoDB Atlas o instancia local
- Git
- Navegador actualizado
- NPM o Yarn

-------------------------------------------
2.2 Variables de Entorno (.env)
-------------------------------------------
El backend utiliza un archivo .env con:

MONGO_URI=mongodb+srv://root:Sebas123@frankfurt.h2awxla.mongodb.net/FrankFurt?retryWrites=true&w=majority&appName=FrankFurt
PORT=5000

-------------------------------------------
2.3 Instalación del Backend
-------------------------------------------
Entrar a la carpeta raíz del proyecto y ejecutar:

npm install

Dependencias principales:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- pdfkit
- xlsx
- nodemailer

-------------------------------------------
2.4 Instalación del Frontend
-------------------------------------------
Entrar a la carpeta:

cd elvandalogrill
npm install

Dependencias principales:
- react
- next
- lucide-react
- recharts
- framer-motion
- tailwindcss
- axios
- react-hot-toast
- @headlessui/react


## 3. ARQUITECTURA DEL BACKEND


-------------------------------------------
3.1 Entrada principal: server / index.js
-------------------------------------------
El servidor principal importa:
- express
- mongoose
- cors
- dotenv

Rutas cargadas:
- /api/orders
- /api/contacto
- /api
- /api/user
- /api/stats
- /api/reportes
- /api/movimientos
- /api/employee
- /api/ingredientes

Conexión a DB desde:
./config/db.js

El servidor escucha en:
http://localhost:5000

-------------------------------------------
3.2 Estructura Base del Backend
-------------------------------------------
config/
    db.js       -> Conexión a MongoDB

routes/
    contactoRoutes.js
    equipoRoutes.js
    productoRoutes.js
    userRoutes.js
    orderRoutes.js
    statsRoutes.js
    reportes.js
    movimientos.js
    employeeRoutes.js
    ingredientesRoutes.js

models/
    (Modelos de Mongoose dependiendo del módulo)

controllers/
    (Lógica de negocio para cada entidad)

utils/
    (Funciones auxiliares si existen)

-------------------------------------------
3.3 Dependencias Críticas
-------------------------------------------
bcryptjs → encriptación de contraseñas
jsonwebtoken → autorización por tokens
nodemailer → envío de correos
pdfkit → reportes en PDF
xlsx → exportar datos en Excel
mongoose → modelado de datos
cors → habilitar acceso CORS


## 4. ARQUITECTURA DEL FRONTEND


-------------------------------------------
4.1 Framework y Librerías
-------------------------------------------
Framework principal: React + create-react-app
Estilos: TailwindCSS
Iconos: lucide-react
Gráficos: Recharts
Animaciones: Framer Motion
Conexión API: Axios
Notificaciones: react-hot-toast

-------------------------------------------
4.2 Scripts del frontend
-------------------------------------------
npm start  → levantar entorno de desarrollo
npm build → compilar para producción
npm test  → ejecutar testing
npm eject → exposición completa del build system

-------------------------------------------
4.3 Estructura del frontend
-------------------------------------------
elvandalogrill/
    src/
        components/
        pages/
        hooks/
        utils/
        services/
        styles/
        context/
        assets/
        App.js
        index.js
        rutas protegidas, dashboard, modales, UI, etc.

-------------------------------------------
4.4 Funcionalidades del frontend
-------------------------------------------
- Dashboard admin con gráficos
- CRUD visual de productos
- Gestión de empleados
- Administración de ingredientes
- Estadísticas en tiempo real
- Sección de pedidos
- Módulo de movimientos económicos
- Reportes exportables
- Interfaz profesional


## 5. ENDPOINTS PRINCIPALES


-------------------------------------------
5.1 Usuarios
-------------------------------------------
POST /api/user/login
POST /api/user/register
GET  /api/user/perfil
PUT  /api/user/update

-------------------------------------------
5.2 Productos
-------------------------------------------
GET /api/productos
POST /api/productos
PUT /api/productos/:id
DELETE /api/productos/:id

-------------------------------------------
5.3 Ingredientes
-------------------------------------------
GET /api/ingredientes
POST /api/ingredientes

-------------------------------------------
5.4 Pedidos
-------------------------------------------
GET /api/orders
POST /api/orders

-------------------------------------------
5.5 Reportes
-------------------------------------------
GET /api/reportes/pdf
GET /api/reportes/excel


## 6. SISTEMA DE AUTENTICACIÓN

El sistema usa JWT:
- Token generado al iniciar sesión
- Middleware para proteger rutas
- Expiración configurable
- Almacena datos básicos del usuario

Contraseñas encriptadas con bcryptjs.

## 7. GENERACIÓN DE REPORTES

PDF → generado por PDFKit  
Excel → generado por xlsx

Ambos se descargan desde el dashboard.


## 8. MOVIMIENTOS Y CONTABILIDAD

Sección especial para registrar:
- Entradas de dinero
- Salidas de dinero
- Categorías
- Balance general
- Exportación de movimientos


## 9. ESTADÍSTICAS Y DASHBOARD

Dashboards creados usando:
- Recharts
- Framer Motion
- Lucide React

Datos consumidos desde:
GET /api/stats

Incluye:
- Total de ventas
- Total de productos
- Total de empleados
- Gráfica de ingresos
- Actividad reciente


## 10. DESPLIEGUE


-------------------------------------------
Backend en producción
-------------------------------------------
- Subir a Render / Railway / VPS
- Usar PM2 para correr Node.js
- Conectar con MongoDB Atlas
- Configurar variables de entorno

-------------------------------------------
Frontend en producción
-------------------------------------------
- Subir a Vercel o Netlify
- Configurar variables REACT_APP_API_URL


## 11. COMANDOS RÁPIDOS


Backend:
npm install
npm start

Frontend:
cd elvandalogrill
npm install
npm start


## 12. CONTRIBUCIÓN

- Mantener el código modular
- Usar control de versiones correctamente
- Crear PR limpios y con descripción clara
- Mantener la arquitectura MVC del backend


## 13. CONTACTO

Proyecto desarrollado por Sebas Botero.

GitHub: https://github.com/S3b4sB0t3r0


## FIN DEL README PARA DESARROLLADORES

