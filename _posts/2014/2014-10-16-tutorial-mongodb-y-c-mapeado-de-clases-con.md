---
layout: post
title:  Tutorial MongoDB y C#. Mapeado de clases con atributos.
redirect_from:
  - /post/100146951744/tutorial-mongodb-y-c-mapeado-de-clases-con.html
  - /post/100146951744/
---


<p>Una de las características que nos proporciona <strong>el driver de C# para MongoDB</strong>, es la serialización de documentos. De esta manera, y ayudándonos de genéricos, podemos convertir documentos de <strong>MongoDB</strong> en objetos de C#, que podemos utilizar directamente nuestras aplicaciones. Es lo que se conoce como mapeado de objetos o clases.</p>

<p>Aunque <strong>MongoDB</strong> hace estas operaciones de forma automática, hay veces en las que es necesario personalizar el proceso para ajustarlo a nuestras necesidades. Por ejemplo nos podemos encontrar un documento no tiene los mismos campos que su correspondiente clase, que los nombres varían o que los tipos de datos son diferentes.</p>

<p>Así que en esta entrada, vamos a ver cómo podemos personalizar este proceso para adaptarse a nuestras necesidades.</p>

<h3>Mapeado automático</h3>

<p>Como ya he comentado, el driver de <strong>MongoDB</strong> es capaz de mapear campos de forma directa, siempre que no sean documentos demasiado complicados.</p>

<pre><code>{
  "Nombre":"Rubén",
  "Blog":"CharlasCylon",
  "Articulos": 143
}
</code></pre>

<p>El documento anterior es un documento <em>JSON</em> que podríamos almacenar en <strong>MongoDB</strong>. Y una clase <em>POCO</em> que lo represente podría ser de la siguiente manera:</p>

<pre><code>public class Usuario {
  public string Nombre {get; set;}
  public string Blog {get; set;}
  public int Articulos {get; set;}
}
</code></pre>

<p>Como veis algo muy sencillo. Para devolver todos los usuarios con una consulta a <strong>MongoDB</strong> haríamos algo parecido a esto:</p>

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

<p>Pero el código anterior, devuelve una excepción.</p>

<blockquote>
  <p>Element &rsquo;_id&rsquo; does not match any field or property of class Usuario.</p>
</blockquote>

<p>Como ya sabemos, <strong>MongoDB</strong> siempre añade un campo <em>_id</em> a todos los documentos, pero este <em>_id</em> no se encuentra en nuestra clase. Y lo mismo pasaría con todos los posibles campos que tenga el documento, pero que no tenga la clase. Pero ¿cómo lo solucionamos?</p>

<h3>Usando atributos</h3>

<p>El espacio de nombres <em>MongoDB.Bson.Serialization.Attributes</em> nos proporciona atributos útiles para gestionar estas situaciones. Es una forma sencilla de decirle al serializador que debe tratar los datos de forma especial.</p>

<p>Para ver como se usan los atributos, primero que vamos a añadir un campo <em>Id</em> a nuestra clase. En este caso tendríamos dos opciones: que el campo sea del tipo ObjectId o que el campo sea un string que se convierta a <em>ObjectId</em> al almacenarse en la base de datos (y viceversa). Otra opción podría ser que el <em>ObjectId</em> se guardase en <strong>MongoDB</strong> como string, pero esa opción la vamos a dejar para otro artículo.</p>

<p>En el primer caso, el más sencillo, solo tenemos que modificar nuestra clase, y no es necesario añadir atributos. El serializador es lo suficientemente inteligente como para saber cómo realizar el mapeo. La clase quedaría así:</p>

<pre><code>public class Usuario
{
    public ObjectId Id { get; set; }
    public string Nombre { get; set; }
    public string Blog { get; set; }
    public int Articulos { get; set; }
} 
</code></pre>

<p>En el segundo caso, sí necesitamos usar un atributo. Lo haríamos de la siguiente manera:</p>

<pre><code>public class Usuario
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string Nombre { get; set; }
    public string Blog { get; set; }
    public int Articulos { get; set; }
}
</code></pre>

<p>En este caso estamos diciendole a <strong>MongoDB</strong> que cuando guarde un objeto de la clase Usuario, debe guardar el Id como <em>ObjectId</em>. En cambio cuando los datos vengan de la base de datos, se deberá convertir dicho <em>ObjectId</em> en string.</p>

<p>Es importante tener en cuenta que el campo <em>_id</em> que se almacena en <strong>MongoDB</strong> tiene que ser un <em>ObjectId</em>. Se producirá una excepción si usamos otro valor distinto. Es decir, números enteros, strings que no se puedan convertir a <em>ObjectId</em>, <em>GUIDS</em> etc.</p>

<p>Con la anterior clase este documento se serializaría correctamente:</p>

<pre><code>{
  "_id" : ObjectId("543e49b085bef02eef995d18"),
  "Nombre" : "Rubén",
  "Blog" : "CharlasCylon",
  "Articulos" : 143
}
</code></pre>

<p>Pero en cambio este otro documento, generará una excepción:</p>

<pre><code>{
  "_id" : 22,
  "Nombre" : "Rubén",
  "Blog" : "CharlasCylon",
  "Articulos" : 143
}
</code></pre>

<p>De momento hemos solucionado el problema del Id, <strong>¿pero qué pasa cuándo el documento tiene campos que no queremos mapear con nuestra clase?</strong> Imaginemos que nuestros documentos son como este:</p>

<pre><code>{
    "_id" : ObjectId("543e558f85bef02eef995d19"),
    "Nombre" : "Rubén",
    "Blog" : "CharlasCylon",
    "Articulos" : 143,
    "Activo" : true,
    "Rol" : "administrator"
}
</code></pre>

<p>Si queremos mapear este documento con la clase que hemos usado antes, se produciría un error, ya que los campos Activo y Rol, no tienen correspondencia en la clase. Para solucionar este problema, podemos utilizar los atributos de clase. Por ejemplo, nuestra clase estaría codificada de la siguiente manera:</p>

<pre><code>[BsonIgnoreExtraElements()]
public class Usuario
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string Nombre { get; set; }
    public string Blog { get; set; }
    public int Articulos { get; set; }
}
</code></pre>

<p>Con el atributo <strong>BsonIgnoreExtraElements</strong> le estamos diciendo al serializador, que debe ignorar aquellos elementos que no existan en la clase.</p>

<p>Si solo queremos hacer esa operación con alguno de los elementos, podemos usar el atributo <strong>BsonIgnoreIfNull</strong>, que se utiliza a nivel de propiedad o campo en lugar de a nivel de clase.</p>

<p>El caso contrario también se puede dar,  si necesitamos asegurarnos de que un campo existe en el documento. Para ello usaremos el atributo <strong>BsonRequired</strong>. Por ejemplo:</p>

<pre><code>[BsonIgnoreExtraElements()]
public class Usuario
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string Nombre { get; set; }
    public string Blog { get; set; }  

    [BsonRequired()]
    public int Articulos { get; set; }
}
</code></pre>

<p>En esta ocasión estamos ignorando todos los campos que no aparezcan en el documento, salvo el campo Articulos, que debe estar presente para que no se produzca una excepción.</p>

<h3>Conclusiones</h3>

<p>Los atributos son una herramienta sencilla, que nos permiten controlar de forma más activa la serialización de los documentos. Además de los atributos explicados en este artículo, existen <a href="http://api.mongodb.org/csharp/1.1/html/7c3829d2-ad42-6bbc-40c6-c2adca36078b.htm">algunos más</a> que nos pueden ayudar en nuestros desarrollos.</p>

<p>Pero <strong>los atributos tienen también sus &ldquo;peros&rdquo;</strong>. Por ejemplo, que** debemos añadirlos para cada entidad o clase** POCO que tengamos, aunque el tratamiento sea el mismo en todas ellas (por ejemplo el tratamiento del Id). Otro problema es que estamos añadiendo elementos característicos de <strong>MongoDB</strong> a nuestras clases, lo cual puede significar un problema si queremos aislar nuestro modelo de datos de la implementación de la base de datos.</p>

<p>Para solucionar estos problemas, en el próximo artículo veremos como crear mapeos de clases con código C# y qué son las <em>conventions</em>. Aquí nos vemos.</p>

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*
