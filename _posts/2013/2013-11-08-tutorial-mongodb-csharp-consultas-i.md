---
layout: post
title: Tutorial MongoDB y C#. Consultas I
redirect_from:
  - /post/66358243519/tutorial-mongodb-csharp-consultas-i.html
  - /post/66358243519/
---

Seguimos adelante con nuestro **tutorial de MongoDB**, en esta ocasión
contando un poco más sobre el accceso a datos a través del **driver de
C#**. 

 Revisando[la primera
entrega](https://www.charlascylon.com/post/64851332600/tutorial-mongodb-y-c-conexion-a-la-base-de-datos "Enlace a Tutorial MongoDB. Conexión a base de datos con C#")
de esta parte del tutorial, he decidido cambiar un poco el enfoque. En
aquella entrega, comencé los ejemplos con una aplicación**Web API**, que
para la parte de conexión a **MongoDB**era más que suficiente. Pero al
llevar los  ejemplos un poco más lejos, me he dado cuenta de que iban a
ser mucho más aclaratorios con una aplicación web normal. Así que he
empezado un proyecto nuevo con **MVC**.

 El proyecto se llama CylonDM y podéis [descargar el código fuente
actual desde
GitHub](https://github.com/rubenfa/CylonDM "Enlace a código fuente de CylonDM").
La idea es hacer una aplicación web que haga las veces de gestor
documental, y poco a poco, ir aumentando sun funcionalidad con ejemplos.
Y también, por qué no, mejorando el código para hacerlo más robusto y
testeable. Eso sí, en esta entrega vamos a ver solo el código que
realiza las consultas y a explicar la implementación. Si queréis probar
los ejemplos, basta con que ejecutéis el proyecto y lo arranquéis. La
pantalla principal permite realizar los tipos de consultas que vamos a
explicar aquí.

 Recuerda: para esta aplicación utilizamos una capa que se encargará de
abstraer toda la lógica de acceso a datos. La hemos llamado
**MongoDataService**y es la encargada de realizar la conexión a la base
de datos, realizar las consultas e insertar los datos. Es en esta clase
dónde realmente podremos ver como funciona el **driver de C#** para
explotar una base de datos **MongoDB**.

### Realizando consultas directamente con JSON


 Esta es la manera que ya utilizamos en la anterior entrega del
tutorial. Se trata de pasar un string en formato *JSON*con la consulta
que queremos realizar. El código del método es el siguiente

```csharp
  public string find(string databaseName, string collectionName, string query)
    {
        var db = server.GetDatabase(databaseName);
        var collection = db.GetCollection(collectionName);

        BsonDocument bsonDoc =
            MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(query);

        var result = collection.Find(new QueryDocument(bsonDoc));

        if (result != null)
        {
            return result.ToJson();
        }
        else
        {
            return "{}";
        }
    }
```

Lo primero que hacemos es obtener un objeto *MongoDatabase*, que
utilizamos para conectar una colección en concreto a través de un objeto
*MongoCollection*. Esto es algo, que de momento, haremos en todos los
métodos que requieran conectar a la base de datos **MongoDB**.

Una vez tenemos el objeto *MongoCollection* instanciado, tendremos que
generar la consulta que queremos hacer a partir del *string*que entra
como parámetro. Para ello convertimos el string *JSON* en un objeto
*BsonDocument* que es la manera que tenemos de representar un documento
de **MongoDB**. 

Después, utilizamos dicho objeto *BsonDocument* para ejecutar el comando
*Find*sobre nuestra colección. *Find*tiene que recibir un objeto del
tipo *QueryDocument*como parámetro, así que utilizamos nuestro
*BsonDocument*para crear uno.  

Si todo va bien, recibiremos desde la base de datos,  un objeto
*MongoCursor* con los resultados. Este resultado lo podemos exportar
convirtiéndolo a *JSON*y devolverlo al controlador que realizó la
llamada.

### Realizando consultas con la clase Query


Con el **driver de C# de MongoDB** tenemos disponible una clase
builder utilizada para generar las consultas. Veamos el código del
método que utiliza esta clase:

```csharp
 public string findById(string databaseName, string collectionName, string id)
         {
             var db = server.GetDatabase(databaseName);
             var collection = db.GetCollection(collectionName);

             var query = Query.EQ(“_id”, BsonValue.Create(ObjectId.Parse(id)));

             var result = collection.FindOne(query);

             if (result != null)
                 return result.ToJson();
             else
                 return  “{}”;
                 
        }
```

La parte de la conexión a la base de datos se realiza de la misma
manera que en el ejemplo anterior. La diferencia en este caso es que con
el builder *Query*generamos un objeto *IMongoQuery*, a partir de una
clave (key) de campo y un valor (value) para dicha clave. En este
ejemplo, como vamos a buscar directamente por id, solo recibimos el
valor del campo.  El objeto IMongoQuery generado se lo pasamos
directamente al comando *FindOne*, que lo utilizará para realizar la
consulta. Al igual que antes, el resultado lo  convertimos a formato
*JSON* y se lo devolvemos al controlador.

Es importante destacar el fragemento de código *ObjectId.Parse(id)*.
Nuestro método está recibiendo como parametro un string, pero antes hay
que convertirlo al tipo *ObjectId*. Si no lo hacemos, la consulta no
devolverá resultados.

En el ejemplo hemos usado *EQ*, pero la clase constructora *Query*tiene
otros métodos estáticos, que podemos utilizar. Algunos de ellos son *GT,
LT, GTE* etc. Además en este ejemplo estamos utilizando el objeto para
buscar solo por un campo  y un valor. El siguiente ejemplo muestra comom
realizar una consulta a partir de un diccionario de claves campo-valor.

### Realizando consultas por múltiples campos con la clase Query

El código del método es bastante similar al anterior:

```csharp
public string find(string databaseName, string collectionName, Dictionary<string, object> searchedElements)
{
  var db = server.GetDatabase(databaseName);
  var collection = db.GetCollection(collectionName);
 
  List<IMongoQuery> ConcatenatedQueries = new List<IMongoQuery>();

  foreach (var item in searchedElements)
  {
    ConcatenatedQueries.Add(Query.EQ(item.Key, BsonValue.Create(item.Value)));
  }
             
  var queries = Query.And(ConcatenatedQueries);
  var result = collection.Find(queries);

  if (result != null)
    return result.ToJson();
  else
    return “{}”;
}
```

Una vez más, la conexión se realiza de la misma manera. El método, en
este caso, recibe un diccionario del tipo *<string,object>* llamado
*searchedElements*, con los campos y valores que se desean buscar. 

Lo primero que hacemos es convertir el objeto *searchedElements* a otro
del tipo *List<IMongoQuery>*. No es algo que podamos hacer
directamente, así que creamos un objeto nuevo de ese tipo, y con un
bucle vamos pasando los valores del diccionario de campos a la lista de
consultas. Todos los objetos *IMongoQuery* que va a contener la lista, se
crean con la clase constructura *Query.EQ*. El valor de la consulta es
objeto, por lo que utilizamos  *BsonValue.Create(item.Value)* para crear
un valor del tipo *Bson*que **MongoDB** pueda entender.

Una vez tenemos todas las propiedades clave-valor en una sola query,
utilizamos el objeto *Query.And* para crear otro objeto del tipo
*IMongoQuery*, pero que contenga todas las condiciones. Hemos usado
*Query.And*, pero podríamos usar *Query.Or* si quiesiéramos.

El objeto queries del tipo *IMongoQuery*se lo pasamos directamente al
comando *Find*, que se encargará de utilizarlo para consultar a
**MongoDB**para devolver los resultados en formato *JSON*.

### Conclusiones


 Con el **driver de MongoDB para C#**, tenemos diversas maneras para
realizar consultas. Podemos utilizar una consulta en formato *JSON*o
podemos utilizar la clase *Query*para componer consultas de diverso
tipo.

 No obstante hay maneras más sencillas de realizar consultas, como por
ejemplo utilizar **LINQ**. Pero eso ya lo veremos en la siguiente
entrega.


* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*

