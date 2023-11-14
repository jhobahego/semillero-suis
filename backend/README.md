# Backend sitio web semillero SUIS
---

## Configuración

1. **Crea un entorno virtual con [`virtualenv`](https://pypi.org/project/virtualenv/):**
    ```bash
    virtualenv venv
    ```

2. **Activa el entorno virtual:**
   - En Windows:
     ```bash
     venv\Scripts\activate
     ```
   - En Unix o MacOS:
     ```bash
     source venv/bin/activate
     ```
     
   - Con Visual Studio Code presionas f1 y escribes 'Python: seleccionar interprete', luego seleccionas el entorno creado,
   aparece con una estrellita

3. **Instala las dependencias desde el archivo `requirements.txt`:**
    ```bash
    pip install -r requirements.txt
    ```

4. **Crea un archivo `.env` con las siguientes variables de entorno:**
   ```env
   DATABASE_URL="mysql+pymysql://user:password@localhost:3306/suis"
   TEST_DATABASE_URL="mysql+pymysql://user:password@localhost:3306/test_suis"
   ADMIN_EMAIL="correo@admin.com"
   SECRET_KEY="MQJ7b1IXKH8Ze3z_FlX4tvSCurO6p5xtVsBMIkaKfI"
   DEVELOPMENT_FRONTEND="http://localhost:5500,http://127.0.0.1:5500"
   RUN_ENV="run"

  ### Notas adicionales:

  - **DATABASE_URL y TEST_DATABASE_URL:** URLs que referencian a la cadena de conexión con la base de datos,
    se debe cambiar user:password por su usuario y contraseña por defecto el usuario es root y sin contraseña.
  - **DEVELOPMENT_FRONTEND:** URLs separadas por comas que hacen referencia al frontend donde se consume la API.
  - **ADMIN_EMAIL:** Correo del usuario administrador.
  - **SECRET_KEY:** Cadena codificada con algoritmo HS256.
  - **RUN_EN:** `test` para usar y `run` para usar la base de datos real

## Iniciar la aplicación:

1. **Inicia el gestor de base de datos:**
   - Utiliza [`XAMPP`](https://www.apachefriends.org/es/download.html), [`MySQL`](https://dev.mysql.com/downloads/mysql/) u otro gestor de bases de datos.
   - Crea las bases de datos con los nombres especificados en `DATABASE_URL` y `TEST_DATABASE_URL` en este caso serían `suis` y `test_suis` respectivamente.

2. **Arranca la aplicación FastAPI:**
   ```bash
   uvicorn app.main:app --reload
   ```

## Uso de la aplicación:
**Accede a la URL que aparece por consola al iniciar la aplicación:**

¡Listo!, se te abrira la documentación de la api generada por fastapi usando el estandar OPENAPI, 
desde aqui puedes utilizar todos los endpoints disponibles en la aplicación y todos ellos están bien documentados.

