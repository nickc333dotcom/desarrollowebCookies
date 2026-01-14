Preguntas de Reflexión (EN SUS PROPIAS PALABRAS)

Conceptuales:
##¿Qué vulnerabilidades de seguridad previenen las cookies HTTP-only que localStorage no puede prevenir? Crea una analogia de ejemplo para tu explicación
-localStorage permite que se pueda acceder a la informacion de la pagina por cualquier persona, esto porque basicamente JavaScript puede leer el contenido y se puede acceder. En cambio, las cookies HTTP-only no permiten que esto pase, ya que solo el servidor puede acceder a la informacion. Un ejemplo serian las historias de Instagram, el localStorage serian las historias que se suben a historia publica, ya que puede acceder cualquier persona, y las cookies HTTP-only serian las historias en mejores amigos, ya que no cualquiera puede acceder a ellas. 

##¿Por qué es importante el atributo sameSite: 'strict' en las cookies? Investiga: ¿Qué es un ataque CSRF (explica con una analogía) y cómo lo previene este atributo?
--El atributo sameSite evita que se use la llave (XSS) por otras personas. Esto es importante ya que existen ataques que pueden afectar a la pagina, por ejemplo, los ataques CSRF. Estos consisten en que tu navegador manda una peticion a una pagina donde ya te habias autenticado sin que lo sepas. Una analogia podria ser los sellos que tienen los doctores, ya que el sello representa su llave (XSS), pero si alguien quisiera utilizarla, podrian hacer que ponga su sello en una hoja que copia la tinta del sello, y asi las personas que copiaron el sello podrian hacer lo que quisieran con el, y el doctor no sabria nada. El atributo de sameSite: 'strict' hace que solo se manden las cookies si las peticiones son de la pagina web propia. 

##¿En qué escenarios NO sería recomendable usar cookies para autenticación, explica porque?
Un escenario seria en el desarrollo de una API publica, ya que las cookies necesitan gestores de cookies, y si se quiere usar la API en Python o en servidor la gestion de las cookies dificultaria el proceso. 
Otro escenario podria ser en aplicaciones que tienen dominios diferentes, es decir, si se tiene una paginaprincipal.com y se tienen otros dominios para ventas y gestiones, las cookies serian un problema. Esto se da ya que los navegadores prohiben el envio de cookies entre dominios diferentes. 


Técnicas:
¿Qué pasaría si olvidas agregar credentials: 'include' en las peticiones fetch del frontend? Experimenta: Elimina temporalmente esta línea y describe el comportamiento observado.
-Si no hay credentials: 'include' lo que pasa es que el usuario no se puede autenticar, aunque haya hecho login. Se ve el error 401 que es el de Unauthorized. 

¿Por qué necesitamos configurar CORS con credentials: true en el backend? Investiga: ¿Qué política de seguridad del navegador está en juego aquí?
-Se debe configurar ya que los navegadores tienen algo llamado SOP(Same Origin Policy), basicamente los navegadores no permiten que una pagina lea informacion de otra. 

¿Cómo afecta el uso de cookies a la arquitectura si decides separar frontend y backend en dominios diferentes? Investiga sobre cookies de terceros y las restricciones del navegador.
-El problema de esto es que se tendrian que usar cookies de terceros, y hay muchos navegadores que estan quitando el soporte para estas cookies. Esto resultaria en que la configuracion sea mas compleja y algunos navegadores van a bloquear las cookies.  


Casos Prácticos:
Si estas implementando un mecanismo de "recordarme":

¿Cómo modificarías maxAge de la cookie?
¿Qué consideraciones de seguridad debes tener?
Maneja la expiración del token de forma elegante:
-El manejo de maxAge se hace en milisegundos, entonces tendria que buscar un valor razonable, lo usual son 30 dias de recordar, entonces usaria: res.cookie('token', valor, { maxAge: 30 * 24 * 60 * 60 * 1000 }). 
=El problema de esto es que se aumenta el riesgo de que se use el mismo dispositivo por varias personas, lo que pone en riesgo la seguridad.

¿Cómo manejarías a nivel de UX (experiencia de usuario) la expiración del token?
¿Cómo redirigirías al login sin perder el contexto de lo que estaba haciendo?
Debugging:
Imagina que recibes el error "Cannot set headers after they are sent to the client":
¿Qué podría estar causándolo en el contexto de cookies?
¿En qué orden deben ejecutarse res.cookie() y res.json()?
-Para que la experiencia del usuario sea buena, en vez de solo cerrar la sesion de golpe, podria poner un mensaje de advertencia unos cuantos minutos antes de que expire para que el usuario pueda alargar el tiempo de uso por asi decirlo mediante una peticion al backend. 
-Agregaria un parametro en la URL para que no se pierda el contexto de lo que se estaba haciendo.
-Tendria que cambiar el orden en el que se estan enviando los datos, ya que primero deben enviarse los encabezados y cookies, y el cuerpo al final. 
-Primero debe ir res.cookie() y despues res.json()


Las cookies no se están guardando en el navegador:
Lista 3 posibles causas y cómo verificarias cada una (algunas causas podrían tener mas de una solución)
1. No hay credentials: 'include'. Para revisar hay que ver la pestaña Network en el navegador. Si la peticion de login no muestra la cookie, hay que cambiar eso. 
2. Configuracion de CORS erronea: Igual, si no esta configurado credentials: true, los navegadores bloquean la cookie. Habria que buscar en la Consola un error que hable de CORS policy.
3. Atributo Secure sin HTTPS: Esto pasa cuando se trabaja con el Secure en true durante desarrollo local. De normal, si se trabaja en localhost, se debe tener esta opcion en false. 

Arquitectura:
Compara localStorage vs Cookies:
Crea una tabla con al menos 5 criterios de comparación
¿Describe un caso específico en el que usarías cada uno respectivamente y porque?

| Criterio | LocalStorage | Cookies (HttpOnly) |
| :--- | :--- | :--- |
| **Acceso desde JavaScript** | Si (Ataques XSS) | No (El flag HttpOnly bloquea el acceso a JS) |
| **Envio a servidor** | Manual (Se debe incluir en cada Header) | Automatico (El navegador la envía solo) |
| **Tamaño maximo** | Grande (Aprox. 5MB - 10MB) | Muy pequeño (Aprox. 4KB) |
| **Seguridad CSRF** | Inmune por defecto | Vulnerable (Requiere configurar flag SameSite) |
| **Persistencia / Expiracion** | Permanente hasta que se borre a mano | Configurable (Se puede poner fecha de expiracion) |

Casos de Uso Especificos
#### 1. ¿Cuando usar Cookies (HttpOnly)?
* **Caso especifico**: Almacenamiento de Tokens de Autenticación (JWT) o identificadores de sesion.
* **Por que**: Debido a que estos tokens son la llave de acceso a la cuenta del usuario, la protección que ofrece el flag HttpOnly es importante para evitar que un ataque XSS pueda leer y robar la informacion del usuario.

#### 2. ¿Cuando usar LocalStorage?
* **Caso especifico**: Guardar preferencias de la UI, como el modo oscuro o el idioma.
* **Por que**: Estos datos no afectan la seguridad de la cuenta. LocalStorage es ideal porque ofrece mas espacio de almacenamiento y permite que JavaScript acceda a ellos de forma rapida para aplicar los cambios visuales en la pagina sin necesidad de consultar al servidor en cada carga.

Diseña una estrategia de migración (en algún ámbito, stack tecnológico, infraestructura, dominio, etc) para una aplicación en producción:
¿Cómo harías la transición sin afectar a usuarios activos? Describe con un ejemplo práctico en el ámbito seleccionado
¿Qué pasos de rollback implementarías?

### Estrategia de Migracion de LocalStorage a Cookies en Produccion

#### Escenario: Transicion sin afectar a usuarios activos
Para migrar una aplicacion con muchos usuarios conectados sin cerrarles la sesion ni generar errores de "No autorizado", se debe aplicar una Estrategia de Doble Lectura.

**Ejemplo practico:**
1.  **Backend Hibrido**: Se actualiza el servidor para que el middleware de autenticacion sea capaz de validar el token si viene en el Header Authorization, o en la Cookie access_token. 
2.  **Despliegue de Cookies**: Al hacer login o renovar el token, el servidor comienza a enviar la Cookie HttpOnly, pero sigue devolviendo el JSON con el token para compatibilidad.
3.  **Actualizacion del Frontend**: Se muestra la version del cliente que usa credentials: 'include'. Una vez que el navegador recibe la primera cookie, la empieza a usar automaticamente.
4.  **Limpieza**: Tras un periodo de tiempo, cuando gran parte de los usuarios ya tengan la cookie activa, se elimina la logica de lectura del Header y el almacenamiento en LocalStorage.


#### Pasos de Rollback 
En caso de que se detecten errores masivos, se implementarian estos pasos:

1.  **Reversion del Frontend**: Hacer un reotrno inmediato a la version anterior del frontend que dependía exclusivamente de localStorage. Como el backend aun puede leer el Header, la aplicacion va a volver a funcionar.
2.  **Mantenimiento de Sesion**: No borrar los tokens del LocalStorage durante la fase de pruebas inicial. Esto permite que si el sistema de cookies falla, el token antiguo siga ahi para ser usado por la version anterior del codigo.
3.  **Desactivacion de Flags**: Si se usa un sistema de Feature Flags, simplemente se apaga use_cookies_auth para que todos los clientes vuelvan a la version previa sin necesidad de lanzar de nuevo.
