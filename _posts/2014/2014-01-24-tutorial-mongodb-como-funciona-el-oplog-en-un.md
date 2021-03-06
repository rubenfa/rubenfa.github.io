---
layout: post
title: Tutorial MongoDB. Como funciona el Oplog en un conjunto de réplicas
redirect_from:
  - /post/74370147141/tutorial-mongodb-como-funciona-el-oplog-en-un.html
  - /post/74370147141/
---

<p><a href="https://www.charlascylon.com/post/73396624673/tutorial-mongodb-simulando-fallos-en-los-conjuntos-de">En el anterior artículo</a>  vimos como podemos poner en apuros a un conjunto de réplicas de <strong>MongoDB</strong>. Cuándo un servidor se cae, los servidores restantes se lanzan a un proceso de elección del que será el nuevo servidor principal. Si tenemos todo bien configurado, nuestro sistema será estable y garantizaremos una alta disponibilidad de nuestros datos. Pero, ¿qué pasa cuándo un servidor que se ha caído vuelve a estar operativo? ¿Cómo sincroniza los datos para estar actualizado? Pues eso es lo que vamos a intentar explicar en esta entrada.</p>

<h3>La colección Oplog</h3>

<p>Ya expliqué en su momento qué era y para qué servía la colección <strong>Oplog</strong>, pero creo que no está de más recordarlo.</p>

<p>Si un servidor principal realiza cambios sobre sus datos, nada más terminar, tiene que guardar las operaciones realizadas en una colección llamada <strong>Oplog</strong>. Es una colección especial del sistema con un tamaño limitado, y que funciona de manera circular. Es decir que para no superar el tamaño máximo asignado, va borrando registros antiguos para poder añadir registros nuevos.</p>

<p>El contenido de esta colección se va replicando a los otros servidores, de manera que estos pueden aplicar también los cambios pendientes. La replicación se realiza de forma asíncrona y es un proceso inteligente. Para evitar cargar el servidor principal, los datos se pueden replicar entre servidores secundarios, siempre que el que mande los datos esté actualizado.</p>

<p>¿Podemos acceder a los datos de esa colección? Podemos hacerlo de dos maneras. La primera es lanzando una consulta sobre la colección <em>oplog.rs</em> que estará dentro de la base de datos <em>local</em>.</p>

<!-- code[javascript] -->

<pre><code>&gt;mongo localhost:27667
MongoDB shell version: 2.4.8
connecting to: localhost:27667/test
rep1:PRIMARY&gt; use local
switched to db local
rep1:PRIMARY&gt; db.oplog.rs.find().pretty();
{
        "ts" : Timestamp(1386797270, 1),
        "h" : NumberLong("-4797359460383157260"),
        "v" : 2,
        "op" : "n",
        "ns" : "",
        "o" : {
                "msg" : "Reconfig set",
                "version" : 3
        }
}
{
        "ts" : Timestamp(1389220325, 1),
        "h" : NumberLong("6144729703820759983"),
        "v" : 2,
        "op" : "i",
        "ns" : "test.people",
        "o" : {
                "_id" : ObjectId("52cdd1e53bc65ad63a62b721"),
                "name" : "Maria"
        }
}
</code></pre>

<p>En el ejemplo vemos algunos de los elementos que tenía en ese momento la colección <em>oplog.rs</em>.</p>

<p>Otra manera de acceder es a través del servidor web que incluye cada instancia en ejecución de <strong>MongoDB</strong>. El puerto en el que se ejecuta este servidor, por defecto, se calcula sumando 1000 al puerto por el que esté escuchando el servicio de <strong>MongoDB</strong>. En el caso del 27666, el servidor web estará en el 28666. Para consultar los datos bastará con hacer una llamada desde en navegador a la dirección <em>http://localhost:28666</em></p>

<blockquote>
  <p><strong>Importante</strong>: Algunas de las secciones que se pueden ver en la página que muestra el servidor web estarán por defecto deshabilitadas. Para que funcionen hay que arrancar el servicio de <strong>MongoDB</strong> con la opción <em>&ndash;rest</em>. De esta manera se habilitarán las API Rest que consultan dichos datos.</p>
</blockquote>

<p>Para llegar a consultar la colección <em>Oplog</em> navegaremos a través de las opción <em>replica set status</em> incluida dentro del menú. Nos aparecerá una tabla, con la lista de servidores. Haciendo clic sobre la columna <em>optime</em> de cualquiera de los servidores disponibles, podremos ver su <em>Oplog</em> actual. En realidad, no se muestra entero, si no un resumen de las primeras y últimas operaciones ejecutadas.</p>

<p>Lo importante de dicha colección, es que tenemos el campo <em>optime</em>, que almacena un identificador para cada operación. Así que es fácil comprobar si un servidor tiene datos actualizados.</p>

<h3>Simulando un servidor no actualizado</h3>

<p>Lo primero que vamos a hacer, es parar uno de los tres servidores que tenemos arrancados. Al pararlo se lanzará un proceso de elecciones y uno de los dos servidores restantes será elegido como principal.</p>

<p>Una vez finalizado el proceso de elección de nuevo principal, nos conectamos al mismo y lanzamos un <em>rs.status</em>:</p>

<!-- code[javascript] -->

<pre><code>rep1:SECONDARY&gt; rs.status()
{
    "set" : "rep1",
    "date" : ISODate("2014-01-22T22:31:41Z"),
    "myState" : 2,
    "syncingTo" : "CYLON-MACHINE:27667",
    "members" : [
            {
                    "_id" : 0,
                    "name" : "CYLON-MACHINE:27666",
                    "health" : 0,
                    "state" : 8,
                    "stateStr" : "(not reachable/healthy)",
                    "uptime" : 0,
                    "optime" : Timestamp(1389654521, 1),
                    "optimeDate" : ISODate("2014-01-13T23:08:41Z"),
                    "lastHeartbeat" : ISODate("2014-01-22T22:31:36Z"),
                    "lastHeartbeatRecv" : ISODate("2014-01-22T22:25:45Z"),
                    "pingMs" : 0,
                    "syncingTo" : "CYLON-MACHINE:27667"
            },
            {
                    "_id" : 1,
                    "name" : "CYLON-MACHINE:27667",
                    "health" : 1,
                    "state" : 1,
                    "stateStr" : "PRIMARY",
                    "uptime" : 1521,
                    "optime" : Timestamp(1389654521, 1),
                    "optimeDate" : ISODate("2014-01-13T23:08:41Z"),
                    "lastHeartbeat" : ISODate("2014-01-22T22:31:41Z"),
                    "lastHeartbeatRecv" : ISODate("2014-01-22T22:31:39Z"),
                    "pingMs" : 0
            },
            {
                    "_id" : 2,
                    "name" : "CYLON-MACHINE:27668",
                    "health" : 1,
                    "state" : 2,
                    "stateStr" : "SECONDARY",
                    "uptime" : 1522,
                    "optime" : Timestamp(1389654521, 1),
                    "optimeDate" : ISODate("2014-01-13T23:08:41Z"),
                    "self" : true
            }
    ],
    "ok" : 1
}
</code></pre>

<p>Ya vemos que nuestro conjunto de réplicas tiene tres servidores, de los cuales uno figura como no accesible. En los otros dos servidores, los que están operativos, vemos que sus campos <strong>optime</strong> coinciden. Esto quiere decir que ambos servidores están actualizados.</p>

<p>Para acabar con esa situación, vamos a lanzar una función que inserta el un millón de documentos.</p>

<!-- code[javascript] -->

<pre><code>rep1:PRIMARY&gt;
rep1:PRIMARY&gt; for(i=0;i&lt;1000000;i++){
...
... db.cylontest.insert({contador:i});
... }
</code></pre>

<p>Recuerda que esta función hay que ejecutarla sobre el servidor principal, ya que es el único servidor que acepta modificaciones en los datos.</p>

<p>La función inserta bastantes registros, por lo que dependiendo de la potencia de vuestro equipo, tardará más o menos en completar la operación. Mientras se ejecuta, nos conectamos al otro servidor y lanzamos un <em>rs.status</em></p>

<!-- code[javascript] -->

<pre><code>{
    "set" : "rep1",
    "date" : ISODate("2014-01-22T22:37:20Z"),
    "myState" : 2,
    "syncingTo" : "CYLON-MACHINE:27667",
    "members" : [
            {
                    "_id" : 0,
                    "name" : "CYLON-MACHINE:27666",
                    "health" : 0,
                    "state" : 8,
                    "stateStr" : "(not reachable/healthy)",
                    "uptime" : 0,
                    "optime" : Timestamp(1389654521, 1),
                    "optimeDate" : ISODate("2014-01-13T23:08:41Z"),
                    "lastHeartbeat" : ISODate("2014-01-22T22:37:13Z"),
                    "lastHeartbeatRecv" : ISODate("2014-01-22T22:25:45Z"),
                    "pingMs" : 0,
                    "syncingTo" : "CYLON-MACHINE:27667"
            },
            {
                    "_id" : 1,
                    "name" : "CYLON-MACHINE:27667",
                    "health" : 1,
                    "state" : 1,
                    "stateStr" : "PRIMARY",
                    "uptime" : 1860,
                    "optime" : Timestamp(1390430239, 7641),
                    "optimeDate" : ISODate("2014-01-22T22:37:19Z"),
                    "lastHeartbeat" : ISODate("2014-01-22T22:37:19Z"),
                    "lastHeartbeatRecv" : ISODate("2014-01-22T22:37:19Z"),
                    "pingMs" : 0
            },
            {
                    "_id" : 2,
                    "name" : "CYLON-MACHINE:27668",
                    "health" : 1,
                    "state" : 2,
                    "stateStr" : "SECONDARY",
                    "uptime" : 1861,
                    "optime" : Timestamp(1390430235, 17853),
                    "optimeDate" : ISODate("2014-01-22T22:37:15Z"),
                    "self" : true
            }
    ],
    "ok" : 1
}
</code></pre>

<p>En este caso se puede comprobar, que los campos <em>optime</em> y <em>optimeDate</em> difieren en los dos servidores que están activos. Esto es porque los datos de los servidores no están del todo sincronizados. Cuándo la función JavaScript termine, si esperamos un rato y volvemos a consultar el estado del conjunto de réplicas veremos que esos campos ya estarán actualizados. Es decir, nuestros servidores tienen los mismos datos. Bueno, todos menos uno.</p>

<p>Cómo tenemos un servidor parado, este no estará sincronizado. Así que lo arrancamos, y enseguida el servidor comenzará a sincronizar sus datos.</p>

<p>Si mientras se está sincronizando, consultamos la colección <em>Oplog</em>, veremos que todavía faltan datos por insertar. Por ejemplo:</p>

<table><thead><tr><th>ts</th>
  <th align="center">optime</th>
  <th align="center">h</th>
  <th align="center">op</th>
  <th align="center">ns</th>
  <th align="center">rest</th>
</tr></thead><tbody><tr><td>Jan 22 23:37:06</td>
  <td align="center">52e04812:2a6c</td>
  <td align="center">62c8cc59772dca50</td>
  <td align="center">i</td>
  <td align="center">test.cylontest</td>
  <td align="center">v: 2 o: { _id: ObjectId(&lsquo;52e048122d9aea14fd5e0be1&rsquo;), contador: 250046.0 }</td>
</tr><tr><td>Jan 22 23:37:06</td>
  <td align="center">52e04812:2a6d</td>
  <td align="center">d9ae7779c359c72e</td>
  <td align="center">i</td>
  <td align="center">test.cylontest</td>
  <td align="center">v: 2 o: { _id: ObjectId('52e048122d9aea14fd5e0be2&rsquo;), contador: 250047.0 }</td>
</tr><tr><td>Jan 22 23:37:06</td>
  <td align="center">52e04812:2a6e</td>
  <td align="center">299e217066028679</td>
  <td align="center">i</td>
  <td align="center">test.cylontest</td>
  <td align="center">v: 2 o: { _id: ObjectId('52e048122d9aea14fd5e0be3&rsquo;), contador: 250048.0 }</td>
</tr><tr><td>Jan 22 23:37:06</td>
  <td align="center">52e04812:2a6f</td>
  <td align="center">8b81adf967fa9ffb</td>
  <td align="center">i</td>
  <td align="center">test.cylontest</td>
  <td align="center">v: 2 o: { _id: ObjectId('52e048122d9aea14fd5e0be4&rsquo;), contador: 250049.0 }</td>
</tr><tr><td>Jan 22 23:37:06</td>
  <td align="center">52e04812:2a70</td>
  <td align="center">1a0139d5894085f2</td>
  <td align="center">i</td>
  <td align="center">test.cylontest</td>
  <td align="center">v: 2 o: { _id: ObjectId('52e048122d9aea14fd5e0be5&rsquo;), contador: 250050.0 }</td>
</tr></tbody></table><p>En este caso nuestra operación de actualización no ha finalizado, ya que el valor de nuestro contador va todavía por 250050.</p>

<p>Eso sí, después de un rato, la sincronización se habrá completado, cosa que podremos comprobar con el comando <em>rs.status()</em>. Ya sabéis, si los <em>optime</em> coinciden, es que todos los servidores están actualizados.</p>

<h3>Conclusiones</h3>

<p><strong>MongoDB</strong> es capaz de replicarse entre servidores de forma eficiente y transparente. Los servidores se comunican entre si para mantener los datos del conjunto de réplicas siempre actualizados. Aunque no podemos configurar mucho más que su tamaño, es importante conocer la colección <strong>Oplog</strong> y cómo funciona.</p>

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*
