---
layout: post
title: Usando ELMAH con MongoDB
redirect_from:
  - /post/81664774505/usando-elmah-con-mongodb.html
  - /post/81664774505/
---

<p>ELMAH (Error Logging Modules and Handlers) es una librería para almacenar logs de las excepciones que se producen en nuestra aplicación. Esta librería podemos utilizarla en aplicaciones ASP.NET y tiene muchas opciones interesantes. Por ejemplo podemos  conectarnos de forma remota para ver los errores o utilizarla con aplicaciones ya existentes sin tener que recompilar. Podéis ver todas las características de ELMAH en su <a href="http://code.google.com/p/elmah/">página de Google Code</a>.</p>

<p>Si queréis ver una completa explicación de como usarlo con SQL Server, gestionar los errores, o incluso enviarlos por correo,  no os perdáis <a href="http://panicoenlaxbox.blogspot.com.es/2013/08/elmah-en-aspnet-mvc-paso-paso.html">la entrada en el blog</a> de <a href="https://twitter.com/panicoenlaxbox">@panicoenlaxbox</a>.</p>

<p>Además de SQL Server, podemos configurar ELMAH con otros proveedores de bases de datos. Podemos usar PostgreSQL, Oracle, MySQL y como no <strong>MongoDB</strong>.</p>

<p>Veamos cómo.</p>

<h3>Componentes necesarios</h3>

<ul><li>Obviamente, lo primero que necesitamos es un servidor <strong>MongoDB</strong> arrancado y funcionando. Recordad que en <a href="https://www.charlascylon.com/mongodb">mi Tutorial de MongoDB</a>, explico como  instalar y usar <strong>MongoDB</strong>.</li>
<li>También nos hace falta un proyecto ASP.NET. Por ejemplo, yo he usado para este artículo una aplicación MVC 5.</li>
<li>Y para acabar, nos hacen falta los paquetes ELMAH, el driver de <strong>MongoDB</strong> para C#, y <em>ELMAH on MongoDB</em>. Instalarlos es muy sencillo, ya que desde NuGet bastará con hacer un <code>Install-Package elmah.mongodb</code> para que se instalen todas las dependencias.</li>
</ul><p>Y ya está. Una vez tengamos todo preparado, tan solo tenemos que configurar ELMAH, para que guarde los datos en nuestro  servidor <strong>MongoDB</strong></p>

<h3>Configurando ELMAH</h3>

<p>De alguna manera, le tenemos que decir a ELMAH, donde debe guardar los datos de los errores. Es tan fácil como ir al <em>Web.config</em> de nuestra aplicación, y buscar la siguiente entrada:</p>

<pre><code>&lt;connectionstrings&gt;&lt;add name="elmah-mongodb" connectionstring="server=localhost;database=elmah;"&gt;&lt;/add&gt;&lt;/connectionstrings&gt;
</code></pre>

<p>El problema es que la cadena de conexión que se ha añadido al Web.config al añadir los paquetes desde NuGet, no tiene mucho que ver con una cadena de conexión a <strong>MongoDB</strong>. En la <a href="http://docs.mongodb.org/manual/reference/connection-string/#uri.ssl">documentación</a> podéis ver el formato que debe tener. Así que en base a eso, cambiamos nuestra sección <code>connectionStrings</code>.</p>

<pre><code>&lt;connectionstrings&gt;&lt;add name="elmah-mongodb" connectionstring="mongodb://localhost:27666/elmah"&gt;&lt;/add&gt;&lt;/connectionstrings&gt;
</code></pre>

<p>La cadena de conexión empieza por <code>mongodb</code>, seguida por el servidor (en este caso <em>localhost</em>), el puerto, y para finalizar, la base de datos. Si la base de datos <code>elmah</code> no existe, se creará automáticamente.</p>

<p>Para almacenar los errores detectados en la página, ELMAH creará también una colección llamada <em>Elmah</em>. Esta colección será de tipo <a href="http://docs.mongodb.org/manual/core/capped-collections/">Capped</a>. Estas colecciones son muy útiles cuando solo necesitamos almacenar los datos más recientes, por lo que son ideales para guardar datos de logs.</p>

<p>Las colecciones <em>capped</em>, tienen un tamaño máximo. Si queremos también pueden tener un número máximo de documentos. Cuándo se alcance uno de estos límites, se borrarán los documentos más antiguos. Así se consigue espacio para añadir los nuevos.</p>

<p>Como ELMAH crea automáticamente la colección, no podemos establecer un tamaño máximo personalizado (o número máximo de documentos) de forma directa. Pero esto es sencillo de corregir. Bastará con borrar la colección y volverla a crear desde la consola de <strong>MongoDB</strong> con un comando como el siguiente:</p>

<pre><code>db.createCollection("Elmah", {capped:true, size:10485760, max:300});
</code></pre>

<p>Como podéis ver, estamos creando una nueva colección, con un tamaño máximo <em>size</em> en bytes, y un número <em>max</em> de documentos. En este caso 300 documentos.</p>

<h3>Simulando un error para probar ELMAH</h3>

<p>Para probar que todo funciona, vamos a simular un error. Con una aplicación de MVC 5 sin demasiada funcionalidad, es algo tan sencillo como introducir una URL que no existe. Eso generará un  error <em>404</em> que será capturado por ELMAH.</p>

<p>El error quedará registrado en la colección <em>Elmah</em>. Si hacemos un <em>find</em> podremos ver los errores que se han producido. Por ejemplo:</p>

<pre><code>{
    "_id" : ObjectId("533d2766c8596f27b0504823"),
    "ApplicationName" : "/LM/W3SVC/16/ROOT",
    "host" : "CYLON-MACHINE",
    "type" : "System.Web.HttpException",
    "source" : "System.Web.Mvc",
    "message" : "No se encuentra el controlador de la ruta de acceso '/test' o no implementa IController.",
    "detail" : "System.Web.HttpException (0x80004005): No se encuentra el controlador de la ruta de acceso '/test' o no implementa IController.\r\n   en System.Web.Mvc.DefaultControllerFactory.GetControllerInstance(RequestContext requestContext, Type controllerType)\r\n   en System.Web.Mvc.DefaultControllerFactory.CreateController(RequestContext requestContext, String controllerName)\r\n   en System.Web.Mvc.MvcHandler.ProcessRequestInit(HttpContextBase httpContext, IController&amp; controller, IControllerFactory&amp; factory)\r\n   en System.Web.Mvc.MvcHandler.BeginProcessRequest(HttpContextBase httpContext, AsyncCallback callback, Object state)\r\n   en System.Web.Mvc.MvcHandler.BeginProcessRequest(HttpContext httpContext, AsyncCallback callback, Object state)\r\n   en System.Web.Mvc.MvcHandler.System.Web.IHttpAsyncHandler.BeginProcessRequest(HttpContext context, AsyncCallback cb, Object extraData)\r\n   en System.Web.HttpApplication.CallHandlerExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute()\r\n   en System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean&amp; completedSynchronously)",
    "user" : "",
    "time" : ISODate("2014-04-03T09:18:28.551Z"),
    "statusCode" : 404,
    "webHostHtmlMessage" : "",
    "serverVariables" : [ 
        [ 
            "ALL_HTTP", 
            "HTTP_CONNECTION:keep-alive\r\nHTTP_ACCEPT:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nHTTP_ACCEPT_ENCODING:gzip,deflate,sdch\r\nHTTP_ACCEPT_LANGUAGE:es-ES,es;q=0.8,en;q=0.6\r\nHTTP_HOST:localhost:63972\r\nHTTP_USER_AGENT:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36\r\n"
        ], 
        [ 
            "ALL_RAW", 
            "Connection: keep-alive\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\nAccept-Encoding: gzip,deflate,sdch\r\nAccept-Language: es-ES,es;q=0.8,en;q=0.6\r\nHost: localhost:63972\r\nUser-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36\r\n"
        ], 
        [ 
            "APPL_MD_PATH", 
            "/LM/W3SVC/16/ROOT"
        ],
        [ 
            "HTTP_CONNECTION", 
            "keep-alive"
        ], 
        [ 
            "HTTP_ACCEPT", 
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
        ], 
        [ 
            "HTTP_ACCEPT_ENCODING", 
            "gzip,deflate,sdch"
        ], 
        [ 
            "HTTP_ACCEPT_LANGUAGE", 
            "es-ES,es;q=0.8,en;q=0.6"
        ], 
        [ 
            "HTTP_HOST", 
            "localhost:63972"
        ], 
        [ 
            "HTTP_USER_AGENT", 
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36"
        ]
    ],
    "queryString" : null,
    "form" : null,
    "cookies" : null
}
</code></pre>

<p>El JSON devuelto tiene más datos en el campo array <em>serverVariables</em>, pero lo he reducido un poco para que sea más legible.</p>

<h3>Conclusiones</h3>

<p>ELMAH es una herramienta muy potente para controlar los errores de nuestras aplicaciones ASP.NET. Pero además con <strong>MongoDB</strong> nos podemos aprovechar de la utilidad de las colecciones <em>capped</em>, que encajan perfectamente en este tipo de herramientas.</p>

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*