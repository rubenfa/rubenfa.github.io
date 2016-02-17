---
layout: post
title: Tutorial MongoDB. Operaciones de consulta avanzadas II
redirect_from:
  - /post/61794345688/tutorial-mongodb-operaciones-de-consulta.html
---


<p>Volvemos a la carga con nuestro tutorial de <strong>MongoDB</strong>, continuando con las operaciones de consulta avanzadas <a href="http://www.charlascylon.com/2013/07/tutorial-mongodb-operaciones-de.html" title="artículo Operaciones Avanzadas I">que ya empezamos la semana pasada.</a></p>
<p>En la anterior entrega vimos como realizar consultas complejas con find o findOne, incluyendo en ellas operadores lógicos como <strong>$gt, $lt, $exists, $and</strong> y algunos más. En esta entrada nos vamos a centrar en las consultas sobre elementos complejos, como  los arrays y los subdocumentos. Así que vamos a ello.</p>
<p>Recuerda: que para los ejemplos estamos utilizando el conjunto de datos que puedes descargar de <a href="https://skydrive.live.com/download?resid=1F8D7C58B1FC74AE!1168" title="enlace a conjunto de datos de los ejemplos">aquí</a>. Si todavía no sabes como importar estos datos a tu base de datos **MongoDB **tienes una pequeña guía de como hacerlo <a href="http://www.charlascylon.com/post/61794340001/tutorial-mongodb-operaciones-de-consulta" title="enlace a entrada donde se explica el comando mongoimport">aquí</a>. Si aún no tienes instalado **MongoDB **<a href="http://www.charlascylon.com/post/61794337102/tutorial-mongodb-instalacion-y-configuracion" title="enlace a entrada de instalación de MongoDB">aquí </a>explico como puedes hacerlo.</p>
<p><strong>Consultar arrays</strong></p>
<p>Como ya hemos visto en anteriores entregas de este tutorial, **MongoDB **puede guardar array de elementos. Los elementos que guarda un array pueden ser de cualquier tipo, es decir que pueden ser strings, números, otros arrays o incluso subdocumentos.</p>
<p>En nuestros datos de prueba (podéis ver la primera entrega para saber como importarlos), cada persona de la colección people tiene asociado un campo _ tags_, que es un array de <em>strings</em>. Si queremos buscar un solo elemento dentro de ese array bastará con hacer una consulta similar a la siguiente:</p>
<p><code>db.people.find({tags:&quot;laborum&quot;},{name:1,tags:1})</code></p>
<p>En este caso **MongoDB **buscará el elemento <em>&quot;laborum&quot;</em> dentro de el array de _ tags_, devolviendo las personas en cuyo array existe dicho elemento. En este caso la consulta no ha sido diferente de las que hemos hecho anteriormente ya que solo estamos buscando un solo elemento.  En cambio si queremos encontrar todos las personas que contengan en _tags _varios valores la consulta sería algo similar a:</p>
<p> </p>
<p><code>db.people.find({tags:{$all:[&quot;laborum&quot;,&quot;sunt&quot;]}},{name:1,tags:1})</code></p>
<p>Usando el operador <strong>$all</strong> buscamos varios elementos dentro de un array, especificando como entrada un array de elementos a buscar. En el ejemplo estamos buscando todos las personas que contengan <em>&quot;laborum</em>&quot; y <em>&quot;sunt&quot;</em> en el campo <em>tags</em>. Sólo se devolverán los documentos que contengan ambos valores. En este caso he especificado dos valores, pero podéis añadir todos los que necesitéis y solo se devolverán los documentos que los incluyan.</p>
<p>De manera similar podemos hacer una búsqueda en un array para devolver los documentos que contengan al menos uno de los elementos a buscar</p>
<p><code>db.people.find({tags:{$in:[&quot;laborum&quot;,&quot;sunt&quot;,&quot;nisi&quot;]}},{name:1,tags:1})</code></p>
<p>En este caso he utilizado tres valores y el operador <strong>$in</strong>, que busca todos los documentos que tengan en el campo _tags _uno de los tres element. En cuanto se detecte que el documento tiene uno de los valores se devuelve como resultado.</p>
<p>Si quisiéramos hacer lo mismo, pero buscando los documentos que **NO **contengan los elementos especificados en el array de entrada, utilizaríamos una consulta con el operador <strong>$nin</strong>:</p>
<p><code>db.people.find({tags:{$nin:[&quot;laborum&quot;,&quot;sunt&quot;,&quot;nisi&quot;]}},{name:1,tags:1})</code></p>
<p>Otro operador que nos puede ser muy útil es <strong>$size</strong>, que se utiliza para buscar los documentos que tienen un campo array de un tamaño predeterminado. Es muy sencillo de utilizar. Por ejemplo para devolver todos los documentos cuyo array de tags tiene un tamaño 3 usaríamos la consulta:</p>
<p><code>db.people.find({tags:{$size:3}})</code></p>
<p>En cuanto a las proyecciones con arrays, tenemos también operadores muy útiles. Si queremos mostrar solo el primer elemento de un array utilizaremos la siguiente consulta:</p>
<p><code>db.people.find({tags:{$in:[&quot;laborum&quot;,&quot;sunt&quot;,&quot;nisi&quot;]}},{&quot;tags.$&quot;:1,name:1})</code></p>
<p>La parte que filtra los datos es la que hemos utilizado en un ejemplo anterior, pero hemos modificado un poco la proyección. Recordad que una proyección se utiliza para mostrar los campos concretos que queremos devolver (como los campos de una sentencia SELECT de SQL). En este caso utilizamos entre comillas el operador <strong>$</strong>. En este caso lo que hacemos con el <em>&quot;tags.$&quot;:1</em> es devolver el primer elemento del array de <em>tags</em>.</p>
<p>Otro operador interesante para proyecciones es $slice. Con este operador lo que hacemos es devolver un número determinado de elementos de un array.</p>
<p><code>db.people.find({tags:{$in:[&quot;laborum&quot;,&quot;sunt&quot;,&quot;nisi&quot;]}}, {tags:{$slice:3},name:1})</code></p>
<p>Con la consulta anterior devolveremos los documentos filtrados, pero solo devolveremos dos campos: los tres primeros elementos del array de _tags _y el nombre de la persona. Si quisiéramos devolver los tres últimos bastaría con usar un número negativo.</p>
<p><code>db.people.find({tags:{$in:[&quot;laborum&quot;,&quot;sunt&quot;,&quot;nisi&quot;]}}, {tags:{$slice:-3},name:1})</code></p>
<p>Y ya para nota tenemos la opción de usar como parámetro de <strong>$slice</strong> un array del tipo <em>[skip,limit]</em></p>
<p><code>db.people.find({tags:{$in:[&quot;laborum&quot;,&quot;sunt&quot;,&quot;nisi&quot;]}}, {tags:{$slice:[2,3]},name:1})</code></p>
<p>O lo que es lo mismo, se ignoran los dos primeros elementos del array (<em>skip</em>) y se cogen sólo los 3 siguientes (<em>limit</em>). En el caso de querer empezar a buscar por el final del array _skip  _tiene que ser un número negativo.</p>
<p><code>db.people.find({tags:{$in:[&quot;laborum&quot;,&quot;sunt&quot;,&quot;nisi&quot;]}}, {tags:{$slice:[-2,3]},name:1})</code></p>
<p><strong>Dot Notation</strong></p>
<p><strong>Dot Notation</strong> (algo así como notación punto) se utiliza en **MongoDB **para realizar consultas en arrays y en subdocumentos. Se basa en añadir un punto después del identificador del array o subdocumento para realizar consultas sobre un índice en concreto del array o sobre un campo concreto del subdocumento. Un ejemplo con arrays:</p>
<p><code>db.people.find({&quot;tags.1&quot;:&quot;enim&quot;})</code></p>
<p>En el ejemplo buscamos todos los documentos que cumplan la condición de que el valor 1 del array sea <em>&quot;enim&quot;</em>.  <strong>Dos cosas importanes, los arrays empiezan con el índice 0 y es necesario que “tags.1” vaya entre comillas para no recibir un error en la Shell.</strong></p>
<p>En cuanto a los subdocumentos, lo vemos en el siguiente apartado.</p>
<p><strong>Consultas en subdocumentos</strong></p>
<p>En nuestros datos de ejemplo existe un campo llamado <em>friends</em>, que contiene un array de subdocumentos. Si en dicho campo quisiéramos buscar los elementos que contienen el subdocumento  compuesto por el <em>id 1</em> y el nombre <em>&quot;Trinity Ford&quot;</em> utilizaríamos una consulta como esta:</p>
<p><code>db.people.find({ friends: { id:1, name:&quot;Trinity Ford&quot; } })</code></p>
<p>En este caso solo se devuelve los documentos que en el array del campo friends tienen el subdocumento_ {id:1,name:”Trinity Ford”}_. Para buscar por un campo del subdocumento en concreto deberemos usar Dot Notation.</p>
<p>`</p>
<blockquote>
<p>db.people.find({&quot;friends.name&quot;:&quot;Trinity Ford&quot;}) `</p>
</blockquote>
<p>Se puede ver que entre comillas hemos especificado el campo <em>&quot;friends.name&quot;</em>, lo que quiere decir que tenemos que buscar en el subdocumento <em>friends</em>, por el campo <em>name</em>. En este caso se devuelven todos los documentos que cumplen el _ “friends.name”:”Trinity Ford”_ independientemente del _id _que tengan.</p>
<p>Usando <strong>Dot Notation</strong>, podemos hacer consultas más precisas y complejas:</p>
<p><code>db.people.find({&quot;friends.2.name&quot;:{$gte:&quot;T&quot;}}, {friends:{$slice:-1},name:1})</code></p>
<p>Buscamos en el array _friends _los elementos que estén en la posición 2 y cuyo nombre sea mayor o igual que T. Además en la proyección mostramos el último elemento, que es por el que estamos filtrando.</p>
<p><strong>Búsquedas en campos de texto con expresiones regulares</strong></p>
<p>Hemos visto que los operadores <strong>$gt, $gte, $lt</strong> etc. se pueden utilizar con _ strings_. Pero ¿cómo podemos buscar patrones en el texto de los campos? Para eso utilizaremos el operador <strong>$regex</strong>, que <strong>utilizando expresiones regulares</strong>,  nos permite hacer búsquedas más complejas en los campos de tipo texto.</p>
<p>Como cada lenguaje de programación utiliza las expresiones regulares de manera diferente, debemos especificar que  **MongoDB **utiliza <em>Perl Compatible Regular Expressions</em>. Este tutorial no pretende profundizar en las expresiones regulares así que si queréis más información <a href="http://perldoc.perl.org/perlre.html" title="ayuda expresiones regulares en perl">podéis ver este enlace con información sobre las expresiones regulares en <em>Perl</em></a>. Aquí tenemos un ejemplo de consulta con expresión regular:</p>
<p><code>db.people.find({&quot;name&quot;: {$regex:&quot;.*r$&quot;}},{name:1})</code></p>
<p>En este caso buscamos todos los documentos cuyo nombre termine con la letra_ r_ mínuscula.</p>
<p><code>db.people.find({&quot;name&quot;: {$regex:&quot;.*fis&quot;}},{name:1})</code></p>
<p><code>db.people.find({&quot;name&quot;: {$regex:&quot;.*Fis&quot;}},{name:1})</code></p>
<p>En las dos consultas anterories estamos buscando elementos que contengan _ “fis”_ o <em>&quot;Fis&quot;</em>. Por defecto las expresiones regulares son sensibles a mayúsculas por lo que la primera consulta no devuelve resultados.  Si queremos ignorar las mayúsculas deberemos utilizar el opeardor <strong>$options</strong>.</p>
<p><code>db.people.find({&quot;name&quot;: {$regex:&quot;.*fis&quot;, $options:&quot;i&quot;}},{name:1})</code></p>
<p>Con la <em>opción i</em>, le decimos a **MongoDB **que las comparaciones no serán sensibles a mayúsculas. Además de la opción i hay varias opciones que podéis consultar en la ayuda de MongoDB.</p>
<p>Aunque las expresiones regulares pueden ser útiles, no conviene abusar de ellas. No todas pueden hacer uso de los índices y pueden hacer que nuestras consultas sean muy lentas. Así que hay que usarlas con cuidado.</p>
<p><strong>Cursores</strong></p>
<p>Cuando hacemos una consulta en la Shell de MongoDB, el servidor nos devuelve un objeto cursor. Un cursor no es más que un iterador sobre los resultados de una consulta. El cursor está en el servidor, mientras que en el cliente solo tenemos el identificador del mismo. Con este sistema se evitan mover datos innecesarios del servidor al cliente, ya que el cursor por defecto solo devuelve 20 resultados. Si queremos mostrar más, debemos escribir “it” en la consola, lo qué nos devolverá los siguientes 20 resultados.</p>
<p>Lo bueno de los cursores es que tienen una serie de opciones interesantes que podemos utilizar para contar el número de resultados u ordenarlos.</p>
<p><strong>Count</strong></p>
<p>Devuelve el número de documentos devueltos por la consulta.</p>
<p><code>db.people.find({&quot;friends.2.name&quot;:{$gte:&quot;T&quot;}}).count()</code></p>
<p><strong>Sort</strong></p>
<p>Ordena los resultados por el campo especificado. La siguiente consulta ordena de forma ascendente</p>
<p><code>db.people.find({&quot;friends.2.name&quot;:{$gte:&quot;T&quot;}},{_id:0,name:1}).sort({name:1})</code></p>
<p>Y la siguiente consulta ordena de forma descendente.</p>
<p><code>db.people.find({&quot;friends.2.name&quot;:{$gte:&quot;T&quot;}},{_id:0,name:1}).sort({name: -1})</code></p>
<p>Podemos especificar más de un campo separándolo por comas.</p>
<p><code>db.people.find({&quot;friends.2.name&quot;:{$gte:&quot;T&quot;}},{_id:0,name:1,email:1}).sort({name:1,email:1})</code></p>
<p><strong>Limit</strong></p>
<p>Limita el número de resultados devuelto. El siguiente ejemplo devuelve los  5  primeros documentos.</p>
<p><code>db.people.find({&quot;friends.2.name&quot;:{$gte:&quot;T&quot;}},{name:1}).limit(5)</code></p>
<p><strong>Skip</strong></p>
<p>Ignora los N primeros documentos especificados. El siguiente ejemplo salta los 5 primeros documentos y devuelve los siguientes</p>
<p><code>db.people.find({&quot;friends.2.name&quot;:{$gte:&quot;T&quot;}},{name:1}).skip(5)</code></p>
<p><strong>toArray</strong></p>
<p>Guarda los resultados en un array que podemos asignar a una variable</p>
<p><code>var myArray = db.people.find({&quot;friends.2.name&quot;:{$gte:&quot;T&quot;}},{name:1}).toArray()</code></p>
<p>Lo bueno de todos estos comandos, es que se pueden concatenar. Por ejemplo para saltar los 10 primeros documentos devueltos y coger los 5 siguientes podemos usar la siguiente consulta</p>
<p><code>db.people.find({&quot;friends.2.name&quot;:{$gte:&quot;T&quot;}},{name:1}).skip(10).limit(5)</code></p>
<p>También podemos ordenar los resultados por orden ascendente y coger solo el primero, devolviendo el valor más bajo.</p>
<p><code>db.people.find({&quot;friends.2.name&quot;:{$gte:&quot;T&quot;}}, {name:1}).sort({name:1}).limit(1)</code></p>
<p><strong>Conclusiones</strong></p>
<p>En esta entrada hemos profundizado en las consultas de MongoDB. Hemos aprendido a consultar sobre arrays, a usar Dot Notation, expresiones regulares y echado un vistazo a alguna de las operaciones que podemos hacer con los cursores.</p>
<p>Ahora que sabemos realizar consultas, nos toca aprender a realizar modificaciones. Pero eso será en futuras entradas.</p>
<hr>
<hr>
<p>_¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me gusta en Facebook o de publicarlo en Twitter. ¡ Gracias !
_</p>
<p><em>Recuerda que puedes ver el índice del tutorial y acceder a todos los artículos de la serie <a href="http://www.charlascylon.com/p/tutorial-mongodb.html">desde aquí.</a></em></p>
<p>¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog? Suscríbete  por <a href="feed://www.charlascylon.com/feed.xml">por RSS</a>.<em><a href="http://www.charlascylon.com/p/tutorial-mongodb.html">
</a></em></p>
