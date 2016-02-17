---
layout: post
title: Tutorial MongoDB. Trabajando con conjuntos de réplicas
redirect_from:
  - /post/72753658228/tutorial-mongodb-trabajando-con-conjuntos-de.html
---

<p>Empezamos el 2014 con una nueva entrega del <strong>tutorial de MongoDB</strong>. <a href="http://www.charlascylon.com/post/69774579592/tutorial-mongodb-creacion-configuracion-replicas" title="Link a entrada sobre configuración de réplicas">En el anterior artículo</a>, pudimos ver cómo podemos crear un 
<strong>conjunto de réplicas</strong> y las distintas opciones que tenemos para configurarlo. En esta entrada, veremos como funciona dicho conjunto a la hora de realizar consultas o grabar nuevos documentos. También veremos como obtener información sobre el estado de la replicación de los elementos insertados, consultando la colección <em>Oplog</em>. Vamos al lío.</p>

<blockquote>
  <p><strong>Nota</strong>: si no leíste el anterior artículo, recuerda que en el explico como configurar un conjunto de réplicas. Este conjunto, con la misma configuración es el que utilizaré a lo largo de esta entrada. Si ya tienes un conjunto creado, pero no tienes datos, puedes descargar los datos con los que he hecho los ejemplos desde <a href="https://skydrive.live.com/download?resid=1F8D7C58B1FC74AE%211168" title="Descarga de conjunto de datos">aquí</a>.</p>
</blockquote>

<h3>Consultas sobre un conjunto de réplicas</h3>

<p>Como ya sabréis, <strong>MongoDB</strong> gestiona los conjuntos de réplicas siguiendo un modelo <em>primario-secundario</em>. Esto quiere decir que sólo un servidor podrá ser el principal, mientras que el resto de servidores serán considerados secundarios.</p>

<p>A la hora de realizar consultas, por defecto, las consultas se deben realizar sobre el servidor principal. Por ejemplo si nos conectamos al servidor principal (en este caso el que está escuchando en el puerto 27666)</p>

<pre><code>MongoDB shell version: 2.4.8
connecting to: localhost:27666/test
rep1:PRIMARY&gt;
</code></pre>

<p>Si nos fijamos en el mensaje que muestra la consola, vemos que dicho servidor aparece como <em>PRIMARY</em>, en el conjunto de réplicas <em>rep1</em>. En dicha consola podremos realizar consultas de forma normal sin ningún tipo de problema.</p>

<p>En cambio, si conectamos contra un servidor secundario, por ejemplo el que escucha por el puerto 27667, la consola mostrará un mensaje ligeramente distinto.</p>

<pre><code>MongoDB shell version: 2.4.8
connecting to: localhost:27667/test
rep1:SECONDARY&gt;
</code></pre>

<p>En este caso el servidor está catalogado por <strong>MongoDB</strong> como secundario. ¿Y qué pasa si intentamos hacer una consulta sobre este servidor?</p>

<pre><code>rep1:SECONDARY&gt; db.people.findOne()
Wed Jan 08 23:05:52.777 error: { "$err" : "not master and slaveOk=false", "code": 13435 } 
at src/mongo/shell/query.js:128
rep1:SECONDARY&gt;
</code></pre>

<p>Como vemos en el error devuelto por la consola, la propiedad <em>slaveOk</em> es <em>false</em>, lo que quiere decir, que no hemos habilitado la opción que nos permite hacer consultas sobre un servidor secundario. Para habilitar la posibilidad de realizar consultas sobre un servidor secundario, tendremos que ejecutar la  función <em>slaveOk()</em>.</p>

<pre><code>rep1:SECONDARY&gt; rs.slaveOk()
</code></pre>

<p>Con ese comando, le estamos diciendo a <strong>MongoDB</strong> que sabemos que es un servidor secundario y que sabemos lo que estamos haciendo. Asumimos la responsabilidad. Y es que hay que tener en cuenta que al realizar consultas sobre un servidor secundario, los datos pueden no estar todavía replicados desde el servidor principal. Es decir, que podemos hacer consultas sobre datos no actualizados.</p>

<p>La posibilidad de realizar consultas sobre un servidor secundario, se utiliza principalmente para balancear la carga entre servidores. Si nuestra aplicación tiene muchas conexiones a la base de datos, nos puede interesar que algunas de las consultas se ejecuten sobre un servidor secundario. Pero tendremos que tener claro que estamos haciendo, ya que (y ya sé que me repito), los datos podrían no estar actualizados.</p>

<h3>Inserciones y actualizaciones en un conjunto de réplicas</h3>

<p>Las inserciones y actualizaciones son muy fáciles de entender. Solo se pueden modificar datos conectados desde el servidor principal. ¿Qué pasa si intentamos hacer una inserción desde un servidor secundario?</p>

<pre><code>rep1:SECONDARY&gt; db.people.insert({name:"Maria"})
**not master**
</code></pre>

<p>Ya veis que <strong>MongoDB</strong> se enfada. Nos dice que el servidor no es el principal y que no nos va a dejar realizar la inserción.</p>

<h3>Endendiendo el Oplog</h3>

<p>La colección <em>Oplog</em> es la que utiliza <strong>MongoDB</strong> para controlar las operaciones que hay que replicar a los servidores secundarios. Cada vez que hacemos una inserción en nuestra base de datos, esta se guarda en la colección <em>Oplog</em> que periódicamente es replicada a los servidores secundarios para que apliquen las mismas operaciones.</p>

<p>Para consultar esta colección tenemos varios comandos interesantes como <em>getReplicationInfo()</em></p>

<pre><code>rep1:PRIMARY&gt; db.getReplicationInfo()
{
    "logSizeMB" : 8643.199609375,
    "usedMB" : 0.11,
    "timeDiff" : 2423165,
    "timeDiffHours" : 673.1,
    "tFirst" : "Wed Dec 11 2013 22:27:50 GMT+0100 (Hora estándar romance)",
    "tLast" : "Wed Jan 08 2014 23:33:55 GMT+0100 (Hora estándar romance)",
    "now" : "Wed Jan 08 2014 23:48:02 GMT+0100 (Hora estándar romance)"
}
</code></pre>

<p>Pero sin duda la manera más interesante de consultar los datos replicados es haciendo uso de la consola web que incluye <strong>MongoDB</strong>. Esta consola es accesible desde cualquier navegador consultando un puerto determinado.</p>

<p>Este puerto se establece sumando 1000 al puerto por el que esta escuchando el servicio <em>mongod</em>. En nuestro caso, podremos acceder a la consola web si en el navegador escribimos <em>localhost:28666</em>. Esta consola muestra diversos datos, pero para consultar el estado de los conjuntos de réplicas, deberemos ir a la sección <em>Replica Set Status</em>.</p>

<blockquote>
  <p><strong>Importante</strong>: para tener todas las funciones de la consola web operativas, a la hora de lanzar el servidor deberemos incluir la opción <em>&ndash;rest</em>, que habilitará el acceso por <em>API REST</em> a algunas de las funciones de consulta de MongoDB.</p>
</blockquote>

<p>En la sección <em>Replica Set Status</em> podremos ver información sobre los servidores que componen nuestra réplica. Si hacemos clic en alguno de los enlaces bajo la columna <em>optime</em> podremos ver las operaciones replicadas.</p>

<table><thead><tr><th>ts</th>
  <th align="center">optime</th>
  <th align="center">h</th>
  <th align="center">op</th>
  <th align="center">ns</th>
  <th align="center">rest</th>
</tr></thead><tbody><tr><td>Jan 08 23:33:55</td>
  <td align="center">52cdd253:1</td>
  <td align="center">53a92042bc903b70</td>
  <td align="center">i</td>
  <td align="center">test.people</td>
  <td align="center">v: 2 o: { _id: ObjectId(&lsquo;52cdd253ecea9b0557deb2bc&rsquo;), personId: 0.0 }</td>
</tr><tr><td>Jan 08 23:33:55</td>
  <td align="center">52cdd253:2</td>
  <td align="center">47ee9c115ab50f74</td>
  <td align="center">i</td>
  <td align="center">test.people</td>
  <td align="center">v: 2 o: { _id: ObjectId('52cdd253ecea9b0557deb2bd&rsquo;), personId: 1.0 }</td>
</tr><tr><td>Jan 08 23:33:55</td>
  <td align="center">52cdd253:3</td>
  <td align="center">4062a27b15156e51</td>
  <td align="center">i</td>
  <td align="center">test.people</td>
  <td align="center">v: 2 o: { _id: ObjectId('52cdd253ecea9b0557deb2be&rsquo;), personId: 2.0 }</td>
</tr><tr><td>Jan 08 23:33:55</td>
  <td align="center">52cdd253:4</td>
  <td align="center">99b66c3b696eaae9</td>
  <td align="center">i</td>
  <td align="center">test.people</td>
  <td align="center">v: 2 o: { _id: ObjectId('52cdd253ecea9b0557deb2bf&rsquo;), personId: 3.0 }</td>
</tr><tr><td>Jan 08 23:33:55</td>
  <td align="center">52cdd253:5</td>
  <td align="center">ad9a80592db8c942</td>
  <td align="center">i</td>
  <td align="center">test.people</td>
  <td align="center">v: 2 o: { _id: ObjectId('52cdd253ecea9b0557deb2c0&rsquo;), personId: 4.0 }</td>
</tr><tr><td>Jan 08 23:33:55</td>
  <td align="center">52cdd253:6</td>
  <td align="center">b6b57f4bbe7ec98e</td>
  <td align="center">i</td>
  <td align="center">test.people</td>
  <td align="center">v: 2 o: { _id: ObjectId('52cdd253ecea9b0557deb2c1&rsquo;), personId: 5.0 }</td>
</tr><tr><td>Jan 08 23:33:55</td>
  <td align="center">52cdd253:7</td>
  <td align="center">ec8d576d28f35ec3</td>
  <td align="center">i</td>
  <td align="center">test.people</td>
  <td align="center">v: 2 o: { _id: ObjectId('52cdd253ecea9b0557deb2c2&rsquo;), personId: 6.0 }</td>
</tr></tbody></table><h3>Conclusiones</h3>

<p>Hoy hemos aprendido que podemos realizar consultas sobre un servidor secundario de <strong>MongoDB</strong> siempre que lo especifiquemos, pero que las inserciones y actualizaciones solo se pueden hacer sobre el servidor principal. También hemos aprendido que <strong>MongoDB</strong> gestiona una colección llamada <em>Oplog</em> dónde se guardan las operaciones realizadas. Esta colección es auditable, y nos servirá para detectar posible problemas de replicación. Problemas, que generaremos en la siguiente entrada.</p>

<hr><hr><ul><li><p>¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me gusta en Facebook o de publicarlo en Twitter.</p></li>
<li><p>Recuerda que puedes ver el índice del tutorial de MongoDB y acceder a todos los artículos de la serie desde <a href="http://www.charlascylon.com/mongodb" title="Enlace a página principal del tutorial">aquí</a>.</p></li>
<li><p>¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog? Suscríbete por <a href="feed://www.charlascylon.com/rss" title="Suscripción RSS">RSS</a>.</p></li>
</ul>
