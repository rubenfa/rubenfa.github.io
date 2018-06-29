---
layout: post
title: Tutorial MongoDB. Introducción a Aggregation Framework
redirect_from:
  - /post/63631312440/tutorial-mongodb-introduccion-aggregation-framework.html
  - /post/63631312440/
---

Hasta ahora, en nuestro **tutorial de MongoDB**, hemos explicado como
realizar consultas típicas a la base de datos. Hemos visto como podemos
hacer consultas similares a las *SELECT*, *DELETE* y *UPDATE* de
cualquier base de datos relacional. Pero nos queda un punto importante
por tratar: **las consultas de agregación**. 

En el día a día de una base de datos, es habitual tener que realizar
consultas para agrupar datos y calcular valores a partir de ellos. Por
ejemplo calcular el importe total de los pedidos realizados en un mes,
la cantidad de alertas que se producen en nuestro sistema de registro de
eventos cada día de la semana o el importe del pedido medio que se hace
a nuestra tienda online.

En las bases de datos relacionales estas consultas las hacemos con
operadores como GROUP BY, SUM, COUNT etc. En **MongoDB** tenemos dos
opciones: *MapReduce*y *Aggregation Framework*.

*MapReduce* es un modelo de programación muy potente, utilizado
inicialmente por Google para el cálculo paralelo de grandes cantidades
de datos. Con el auge del *Big Data* este modelo se ha hecho bastante
popular y se utiliza en numerosos frameworks y tecnologías actuales como
Hadoop,  MapReduce-MPI Library, **MongoDB** y muchas otras. Veremos como
utilizar *MapReduce* en **MongoDB** n futuros artículos.

La otra opción,*Aggregation Framework*, apareció con la versión 2.2 de
**MongoDB** para poder realizar cálculos de agregación de forma parecida
a los que hacemos en las bases de datos relacionales. Aunque
*MapReduce* es más potente, también es más difícil de utilizar así que
para realizar cálculos sencillos es más conveniente utilizar *Aggregation
Framework*.

Esta entrada va a ser principalmente **teórica**, así que preparaos
para leer. Los ejemplos los dejaremos para las siguientes entradas.

### Partes de una consulta de agregación

Una consulta de agregación con *Aggregation Framework* tiene el
siguiente formato

```javascript
db.people.aggregate( [<pipeline>] )
```

¿Qué significa *pipeline*? Los *pipelines* o tuberías, son similares a
las que se utilizan en la línea de comandos de los sistemas Unix,
pasando los resultados de un comando a otro para producir resultados de
forma conjunta. En el caso de **MongoDB** se passan los resultados de un
*pipeline* que usa un operador de *Aggregation Framework* al siguiente
*pipeline*para que los procese.

Con **MongoDB** podemos utilizar los siguientes operadores en los
pipelines.

-   *$project* : se utiliza para modificar el conjunto de datos de entrada, añadiendo, eliminando o recalculando campos para que la salida sea diferente.
-   *$match*: filtra la entrada para reducir el número de documentos, dejando solo los que cumplan las condiciones establecidas.
-   *$limit*: restringe el número de resultados al número indicado.
-   *$skip*: ignora un número determinado de registros, devolviendo los siguientes.
-   *$unwind*: convierte un array  para devolverlo separado en documentos.
-   *$group*: agrupa documentos según una determinada condición.
-   $sort: ordena un conjunto de documentos según el campo especificado.
-   $geoNear: utilizado con datos geoespaciales, devuelve los documentos ordenados por proximidad según un punto geoespacial.

Para realizar cálculos sobre los datos producidos por los *pipelines*,
utilizamos las *expresiones*. Las *expresiones* son funciones que
realizan una determinada operación sobre un grupo de documentos, un
array o un campo en concreto. Algunos ejemplos de *expresiones* son
*$max* que devuelve el valor máximo de un campo en un grupo, *$min* que
devuevle el mínimo, *$divide* para dividr dos números o *$substr* que
coge un string y devuelve solo una parte del mismo.

Veremos la mayoría de operadores de expresión y cómo utilizarlos en
próximas entradas.

Ahora que sabemos, al menos por encima, cómo funciona *Aggregation
Framework*, vamos a ver como se traduciría la siguiente consulta SQL.

```sql
SELECT id_client, SUM(total_pedido) AS total FROM pedidos GROUP BY id_cliente
```

La consulta es bastante sencilla. Cogemos todos los pedidos agrupados
por cliente y sumamos el valor del campo total_pedido, para sacar la
cantidad total que cada cliente ha gastado en nuestra tienda. Y aquí la
versión **MongoDB**

```javascript
db.pedidos.aggregate( [
    { 
        $group: { 
            _id: "$id_cliente",
            total: { 
                $sum: "$total_pedido" 
                } 
             } 
     }])
```

En el ejemplo solo utilizamos un *pipeline* con *$group* y una *expresión
 $sum*. No os preocupéis si no acabáis de ver clara la sintaxis, porque
lo veremos con más calma en siguientes artículos. Lo importante es
entender el concepto de *pipelines*y *expresiones*.

### Optimización

A la hora de realizar consultas de agregación, hay que tener un par de
cosas en cuenta para que estén optimizadas. Lo primero es que el orden
de los *pipelines* es importante. Aunque en la versión 2.4 de
**MongoDB** se ha incluido un paso previo que ordena los *pipelines* de
manera óptima, no viene mal en pensar si la consulta que estamos
ejecutando está optimizada. Por ejemplo, si solo necesitamos un
subconjunto de datos para realizar la agregación, lo mejor es hacer esta
operación lo antes posible para reducir el número de documentos a
procesar. Es decir que si tenemos un millón de clientes, pero solo
queremos realizar cálculos con los que tienen un nombre que empieza por
“A”, lo mejor es realizar el filtro al principio. Así en lugar de
procesar un millón de documentos, procesaremos solo los que empiecen por
A.

Además hay que tener en cuenta la manera en la que *Aggregation
Framework* utiliza los índices. No todos los operadores pueden hacer uso
de los índices de **MongoDB**. Por ejemplo *$match*, *$sort*,
*$limit* y *$skip* pueden utilizar índices siempre que aparezcan al
principio de los *pipelines* o cuando se colocan antes de *$project*,
*$group* o *$unwind*. El uso de índices puede hacer que nuestra
consulta se ejecute rápidamente o que se eternice, así que hay que
tenerlo en cuenta.

### Datos pre calculados

Imagina que tenemos un sistema que controla el acceso de los usuarios al
sistema. Cuando un usuario inicia sesión se guarda el siguiente
documento en la colección sessions.

```javascript
{
    _id: ObjectId(“51f8d6233d99d9c39c1b2229”),
    user:“ _rubenfa”,
    userGroup:“admins”,
    sessionStart: ISODate(“2013-07-04T10:40:57Z”)
}
```

Si el sistema es grande y tiene muchos inicios de sesión, la coleción
tendrá un gran número de documentos. A la hora de explotar los datos y
realizar informes,  las consultas realizadas con *Aggregation Framework*
serán lentas. Por ejemplo imaginemos que queremos saber el número de
accesos de usuario por hora. Eso implicaría agrupar por el campo
sessionStart, que tiene también minutos y segundos, por lo que puede ser
costoso al tener que realizar cálculos. Para solucionar esto podemos
utilizar una colección con datos pre calculados que modificaremos cada
vez que un usuario inicia sesión. La colección sessionStats tendrá
documentos del tipo:

```javascript
{
    “_id”: ObjectId(“51f8d6233d99d9c39c1b2229”),
    “year”:2013,
    “month”: 7,
    “day”: 31,
    sessionsHour:
        {
            “00”: 13211,
            “01”: 15721,
            “02”: 14365,
                …
            “21”: 10894123,
            “22”: 10700128,
            “23”: 10000113
        }
}
```
Así, si un usuario inicia sesión a las 10 horas del día 31 del mes 7, se
incrementará el campo “10” aumentando el número de inicios de sesión.
Así los datos los tendremos precalculados con cada inserción, y puesto
que es una sentencia bastante directa el coste de la inserción es
despreciable, ahorrandonos mucho tiempo en cálculos.

### Conclusión

En esta entrada hemos visto, de forma general, como funciona
*Aggregation Framework* y como podemos optimizar las consultas para
obtener el mejor rendimiento. Este framework nos proporciona una manera
sencilla y rápida de explotar datos para realizar cálculos, agrupación
de resultados y otras interesantes operaciones.

En las siguientes entradas nos centraremos en los distintos operadores
disponibles en **MongoDB** explicando su funcionamiento con ejemplos.

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*

