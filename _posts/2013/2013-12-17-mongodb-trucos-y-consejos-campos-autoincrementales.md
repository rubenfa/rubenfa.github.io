---
layout: post
title:  MongoDB. Trucos y consejos. Creación y uso de campos autoincrementales
redirect_from:
  - /post/70281280317/mongodb-trucos-y-consejos-campos-autoincrementales.html
---

En ocasiones es necesario que en nuestra base de datos creemos *campos
autoincrementales*. Estos campos, que son campos numéricos, se van
incrementando (normalmente de uno en uno) cada vez que se inserta un
nuevo registro. En *SQL Server* podemos hacer esto con los campos
identidad o usando secuencias (a partir de SQL Server 2012), mientras
que en *Oracle*, esto se gestiona también usando secuencias.

 En **MongoDB**no existe esta característica, pero podemos valernos de
algunas técnicas para obtener la misma funcionalidad.  Veamos como
hacerlo.

### Creando una colección de secuencias

Lo primero que haremos, será crear una colección de secuencias. Las
secuencias no serán más que sencillos documentos con un campo *_id* de
tipo texto y con un campo con el valor de la secuencia.

 Vamos a suponer que estamos creando un sistema de blogging. Las
entradas del blog se irán dando de alta en una colección llamada
*posts*, que deberá tener un campo *_id* que se incremente de forma
automática con cada inserción de una nueva entrada. Por tanto lo primero
que tendremos que hacer, será inicializar nuestra secuencia en la
colección de secuencias, cosa que podremos hacer con un comando parecido
al siguietne:

```javascript
db.sequences.insert(
    {
       _id: “posts”,
       seq: 0
    }
 );
```

Y listo, ya tenemos nuestra colección de secuencias creada y con la
secuencia posts inicializada.

### Creando una función que gestione las secuencias

Ahora que tenemos creada nuestra colección de secuencias en nuestro
**MongoDB**, necesitamos crear una función que se encargue de
incrementar el valor de la secuencia y devolverlo. Es posible que
pensemos que lo más lógico  es hacer una consulta sobre la colección de
secuencias, incrementar el valor actual y actualizarlo en la base de
datos. El problema de esa solución es que solo la actualización del
documento será una **operación atómica**, por lo que podemos
encontrarnos con problemas de concurrencia si la operación se realiza
desde dos o más conexiones distintas al mismo tiempo. 

 Por suerte en **MongoDB**podemos hacer uso del comando
**findAndModify**. Este comando es capaz de actualizar un documento de
forma atómica y devolvernos después el resultado. De esta manera,
garantizamos que siempre se nos devuelva el siguiente valor de la
secuencia, y como una actualización siempre es una operación atómica, no
tendremos problemas de concurrencia. 

 La función que crearíamos para controlar las secuencias sería similar a
la siguiente:

```javascript
function nextVal(name) {
    var ret = db.sequences.findAndModify(
           {
             query: { _id: name },
             update: { $inc: { seq: 1 } },
             new: true
           }
    );

    return ret.seq;
 }
```

Como veis estoy usando *JavaScript*, ya que las operaciones las voy a
hacer directamente desde la consola de **MongoDB**, pero podríamos hacer
lo mismo desde*C#*. 

La función *nextVal* recibe un parámetro con el nombre de la secuencia,
que utilizaremos para pasársela al comando **findAndModify** de
**MongoDB**para que encuentre el documento de la colección sequences que
hay que modificar. 

 Además de la consulta con el nombre de la secuencia,
**findAndModify** realiza una actualización sobre el campo *seq*,
haciendo un *$inc* para incrementar el valor actual. 

El último parámetro que recibe **findAndModify** es el parámetro *new*.
Cuando este parámetro es *true*, devuelve el valor del documento
modificado, es decir después de aplicar el *update*. Esto es importante,
ya que por defecto el valor es false y devuelve el documento antes de la
actualización.

 Una vez tenemos nuestra función para controlar las secuencias, veamos
como podemos utilizarla.

### Utilizando la secuencia

Como comentaba antes, estamos implementando un sistema de blogging.
Ahora, cuando insertemos una nueva entrada, podemos hacer uso de la
secuencia que hemos creado a través de la función *nextVal*:

```javascript
db.posts.insert(
    {
      _id: nextVal(“posts”),
      title: “Tutorial de MongoDB. Operaciones de consulta” ,
      content: “ En nuestra anterior entrada del tutorial de  MongoDB…”,
      status: “published”
    }
 );

 db.posts.insert(
    {
      _id: nextVal(“posts”),
      name: “Tutorial de MongoDB y C#. Conexión a la base de datos”,
      content: “Cuando queremos usar MongoDB desde C#, tenemos que crear una conexión …”,
      status: “draft”
    }
 );
```

Como véis una vez tenemos creada la función, utilizar la secuencia es
muy sencillo.

### Conclusiones

**MongoDB**no tiene todas las opciones que si poseen los sistemas de
gestión documental relacionales, pero aprovechándonos de su
versatilidad, podemos llevar a cabo muchas de ellas. Si los valores que
genera **MongoDB**de forma automática para un campo *_id*, no son
suficientes, y necesitamos un campo autoincremental, siempre tendremos
esta interesante alternativa.

* * * * *

* * * * *

*¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me
gusta en Facebook o de publicarlo en Twitter. ¡ Gracias !
*

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde
aquí.](http://www.charlascylon.com/p/tutorial-mongodb.html)*

¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog?
Suscríbete [por correo
electrónico](http://feedpress.it/e/mailverify?feed_id=charlascylon&loc=es)
o [por RSS](feed://www.charlascylon.com/rss).*[
](http://www.charlascylon.com/p/tutorial-mongodb.html)*

