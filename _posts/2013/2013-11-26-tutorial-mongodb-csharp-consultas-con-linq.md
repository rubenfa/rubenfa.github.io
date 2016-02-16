---
layout: post
title: Tutorial MongoDB y C#. Consultas con LINQ
redirect_from:
  - /post/68150241999/tutorial-mongodb-csharp-consultas-con-linq.html
---

<p>En el pasado artículo de este<strong> tutorial de MongoDB y C#</strong>, vimos varias maneras de realizar consultas a la base de datos a través del <strong>driver de C#</strong>. De manera muy sencilla  podíamos realizar consultas pasando directamente un <em>JSON </em>o utilizando la clase <em>Query</em>. No obstante hay una manera mejor, aprovechándonos de uno de las mejores características que tiene .NET: <strong>LINQ</strong>.<br/></p>

<blockquote><strong>Nota</strong>: la útlima iteración de código utilizada en este artículo la podéis encontrar en <a href="https://github.com/rubenfa/CylonDM" title="Enlace a código fuente de CylonDM"> GitHub</a>. Para las pruebas no existe un conjunto de datos, pero <a href="https://skydrive.live.com/download?resid=1F8D7C58B1FC74AE%217616&amp;authkey=%21AJR6UXIe1hp2Yig&amp;ithint=file%2c.json" title="enlace a descarga de datos de ejemplo"> aquí </a>podéis encontrar algunos documentos para que probéis.<br/></blockquote>

<h3>Utilizando clases POCO</h3>

<p><br/> El driver de <strong>MongoDB </strong>para <em>C#</em> soporta la utilización de <strong>LINQ </strong>para realizar todo tipo de consultas. La sintaxis de una consulta LINQ será la siguiente<br/><br/>

<pre>
var collection = database.GetCollection&lt;TDocument&gt;(&quot;collectionname&quot;);
</pre>

La clave del asunto, está en el genérico <em>TDocument</em>. El método <em>GetCollection</em> soporta genéricos, por lo que a la hora de usarlo deberemos pasarle el nombre de una clase. En este caso, las clases que utilizaremos como parámetro se conocen como POCO, algo así como <em>Plain Old Class Object</em>, pero que en español suena muy gracioso. Estas clases POCO, no son más que clases simples que solo contienen propiedades, y no contienen métodos, ni implementación de ningún tipo. ¿Y dónde definimos nuestras clases POCO? Como estamos utilizando el patrón <em>modelo-vista-controlador</em>, lo más normal es definir este tipo de elementos en el modelo, ya que son una representación de nuestro modelo de datos. Así que en la carpeta <em>Models </em>de nuestro proyecto vamos a crear un nuevo archivo al que llamaremos <em>DocumentModels.cs</em>. Este archivo contendrá las siguientes clases:</p>

<pre>
public class CreationInfo
{
  public DateTime creationDate {get;set;}
  public string author {get;set;}
  public string typist {get;set;}
}

public class AccessInfo
{
  public string user {get;set;}
  public string action {get;set;}
  public DateTime accessDate {get;set;}
}

public class VersionInfo
{
  public int mayor {get;set;}
  public int minor {get;set;}
  public string label {get;set;}
  public string path {get;set;}   
} 

public class Document
{
  [BsonElement("id")]
  public ObjectId id { get; set; }
  public string title {get;set;}
  public string subtitle {get;set;}
  [BsonElement("abstract")]
  public string abs {get;set;}
  public string fileFormat {get;set;}
  public CreationInfo creationInfo {get;set;}
  public AccessInfo[] accessHistory {get;set;}
  public VersionInfo[] versions {get;set;}
}
</pre>


<p>Como podéis ver, estamos definiendo tres clases POCO. La clase principal, llamada <em>Document</em>, contiene diversas propiedades. Entre ellas dos arrays que contienen objetos del tipo <em>AccessInfo </em>y <em>VersionInfo</em>. Lo que haremos con estas clases POCO es pasárselas a <strong>MongoDB</strong>, que se encargará de convertir los resultados en objetos <em>Document</em>. Al final con estas clases, lo que estamos es definiendo la estructura de un documento de <strong>MongoDB</strong>, que será lo que se almacene en la base de datos. El <strong>driver de C#</strong> se encargará de todo el proceso de serialización y deserialización, aunque hay que tener en cuenta algunas cosas. <br/><br/> Lo primero a tener en cuenta, es que todos los campos que devuelva una consulta, deberán tener su equivalente en la clase POCO, salvo que indiquemos lo contrario. Es decir, que si en nuestros documentos de la base de datos existe un campo <em>title</em>, deberá exisitir una propiedad <em>title</em>, y con un tipo equivalente, en la clase.  Si la propiedad no existe, o no tiene un tipo equivalente, el driver devolverá una excepción. Si por alguna razón no queremos añadir todos los campos a la clase POCO, porque quizá no exista en todos los documentos, deberemos hacer uso del atributo de clase <em>[BsonIgnoreExtraElements]</em>. <br/><br/> Si el nombre de alguno de los campos de nuestra clase no coincide con el del documento, deberemos utilizar el atributo <em>[BsonElement()]</em>. Por ejemplo en el ejemplo, tenemos definida una propiedad <em>abs </em>ya que <em>abstract </em>es una palabra clave de <strong>C# </strong>que no podemos utilizar como nombre. Como el campo en <strong>MongoDB </strong>se llama abstract, hacemos uso del atributo antes mencionado añadiendo un <em> [BsonElement(&ldquo;abstract&rdquo;)]</em> justo delante de la propiedad indicada.<br/><br/> Lo mismo hemos hecho con el campo id, que además es del tipo <em>ObjectId</em>, tipo especial definido en las librerías de <strong>MongoDB</strong>. <br/><br/> Existen otros muchos atributos dentro del espacio de nombres <em>MongoDB.Bson.Serialization.Attributes</em>. Dependiendo de las operaciones que tengamos que realizar, deberemos utilizar unos u otros.  Podéis consultar la lista entera <a href="http://docs.mongodb.org/ecosystem/tutorial/serialize-documents-with-the-csharp-driver/">aquí</a>. <br/><br/> Por cierto, en los ejemplos estamos pasando directamente los modelos a las vistas. Lo más correcto sería utilizar <em>ViewModels</em>, pero por simplicidad, eso lo dejaremos para más adelante.</p>

<h3>Consultas con LINQ</h3>

<p>Ahora que hemos visto como <strong>MongoDB </strong>serializa y deserializa las clases POCO desde (y hacia) <em>BSON</em>, podemos ver como utilizarlas con <strong>LINQ</strong>. Para ello hemos creado el siguiente método en nuestra clase <em>MongoDataService</em>:</p>

<pre>
public string findDocumentsByTitle(string databaseName,string collectionName,string title)
{

    var db = server.GetDatabase(databaseName);
    var documents = db.GetCollection&lt;Document&gt;(collectionName);
           
    var result = from d in documents.AsQueryable&lt;Document&gt;()
                 where d.title == title
                 select d;

    if (result != null)
      return result.ToJson();
    else
      return &quot;{}&quot;;
}
</pre>

El método recibe tres parámetros de tipo <em>string</em>. Los dos primeros hacen referencia a la base de datos y al nombre de la colección que queremos consultar. El último parámetro contiene el título del documento, que será el campo por el que vamos a filtrar.<br/><br/> A diferencia de los ejemplos del anterior artículo, en este caso al método <em> GetCollection </em>le estamos diciendo que queremos convertir los resultados a objetos <em>&lt;Document&gt;</em>. Una vez hemos hecho esto, ya podemos hacer nuestra consulta <strong>LINQ</strong>, que en este caso utiliza el <em>where </em>para filtrar por el campo <em> title</em>. Para finalizar convertimos los resultados a <em>JSON </em>y devolvemos los datos. Este es el método del controlador que realiza la llamada al método anterior:</p>

<pre>
[HttpPost]
public ActionResult SearchByTitle(string title)
{
    var connection = WebConfigurationManager.ConnectionStrings[&quot;MongoDB&quot;].ToString();
    MongoDataService dataService = new MongoDataService(connection);

    var documents = dataService.findDocumentsByTitle(&quot;CylonDM&quot;, &quot;Documents&quot;, title);

    ViewBag.results = documents;
    ViewBag.typeSearch = &quot;LINQ&quot;;
    return View(&quot;SearchResults&quot;);         
}
</pre>
El driver de C# para <strong>MongoDB</strong>, soporta muchos de los operadores habituales de <strong> LINQ </strong>como son <em>Any</em>, <em>Count</em>, <em>Distinct</em>, <em>First</em>, <em>Last </em>etc. <a href="http://docs.mongodb.org/ecosystem/tutorial/use-linq-queries-with-csharp-driver/" title="enlace a LINQ">Aquí</a> podéis encontrar una lista de ellos, y una explicación de como usarlos.<br/><br/> Pero a pesar de lo bien que funciona, y de lo bonito que ha quedado, tenemos un problema con nuestro método y es que solo nos servirá para buscar por el campo título. Si queremos consultar por otros campos (o combinación de ellos) tendríamos que crear un método para cada caso, lo cual es bastante aburrido e ineficiente. Para solucionar este problema, podemos uilizar la potencia de las <em>expresiónes Lambda</em> y los genéricos.</p>

<h3>Consultas con LINQ y expresiónes Lambda</h3>

<p><br/> Lo que buscamos con este método, es generar un método muy genérico, de manera que lo podamos reutilizar para realizar el mayor número de consultas posibles. Y eso podemos conseguir con las <em>expresiones Lambda</em>. Veamos el ejemplo:</p>

<code>
public string find&amp;lt;T&amp;gt; (string databaseName, string collectionName, Expression&amp;lt;Func&amp;lt;T, bool&amp;gt;&amp;gt; expression) where T: class
{
    var db = server.GetDatabase(databaseName);
    var documents = db.GetCollection&amp;lt;T&amp;gt;(collectionName);
    var result = documents.AsQueryable&amp;lt;T&amp;gt;().Where(expression);
    
    if (result != null)
      return result.ToJson();
    else
      return &amp;quot;{}&amp;quot;;
}
</code>

En este caso uno de los parámetros recibidos por el método, es una<strong> expresión Lambda</strong> que se resolverá de forma dinámica en tiempo de ejecución. Como veis en ningún momento especificamos el tipo que pasamos como parámetro, ya que los tipos son genéricos y se definirán en el momento de ejecutarse. Veamos como utilizaríamos el método creado para buscar por título, de forma similar a como hacíamos antes:</p>

<pre>
[HttpPost]
public ActionResult SearchByTitleLambda(string title)
{
    var connection = WebConfigurationManager.ConnectionStrings[&quot;MongoDB&quot;].ToString();
    MongoDataService dataService = new MongoDataService(connection);

    var documents = dataService.find&lt;Document&gt;( &quot;CylonDM&quot;, &quot;Documents&quot;, d=&gt; d.title == title);

    ViewBag.Results = documents;
    ViewBag.TypeSearch = &quot;LINQ y Lambda&quot;;
    return View(&quot;SearchResults&quot;);
}
</pre>

En este caso utilizamos el método find que hemos definido, pero diciéndole que vamos a buscar objetos <em>&lt;Document&gt;</em>. Lo importante está en el tercer parámetro ya que los dos primeros parámetros del método, de tipo string, son el nombre de la base de datos y la colección a consultar. En el último parámetro, en cambio, estamos pasando una <strong>expresión Lambda</strong> para filtrar por el campo <em>title</em>.<br/><br/> Lo bueno de este método, es que podríamos usarlo desde cualquier otra parte de la aplicación, pasándole un filtro y una clase POCO totalmente distinta. ¿Qué queremos consultar de una colección que se llama People? Ya tenemos el método creado, solo hay que llamarlo pasándole como parámetro una clase POCO del tipo <em>People</em>.</p>

<pre>
var documents = dataService.find&lt;People&gt;( &quot;CylonDM&quot;, &quot;People&quot;, d=&gt; d.name== name &amp;&amp; d.age==33);
</pre>

En el método creado para el ejemplo se usa un parámetro string para pasar el nombre de la colección a consultar, pero podemos adaptar el método para que extraiga el nombre  de forma dinámica través de <em>Reflection</em> y ahorrarnos un parámetro. En este caso, el único requisito sería que las clases poco se tendrían que llamar igual que las colecciones de nuestra base de datos <strong> MongoDB</strong>.<br/></p>

<h3>Pero no es oro todo lo que reluce</h3>

<p>Aunque Linq es una herramienta potente, y podemos usarla junto con MongoDB, hay que tener en cuenta lo que para mi es un problema.</p>

<p><strong>Si utilizamos Linq, las proyecciones de datos se realizan en el cliente</strong>. Es decir, que aunque hagamos un Select de un par de campos, MongoDB se trae del servidor todos los datos y luego hace la proyección. Repito: si queremos hacer un Select de, por ejemplo, el _id, nos estaremos trayendo todos los datos de la base de datos para descartarlos y quedarnos con uno. ¿Feo verdad?</p>

<p>Por tanto si tenemos documentos con muchos campos, o devolvemos muchos resultados, nos estaremos trayendo del servidor un montón de bytes inútiles.</p>

<p>Esto sucede con el driver actual, que a día de hoy es el 1.9.2. Tampoco entiendo muy bien porque no han implementado la opción en Linq, ya que la clase MongoCursor ya es capaz de definir las proyecciones con el método SetFields.</p>

<p>Así que mucho ojo con utilizar Linq.</p>

<h3>Conclusiones</h3>

<p><br/> El <strong>driver de C# de MongoDB </strong>nos proporciona una ventaja que no tienen los drivers de otras plataformas: podemos utilizar <strong>LINQ </strong>para realizar consultas. Si además utilizamos la potencia de las <strong>expresiones Lambda</strong>, seremos capaces de aislar completamente nuestra clase de acceso a datos. Así, si queremos hacer cambios en la implementación de la misma, nos será posible evitar realizar cambios en los métodos de los controladores. En próximas entregas, veremos como aislar completamente nuestra clase de acceso a datos, creando unos cuántos métodos genéricos de consulta.</p>



<p></p>

<hr><hr><p><em>¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me gusta en Facebook o de publicarlo en Twitter. ¡ Gracias !<br/></em></p>

<p><em>Recuerda que puedes ver el índice del tutorial y acceder a todos los artículos de la serie <a href="http://www.charlascylon.com/p/tutorial-mongodb.html">desde aquí.</a></em></p>

<p>¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog? Suscríbete  <a href="feed://www.charlascylon.com/feed.xml">por RSS</a>.<em><a href="http://www.charlascylon.com/p/tutorial-mongodb.html"><br/></a></em></p>
