---
layout: post
title: Tutorial MongoDB. Operaciones de consulta avanzadas I
redirect_from:
  - /post/61794343130/tutorial-mongodb-operaciones-de-consulta.html
  - /post/61794343130/
---

<blockquote>
<p><strong>Nota: </strong>Recuerda que este artículo foma parte del tutorial de MongoDB, al que puedes acceder desde <a href="https://charlascylon.com/tutorialmongo">este enlace.</a> En el tutorial explico como instalar MongoDB, como conectar a la base de datos o cosas más avanzadas com Aggregation Framework y conjuntos de réplicas. </p> 
</blockquote>

<p>En el pasado artículo, hicimos una aproximación a los comandos <em>find </em>y <em>findOne</em>, para realizar consultas sencillas sobre <strong>MongoDB</strong>. En esta entrada profundizaremos un poco más y explicaremos consultas más complicadas. Inicialmente había pensado explicar todo en un solo artículo, pero creo que este hubiera sido demasiado largo, así que vamos a dividirlo en dos partes. </p>

<div>
<div>
<div><span> </span></div>
</div>
<div>
<div><span>Tanto en esta parte, como en la siguiente, utilizaremos muchos de los operadores existentes en <strong>MongoDB</strong>. Podéis encontrar una lista detallada <a href="http://docs.mongodb.org/manual/reference/operator/">aquí</a>. Como para realizar consultas necesitamos datos, vamos a utilizar el mismo archivo <em>JSON </em>que en el anterior artículo. Podéis descargarlo de mi <a href="https://skydrive.live.com/redir?resid=1F8D7C58B1FC74AE!1171&amp;authkey=!ACXsbC94anVewC0">SkyDrive</a>. Si no sabéis como importarlo, recordad que está explicado en el anterior post.</span></div>
</div>
<div>
<div><span> </span></div>
</div>
<div>
<div><span>Una vez hecha la introducción aquí va la primera entrega de consultas avanzadas en la <strong>Shell </strong>de <strong>MongoDB</strong>.</span></div>
</div>
<div>
</div>
<div>
<h3><strong><span>Operaciones de comparación</span></strong></h3>
</div>
<div>
<div><span>En las bases de datos relacionales, es muy típico filtrar los resultados según el valor de un determinado campo. Por ejemplo si <em>X &gt; 0</em>,<em> Y. Pero ¿cómo realizamos esto en <strong>MongoDB</strong>?</em></span></div>
</div>
<div>
<div><span> </span></div>
</div>
<div>
<div><span>Imaginemos que queremos mostrar las personas de la colección people, que tienen más de 30 años. Para ello utilizaremos el operador <em><strong>$gt</strong></em> (abreviatura de “greater than” en inglés).</span></div>
</div>
<div>
<div></div>
</div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find({age:{$gt:30}},{name:1,age:1})</pre>
</div>

<div>
<div><span>Como veis la consulta es bastante sencilla. Como primer parámetro del comando find añadimos la consulta y como segunda parte una proyección con los datos que queremos que nos devuelva dicha consulta (en este caso <em>name </em>y <em>age</em>). Todo en <strong>MongoDB </strong>se hace con <em>JSON </em>así que para buscar los mayores de 30 años añadimos otro documento <em>JSON </em>con el operador utilizado y el valor por el que debe filtrar.</span></div>
</div>
<div>
<div><span> </span></div>
</div>
<div>
<div><span>Si os fijáis en los resultados, no se devuelve ninguna persona con edad igual a 30. Esto es porque hemos usado <strong><em>$gt</em></strong> y no <em><strong>$gte</strong></em> (“greater than equals” en inglés). Así que si ejecutamos la consulta siguiente, obtendremos todos elementos de la colección <em>people </em>con edad mayor o igual a 30 años.</span></div>
</div>
<div><br/><div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find({age:{$gte:30}},{name:1,age:1})</pre>
</div>

<div>
<div><span>Lo mismo haremos si queremos obtener las personas menores de 30 años utilizando los comandos <strong><em>$lt</em></strong> (“lower than”) o <strong><em>$lte</em></strong> (“lower than equals”).</span></div>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find({age:{$lt:30}},{name:1,age:1})</pre>
</div>

<div>
<div><span>Y si quisieramos extraer todas las personas cuya edad NO es 30 utilzaríamos el operador <strong><em>$ne</em></strong>.</span></div>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find({age:{$ne:30}},{name:1,age:1})</pre>
</div>

<div>
<div><span>Imaginemos ahora que queremos extraer las personas con una edad igual a 25, 30 o 35 años. En SQL podríamos utilizar un <em>WHERE age IN (25,30,35)</em>. En <strong>MongoDB </strong>utilizaríamos el operador <strong><em>$in</em></strong> y un array con los datos.</span></div>
</div>
<div>
<div></div>
</div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find({age:{$in:[25,30,35]}},{name:1,age:1})</pre>
</div>
<div><br/><span>Esta consulta nos devuelve todos las presonas cuyas edades son igual a 25, 30 o 35.</span><br/><span><br/></span></div>
<div>
<h3><strong><span>Comparaciones con strings</span></strong></h3>
</div>
<div>
<div><span>Los operadores descritos anteriormente son aplicables a los <em>strings</em>. Pero hay que tener en cuenta que <strong>MongoDB </strong>distingue entre mayúsculas y minúsculas y que utiliza <a href="http://es.wikipedia.org/wiki/Orden_lexicogr%C3%A1fico">el orden lexicográfico</a>. Esto quiere decir que <strong>MongoDB </strong>ordena los <em>strings </em>de la misma manera que un diccionario, aunque diferenciando mayúsculas y minúsculas.</span></div>
</div>
<div>
<div><span> </span></div>
</div>
<div>
<div><span>Este es un ejemplo de orden de strings que hace <strong>MongoDB</strong>.</span></div>
</div>
<div></div>
<div>
<div>
<div class="hiddenCode">
<pre class="consolestyle">{ "_id" : "AAab" }<br/>{ "_id" : "Abb" }<br/>{ "_id" : "Abc" }<br/>{ "_id" : "BCb" }<br/>{ "_id" : "Bbaab" }<br/>{ "_id" : "abb" }<br/>{ "_id" : "abc" }<br/>{ "_id" : "bcb" }</pre>
</div>
<div></div>
<div>
<div><span>En orden ascendente las mayúsculas van primero y luego se tiene en cuenta el orden lexicográfico de cada letra. Como podéis ver el número de caracteres no se tiene en cuenta.</span></div>
</div>
</div>
<div>
<div></div>
</div>
<div>
<h3><strong><span>Operaciones según la existencia o el tipo de los elementos</span></strong></h3>
</div>
<div>
<div><span>Como ya sabéis <strong>MongoDB </strong>es una base de datos sin esquema, lo que quiere decir que los documentos, aun siendo de la misma colección, pueden tener distintos campos. Incluso estos campos pueden ser de distintos tipos en cada documento.</span></div>
</div>
<div>
<div><span> </span></div>
</div>
<div>
<div><span>Así que en ocasiones puede ser útil realizar una consulta que nos devuelva los documentos en los que exista un determinado campo. En la siguiente consulta comprobamos buscamos los documentos en los que existe el campo <em>company</em>.</span></div>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find({company:{$exists:true}},{name:1,age:1,company:1})</pre>
</div>

<div>
<div><span>Si quisieramos buscar los documentos que no tienen el campo company, bastará con cambiar el true por un false en el <strong><em>$exists.</em></strong></span></div>
</div>
<div>
<div><span> </span></div>
</div>
<div>
<div><span><strong>MongoDB </strong>puede guardar documentos con distintos tipos en el mismo campo. Por ejemplo aunque <em>age </em>es un número para todos los documentos, podríamos insertar un documento nuevo con un <em>string </em>en ese campo. Por tanto, también podríamos necesitar filtrar por documentos en los cuales un campo será de un determinado tipo. Esto se hace con el operador <em><strong>$type</strong></em>.</span></div>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find({company:{$type:2}},{name:1,age:1,company:1})</pre>
</div>

<div>
<div><span>En este caso estamos buscando los documentos cuyo campo company sea de tipo 2, que es el tipo <em>string</em>. Podéis encontrar número asignado a cada tipo <a href="http://docs.mongodb.org/manual/reference/operator/type/#op._S_type">en la ayuda del operador $type en la página de MongoDB</a>.</span></div>
</div>
<div>
<div></div>
</div>
<div>
<h3><strong><span>Operaciones lógicas</span></strong></h3>
</div>
<div>
<div><span>En bases de datos relacionales es muy típico añadir operadores <em>OR </em>a la clausula <em>WHERE</em>. Por ejemplo <em>WHERE gender = “female” OR age &gt; 20</em>. Hasta ahora las consultas que hemos visto buscaban por uno o más campos, pero lo hacían  con la lógica de un <em>AND</em>, es decir, que todas las condiciones debían cumplirse. Si queremos añadir cláusulas <em>OR </em>usaremos <strong><em>$or</em></strong>.</span></div>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find( <br/>  { $or: <br/>     [ <br/>       {gender:"female"}, <br/>       {age:{$gt:20}} <br/>     ] <br/>   } , <br/>   {name:1,gender:1,age:1} )</pre>
</div>

<div>
<div><span>En este caso buscamos los documentos cuyo campo gender sea “<em>female</em>&ldquo; o cuyo campo <em>age </em>sea mayor que 20. Como vemos basta con especificar un array de condiciones para que el operador <em><strong>$o</strong></em>r realice la consulta.</span></div>
</div>
<div>
<div><span> </span></div>
</div>
<div>
<div><span>Lo curioso es que también existe un operador <em><strong>$and</strong></em>. ¿Por qué es curioso? Pensemos en las siguientes consultas</span></div>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find( {gender:"female", age:{$gt:20}} , {name:1,gender:1,age:1} )</pre>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find(<br/>  { <br/>    $and: <br/>      [ <br/>        {gender:"female"}, <br/>        {age:{$gt:20}} <br/>      ] <br/>   } , <br/>   {name:1,gender:1,age:1} )</pre>
</div>

<div>
<div><span>Pues es curioso, porque en realidad, la consulta es la misma. En la primera, <strong>MongoDB </strong>hace un<em> and implícito </em>de los parámetros de la consulta, mientras que en la segunda hemos incluido el<em> and explícitamente</em>. </span></div>
</div>
<div>
<div><span> </span></div>
</div>
<div>
<div><span>¿Entonces por qué usar este operador? Pues puede utilizarse si tenemos que hacer una consulta que incluya dos veces el mismo campo. Si no utilizamos el <em>and </em>y lo hacemos de de esta manera, podemos obtener resultados erróneos. Por ejemplo las siguientes consultas son iguales, aunque invirtiendo el orden de las condiciones. </span></div>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find( {age:{$gt:30},age:{$lt:40}} , {name:1,gender:1,age:1} )</pre>
<pre class="consolestyle">&gt; db.people.find( {age:{$lt:40},age:{$gt:30}} , {name:1,gender:1,age:1} )</pre>
</div>

<div>
<div><span>Si las ejecutáis veréis que devuelven resultados distintos. Esto es porque <strong>MongoDB </strong>coge el último valor para realizar la consulta. La consulta correcta sería:</span></div>
</div>
<div>
<div></div>
</div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find( <br/> {<br/>  $and:<br/>   [<br/>     {age:{$gt:30}},<br/>     {age:{$lt:40}}<br/>   ]} , <br/>   {name:1,gender:1,age:1} )</pre>
</div>

<div>
<div><span><em><strong>$and</strong></em> también puede ser útil para filtrar conjuntamente con <strong><em>$or</em></strong></span></div>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">db.people.find( <br/>  {$or:<br/>     [ {age:{$gt:30}}, <br/>         {$and:[<br/>                 {age:{$gt:50}},<br/>                 {gender:"female"}<br/>                ]<br/>          } <br/>      ] <br/>   })</pre>
</div>

<div>
<div><span>Este comando nos buscará las personas en people cuya edad es mayor que 30, o cuyo género es “female” y su edad mayor que 50.</span></div>
</div>
<div>
<div></div>
</div>
<div>
<div><span>Además de <strong><em>$and y $or</em></strong>, tenemos otros dos operadores lógicos que son <strong><em>$not y $nor</em></strong>.</span></div>
</div>
<div></div>
<div>
<div><span>$not es bastante sencillo de entender ya que lo que hace es buscar los documentos que no cumplan una determinada condición. </span></div>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find( {age:{$not:{$gt:30}}})</pre>
</div>

<div>
<div><span>Lo importante en este caso, es saber que <strong><em>$not </em></strong>solo puede usarse con otros operadores como <strong><em>$gt o $lt</em></strong>. No puede usarse con valores directos o documentos. Para eso ya existe el operador <strong><em>$ne</em></strong> que hemos explicado antes. También hay que tener en cuenta que estamos buscando edades que no sean mayores que 30. Esto incluye el 30, ya que está fuera del conjunto de números mayores que 30 , y los documentos que no tengan campo <em>age</em>.</span></div>
</div>
<div></div>
<div>
<div><span>También podemos utilizar el operador <strong><em>$nor</em></strong> que acepta dos o más valores. Por ejemplo en la siguiente consulta buscamos las personas cuya edad NO sea mayor que 30 y cuyo campo <em>isActive </em>NO sea true. </span></div>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">&gt; db.people.find({$nor:[{age:{$gt:30}},{isActive:true}]},{age:1,isActive:1})</pre>
</div>

<div>
<div><span>Destacar que al igual que <strong><em>$not</em></strong>, <em><strong>$nor</strong></em> devuelve también los documentos si los campos no existen. Para evitar esto, si es algo que no deseamos, podemos añadir el operador <strong><em>$exists</em></strong>.</span></div>
</div>
<div></div>
<div class="hiddenCode">
<pre class="consolestyle">db.people.find(<br/>     {$nor:<br/>       [ {age:{$gt:30}},{age:{$exists:false}},<br/>         {isActive:true},{isActive:{$exists:false}}<br/>       ]<br/>     })</pre>
</div>

<div>
<div><span>En este caso buscamos los documentos cuya edad NO sea mayor que 30, cuyo campo <em>isActive </em>NO sea true y que ambos campos existan.</span></div>
</div>
<div></div>
<div>
<h3><strong><span>Conclusión</span></strong></h3>
</div>
<div>
<div><span><strong>MongoDB </strong>tiene un potente motor de consultas que nos permite realizar prácticamente cualquier operación. No obstante en este artículo hemos dejado fuera partes importantes, como las consultas sobre campos que contienen un array o un subdocumento, consultar texto como si usáramos el <em>LIKE </em>de las bases de datos relacionales o como realizar ordenaciones.</span></div>
</div>
<div>
<div><span> </span></div>
</div>
<div>
<div><span>Todo eso para la siguiente entrada. Allí nos vemos.</span></div>
</div>
<div><br/><br/></div>
<hr><hr><p><em>¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me gusta en Facebook o de publicarlo en Twitter. ¡ Gracias !<br/></em></p>
</div>
</div>
</div>

* * * * *

* * * * *
*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*
