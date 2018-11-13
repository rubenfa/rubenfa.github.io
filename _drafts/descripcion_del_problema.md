Llevo tiempo dándole vueltas a como explicar algunas cosas de Elixir, con algún ejemplo chulo. Por suerte se me ha ocurrido una idea que englobará muchos de los conceptos que se utilizan en Elixir, incluyendo una de sus mejores características: OTP. Obviamente no es tarea para explicar en una sola entrada, así lo iré explicando todo en varias entradas. De momento, como hay que empezar por algo, os voy a contar en que consiste la idea.


## El juego

Una de las cosas que más me gustan es la música rock. Así que vamos a crear un juego bastante rockero. La idea es que sonará un pedazo de una canción y tendremos que adivinarla. El pedazo tendrá una longitud variable, pero no durará más de 10s, que es el tiempo máximo que tienes para elegir una respuesta. Será un riff de guitarra corto y representativo. Si llevas el rock en las venas, no te será difícil adivinar la canción. 

Para hacerlo más divertido, se mostrarán 4 opciones en pantalla, indicando grupo y título de la canción. Solo una de las opciones es la correcta. Lo más interesante de esto es que obtendrás más puntos cuánto más pronto adivines la canción. 

- Adivinar la canción: 100 puntos.
- Fallar: -50 puntos.
- Si aciertas la respuesta, por cada segundo que te sobre recibirás 10 puntos. Es decir, que si aciertas en el segundo 4, te habrán sobrado 6 segundos, por lo que ganas 60 puntos extra.
- Si aciertas 5 canciones seguidas, obtendrás 100 puntos extra.

Como veis la mecánica es sencilla y no tiene mayor dificultad. Para darle alegría a la cosa, vamos a hacer el juego multijugador, pudiendo jugar de 1 a 4 personas. El que más puntos consiga, será el ganador.

Para poder gestionar las partidas, se utilizará el concepto sala, a la que se pueden unir los jugadores (recuerda, como mucho 4), para iniciar una partida. Las salas podrán ser generadas al vuelo para jugar con otras personas que estén esperando una partida, pero también podrán crearse bajo demanda, para que se pueda invitar a gente a esa sala a través de un enlace único.

Cada partida tendrá 20 canciones, y el jugador que más puntos obtenga, será el ganador de la partida y obtendrá la guitarra de oro.

¿Y cómo traducimos esto a Elixir?


## El juego en Elixir

Lo primero que vamos a hacer es crear la lógica del juego de forma aislada. Toda esta lógica tendrá una API, con las funciones que tendremos que utilizar para que el juego se desarrolle según los requisitos.

Al hacerlo de forma aislada, nos aseguraremos de que el juego funciona sin necesidad de ningún tipo de interfaz, pudiendo utilizar directamente Iex. Empezaremos por la lógica de un solo jugador, para más tarde añadir el resto de jugadores.


## Usando OTP

Si por algo destaca la máquina virtual de Erlang, es por OTP. Por si no lo sabéis OTP es el conjunto de herramientas que tiene la máquina virtual de Erlang (sobre la que corre Elixir) para desarrollar aplicaciones concurrentes, escalables y tolerantes a fallos. No quiero extenderme mucho aquí sobre lo que es OTP, así que si queréis más información podéis ver lo que escribí [aquí en el blog](https://charlascylon.com/2017-02-15-fail-fast), en [Genbeta](https://www.genbeta.com/desarrollo/construyendo-aplicaciones-distribuidas-con-erlang-otp) o leer el fantástico libro [Designing for scalability with Erlan/OTP](https://www.amazon.es/Designing-Scalability-Erlang-OTP-Fault-Tolerant-ebook/dp/B01FRIM8OK).

El caso es que nos aprovecharemos de la facilidad de OTP para crear procesos concurrentes, para aislar partidas, jugadores y realizar la comunicación entre ellos en tiempo real.

Por ejemplo, cuando accedemos a una sala, estaremos accediendo a un proceso, que a su vez tendrá de 1 a 3 procesos hijos que representarán a los jugadores y que mantendrá el estado de la partida.

No os preocupéis si esto resulta un poco confuso ahora mismo, porque lo veremos más claro según lo vayamos desarrollando.


## Phoenix

El último paso que daremos será el de crear la interfaz del juego. Hoy en día todo es web, así que nosotros no vamos a ser menos, y vamos a crear una aplicación con el framework web de Elixir por excelencia: Phoenix. 

Con Phoenix podremos gestionar la creación de partidas personalizadas en salas o unirnos a los jugadores que ya estén jugando en ese momento. Phoenix hará uso de sus websockets para conectar los clientes con los procesos de servidor. Sí, has leído bien, Phoenix puede conectar sockets JavaScript con procesos en el servidor, por lo que la actualización de la información puede hacerse en tiempo real y de forma muy sencilla.

## Código fuente

El código fuente del juego podréis encontrarlo en GitHub, y estaré encantado de responder a cualquier pregunta.

