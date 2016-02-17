---
layout: post
title: Tutorial MongoDB. Eligiendo una sharding key
redirect_from:
  - /post/98959446466/tutorial-mongodb-eligiendo-una-sharding-key.html
---

<h1> ![](<a href="https://31.media.tumblr.com/fc5b21b6d7df5df597a873ba634db328/tumblr_inline_ncscb3T5ua1sno6e9.jpg">https://31.media.tumblr.com/fc5b21b6d7df5df597a873ba634db328/tumblr_inline_ncscb3T5ua1sno6e9.jpg</a>) </h1>

<p>En el artículo anterior, <a href="http://www.charlascylon.com/post/75034298293/tutorial-mongodb-explicando-el-sharding-con-una-baraja">explicaba el concepto de sharding con una baraja de cartas</a>. Básicamente el <em>sharding</em> trata de repartir los documentos entre servidores. De esta manera la carga se distribuye, ya que el documento solo se insertará en uno de los servidores.</p>

<p>Para repartir los documentos se utiliza lo que se conoce como <strong>sharding key</strong>. Esta clave no es más que un campo de <strong>MongoDB</strong> (o varios, en realidad), que nos permite decidir en qué servidor debe almacenarse el documento. El encargado de esta decisión es un proceso conocido como <em>mongos</em>, que recibe las peticiones y las envía al servidor correcto.</p>

<p>Elegir una <strong>sharding key</strong>, es seguramente la parte más importante cuándo queremos habilitar el <em>sharding</em>. El rendimiento de la base de datos dependerá de la clave que elijamos. Además eliminar una <strong>sharding key</strong> una vez establecida puede ser una experiencia poco recomendable. Así que mejor estar muy seguros de hacer una buena elección.</p>

<p>Es importante destacar, que los campos que se incluyan en una <strong>sharding key</strong> deberán tener un índice. Si quieres saber más sobre los índices en <strong>MongoDB</strong>, puedes consultar <a href="http://www.charlascylon.com/post/61794351054/tutorial-mongodb-indices">el artículo que escribí sobre los índices</a>.</p>

<h3>Puntos a tener en cuenta a la hora de elegir nuestra sharding key</h3>

<p>Lo primero a tener en cuenta es <strong>qué queremos mejorar con el sharding</strong>. Si queremos mejorar la latencia de las escrituras, quizá nos interese dividir los datos de forma geográfica. Es decir, escribir en un servidor cercano. Si en cambio lo que queremos es mejorar la velocidad de escrituras o lecturas indistintamente, buscaremos dividir los datos de forma paralela. Así la carga se reparte equitativamente entre los servidores.</p>

<p>También podemos <strong>buscar la optimización de recursos</strong>. Por ejemplo optimizar la RAM. Para ello deberemos tener un conjunto de registros pequeño por cada servidor. Es decir, tendremos más servidores, con menos potencia, pero con menos datos que manejar. Eso sí, sin olvidarnos de cuántos <em>shards</em> (servidores) necesitamos realmente. Tener muchos incrementará la complejidad.</p>

<p>Y para terminar, <strong>hay que tener en cuenta el tipo de consultas que vamos a realizar</strong>. Para que el particionado sea efectivo, lo ideal es que las consultas se realicen sólo sobre uno de los <em>shards</em>. Esto implica que en las consultas deberemos incluir la <strong>sharding key</strong>. Si por ejemplo nuestra clave es el nombre de usuario, pero solo realizamos las búsquedas por fecha, la consulta se ejecutará en todos los servidores, perdiendo algunas de las ventajas del <em>sharding</em>. No hay que olvidar, que el tiempo de respuesta de las consultas estará determinado por el servidor más lento, ya que <strong>MongoDB</strong> tiene que esperar la respuesta de todos los servidores</p>

<h3>Tipos de sharding key</h3>

<p>Aunque la clave puede ser cualquier campo de nuestros documentos, podríamos decir que los tipos de claves los podemos englobar en los siguientes: claves ascendentes, aleatorias, basadas en localización y compuestas.</p>

<h4>Claves ascendentes</h4>

<p>En este caso elegimos <strong>un campo que va creciendo con cada inserción</strong>. Esto sucede si usamos, por ejemplo, ObjectId o un campo fecha. Al ser valores incrementales, el documento siempre se insertará en el último shard. Esto tiene algunas ventajas, pero en general da más problemas que otra cosa. Para mantener los shards balanceados, MongoDB estará moviendo documentos de un shard a otro de forma continua, para mantener la distribución. Estos movimientos van a perjudicar el rendimiento. En especial si buscamos escalar las escrituras, ya que estas irán siempre al mismo servidor.</p>

<h4>Claves aleatorias</h4>

<p><strong>Son campos que tienen un valor aleatorio, y son únicos en cada inserción</strong>. <em>GUIDS</em>, <em>MD5</em> o similares. Con claves de este tipo, las escrituras se van repartiendo de forma homogénea entre los distintos servidores. De esta manera se reducen mucho los movimientos de documentos entre <em>shards</em>. Lo malo de estas claves, es que hacer consultas sobre ellas no siempre es fácil. Como hemos dicho antes, lo ideal es que en la consulta vaya la clave, pero quizá esto no sea siempre posible, al ser el campo único.</p>

<p>Si no tenemos ningún campo único, podemos utilizar un <a href="http://docs.mongodb.org/manual/tutorial/shard-collection-with-a-hashed-shard-key/">hashed index como sharding key</a>.</p>

<h4>Claves basadas en localización</h4>

<p>Ya hemos comentado, que en ocasiones podemos necesitar que los documentos se almacenen en base a su localización. Por ejemplo por IP, latitud, longitud etc. Aunque podemos hacerlo directamente, <strong>MongoDB</strong> distribuirá equitativamente los documentos como si de una clave ascendente se tratara. Esto no es deseable. Para solucionar esto, añadiremos <em>tags</em>.</p>

<p>Los <em>tags</em> permiten indicar de forma manual los rangos mínimo y máximo que tiene cada shard. Así podríamos añadir un rango de IP que vaya de la 192.0.0.0 a la 192.255.255.255 de manera que los documentos cuyo campo IP pertenezcan a ese rango, queden todos en el mismo servidor.</p>

<h4>Claves compuestas</h4>

<p>Aquí en lugar de utilizar un solo campo de un documento <strong>MongoDB</strong>, utilizaremos varios. Lo ideal es encontrar la manera de repartir equitativamente los documentos entre <em>shards</em>, pero que además las búsquedas se realicen exclusivamente sobre los servidores que tienen los datos.</p>

<p>Como ejemplo podemos pensar en una tienda online. La <strong>shard key</strong> estará compuesta por nombre de usuario (aleatorio) y el identificador del pedido (incremental). De esta manera los pedidos se distribuirán de forma homogénea al ser el usuario aleatorio, pero los datos de un mismo usuario estarán concentrados en pocos <em>shards</em>, lo que mejorará el tiempo de búsqueda de los pedidos.</p>

<h3>Conclusiones</h3>

<p>En definitiva, elegir la <strong>shard key</strong> de forma correcta es muy importante. Tanto que <strong>marcará el rendimiento futuro de nuestra base de datos</strong>.</p>

<p>Viendo las distintas posibilidades, quizá lo mejor sea utilizar claves compuestas (siempre que encontremos una buena manera de agrupar) o claves aleatorias.</p>

<p>En el próximo artículo sobre <em>sharding</em>, veremos como configurar los <em>shards</em>.</p>

<p><strong>Imágen</strong> <a href="https://www.flickr.com/photos/traftery/">Tom Raftery</a></p>

<hr><hr><ul><li><p>¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me gusta en Facebook o de publicarlo en Twitter.</p></li>
<li><p>Recuerda que puedes ver el índice del tutorial de MongoDB y acceder a todos los artículos de la serie desde <a href="http://www.charlascylon.com/mongodb" title="Enlace a página principal del tutorial">aquí</a>.</p></li>
<li><p>¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog? Suscríbete por <a href="feed://www.charlascylon.com/feed.xml" title="Suscripción RSS">RSS</a>.</p></li>
</ul>
