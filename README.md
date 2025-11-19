README - DESARROLLADORES
========================

Proyecto: FOOD
Repositorio: https://github.com/S3b4sB0t3r0/FOOD
Autor: S3b4sB0t3r0

Propósito
--------
Documento orientado a desarrolladores para configurar, entender y contribuir al proyecto FOOD.
Incluye: arquitectura, instrucciones de setup locales, estructura de carpetas, variables de entorno,
scripts útiles, recomendaciones de testing, despliegue y troubleshooting.

Resumen rápido
--------------
- Stack principal: JavaScript (se observa predominio de JS).  
- Carpetas principales visibles: `Back_End/` y `Front_End/`.  
- Este README asume un stack típico: Node.js + Express (o similar) en backend y React/Vite/Next en frontend.
- Ajusta los comandos y variables según tu stack real.

Índice
------
1. Requisitos locales
2. Estructura del repositorio (carpeta por carpeta)
3. Configuración (variables de entorno)
4. Instalación y ejecución (desarrollo)
5. Scripts útiles
6. Base de datos
7. API (guía de endpoints y ejemplos)
8. Frontend (arranque, configuración, build)
9. Testing
10. Linting y formateo
11. Deploy/Producción
12. Flujo de trabajo / Contribuciones
13. Troubleshooting común
14. Archivos y puntos a completar

1) Requisitos locales
---------------------
- Node.js LTS (>= 18 recomendado)
- npm (o yarn)
- MongoDB / PostgreSQL / MySQL según lo que uses (si usas MongoDB Atlas, sólo la URI)
- Git
- (Opcional) Docker y docker-compose para levantar BD y servicios en contenedores
- (Opcional) PM2 para producción

2) Estructura del repositorio (carpeta por carpeta)
---------------------------------------------------
A continuación se describe una estructura sugerida basada en lo que el repo muestra y prácticas comunes.
Verifica la estructura real en tu repo y actualiza donde sea necesario.

FOOD/
├─ Back_End/                # Código del servidor
│  ├─ src/                   # Fuentes (controllers, models, routes, services)
│  │  ├─ controllers/
│  │  ├─ routes/
│  │  ├─ models/
│  │  ├─ middlewares/
│  │  ├─ utils/
│  │  └─ index.js / app.js   # punto de entrada
│  ├─ config/                # configuración (db, logger, constantes)
│  ├─ scripts/               # scripts útiles (p. ej. seeders)
│  ├─ tests/                 # tests unitarios/integración (opcional)
│  ├─ package.json
│  └─ .env.example
│
├─ Front_End/               # Cliente (React / Vue / Angular / Vanilla)
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ services/          # llamadas HTTP (axios/fetch wrappers)
│  │  ├─ store/             # redux, context o pinia
│  │  └─ main.jsx / index.js
│  ├─ public/
│  ├─ package.json
│  └─ .env.example
│
├─ README.md
└─ README-DEV.txt (este archivo)

Descripción detallada por carpeta
---------------------------------
Back_End:
- controllers/: lógica que responde a requests (por recurso: users, auth, products, orders)
- routes/: definición de rutas y su versionado (p. ej. /api/v1/products)
- models/: esquemas (mongoose) o entidades (sequelize/TypeORM)
- middlewares/: autenticación (JWT), validaciones, manejo de errores
- services/: lógica de negocio independiente de HTTP (p. ej. pagos, emails)
- utils/: helpers y utilidades (formatos, validadores)
- config/: carga de variables de entorno y configuraciones por ambiente
- index.js / server.js: arranque del servidor y conexión a DB

Front_End:
- components/: componentes reutilizables (botones, cards, inputs)
- pages/: vistas principales (Home, Menu, Cart, Checkout, Admin)
- services/: axios wrappers, interceptores (JWT refresh), endpoints
- store/: redux / context para estado global (carrito, usuario)
- assets/: imágenes, iconos, estilos globales
- routes.js / App.jsx: ruteo del cliente (react-router o similar)

3) Configuración (variables de entorno)
---------------------------------------
Crea `.env` en cada parte (Back_End y Front_End) tomando como base `.env.example`.

Back_End `.env` (ejemplo):
DB_URI=mongodb+srv://usuario:pass@cluster0.mongodb.net/fooddb?retryWrites=true&w=majority
PORT=4000
JWT_SECRET=tu_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLOUDINARY_URL=...           # si subes imágenes
EMAIL_HOST=smtp.example.com  # si envías emails
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...

Front_End `.env` (ejemplo):
VITE_API_BASE_URL=http://localhost:4000/api
REACT_APP_API_URL=http://localhost:4000/api  # según framework
VITE_SOME_KEY=...

IMPORTANTE:
- Nunca subir los `.env` reales al repo.
- Mantén `.env.example` actualizado con claves necesarias.

4) Instalación y ejecución (desarrollo)
--------------------------------------
Pasos típicos:

Clonar:
git clone https://github.com/S3b4sB0t3r0/FOOD.git
cd FOOD

Backend:
cd Back_End
npm install
cp .env.example .env      # editar .env con valores reales
npm run dev               # asumiendo nodemon o script dev
# o
node index.js

Frontend:
cd ../Front_End
npm install
cp .env.example .env
npm run dev               # Vite/CRA/Next (ajusta según tu stack)

5) Scripts útiles (ejemplo en package.json)
-------------------------------------------
Back_End/package.json (sugeridos):
- "start": "node src/index.js"
- "dev": "nodemon src/index.js"
- "lint": "eslint . --fix"
- "test": "jest --runInBand"

Front_End/package.json (sugeridos):
- "start": "react-scripts start" o "vite"
- "build": "react-scripts build" o "vite build"
- "test": "react-scripts test"

6) Base de datos
-----------------
- Si usas MongoDB: define modelos mongoose en `/Back_End/src/models`.
- Si usas SQL: usa migrations y un ORM (Sequelize/TypeORM).
- Proporciona scripts de seed para datos iniciales (usuarios admin, productos de ejemplo).
- Recomendación: `docker-compose.yml` para levantar DB en local:
  - servicio db (mongo/postgres)
  - servicio adminer / mongo-express (opcional)

7) API - Guía y ejemplos
------------------------
A falta de inspección completa de los controladores, te dejo una plantilla de endpoints REST comunes que deberías tener / documentar:

Auth
POST /api/auth/register         -> registro (body: name, email, password)
POST /api/auth/login            -> login (body: email, password) -> devuelve JWT
POST /api/auth/refresh          -> refresh token (si implementas)

Usuarios
GET /api/users                  -> listar usuarios (admin)
GET /api/users/:id              -> obtener datos usuario
PUT /api/users/:id              -> actualizar usuario
DELETE /api/users/:id           -> eliminar usuario

Productos / Menú
GET /api/products               -> listar productos (paginación, filtros)
GET /api/products/:id
POST /api/products              -> crear producto (admin)
PUT /api/products/:id
DELETE /api/products/:id

Categorías
GET /api/categories
POST /api/categories
...

Carrito / Pedidos
POST /api/cart                  -> agregar al carrito (o manejar en frontend)
POST /api/orders                -> crear pedido
GET /api/orders/:id             -> ver pedido
PUT /api/orders/:id/status      -> actualizar estado (admin/repartidor)

Ejemplo de request (curl):
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@local","password":"123456"}'

Respuesta esperada:
{
  "ok": true,
  "token": "eyJhbGciOi...",
  "user": { "id": "...", "name": "...", "role": "client" }
}

8) Frontend - atención a integración
------------------------------------
- Centraliza las URLs de API en `src/services/api.js` o variables de entorno.
- Maneja tokens JWT con interceptores axios: añadir header `Authorization: Bearer <token>`.
- Protege rutas (Route Guards) en frontend para roles (admin / client / delivery).
- Separar vistas: cliente vs admin. Ideal: prefijo `/admin` para el panel.

9) Testing
----------
- Backend: Jest + Supertest (tests de rutas y controladores).
- Frontend: Jest + React Testing Library (componentes críticos).
- E2E: Cypress para flujo completo (registro -> pedir -> ver pedido en admin).

10) Linting y formateo
----------------------
- ESLint con configuración base (Airbnb, Standard o personalizada).
- Prettier para formateo consistente.
- Hooks de git: Husky + lint-staged para correr lint/format antes de commits.

11) Deploy / Producción
-----------------------
- Backend: build y correr con PM2, Docker o deploy en Heroku / Railway / Render / DigitalOcean.
- Frontend: build estático servido por Nginx o Netlify / Vercel.
- Variables de entorno en el host: añadir JWT_SECRET, DB_URI, y claves de terceros (Stripe, Cloudinary).
- CORS: configura CORS en backend permitiendo dominio del frontend en producción.

12) Flujo de trabajo y Contribuciones
-------------------------------------
- Rama principal `main` protegida.
- Branches: `feature/<nombre>`, `hotfix/<issue>`.
- Pull Requests con descripción, pruebas y screenshots cuando apliquen.
- Revisión por al menos 1 reviewer y pruebas locales antes de merge.

13) Troubleshooting común
--------------------------
- Error: `(u.estado || "").toLowerCase is not a function`  
  -> Eso indica que `u.estado` no es string (puede ser null o boolean). Asegúrate de normalizar datos al fetchear: `String(u.estado || "").toLowerCase()` o revisar tipo en la BD.
- Problema de CORS: habilitar CORS y listar orígenes permitidos.
- Problemas con imágenes: verificar rutas públicas, permisos y si usas Cloudinary revisar credenciales.

14) Archivos y puntos a completar (lo que yo no pude leer)
----------------------------------------------------------
Al intentar leer tu repo en GitHub la UI devolvió un error parcial; confirmo que encontré las carpetas `Back_End` y `Front_End` pero no pude listar **todos** los archivos individuales ni revisar package.json concretos. Para un README 1:1 y totalmente exacto necesito que me pases (una de estas opciones):

- Opción A: Pegues aquí el árbol del repo (`tree -a` / `ls -R`) o una lista de archivos.  
- Opción B: Me permitas abrir el repo complet o que recargues la página de GitHub (si es un error momentáneo) y vuelvas a pedírmelo.  
- Opción C: Indiques si realmente usas (marcar) estas tecnologías:  
  - Backend: Node.js + Express / NestJS / Otro  
  - DB: MongoDB / MySQL / PostgreSQL  
  - Frontend: React (CRA) / Vite / Next.js / Vue / Angular

Si quieres, con la opción A me pasas el contenido de la raíz del repo (lista de archivos y carpetas) y yo genero inmediatamente una versión EXACTA del README de desarrolladores adaptada a tu código actual.

Notas finales y checklist antes del PR
--------------------------------------
- Añade `README-DEV.txt` en la raíz con este contenido.  
- Incluye `.env.example` en ambas carpetas con variables mínimas.  
- Añade scripts "dev" y "start" claros en `package.json`.  
- Documenta los endpoints principales en `Back_End/README_API.md` o usa Swagger (recomendado).  
- Crea `CONTRIBUTING.md` si quieres normas de contribución.

---



