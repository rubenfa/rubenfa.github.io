---
layout: post
title: Tutorial MongoDB. Operadores de expresión en Aggregation Framework II
redirect_from:
  - /post/66079577017/tutorial-mongodb-operadores-expresion-ii.html
---

En esta nueva entrega de nuestro tutorial de **MongoDB**, vamos a
continuar repasando los operadores de expresión que podemos utilizar con
los pipelines de **Aggregation Framework**. La semana pasada ya
mencionamos que podíamos agrupar estos operadores por su funcionalidad,
y repasamos con algunos ejemplos, el funcionamiento de los operadores de
agrupación y de los operadores aritméticos. Y ahora nos toca descubrir
como funcionan los operadores de comparación.

### Operadores de comparación

Este tipo de operadores de expresión se utilizan para comparar valores
y devolver un resultado. Los operadores disponibles son los siguientes:

-   $cmp: compara dos valores y devuelve un número entero como  resultado. Devuelve -1 si el primer valor es menor que el segundo, 0 si son iguales y 1 si el primer valor es mayor que el segundo.
-   $eq: compara dos valores y devuelve true si son equivalentes.
-   $gt: compara dos valores y devuelve true si el primero es más grande que el segundo.
-   $gte: compara dos valores y devuelve true si el primero es igual o más grande que el segundo.
-   $lt: compara dos valores y devuelve true si el primero es menor que el segundo.
-   $lte: compara dos valores y devuelve true si el primero es igual o menor que el segundo.
-   $ne: compara dos valores y devuelve true si los valores no son equivalentes.

Los operadores *$gt,$gte, $lt, $lte, $ne* se utilizan de la misma
manera que en las consultas find normales. Veamos un par de ejemplos:

```javascript
db.people.aggregate(
    {
        $match:
        {
            age: { $gt: 20 }
        }
    },
    { $project: { name: 1, age: 1 } }
    );
```


Que nos devolverá todas las personas cuya edad sea mayor que 20.

```javascript
db.people.aggregate(
    {
        $match:
        {
            age: { $lte: 30 }
        }
    },
    { $project: { name: 1, age: 1 } }
    );
```

En este caso esta consulta en **MongoDB** devuelve todas las personas
cuya edad sea menor o igual que 30. En ambos casos los pipelines
*$project* los he añadido para que los resultados sean más fáciles de
analizar. Las consultas funcionan perfectamente aunque no lo utilicemos.


Estos operadores suelen ser más útiles con el pipeline *$match*, pero
podemos usarlos en otros pipelines como *$project*. Lo único que
tendremos que tener en cuenta es que la sintaxis será un poco diferente

```javascript
db.people.aggregate(
 {$project:
     {
        name:1,
        age:1,       
        ageGreaterThan30:{$lte:['$age',30]}
     }    
 });
 ```   

En el caso de pipelines distintos de *$match*, tendremos que
especificar el operador junto con un array con los dos valores a
comparar. En el ejemplo, estamos comparando que la edad sea inferior a
30 y creando un nuevo campo en la proyección para mostrar el resultado,
que será siempre true o false. El resultado será parecido al siguiente:

```json
{
    “_id”: ObjectId(“5259c377dcdf4b98c24ca723”),
    “age”: 31,
    “name”: “JulieAguirre”,
    “ageGreaterThan30”: false
},
{
    “_id”: ObjectId(“5259c377dcdf4b98c24ca72c”),
    “age”: 21,
    “name”: “YoungFrench”,
    “ageGreaterThan30”: true
}
```


Como veis hemos dejado de lado los operadores *$cmp y $eq*, porque
estos dos operadores tienen un comportamiento diferente. Si os habéis
fijado, en todos los ejemplos que hemos realizado hemos utilizado
valores fijos: *$gt:20, $lte:30* etc. Esto es porque no se pueden
realizar comparaciones entre distintos campos con los operadores
anteriores. Por ejemplo esto no va a funcionar:

```javascript
db.people.aggregate(
 {
     $match:
     {
         latitude:{$gte:“$longitude”}
     }    
 },
 {$project: {name:1,age:1}}
 );
```

Bueno, en realidad si funciona, pero no como esperamos. Si nuestra
intención es intentar comparar el campo latitude con el campo longitude
y ver cuál es mayor, lo estamos haciendo de forma equivocada. En este
caso lo que, en realidad, estamos haciendo es comparar latitude con el
string “$longitude”. Y eso es algo que está bastante alejado de nuestra
intención. Para casos como este, tendremos que utilizar *$cmp* o
*$eq*, pero sin utilizarlos desde *$match* ya que consultas como esta
no tienen mucho sentido:


```javascript
db.people.aggregate(
 {$match:
     {             
        $eq:[“$latitude”,“$longitude”]
     }    
 }
 );
```

En el caso de que latitude y longitude fuesen iguales, *$match* no
devolvería nada, porque no estamos comparando por ningún campo. En
cambio esta otra consulta, si que funcionará correctamente:

```javascript
db.people.aggregate(
 {$project:
     {           
        name:1,
        age:1,       
        twentynine:{$eq:[“$age”,29]}
     }    
 },
 {$match:
     {        
         twentynine:true
     }
 } 
 );
 ```   

Con el pipeline *$project* hemos creado una nueva proyección con los
datos que nos interesan. El campo twentynine es generado al vuelo, con
el resultado de comparar age con el número 29. Si *age*es 29, twentynine
será true, mientras que será false en cualquier otro caso. Una vez hecha
la proyección, utilizamos el pipeline *$match* para quedarnos solo con
aquellos documentos cuyo campo twentynine es true. El resultado sería
similar al siguiente:

```json
{
    “_id”: ObjectId(“5259c377dcdf4b98c24ca760”),
    “age”: 29,
    “name”: “FitzpatrickBarnes”,
    “TwentyNine”: true
},
{
    “_id”: ObjectId(“5259c377dcdf4b98c24ca765”),
    “age”: 29,
    “name”: “GutierrezHerrera”,
    “TwentyNine”: true
}
```

Y lo bueno es que, tanto *$eq* como *$cmp*, funcionan perfectamente en
la consola de **MongoDB**con dos campos del documento sin tener que
introducir valores fijos. Veamos un ejemplo con *$cmp*:


```javascript
db.people.aggregate(
 {$project:
     {           
        name:1,
        age:1,       
        position:{$cmp:[“$latitude”,“$longitude”]}
     }    
 } 
 );
```

En esta proyección, lo que hacemos es comparar el campo latitude
directamente con el campo longitude, sin tener que introducir valores
fijos. El resultado será similar a este:

```json
{
    “_id”: ObjectId(“5259c377dcdf4b98c24ca723”),
    “age”: 31,
    “name”: “JulieAguirre”,
    “position”: -1
},
{
    “_id”: ObjectId(“5259c377dcdf4b98c24ca72c”),
    “age”: 21,
    “name”: “YoungFrench”,
    “position”: 1
},
{
    “_id”: ObjectId(“5259c377dcdf4b98c24ca734”),
    “age”: 21,
    “name”: “GriffinTyson”,
    “position”: 1
}
```

Como explicábamos al principio de la entrada, *$cmp* devolvería -1 si
latitude es menor que longitude, 1 si latitude es mayor que longitude y
0 si son iguales.

### Conclusiones


 En esta entrega hemos repasado el funcionamiento de los operadores de
expresión utilizados en **MongoDB**para la comparación de datos. En
general son sencillos de utilizar, pero tienen algunas salvedades que
deberemos conocer para utilizarlos correctamente. 

 Quería haber explicado también el funcionamiento de otros tipos de
operadores, pero el artículo quedaría demasiado largo, así que lo
dejamos para la próxima entrega.

* * * * *

* * * * *

*¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me
gusta en Facebook o de publicarlo en Twitter. ¡ Gracias !
*

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde
aquí.](http://www.charlascylon.com/p/tutorial-mongodb.html)*

¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog?
Suscríbete [por RSS](feed://www.charlascylon.com/feed.xml).*[
](http://www.charlascylon.com/p/tutorial-mongodb.html)*

