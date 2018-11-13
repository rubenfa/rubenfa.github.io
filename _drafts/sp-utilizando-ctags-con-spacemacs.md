Como desarrollador, me gusta configurar las herramientas que utilizo para que hagan las cosas como yo quiero y con las funcionalidades que necesito. Dependiendo del editor que utilices, esto puede ser más sencillo o más complicado. Para desarrollar en Elixir, [me gusta utilizar Spacemacs](https://charlascylon.com/2016-06-20-spacemacs-el-editor-perfecto-Elixir). Lo bueno que tiene Emacs es que es muy configurable, y Spacemacs (que no es más que un Emacs tuneado) lo hace todavía más sencillo. A través del archivo `.spacemacs`  se puede configurar prácticamente cualquier aspecto del editor, y con el tiempo [he conseguido una configuración bastante estable](https://charlascylon.com/2017-09-20-spacemacs-mi-configuracion-personal).

Hace unos días empecé el desarrollo de una sencilla web para uno de mis proyectos personales. Al editar el `HTML` me di cuenta de que el modo de edición web, `web-mode`, no me mostraba las clases CSS de mi hoja de estilos. Mi memoria es más o menos como la de un pez, así que aunque acabe de definir una clase CSS, en cosa de 2 minutos se me ha olvidado su nombre. Así que este "problema", era un verdadero fastidio. Problemas del primer mundo.

¿Y cómo solucionarlo? Y ahí es cuando entran en juego `ctags`


## Ctags al rescate

Ctags no es más que una herramienta que permite crear un índice (tag) con información de los archivos de código fuente de nuestros proyectos. Dependiendo de nuestra configuración, podremos generar índices para archivos de diferentes lenguajes, haciendo que sus variables, clases, funciones etc. estén indexadas y por tanto sean fáciles de encontrar. En definitiva es como crear una guía de teléfonos para nuestro código fuente, de manera que si tenemos que buscar la variable `productId`, bastará con buscar en el índice para encontrar su posición exacta en un archivo de código.

Lo bueno es que **este índice puede ser aprovechado por otras herramientas** para darnos funcionalidad extra. Por ejemplo, Emacs podrá navegar por el código fuente, permitiéndonos saltar a la definición de una función o variable, utilizando `M-.`. También podemos conseguir que los modos de autocompletado de código, en este caso `company-mode`, nos muestren elementos del índice que ha creado ctags, para poder seleccionarlos. Justo lo que yo quería conseguir.

Aunque ctags es bastante sencillo en cuanto a concepto, la cosa se complica por la multitud de opciones que tenemos.


## Ctags y sus diferentes sabores

La filosofía Open Source tiene muchas cosas buenas. Más buenas que malas diría yo. Pero entre las malas, la que peor llevo es la de la dispersión del esfuerzo para crear herramientas diferentes que tienen el mismo objetivo. Y es que esto seguro que es un problema que también habéis sufrido. Existe una herramienta que hace X y alguien decide que no le gusta, que no se mantiene lo suficiente o que va a cambiar el enfoque, así que decide crear la herramienta Y. Pasa el tiempo y alguien decide que ni Y, , ni X, hacen las cosas como a ellos les gustaría. ¿Solución? Sí, lo has adivinado: crear la librería Z. 

Es cierto que la filosofía de Microsoft de intentar coparlo todo tampoco es buena, pero como se suele decir, en el termino medio está la virtud. Y es que hay que pensar que cuando se dispersan tanto las herramientas, también lo hace su documentación. La ayuda que proporcionan los compañeros desarrolladores en foros y listas de distribución, también se dispersa, haciendo difícil la solución de problemas concretos.

Pero bueno, después de este discurso de abuelo cebolleta enfadado, vamos a ver los distintos sabores que existen para generar el índice con ctags.

- Exuberant Ctags: inicialmente creado para Vim, aunque es compatible con Emacs. No hay que olvidarse de incluir la opción `-e` para la compatibilidad con este editor. Soporta cerca de 40 lenguajes de programación y la posibilidad de ampliar el soporte utilizando expresiones regulares.
- Etags: es la utilidad que viene de serie con Emcas y en este caso el índice se genera especialmente para Emacs.
- Universal Ctags: fork de Exuberant Ctags. Por lo visto el mantenimiento de Exuberant Ctags ha sido inexistente en estos últimos años, así que alguien decidió crear un fork y hacer la guerra por su cuenta.

s
