---
layout: post
title:  Tutorial de MongoDB y C#. Modificando el mapeo de clases con Class Maps y Conventions
redirect_from:
  - /post/100816290873/tutorial-mongodb-modificando-mapeo-class-maps-convention.html
  - /post/100816290873/
---

<p>En el <a href="https://www.charlascylon.com/post/100146951744/tutorial-mongodb-y-c-mapeado-de-clases-con-atributos">anterior artículo</a> contaba como podíamos tener un mayor control sobre la serialización de los elementos de un documento. <strong>Ayudados por los atributos</strong>, podíamos modificar el comportamiento. Así podíamos mapear un documento con una clase aunque los campos fueran de distinto tipo, no existieran o tuvieran nombres diferentes.</p>

<p>Pero como comentaba en el final del artículo, es posible que el uso de atributos no sea la solución más indicada para nosotros. Por ejemplo, puede pasar que no queramos mezclar nuestro modelo de clases de datos con la implementación específica que hace <strong>MongoDB</strong>. O que no queramos especificar los atributos por cada clase generada.</p>

<p>En este artículo vamos a ver como podemos cambiar el comportamiento de la serialización de objetos sin utilizar atributos.</p>

<h3>Personalizando el mapeo de clases</h3>

<p>Una de las opciones que tenemos, es cambiar el comportamiento del mapeo de clases. Esta es una operación que deberemos hacer una sola vez en nuestra aplicación, por lo que será conveniente hacerla en algún evento de inicio. Por ejemplo en MVC podemos hacerlo en la clase <em>Startup</em>.</p>

<p>Vamos a suponer que nuestros documentos siguen el siguiente modelo:</p>

<pre><code>{
  "_id" : ObjectId("543e558f85bef02eef995d19"),
  "Nombre" : "Rubén",
  "Blog" : "CharlasCylon",
  "Articulos" : 143,
  "Activo" : true,
  "Rol" : "administrator"
}
</code></pre>

<p>Y que nuestra clase POCO tiene el siguiente formato:</p>

<pre><code>public class Usuario
{
    public string Id { get; set; }
    public string Nombre { get; set; }
    public string Blog { get; set; }
    public int Articulos { get; set; }
}
</code></pre>

<p>Y que vamos a realizar una consulta desde C# de la siguiente manera:</p>

<pre><code>var client = new MongoClient("mongodb://localhost:27666");
var server = client.GetServer();
var database = server.GetDatabase("test");
var collection = database.GetCollection&lt;usuario&gt;("usuarios");

var lista = collection.FindAllAs&lt;usuario&gt;();

foreach (var item in lista)
{
    Console.WriteLine(item.Nombre);
    Console.WriteLine(item.Blog);
    Console.WriteLine(item.Articulos);
}
</code></pre>

<p>Como vimos en el anterior artículo, el <strong>código anterior produce varias excepciones</strong>. La primera porque un campo <em>ObjectId</em> no se puede convertir a <em>string</em>, y la segunda porque existen campos en el documento, que no están en la clase (Activo y Rol).</p>

<p>Para evitar esas excepciones, debemos modificar el mapeo que hacemos de los campos. Y eso se puede hacer de la siguiente manera:</p>

<pre><code>BsonClassMap.RegisterClassMap&lt;usuario&gt;(cm =&gt;
{
    cm.AutoMap();
    cm.IdMemberMap.SetRepresentation(BsonType.ObjectId);
    cm.SetIgnoreExtraElements(true);
});
</code></pre>

<p>La clase <em>BsonClassMap</em> del espacio de nombres <em>MongoDB.Bson.Serialization</em>, se encarga de registrar los mapeos personalizados. En este caso estamos haciendo que para la clase <em>Usuario</em>, se realice el mapeo automático para todos los campos, pero con dos excepciones. En la primera, que indicamos con <em>IdMemberMap.SetRepresentation</em>, estamos diciendo que el campo <em>Id</em> será del tipo <em>ObjectId</em> en base de datos. La segunda excepción la indicamos con <em>SetIgnoreExtraElements</em>, y decimos que se deben ignorar los campos que no tengan correspondencia entre la clase y el documento existente en <strong>MongoDB</strong>.</p>

<p>Como he comentado antes, este mapeo debemos hacerlo solo una vez, ya que si no se producirá una excepción. El mapeo solo se aplica para las clases de tipo <em>Usuario</em>, ya que el resto se seguirán comportando igual.</p>

<p>Este tipo de mapeo puede tener sentido para cosas muy específicas, pero si tenemos muchas clases, será una pérdida de tiempo aplicar las mismas opciones a todas ellas. Y para solucionar ese problema aparecen las <em>Conventions</em>.</p>

<h3>Personalizando el mapeo de clases con Conventions</h3>

<p>He intentado buscar una buena traducción para <em>conventions</em>, pero la verdad es que no me convence ninguna. Podríamos decir que las <em>conventions</em> son acuerdos preestablecidos para serializar los documentos de una determinada manera. La idea es parecida a la del ejemplo anterior, pero en este caso se aplicará a distintas clases según un filtro y no solo para las de un tipo determinado. Un ejemplo:</p>

<pre><code>ConventionPack pack = new ConventionPack();
pack.Add(new IgnoreExtraElementsConvention(true));
pack.Add(new StringObjectIdConvention());

ConventionRegistry.Register("My Conventions", pack, t =&gt; true);
</code></pre>

<p>Al igual que con <em>BsonClassMap</em>, <em>ConventionRegistry</em> hay que usarlo una sola vez en la aplicación. Y además hay que hacerlo en un punto temprano de la ejecución, ya que si se mapea alguna clase antes, nuestras <em>conventions</em> podrían no funcionarán bien.</p>

<p>Si nos fijamos en el código anterior, podemos ver creamos una instancia de <em>ConventionPack</em> y luego utilizamos el método <em>Add</em> para añadir. Una vez tenemos creado nuestro <em>ConventionPack</em>, tendremos que registrarlo. Esto podemos hacerlo con la clase <em>ConventionRegistry</em>, y el método estático <em>Register</em>. Como se puede ver en el ejemplo, este método recibe tres parámetros: un nombre (puede ser cualquier string), el pack de conventions y un filtro para delimitar las clases a las que se aplica. En este caso estamos haciendo un <em>t =&gt; true</em>, lo que hace que se aplique a todas las clases. Aunque si quisiéramos podríamos filtrar, por ejemplo, por el nombre del ensamblado.</p>

<p>Si nos fijamos otra vez en las <em>conventions</em> que estamos añadiendo al <em>ConventionPack</em>, podemos ver  que estamos añadiendo dos: <em>IgnoreExtraElementsConvention</em> y <em>StringObjectIdConvention</em>. La primera, es una <em>convention</em> que ya tenemos implementada en el espacio de nombres <em>MongoDB.Bson.Serialization.Conventions</em>. Existen <a href="http://api.mongodb.org/csharp/current/html/c964d104-512c-4b86-662e-dc0bafab836c.htm">varias conventions más</a> que podremos usar en nuestras aplicaciones. La segunda es una <em>convention</em> personalizada. Veamos su código:</p>

<pre><code>public class StringObjectIdConvention : ConventionBase, IPostProcessingConvention
{
    public void PostProcess(BsonClassMap classMap)
    {
        var idMap = classMap.IdMemberMap;

        if (idMap != null &amp;&amp; idMap.MemberName == "Id" &amp;&amp; idMap.MemberType == typeof(string) )
        {
            idMap.SetRepresentation(BsonType.ObjectId);
            idMap.SetIdGenerator(new StringObjectIdGenerator());
        }
    }
}
</code></pre>

<p>Esta <em>convention</em> es la que utilizamos para decir que un <em>Id</em> será de tipo string en las clases, pero que se almacenará como <em>ObjectId</em> en <strong>MongoDB</strong>. Por eso implementamos la interface <em>IPostProcessingConvention</em>, que nos sirve para realizar operaciones al finalizar la serialización (<em>PostProcess</em>). La serialización se realiza en  varios pasos que siguen un orden, y hay definidas <a href="http://docs.mongodb.org/ecosystem/tutorial/serialize-documents-with-the-csharp-driver/#conventions">distintas interfaces</a> para procesar los elementos en un momento u otro.</p>

<p>Volviendo a nuestra <em>convention</em> personalizada, vemos que tiene solo un método y que en él comprueba si en el mapeo de clase existe un campo <em>Id</em> de tipo string. Si es así, lo que hace es establecer la representación como <em>ObjectId</em> y el generador de <em>Ids</em> como <em>StringObjectGenerator</em>.</p>

<h3>Conclusiones</h3>

<p>Aunque el driver de C# para <strong>MongoDB</strong> es capaz de serializar automáticamente muchos de los documentos, en ocasiones es necesario tener un mayor control sobre la operación. Para ello, el driver de C#, nos proporciona de distintos métodos. Tenemos los atributos, los mapeos de clases y las <em>conventions</em>.</p>

<p>En nuestra mano está, usar una u otra alternativa, según nuestras necesidades.</p>

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*
