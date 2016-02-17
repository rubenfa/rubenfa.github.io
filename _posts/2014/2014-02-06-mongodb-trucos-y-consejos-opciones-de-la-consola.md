---
layout: post
title: MongoDB. Trucos y consejos. Opciones de la consola que quizá no conocías
redirect_from:
  - /post/75783630985/mongodb-trucos-y-consejos-opciones-de-la-consola.html
---

<p>Hace un tiempo, en <a href="http://www.charlascylon.com/post/64100855356/gestion-de-mongodb-con-robomongo">otro artículo</a>, os hablé de Robomongo.</p>

<p>Robomongo es una aplicación muy útil para gestionar nuestras bases de datos <strong>MongoDB</strong>. Tiene ciertas características interesantes, que nos pueden hacer la vida más fácil.</p>

<p>En el artículo de hoy, y un poco a parte de la línea general del tutorial de <strong>MongoDB</strong>, os voy a hablar de algunas funcionalidades de la  consola que quizá no conozcáis.</p>

<h3>Personalización del prompt</h3>

<p>Por defecto, la consola de <strong>MongoDB</strong> solo nos muestra un signo &ldquo;&gt;&rdquo; como indicador. Si queremos modificar este comportamiento, podemos hacer uso del objeto <strong>prompt</strong> que está definido en nuestra consola.</p>

<pre><code>prompt = function()
 {
    return hostname() + "&gt;";
 }
</code></pre>

<p>Con la función anterior lo que conseguimos es que en lugar de mostrar simplemente el signo &ldquo;&gt;&rdquo; también se muestre el nombre de la máquina sobre la que estamos trabajando. En mi caso:</p>

<pre><code>CYLON-MACHINE&gt;use people
switched to db people
CYLON-MACHINE&gt;
</code></pre>

<h3>Usando scripts desde la consola</h3>

<p>Lo malo de definir funciones directamente desde la consola, es que estas se eliminan en cuánto terminamos la sesión. Si salimos de la consola de <strong>MongoDB</strong> y volvemos a conectar, el <em>prompt</em> volverá a ser un simple símbolo &ldquo;&gt;&rdquo;.</p>

<p>Además, escribir scripts en la consola es algo bastante tedioso. Cada vez que añadimos un salto de línea, esta queda fija. <strong>MongoDB</strong> entiende que vas a introducir la siguiente línea del script, por lo que no te deja modificar las anteriores. Si te das cuenta tarde de que has puesto mal algún comando, te toca volver a escribirlo desde el principio. Así que escribir scripts largos es bastante difícil.</p>

<p>Si tenemos funciones que utilizamos habitualmente, podemos cargarlas desde un script. Por ejemplo, imaginemos que tenemos un script como este, al que llamaremos <em>finder.js</em>:</p>

<pre><code>var findLast10 = function()
{ 
    return db.people.find
    (
      {},
      {name:1}
    ).sort({name:-1}).limit(10).pretty(); 
};

prompt = function()
     {
        return hostname() + "&gt;";
     }

print("Datos personalizados cargados correctamente");
</code></pre>

<p>En el script anterior creamos una función llamada <em>findLast10</em> que hace una consulta para devolver ordenados los 10 últimos nombres de la colección <em>people</em>. También añadimos la función que hemos utilizado antes para modificar el <em>prompt</em>. Para cargarlo, usamos el comando <em>load</em>:</p>

<pre><code>&gt; load("finder.js");
Datos personalizados cargados correctamente
true
CYLON-MACHINE&gt;findLast10()
{ "_id" : ObjectId("51ca13be68c55d38628ec6ec"), "name" : "Zoey Waller" }
{ "_id" : ObjectId("51ca13be68c55d38628ec721"), "name" : "Zoey Otis" }
{ "_id" : ObjectId("51ca13be68c55d38628ec658"), "name" : "Zoe Wallace" }
{ "_id" : ObjectId("51ca13be68c55d38628ec7a0"), "name" : "Zoe Hamphrey" }
{ "_id" : ObjectId("51ca13be68c55d38628ec6ef"), "name" : "Victoria Mercer" }
{ "_id" : ObjectId("51ca13be68c55d38628ec6e3"), "name" : "Victoria Fisher" }
{ "_id" : ObjectId("51ca13be68c55d38628ec7dc"), "name" : "Victoria Adamson" }
{ "_id" : ObjectId("51ca13be68c55d38628ec7ce"), "name" : "Vanessa Owen" }
{ "_id" : ObjectId("51ca13be68c55d38628ec6e1"), "name" : "Vanessa Gate" }
{ "_id" : ObjectId("51ca13be68c55d38628ec7f2"), "name" : "Vanessa Davidson" }
CYLON-MACHINE&gt;
</code></pre>

<p>Tras cargar el archivo <em>finder.js</em> podemos ver que el <em>prompt</em> vuelve a escribir el nombre de la máquina. También ha definido la función <em>findLast10</em>, que como vemos, se puede ejecutar sin problemas.</p>

<p>Es importante destacar que los archivos js deben estar en el mismo directorio que <strong>MongoDB</strong> para que pueda encontrarlos. Si queremos usar subdirectorios, podemos añadir la ruta relativa.</p>

<pre><code>&gt; load("scripts/finder.js");
</code></pre>

<h3>Cargando scripts y variables al iniciar la consola</h3>

<p>El anterior truco es muy útil, pero sigue teniendo el problema de que tenemos que cargar el archivo con el comando <em>load</em> cada vez que iniciamos la consola de <strong>MongoDB</strong>.</p>

<p>Si queremos evitar esto, tendremos que guardar las variables y funciones en un archivo llamado <em>.mongorc.js</em>. Este archivo está ubicado en el <em>Home</em> de nuestro usuario si usamos Linux, o en <em>raiz\usuarios\nombre_usuario</em> si usamos Windows.</p>

<p>De esta manera los scripts, se cargarán automáticamente al iniciar una conexión a la consola.</p>

<pre><code>D:\Software\mongo\2.4&gt;mongo localhost:27666
MongoDB shell version: 2.4.8
connecting to: localhost:27666/test
Datos personalizados cargados correctamente
CYLON-MACHINE&gt;findLast10()
{ "_id" : ObjectId("51ca13be68c55d38628ec6ec"), "name" : "Zoey Waller" }
{ "_id" : ObjectId("51ca13be68c55d38628ec721"), "name" : "Zoey Otis" }
{ "_id" : ObjectId("51ca13be68c55d38628ec658"), "name" : "Zoe Wallace" }
{ "_id" : ObjectId("51ca13be68c55d38628ec7a0"), "name" : "Zoe Hamphrey" }
{ "_id" : ObjectId("51ca13be68c55d38628ec6ef"), "name" : "Victoria Mercer" }
{ "_id" : ObjectId("51ca13be68c55d38628ec6e3"), "name" : "Victoria Fisher" }
{ "_id" : ObjectId("51ca13be68c55d38628ec7dc"), "name" : "Victoria Adamson" }
{ "_id" : ObjectId("51ca13be68c55d38628ec7ce"), "name" : "Vanessa Owen" }
{ "_id" : ObjectId("51ca13be68c55d38628ec6e1"), "name" : "Vanessa Gate" }
{ "_id" : ObjectId("51ca13be68c55d38628ec7f2"), "name" : "Vanessa Davidson" }
CYLON-MACHINE&gt;
</code></pre>

<h3>Ejecutando funciones almacenadas</h3>

<p><strong>MongoDB</strong> no tiene procedimientos almacenados, aunque tiene una función parecida: podemos almacenar funciones dentro de la base de datos. Un ejemplo:</p>

<pre><code>db.system.js.save(
{
   _id:"findLast10",
   value: function(){
        return db.people.find
        (
          {},
          {name:1}
        ).sort({name:-1}).limit(10).pretty().toArray();
 }
}); 
</code></pre>

<p>Si ejecutamos el código anterior en la consola, estaremos guardando una función JavaScript en la base de datos. La función es la misma que hemos utilizado antes, con la diferencia de que hemos añadido un <em>toArray</em>. Como <em>find</em> en realidad devuelve un cursor, tenemos que añadir el toArray para devolver los resultados, en lugar de el propio cursor.</p>

<p>Para ejecutar nuestra función almacenada, utilizamos el comando <em>eval</em> y el <em>_id</em> de la función:</p>

<pre><code>&gt; db.eval("findLast10()");
[
    {
            "_id" : ObjectId("51ca13be68c55d38628ec6ec"),
            "name" : "Zoey Waller"
    },
    {
            "_id" : ObjectId("51ca13be68c55d38628ec721"),
            "name" : "Zoey Otis"
    },
    {
            "_id" : ObjectId("51ca13be68c55d38628ec658"),
            "name" : "Zoe Wallace"
    },
    {
            "_id" : ObjectId("51ca13be68c55d38628ec7a0"),
            "name" : "Zoe Hamphrey"
    },
    {
            "_id" : ObjectId("51ca13be68c55d38628ec6ef"),
            "name" : "Victoria Mercer"
    },
    {
            "_id" : ObjectId("51ca13be68c55d38628ec6e3"),
            "name" : "Victoria Fisher"
    },
    {
            "_id" : ObjectId("51ca13be68c55d38628ec7dc"),
            "name" : "Victoria Adamson"
    },
    {
            "_id" : ObjectId("51ca13be68c55d38628ec7ce"),
            "name" : "Vanessa Owen"
    },
    {
            "_id" : ObjectId("51ca13be68c55d38628ec6e1"),
            "name" : "Vanessa Gate"
    },
    {
            "_id" : ObjectId("51ca13be68c55d38628ec7f2"),
            "name" : "Vanessa Davidson"
    }
]   
</code></pre>

<h3>Conclusiones</h3>

<p>Aunque la consola de <strong>MongoDB</strong> en ciertos aspectos no es muy amigable, tiene una serie de opciones que cualquier administrador debería conocer. Teniendo una buena colección con las funciones más utilizadas, nos evitaremos repetir pasos y podremos automatizar mejor las tareas.</p>

<hr><hr><ul><li><p>¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me gusta en Facebook o de publicarlo en Twitter.</p></li>
<li><p>Recuerda que puedes ver el índice del tutorial de MongoDB y acceder a todos los artículos de la serie desde <a href="http://www.charlascylon.com/mongodb" title="Enlace a página principal del tutorial">aquí</a>.</p></li>
<li><p>¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog? Suscríbete por <a href="feed://www.charlascylon.com/rss" title="Suscripción RSS">RSS</a>.</p></li>

</ul>
