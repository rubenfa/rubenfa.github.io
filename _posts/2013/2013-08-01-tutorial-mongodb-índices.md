---
layout: post
title: Tutorial MongoDB. Índices
redirect_from:
  - /post/61794351054/tutorial-mongodb-índices.html
  - /post/61794351054/
---

<p>Una parte importante en cualquier base de datos, sea relacional o no, son los índices. Los índices se utilizan para incrementar la velocidad de acceso a los datos, pudiendo obtenerlos de manera más directa. En lugar de recorrer una tabla o colección para buscar un conjunto de resultados, buscamos directamente en el índice que nos devuelve el registro o conjunto de registros de forma directa.</p>

<p><strong>MongoDB</strong> es capaz de definir índices a nivel de colección, pudiendo reducir drásticamente el tiempo que tarda una consulta en devolver los resultados, ya que <strong>MongoDB</strong> intenta mantener los índices en la memoria RAM, o si no es posible, en disco de forma secuencial. Este índice se almacena internamente como un <a href="http://es.wikipedia.org/wiki/%C3%81rbol-B">B-Tree (árbol-B)</a>, por lo que su creación y mantenimiento puede influir en el rendimiento de las consultas de escritura como inserciones y actualizaciones.</p>

<p>Con cada consulta, el optimizador de consultas de <strong>MongoDB</strong> elegirá un solo índice ya que no es posible utilizar más. Este índice se determina de manera automática utilizando el que supuestamente tendrá el mejor rendimiento.</p>

<p>Ahora que sabemos qué son los índices, vamos a ver que tipos hay y como crearlos.</p>

<h3>Creación de índices</h3>

<p>Para crear un índice utilizaremos el comando <em>ensureIndex</em>.</p>

<pre><code>&gt; db.collection.ensureIndex(keys, options)  
</code></pre>

<p>En keys añadiremos los campos sobre los que se creará el índice y en opciones podremos añadir distintas opciones como <em>unique</em>, <em>background</em> etc.</p>

<h3>Tipos de índices</h3>

<h4>Índice _id</h4>

<p>Como ya hemos visto en otras entradas del blog, <strong>MongoDB</strong> crea un campo <em>_id</em> para cada documento. Con este campo se crea automáticamente un índice único que no podemos borrar. Todo documento insertado en una colección tendrá un campo <em>_id</em> único que no se podrá repetir.</p>

<h4>Índices normales</h4>

<p>Por índices normales se entienden aquellos que no utilizan ningún tipo de opción. Se crearán con un comando similar a</p>

<pre><code>&gt; db.products.ensureIndex( { "name": 1 }
</code></pre>

<h4>Índices en subdocumentos</h4>

<p>Podemos crear índices que engloben todo el contenido de un subdocumento. Imaginemos que tenemos documentos como el siguiente</p>

<pre><code>{
 name:"Pedro Pérez",
 direccion: 
 {
  ciudad:"Madrid",
  pais: "España" 
 }
}



&gt; db.addresses.ensureIndex({"direccion":1}) 
</code></pre>

<p>Una vez creado el índice sobre el subdocumento, se utilizará a la hora de realizar consultas, como por ejemplo la siguiente:</p>

<pre><code>&gt; db.addresses.find({direccion:{ciudad:"Madrid",pais:"España"}})
</code></pre>

<h4>Índices embebidos</h4>

<p>Podemos crear un índice que esté dentro del campo concreto de un subdocumento utilizando <strong>Dot Notation</strong>.</p>

<pre><code>&gt; db.addresses.ensureIndex({"direccion.ciudad":1}) 
</code></pre>

<h4>Índices compuestos</h4>

<p>Un índice compuesto es un aquel que incluye varios campos en su definición.</p>

<pre><code>&gt; db.productos.ensureIndex({"localizacion":1, "tipo":1, "cantidad":1})
</code></pre>

<p>Si nuestra aplicación suele hacer consultas que impliquen el uso de los campos localización y tipo, la velocidad de las consultas se verá incrementada.</p>

<p>Además los índices compuestos soportan <em>prefijos</em>. Un prefijo es el inicio de un subconjunto de campos. En el ejemplo anterior existen los prefijos <em>{localización}</em> y <em>{localización, tipo}</em>. Esto quiere decir que una consulta que utilice el campo <em>localización</em> o el campo <em>localización</em> y el campo tipo, también podrá hacer uso del índice incrementando su velocidad de respuesta.</p>

<h4>Índices multikey</h4>

<p>Si se añade un campo array a un índice, <strong>MongoDB</strong> indexará cada elemento del array por separado. Consideremos el siguiente ejemplo de documento.</p>

<pre><code>{
 title:"MongoDB: base de datos NoSQL",
 tags: ["MongoDB","10gen","tutorial"]
}
</code></pre>

<p>Si creamos un índice sobre el campo tags, podremos buscar documentos con las querys <em>{tags:&ldquo;MongoDB&rdquo;}</em>, <em>{tags:&ldquo;10gen&rdquo;}</em> o <em>{tags:&ldquo;tutorial&rdquo;}</em>.</p>

<p>Si el array contiene documentos también podemos generar índices</p>

<pre><code>{
 title:"MongoDB: base de datos NoSQL",
 tags: 
 [
  {id:1222,text:"MongoDB"},
  {id:1223,text:"10gen"},
  {id:1234,text:"tutorial"}
 ]
}
</code></pre>

<p>Por ejemplo podemos crear el siguiente índice</p>

<pre><code>&gt; db.blogPosts.ensureIndex({"tags.text":1})
</code></pre>

<p>Lo que nos permitirá realizar consultas utilizando dicho índice:</p>

<pre><code>&gt; db.blogPosts.find({"tags.text":"MongoDB"}) 
</code></pre>

<p>También podemos crear índices compuestos que contengan <em>índices multikey</em>, pero hay que tener en cuenta que solo uno de los campos en el índice compuesto podrá ser un array. Por ejemplo, pensemos en documentos con el siguiente formato</p>

<pre><code>{
 title:"MongoDB: base de datos NoSQL",
 authors:["Pedro J","Roman K", "Luis"],
 tags: ["MongoDB","10gen", "tutorial"]
}
</code></pre>

<p>Está permitido crear un índice compuesto para <em>{title:1,authors:1}</em>, pero no crear un índice para <em>{authors:1,tags:1}</em> ya que <strong>MongoDB</strong> tendría que hacer el producto cartesiano de ambos arrays lo que podría dar lugar a un índice imposible de mantener.</p>

<h3>Opciones</h3>

<h4>Unique</h4>

<p>Un índice único es un índice que no acepta valores duplicados. Si intentamos insertar un índice que ya existe en la colección MongoDB nos devolverá un error. Para crearlo utilizaremos un comando como el siguiente:</p>

<pre><code>&gt; db.addresses.ensureIndex( { "user_id": 1 }, { unique:true } )
</code></pre>

<h4>Sparse</h4>

<p>Normalmente un índice incluye todos los documentos, incluso aquellos que no tienen el campo del índice. En ese caso el índice almacena valores <em>null</em>. Con la opción <em>sparse</em> hacemos que un índice no incluya dichos documentos.</p>

<pre><code>&gt; db.addresses.ensureIndex( { "user_id": 1 }, { sparse: true } )
</code></pre>

<p>Aunque al haber menos documentos la velocidad se puede ver incrementada, hay que tener en cuenta que las consultas pueden verse afectadas devolviendo datos incompletos.</p>

<h4>Background</h4>

<p>Cuando creamos un índice se bloquea la colección. Si esta colección tiene una gran cantidad de datos el sistema puede verse afectado por un largo periodo de tiempo. Para evitar esto podemos usar la opción <em>background</em> que permite seguir utilizando la instancia mientras se termina de generar el índice.</p>

<pre><code>&gt; db.addresses.ensureIndex( { "user_id": 1 }, { background: true } )
</code></pre>

<h4>Borrar duplicados</h4>

<p>Si intentamos crear un índice único sobre un campo que ya contiene valores duplicados, <strong>MongoDB</strong> nos devolverá un error. Para evitar esto podemos usar la opción <em>dropDups</em> que borrará todos los duplicados.</p>

<pre><code>&gt; db.addresses.ensureIndex( { "user_id": 1 }, {unique:true,dropDups: true})
</code></pre>

<p>El anterior comando borrará  todos los <em>user_id</em> duplicados, dejando solo la primera ocurrencia. Es importante destacar, que también se incluirán en el índice los documentos que no tengan el campo <em>&ldquo;user_id&rdquo;</em>, pero con valor <em>null</em>. Si la primera ocurrencia es un documento que no tenga dicho campo, el resto de documentos serán eliminados.</p>

<h3>Ordenación de los índices</h3>

<p>Cuando utilizamos el comando <em>ensureIndex</em> y le pasamos como parámetro el nombre del campo y un número 1 estamos diciendo a <strong>MongoDB</strong> que el índice debe crearse de manera ascendente. Si por el contrario pasamos un -1, haremos que el índice se ordene de manera descendente.</p>

<p>Si el índice tiene un solo valor, la ordenación no es demasiado importante porque <strong>MongoDB</strong> es capaz de recorrer el árbol de índices desde el principio al final o desde el final al principio. Por tanto si una de nuestras consultas utiliza un operador <em>order</em>, se utilizará el índice recorriéndolo de una manera o de otra.</p>

<p>Sin embargo si tenemos un índice compuesto, es posible que necesitemos ordenar cada campo en una dirección. Por ejemplo si tenemos una tabla que controla los accesos de los usuarios a partir de la fecha y la hora, y queremos obtener el nombre de usuario y la fecha más actual, nuestro índice debería crearse con un <em>{user_id:1, lastLoginDate:-1}</em>. De esta manera se ordenaran primero los usuarios de forma ascendente y las fechas de acceso de forma descentente, haciendo las consultas de este tipo más rápidas y sencillas.</p>

<h3>Consultas cubiertas totalmente por un índice</h3>

<p>Una consulta está cubierta completamente por un índice <strong>cuando todos los campos de la consulta y todos los campos devueltos</strong>, están dentro del índice. Aunque hay algunas excepciones:</p>

<ul><li>si alguno de los documentos en la colección, contiene un array en alguno de los campos incluídos en el índice, el índice se convierte en un multikey index y no cubrirá la consulta completamente.</li>
<li>si alguno de los índices hace referencia a algún subdocumento.</li>
</ul><p>Cuando esto sucede las consultas se devuelven rápidamente ya que **MongoDB* *no necesita acceder al documento para devolver los resultados. Estas consultas son sin duda las más rápidas, así que conseguir que nuestros índices cubran completamente nuestras consultas nos proporcionará muy buen rendimiento.</p>

<h3>Eliminar índices</h3>

<p>Para eliminar un índice utilizaremos el comando dropIndex como se explica en el siguiente ejemplo.</p>

<pre><code>&gt; db.products.dropIndex( { "name": 1 }
</code></pre>

<h3>Regenerar índices</h3>

<p>Al igual que sucede en las bases de datos relacionales puede ser necesario recrear de nuevo un índice. Para ello utilizaremos el comando reIndex</p>

<pre><code>&gt; db.products.reIndex()
</code></pre>

<p>El comando borrará todos los índices de la colección y los volverá a generar. Si queremos hacerlo solo con un índice en lugar de realizarlo con todos basará con borrarlo y volver a crearlo.</p>

<h3>Conclusión</h3>

<p>Los índices son un punto importante a la hora de realizar consultas contra una base de datos <strong>MongoDB</strong>. Una mala gestión de los índices puede derivar en un rendimiento pobre, por lo que deberemos ser conscientes del tipo de consutlas que se realizan a la base de datos. Sabiendo qué campos se utilizan para filtrar y cuáles suelen ser los devueltos en las consultas, seremos capaces de crear los índices necesarios para que nuestra base de datos se comporte correctamente.</p>

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](http://charlascylon.com/tutorialmongo)*
