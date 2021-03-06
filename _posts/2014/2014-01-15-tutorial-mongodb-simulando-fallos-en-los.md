---
layout: post
title: Tutorial MongoDB. Simulando fallos en los conjuntos de réplicas
redirect_from:
  - /post/73396624673/tutorial-mongodb-simulando-fallos-en-los.html
  - /post/73396624673/
---


<p>En los últimos artículos sobre <strong>conjuntos de réplicas</strong> de este <strong>tutorial de MongoDB</strong>, hemos podido ver cómo crear un conjunto de réplicas, cómo configurarlo y cómo se trabaja con él. Lo único que nos queda por ver es cómo se comporta <strong>MongoDB</strong> en situaciones en las que algún miembro del conjunto deja de funcionar. Así que en esta ocasión intentaremos poner en apuros a nuestras réplicas para ver cómo se comportan.</p>

<blockquote>
  <p><strong>Nota</strong>: recuerda que para probar los ejemplos de este artículo, necesitas crear un conjunto de replicas. Si no sabes como hacerlo <a href="https://www.charlascylon.com/post/69774579592/tutorial-mongodb-creacion-configuracion-replicas" title="Enlace a creación y configuración de réplicas">aquí explico como hacerlo</a>. Si no sabes qué son las réplicas,  <a href="https://www.charlascylon.com/post/69062614637/tutorial-mongodb-alta-disponibilidad-replicas" title="enlace a alta disponibilidad con réplicas">en este otro artículo</a> explico qué son y para qué sirven.</p>
</blockquote>

<h3>Verificando el estado de los servidores</h3>

<p>En nuestro estado inicial, tenemos tres servidores <strong>MongoDB</strong> corriendo en los puertos <em>27666</em>, <em>27667</em> y <em>27668</em>. Uno de ellos será el servidor principal, y los otros serán servidores secundarios. Para saber en qué estado está cada uno, podemos conectarnos a través de <strong>la consola de MongoDB</strong> a cualquiera de los servidores y ejecutar el comando <em>rs.status</em>. Veamos un ejemplo:</p>

<!-- code[javascript] -->

<pre><code>rep1:PRIMARY&gt; rs.status()
{
    "set" : "rep1",
    "date" : ISODate("2014-01-13T22:08:19Z"),
    "myState" : 1,
    "members" : [
            {
                    "_id" : 0,
                    "name" : "CYLON-MACHINE:27666",
                    "health" : 1,
                    "state" : 1,
                    "stateStr" : "PRIMARY",
                    "uptime" : 1250,
                    "optime" : Timestamp(1389220435, 1000),
                    "optimeDate" : ISODate("2014-01-08T22:33:55Z"),
                    "self" : true
            },
            {
                    "_id" : 1,
                    "name" : "CYLON-MACHINE:27667",
                    "health" : 1,
                    "state" : 2,
                    "stateStr" : "SECONDARY",
                    "uptime" : 1205,
                    "optime" : Timestamp(1389220435, 1000),
                    "optimeDate" : ISODate("2014-01-08T22:33:55Z"),
                    "lastHeartbeat" : ISODate("2014-01-13T22:08:17Z"),
                    "lastHeartbeatRecv" : ISODate("2014-01-13T22:08:18Z"),
                    "pingMs" : 0,
                    "syncingTo" : "CYLON-MACHINE:27666"
            },
            {
                    "_id" : 2,
                    "name" : "CYLON-MACHINE:27668",
                    "health" : 1,
                    "state" : 2,
                    "stateStr" : "SECONDARY",
                    "uptime" : 1142,
                    "optime" : Timestamp(1389220435, 1000),
                    "optimeDate" : ISODate("2014-01-08T22:33:55Z"),
                    "lastHeartbeat" : ISODate("2014-01-13T22:08:18Z"),
                    "lastHeartbeatRecv" : ISODate("2014-01-13T22:08:18Z"),
                    "pingMs" : 0,
                    "syncingTo" : "CYLON-MACHINE:27666"
            }
    ],
    "ok" : 1
}
</code></pre>

<p>Cómo podemos ver en el resultado, el servidor que escucha por el puerto <em>27666</em> es el servidor principal. También podemos ver otros datos interesantes, como el estado en el que se encuentran los servidores, o cuándo han sido actualizados por última vez. Cómo nosotros no hemos ejecutado ninguna operación de actualización nueva, los campos <em>optimeDate</em> y <em>optime</em> son iguales para los tres servidores.</p>

<h3>¿Qué pasa si se cae un servidor?</h3>

<p>Para simular la caída de un servidor, simplemente vamos al administrador de tareas y eliminamos uno de los procesos de  <strong>MongoDB</strong> que están en ejecución. En este caso vamos a eliminar el proceso del servidor principal, ya que así nos aseguraremos de que se lance un proceso de elección de nuevo principal.</p>

<p>Tras eliminar el proceso, veremos en la consola de los otros dos servidores, que estos tratan de localizar al servidor que no está funcionando:</p>

<!-- code[javascript] -->

<pre><code>Mon Jan 13 23:17:54.849 [rsBackgroundSync] replSet sync source problem: 10278 db client error communicating with server: CYLON-MACHINE:27666
Mon Jan 13 23:17:54.850 [rsBackgroundSync] replSet syncing to: CYLON-MACHINE:27666  Mon Jan 13 23:17:54.891 [rsHealthPoll] DBClientCursor::init call() failed
Mon Jan 13 23:17:54.892 [rsHealthPoll] replset info CYLON-MACHINE:27666 heartbeat failed, retrying 
Mon Jan 13 23:17:55.849 [rsBackgroundSync] repl: couldn't connect to server CYLON-MACHINE:27666
Mon Jan 13 23:17:55.850 [rsBackgroundSync] replSet not trying to sync from CYLON-MACHINE:27666, it is vetoed for 10 more seconds
Mon Jan 13 23:17:55.851 [rsBackgroundSync] replSet not trying to sync from CYLON-MACHINE:27666, it is vetoed for 10 more seconds
Mon Jan 13 23:17:55.887 [rsHealthPoll] replSet info CYLON-MACHINE:27666 is down (or slow to respond):
Mon Jan 13 23:17:55.888 [rsHealthPoll] replSet member CYLON-MACHINE:27666 is now in state DOWN
</code></pre>

<p>Como podéis ver, en este proceso el servidor que ha fallado es marcado como caído. Si volvemos a ejecutar el comando <em>rs.status</em>, veremos que los datos de ese servidor han cambiado.</p>

<!-- code[javascript] -->

<pre><code>{
     "_id" : 0,
     "name" : "CYLON-MACHINE:27666",
     "health" : 0,
     "state" : 8,
     "stateStr" : "(not reachable/healthy)",
     "uptime" : 0,
     "optime" : Timestamp(1389220435, 1000),
     "optimeDate" : ISODate("2014-01-08T22:33:55Z"),
     "lastHeartbeat" : ISODate("2014-01-13T22:27:11Z"),
     "lastHeartbeatRecv" : ISODate("2014-01-13T22:17:54Z"),
     "pingMs" : 0
}
</code></pre>

<p>En ese momento, al detectar que el servidor principal no está accesible, se lanza una elección para decidir cuál será el nuevo servidor principal.</p>

<!-- code[javascript] -->

<pre><code>Mon Jan 13 23:17:55.985 [rsMgr] replSet info electSelf 1
Mon Jan 13 23:17:55.987 [conn120] replSet voting no for CYLON-MACHINE:27668 already voted for another
Mon Jan 13 23:17:55.989 [rsMgr] replSet couldn't elect self, only received 1 votes
Mon Jan 13 23:17:58.891 [rsHealthPoll] replset info CYLON-MACHINE:27666 heartbeat failed, retrying
Mon Jan 13 23:18:00.641 [rsMgr] replSet info electSelf 1
Mon Jan 13 23:18:00.855 [rsMgr] replSet PRIMARY
</code></pre>

<p>Cuando se producen unas elecciones para nuevo servidor principal, los servidores se comunican unos con otros con la intención de decidir quién es el servidor que debería ser el principal. El proceso de elección tiene múltiples variantes, que ya expliqué <a href="https://www.charlascylon.com/post/69062614637/tutorial-mongodb-alta-disponibilidad-replicas" title="enlace a alta disponibilidad con réplicas">en el artículo teórico sobre conjuntos de réplicas.</a>. En nuestro caso el servidor que escucha por el puerto <em>27667</em> se ha establecido como principal tras finalizar la elección.</p>

<h3>¿Qué pasa si se cae otro servidor más?</h3>

<p>Si siguiendo el mismo procedimiento, matamos el proceso de otro de los servidores, el mensaje que mostrará la consola será el siguiente:</p>

<!-- code[javascript] -->

<pre><code>Mon Jan 13 23:48:01.731 [rsMgr] replSet can't see a majority, will not try to elect self
</code></pre>

<p>En este caso el servidor restante nunca se va a convertir en el servidor principal, ya que no es capaz de conectar con la mayoría de servidores. Recordemos con mayoría de servidores nos estámos refiriendo a los votos en juego, que  en este caso eran 3 votos. Para convertirse en principal un servidor debería conseguir al menos 2 votos, pero ahora esto es algo imposible, ya que al caerse los otros servidores, solo hay un voto en juego.</p>

<p>Si volvemos a arrancar uno de los servidores, se volverá a lanzar un proceso de elección y se elegirá de nuevo un servidor principal.</p>

<h3>Forzando las elecciones para cambiar el servidor principal</h3>

<p>Si volvemos a arrancar todos los servidores, es posible que la configuración de los servidores haya cambiado. Dependiendo de como se hayan desarrollado las elecciones el servidor principal ahora puede ser otro. Esto será así hasta que se produzca una nueva elección. Pero no necesitamos esperar a qué se produzca un fallo, ya que podemos forzar el proceso conectándonos al servidor principal y ejecutando el comando <em>rs.stepDown</em></p>

<!-- code[javascript] -->

<pre><code>rep1:PRIMARY&gt; rs.stepDown()
Tue Jan 14 00:00:06.013 DBClientCursor::init call() failed
Tue Jan 14 00:00:06.021 Error: error doing query: failed at src/mongo/shell/quer
y.js:78
Tue Jan 14 00:00:06.023 trying reconnect to localhost:27668
Tue Jan 14 00:00:06.025 reconnect localhost:27668 ok
rep1:SECONDARY&gt; rs.status()
</code></pre>

<p>Como vemos en el ejemplo, se lanzan unas nuevas elecciones, en las que no entra el servidor actual, por lo que se elige uno de los otros dos servidores como principal.</p>

<h3>Cambiando la prioridad de los servidores.</h3>

<p>Si todos los servidores están en el mismo estado, están actualizados y tienen la misma prioridad, la elección puede elegir a cualquiera de los servidores como principal. Si queremos darle mayor importancia a uno de ellos, y asegurarnos de que es elegido como principal si está disponible, deberemos jugar con la <em>prioridad</em>. Veamos un ejemplo de como podemos cambiarlo.</p>

<!-- code[javascript] -->

<pre><code>rep1:PRIMARY&gt; conf = rs.conf()
{
    "_id" : "rep1",
    "version" : 3,
    "members" : [
            {
                    "_id" : 0,
                    "host" : "CYLON-MACHINE:27666"
            },
            {
                    "_id" : 1,
                    "host" : "CYLON-MACHINE:27667"
            },
            {
                    "_id" : 2,
                    "host" : "CYLON-MACHINE:27668"
            }
    ]
}   
rep1:PRIMARY&gt; conf.members[1].priority=2
2
rep1:PRIMARY&gt; rs.reconfig(conf)
Tue Jan 14 00:08:41.806 DBClientCursor::init call() failed
Tue Jan 14 00:08:41.808 trying reconnect to localhost:27666
Tue Jan 14 00:08:41.811 reconnect localhost:27666 ok reconnected to server after rs command (which is normal)

rep1:SECONDARY&gt;
</code></pre>

<p>Como ya habíamos dicho anteriormente un servidor <strong>MongoDB</strong> tiene por defecto una prioridad de 1. En nuestro ejemplo, hemos cambiado la prioridad del servidor que escucha por el puerto <em>27667</em> a 2, por lo que se convierte en el servidor con la prioridad más alta. Desde este momento, siempre que se produzca un fallo en los otros servidores, en las elecciones resultantes, este servidor será elegido como principal al tener la prioridad más alta.</p>

<h3>Conclusiones</h3>

<p><strong>MongoDB</strong> tiene un sistema robusto y fiable para elegir un servidor principal en caso de que se produzca un fallo. En una arquitectura en la que solo puede haber un servidor principal, y en la que solo se pueden realizar operaciones de actualización sobre el servidor principal, este proceso es <strong>crítico</strong>. En el próximo artículo, veremos como se comporta un conjunto de réplicas a la hora de realizar cambios, y qué pasa cuándo un servidor falla y tiene que actualizar sus datos.</p>

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*