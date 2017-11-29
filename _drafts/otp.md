
Cualquiera que se haya enfrentado a la construcción de un sistema distribuido, se habrá dado cuenta que no es tarea fácil. Ya sea porque estamos construyendo un sistema a base de microservicios, porque estamos repartiendo un problema en partes para solucionarlas de forma paralela, o porque nuestro sistema tiene una concurrencia muy alta, nos enfrentaremos a una serie de problemas que son de sobra conocidos. Y es que hay muchos factores a tener en cuenta, como el control de la concurrencia, la sincronización de los datos o la tolerancia a fallos. La buena noticia es que si somos programadores de Elixir o Erlang, lo tendremos mucho más fácil gracias a OTP.


## OTP

OTP (Open Telecom Platform), es un conjunto de librerías, herramientas y patrones que nos permiten gestionar procesos y concurrencia con mucha más facilidad. OTP fue creado pensando en centralitas telefónicas, que por aquella época (hablamos de mediados de los 90), eran de los pocos sistemas altamente concurrentes que existían. Con el paso del tiempo, fueron apareciendo más problemas que OTP podía resolver y es que los creadores consiguieron crear un modelo capaz de lidiar con los términos distribuido, tolerante a fallos, escalable, que funciona en tiempo real y altamente disponible. ¿Qué significan estos términos?

- **Escalable**: cuando un sistema puede adaptarse a cambios de carga o recursos disponibles.
- **Distribuido**: se refiere a cuando podemos agrupar sistemas y como interactúan unos con otros. Podemos crear grupos de sistemas de forma horizontal, por ejemplo añadiendo más máquinas hardware, para tener más recursos o añadir capacidad de proceso de forma vertical haciendo más potentes nuestras máquinas hardware virtualizadas.
- **Tolerante a fallos**: todo el sistema se comportará de forma previsible cuando se produzcan fallos. Si el sistema es tolerante a fallos, la latencia y la capacidad de respuesta no se verán mermadas en exceso y el sistema podrá continuar funcionando de forma normal.
- **Funcionamiento en tiempo real**: el tiempo de respuesta y la latencia serán constantes, y seremos capaces de devolver una respuesta en un tiempo razonable y normalmente bajo. Independientemente de las peticiones concurrentes que recibamos, deberemos ser capaces de responder a todas ellas.
- **Alta disponibilidad**: da igual que tengamos un *bug* en nuestro código, el sistema debe seguir funcionando. Es decir, que las actualizaciones del código, los parches u otras operaciones típicas de mantenimiento, no deben parar el sistema, que debe seguir funcionando, de forma continua.

Con OTP, y utilizando tanto Erlang, como Elixir, podemos conseguir controlar todas estas características de los sistemas distribuidos, de forma robusta.






