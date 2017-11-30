
Cualquiera que se haya enfrentado a la construcción de un sistema distribuido, se habrá dado cuenta que no es tarea fácil. Ya sea porque estamos construyendo un sistema a base de microservicios, porque estamos repartiendo un problema en partes para solucionarlas de forma paralela, o porque nuestro sistema tiene una concurrencia muy alta, nos enfrentaremos a una serie de problemas que son de sobra conocidos. Y es que hay muchos factores a tener en cuenta, como el control de la concurrencia, la sincronización de los datos o la tolerancia a fallos. La buena noticia es que si somos programadores de Elixir o Erlang, lo tendremos mucho más fácil gracias a OTP.


## OTP

OTP (Open Telecom Platform), es un conjunto de librerías, herramientas y patrones que nos permiten gestionar procesos y concurrencia con mucha más facilidad. OTP fue creado pensando en centralitas telefónicas, que por aquella época (hablamos de mediados de los 90), eran de los pocos sistemas altamente concurrentes que existían. Con el paso del tiempo, fueron apareciendo más problemas que OTP podía resolver y es que sus creadores consiguieron crear un modelo capaz de lidiar con conceptos como distribuido, tolerante a fallos, escalable, que funciona en tiempo real y altamente disponible. ¿Qué significan estos términos?

- **Escalable**: cuando un sistema puede adaptarse a cambios de carga o recursos disponibles.
- **Distribuido**: se refiere a cuando podemos agrupar sistemas y como interactúan unos con otros. Podemos crear grupos de sistemas de forma horizontal, por ejemplo añadiendo más máquinas hardware, para tener más recursos o añadir capacidad de proceso de forma vertical haciendo más potentes nuestras máquinas hardware virtualizadas.
- **Tolerante a fallos**: todo el sistema se comportará de forma previsible cuando se produzcan fallos. Si el sistema es tolerante a fallos, la latencia y la capacidad de respuesta no se verán mermadas en exceso y el sistema podrá continuar funcionando de forma normal.
- **Funcionamiento en tiempo real**: el tiempo de respuesta y la latencia serán constantes, y seremos capaces de devolver una respuesta en un tiempo razonable y normalmente bajo. Independientemente de las peticiones concurrentes que recibamos, deberemos ser capaces de responder a todas ellas.
- **Alta disponibilidad**: da igual que tengamos un *bug* en nuestro código, el sistema debe seguir funcionando. Es decir, que las actualizaciones del código, los parches u otras operaciones típicas de mantenimiento, no deben parar el sistema, que debe seguir funcionando de forma continua.

Con OTP, y utilizando tanto Erlang, como Elixir, podemos conseguir controlar todas estas características de los sistemas distribuidos de forma robusta. ¿Y cómo consigue OTP hacer lo difícil sencillo? Pues con una mezcla de las siguientes características.


### Erlang/Elixir

Un lenguaje funcional es de ayuda a la hora de conseguir cierta seguridad a la hora de crear software distribuido, pero más importante es la inmutabilidad del mismo. En otros lenguajes mutables, debemos recurrir a sistemas de sincronización de datos para evitar problemas acceso concurrente. Semáforos, monitores, bloqueos etc. son palabras conocidas entre todos aquellos que nos hemos visto en la necesidad de programar alguna aplicación basada en hilos o procesos.

Con Erlang y Elixir es algo que tenemos solucionado desde la base, ya que al ser los datos inmutables, nos evitamos de un plumazo todos estos problemas. Si las estructuras de datos de nuestros programas no pueden modificarse, no existirán problemas de concurrencia.

Además, estos dos lenguajes también están diseñados para lanzar procesos de forma sencilla y su forma de gestionarlos nos ayuda mucho a la hora de generar programas distribuidos.

### La máquina virtual BEAM

Erlang y Elixir corren sobre una máquina virtual conocida como BEAM, que curiosamente son las siglas de Bogdan/Björn's Erlang Abstract Machine, nombres de dos programadores que trabajaban en Ericsson por la época. 

Esta máquina virtual es parte importante para conseguir los objetivos de los que hablábamos antes. En palabras de Joe Armstrong, uno de los coautores de Erlang "Puedes emular la lógica de Erlang, pero si no corre sobre la máquina virtual de Erlang no puedes emular la semántica". Así que, por muy bonitos que sean los lenguajes de programación, sin una máquina virtual bien diseñada, no tendríamos muchas de las funcionalidades cubiertas. 

La máquina virtual de Erlang está optimizada para gestionar concurrencia, tiene un recolector de basura por cada proceso (haciendo que la recolección sea más sencilla y rápida) y que funciona de forma muy predecible y consistente en todos los casos. 


### Herramientas y librerías

Además de Erlang y Elixir como lenguajes, y además de BEAM como máquina virtual, OTP incluye otra serie de añadidos que hacen toda la magia posible. Algunas de estas características son las siguientes:

- Erlang runtime system (ERS), el kernel (que contiene toda la funcionalidad del ERS) y algunas librerías estándar (stdlib).
- Bases de datos distribuidas como MNESIA. Es rápida y reside en el mismo espacio de memoria que las aplicaciones.
- Una colección de protocolos e interfaces para comunicarse con otros lenguajes de programación, como C o Java, herramientas de seguridad como SSL, sistemas de acceso a LDAP y un largo etc.
- Herramientas para desarrollo, distribución y gestión de nuestros programas.
- Debugger, un entorno gráfico que nos permite navegar por la ejecución de nuestro código.
- Observer, herramienta para monitorizar procesos y su estado.

Y muchas otras más características, que serían largas de enumerar, pero que hacen de Erlang/OTP una herramienta muy completa.


### Nodos

Los nodos son un conjunto de las herramientas anteriormente descritas, así como de herramientas de terceros, que funcionan sobre el sistema operativo. Cada nodo, puede funcionar de forma independiente, pero se comunica con el resto de nodos de la red, permitiendo hacer nuestro sistema escalable de forma horizontal. 


## PROCESOS

Aunque OTP está compuesta de muchas partes diferentes, podríamos decir que la parte principal son los procesos. Al final son los procesos los encargados de realizar las operaciones demandadas, y la gestión que hace OTP de ellos es parte fundamental en todo el sistema.

No debemos pensar en los procesos como si estuviéramos hablando de procesos del Sistema Operativo. En este caso los procesos son mucho más livianos, lo que nos permite ejecutar muchísimos de forma concurrente sin que nuestro sistema se resienta. De hecho un nodo puede ejecutar cientos de miles de procesos (incluso millones dependiendo de la potencia del hardware), sin afectar al rendimiento. 

Un proceso en Erlang/Elixir está compuesto por su buzón de mensajes, su propio recolector de basura, un stack con la información necesaria y una zona para gestionar los enlaces a otros procesos. En conjunto, es probable que el tamaño no sea más que de 1Kb (2Kb en sistemas de 64 bits). Como veis los procesos son muy pequeños. 

Pero la parte más importante es sin duda la comunicación entre procesos. Los procesos se comunican en base a un modelo de actores, o lo que es lo mismo, los procesos no comparten memoria, y solo se comunican unos con otros a través del buzón de mensajes.


Si un proceso quiere comunicarse con otro, dejará un mensaje en el buzón del proceso destinatario, que el proceso receptor procesará cuando le sea posible. Gracias a este modelo de actores, nos evitamos los problemas relacionados con compartir memoria y hacemos mucho más sencillo el trabajo del recolector de basura.

Al tener la posibilidad de gestionar los procesos de forma independiente, se nos presentan interesantes opciones para crear estructuras jerárquicas de procesos de forma que sea mucho más sencillo gestionar los procesos. Es aquí donde entran los conceptos de aplicación, supervisor o los más básicos como los GenServer.

### Supervisores

Los supervisores son procesos que tienen el único objetivo de lanzar y  monitorizar procesos *hijos*. Son capaces de detectar cuando un proceso que depende de él se ha detenido (por un fallo o por una ejecución normal), y dependiendo de su configuración, utilizar diferentes estrategias para su reinicio. Son las siguientes:

- **One for one**: si un proceso falla, se vuelve a reiniciar ese y sólo ese proceso.
- **One for all**: si un proceso falla, se detienen todos los procesos de ese supervisor y se vuelven a iniciar.
- **Rest for one**: si un proceso falla, además de él,  se detienen todos los procesos que se hayan iniciado después y se vuelven a iniciar.

Por tanto la clave a la hora de usar supervisores, es asegurarse de que el orden de inicio está correctamente designado y la estrategia de reinicio elegida es la correcta.

Con todo esto podemos crear estructuras de supervisión más o menos complejas. Los fallos se pueden ir propagando hacia arriba en la jerarquía de supervisión. Si un proceso falla, su supervisor decidirá reiniciarlo. Si el problema se soluciona con ese reinicio, la ejecución continuará de forma normal. Pero si el proceso reiniciado vuelve a fallar, se seguirá intentando, hasta que se alcance un límite de intentos preconfigurado. Es ahí cuando el supervisor se detendrá y pasará el error a su propio supervisor. Si ningún reinicio soluciona el problema, es posible que se tomen medidas drásticas como reiniciar la máquina virtual, o incluso reiniciar la máquina.


### Aplicaciones

Las aplicaciones no tienen una definición fácil, pero son algo así como conjuntos de módulos, supervisores, configuraciones y otros recursos. Estos conjuntos son independientes unos de otros y es una forma de agrupar código para poder desplegarlo en cualquier parte. Por ejemplo podemos desplegar una aplicación en un nodo de Erlang y dicha aplicación podrá ser arrancada y detenida como un todo. Las aplicaciones pueden ser de tipo *normal* o de tipo *librería*. Las primeras arrancan un supervisor para poder gestionar los procesos dependientes, mientras que las de tipo librería no lo hacen, ya que no lo necesitan.


### GenServer

Un GenServer, implementa la típica estructura cliente servidor. Aunque con Erlang y Elixir pueden lanzarse procesos de forma manual, es mucho más sencillo crearlos a través de un GenServer. Los GenServer se basan en comportamientos (Behaviours en inglés), que definen una interface común para la comunicación entre procesos. Esta interface utiliza llamadas `handle_call` (síncronas) y `handle_cast` (asíncronas), para realizar todas las operaciones requeridas. Los GenServer se pueden iniciar desde una función  `start_link`, que suele ser utilizada, entre otras cosas, por los supervisores a la hora de arrancar el proceso.

Como hemos comentado antes, con OTP utilizamos un modelo de actores, y solo podemos comunicarnos con un proceso a través de su buzón de mensajes. Si utilizamos los call, nuestro proceso quedará a la espera de una respuesta del proceso remoto, mientras que si utilizamos cast, continuaremos la aplicación sin esperar ninguna respuesta.


## ACTUALIZACIÓN EN CALIENTE

Como decíamos, si un sistema que tiene que tener alta disponibilidad no puede detenerse para ser actualizado. Debemos asegurar que el sistema es capaz de funcionar incluso cuando tenemos que aplicar parches para corregir *bugs* o para añadir nueva funcionalidad.

Por suerte, con OTP, tenemos la posibilidad de utilizar la actualización de código en caliente. Para ello los módulos tienen que cargarse previamente, de lo que se encarga un componente de OTP conocido como *servidor de código*.

En el sistema puede haber hasta dos versiones de un mismo módulo, aunque inicialmente solo habrá una versión. Si realizamos algún cambio en el código, la versión existente pasará a ser la versión antigua, y la versión nueva pasará a ser la actual. Ambas versiones pueden seguir funcionando, ya que puede haber módulos que estén siendo utilizados por algún proceso en ejecución. Cuando sea posible, OTP irá actualizando los módulos de todos los procesos en ejecución. Si tenemos dos versiones y añadimos una tercera, la versión inicial será eliminada y los procesos que aun estén funcionando con ella serán detenidos.

## TOLERANCIA A FALLOS

Los nodos de Erlang/OTP entran en juego cuando queremos hacer que nuestra aplicación sea tolerante a fallos. Aunque al tener más de un nodo, nos encontramos con otros problemas típicos de la programación distribuida. 

### Problemas en el paso de mensajes

Tenemos multitud de procesos en ejecución, que pueden ejecutarse en distintos nodos. Si hay fallos de red, sobrecarga de procesos o cualquier otro problema, cabe la posibilidad de que algún mensaje se pierda. En este caso podemos seguir tres estrategias distintas:

- **Al menos uno**: imagina que tenemos un servidor web en el que queremos iniciar sesión. Si la primera petición falla, podemos intentarlo en otro nodo. Si el segundo nodo funciona, nos quedamos con la sesión de este. Es posible que la primera petición acabe funcionando (aunque con retraso), pero nosotros la ignoraremos.
- **Como mucho uno**: imaginemos que un sistema que envía SMS. Si nuestro sistema envía millones de mensajes al día, es posible que la pérdida de algunos mensajes sea asumible y no nos preocupe. En ese caso realizamos la petición de envío de SMS y nos olvidamos.
- **Exactamente uno**: en este caso tenemos que asegurar que la petición se ejecuta una vez (y solo una). Si solo tenemos un nodo, no habrá problemas, pero la cosa se complica si hay varios. Si un nodo falla, podemos solicitar a otro que resuelva la petición. ¿Pero por qué ha fallado el primero? Puede ser porque nunca le llegó la petición, porque sufrió un error o incluso recibió la petición, pero lo que se ha perdido ha sido la respuesta. En cualquier caso, deberemos pensar en estos problemas a la hora de utilizar esta estrategia.

### Problemas con los datos compartidos

Si tenemos varios nodos funcionando, nos encontraremos con el problema de los datos compartidos entre ellos. En este caso podemos seguir varias estrategias:

- **No compartir nada**: los procesos de un nodo tienen cada uno su versión de los datos y de su estado actual y no lo comparten con ningún otro nodo. Esto hace que la escalabilidad del sistema sea predecible y lineal. El problema de esta estrategia, es que si perdemos el nodo, también perdemos los datos y el estado actual de los procesos.
- **Compartir una parte**: si queremos asegurar de que aunque un nodo falle, podamos conservar los datos más críticos, utilizamos esta estrategia. Los datos y el estado se irán copiando entre nodos, para asegurarnos de tener una copia en cada uno. Esto reduce algo el rendimiento, y nos crea el problema de que si un nodo se reinicia, tiene que volver a adquirir los datos de todos los procesos. 
- **Compartir todo**: en este caso no nos podemos permitir que se pierda un solo dato, y debemos asegurarnos de que una transacción se ejecuta una sola vez. Esta técnica es la más segura, pero también nos obliga a sacrificar escalabilidad. 

### Consistencia vs disponibilidad

Aunque las soluciones reales no son tan simples, el teorema de CAP ya nos indica que todo sistema distribuido tiene que elegir entre consistencia, disponibilidad y tolerancia a particiones. Y cuando diseñamos nuestra aplicación distribuida, es algo que debemos tener en cuenta.

Por ejemplo en las estrategias para gestionar el paso de mensajes, podemos ver que dependiendo de la que elijamos tendremos que sacrificar o bien la consistencia o bien la disponibilidad. La estrategia *al menos uno* es muy escalable, pero no muy consistente, mientras que la estrategia *exactamente uno* es muy consistente, pero mucho menos escalable, por lo que la disponibilidad se resiente.

Lo mismo nos pasa con el tema de compartir datos. *Compartir todo* hace que seamos mucho más fiables, pero que nuestra disponibilidad sea menor. Si *no compartimos nada*, pasa justamente lo contrario, somos menos fiables, pero nos aseguramos una alta disponibilidad.

## CONCLUSIÓN

Erlang/Elixir y OTP nos proporcionan muchas herramientas para que construir sistemas distribuidos sea mucho menos doloroso que con otras plataformas y lenguajes de programación. Aun así, no es tarea fácil y hay muchos aspectos que deberemos tener en cuenta para asegurar que nuestra aplicación es tolerante a fallos, altamente disponible etc. 

En definitiva, construir sistemas distribuidos es difícil, pero muy divertido.
