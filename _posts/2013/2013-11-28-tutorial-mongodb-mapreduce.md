---
layout: post
title: Tutorial MongoDB. MapReduce
redirect_from:
  - /post/68351468690/tutorial-mongodb-mapreduce.html
  - /post/68351468690/
---

En la anterior entrega de este **tutorial de MongoDB**, completamos el
repaso a todas las operaciones que podemos realizar sobre
**MongoDB**para realizar consultas de agregación. Aunque **Aggregation
Framework** es muy potente y versátil, no viene mal contar con una
opción extra para realizar este tipo de consultas. Y esta opción es
**MapReduce**.

> **Recuerda**: que para los ejemplos estamos utilizando el conjunto de
> datos que puedes descargar de
> [aquí](https://skydrive.live.com/download?resid=1F8D7C58B1FC74AE%211168 "enlace a conjunto de datos de los ejemplos").
> Si todavía no sabes como importar estos datos a tu base de datos
> **MongoDB**tienes una pequeña guía de como hacerlo
> [aquí](http://www.charlascylon.com/post/61794340001/tutorial-mongodb-operaciones-de-consulta "enlace a entrada donde se explica el comando mongoimport").
> Si aún no tienes instalado
> **MongoDB**[aquí](http://www.charlascylon.com/post/61794337102/tutorial-mongodb-instalacion-y-configuracion "enlace a entrada de instalación de MongoDB")explico
> como puedes hacerlo.

### ¿Qué es MapReduce?

**MapReduce**es un framework creado por Google, y pensado para realizar
operaciones de forma paralela sobre grandes colecciones de datos.  Este
framework está compuesto de dos funciones principales: la función
**Map** y la función **Reduce**. De ahí ese nombre tan original.  La
función **Map** se encarga, de forma paralela, de mapear los datos de
origen. Para cada dato de origen, se genera una tupla clave-valor, las
cuales son unidas en una lista que se pasa a la función **Reduce**.
Después, la función **Reduce**, trata cada elemento de la lista de pares
y realiza operaciones sobre ella para devolver un dato concreto. 

Seguramente, al verlo escrito no haya quedado muy claro, así que vamos
a verlo con un ejemplo. Imaginemos que tenemos una colección con
documentos del siguiente tipo:

```javascript
{
    _id: 1,
    name: “Pedro”,
    age: 23,
    savedPoints: [
        200,
        10,
        30
    ]
},
{
    _id: 2,
    name: “Mariano”,
    age: 48,
    savedPoints: [
        50,
        85
    ]
}
```

Si aplicamos la función **Map**, lo que haremos será a partir de cada
documento de entrada, elegir la tupla de campos que se enviará en una
lista a la función **Reduce**. En este caso usaremos el campo *_id* y el
campo *savedPoints*. Nos quedaría:

```javascript
 {_id:1,savedPoints:[200,10,30] },
 {_id:2,savedPoints:[50,85] }
```

Una vez tenemos la lista de tuplas, la función **Reduce** realizará un
cálculo sobre los datos, en este caso sumar los valores del Array. El
resultado sería:

```javascript
 {_id:1,totalPoints:240},
 {_id:2,totalPoints:135 }
```

El ejemplo queda un poco triste al tener solo un par de documentos, pero
creo que la idea queda más o menos clara. Veamos ahora como podemos
utilizar **MapReduce** con **MongoDB**.

### Utilizando MapReduce en MongoDB

Para ejecutar una operación **MapReduce** en **MongoDB**, necesitaremos
ejecutar un comando como este:

```javascript
db.nombreColección.mapReduce(mapFunction,reduceFunction, options);
```
Como veis, el formato de la instrucción es más o menos similar a la que
hemos usado hasta ahora. Como parámetros al método **mapReduce** de la
coleccion, debemos pasar una función Javascript que se encargue del
**Map**, otra función que se encargue del **Reduce** y un *JSON* con
opciones adicionales. Este *JSON* deberá incluir al menos el campo
*output*, con un string que represente el nombre de la colección que se
creará para almacenar los datos de la consulta. Eso sí, tened en cuenta
que hay más opciones, y que las podéis consultar
[aquí](http://docs.mongodb.org/manual/reference/command/mapReduce/#dbcmd.mapReduce "enlace a MapReduce con MongoDB").

Vamos ahora con un ejemplo. Imaginemos que queremos consultar cuántas
personas en nuestra base de datos son hombres, cuántas son mujeres y que
queremos sumar la edad total de las personas que componen esos dos
grupos. Usando **Aggregation Framework**, realizaríamos una consulta
parecida a  esta:

```javascript
 db.people.aggregate(
 {
     $group:
     {_id:“$gender”,
         totalAge:{$sum:“$age”},
         totalPeople:{$sum:1}
     }
 });
```

 Básicamente usamos el pipeline *$group* para agrupar por el campo
*gender*y luego vamos acumulando la suma de la edad y el número de
personas. 

 Para realizar esto con **MapReduce** primero necesitaremos una función
**Map**, que será la siguiente:

```javascript
var map = function () {
    emit(this.gender, { age: this.age, count: 1 });
}
```
Esta función lo único que hace es crear la tupla de datos que pasaremos
a la función **Reduce** cogiendo los campos gender y un objeto que
contenga la edad y un contador con el valor 1. En la función **Map**, la
palabra *this* hace referencia al documento actual que se está
procesando, por eso con *this.age* y *this.gender*, podemos acceder a esos
campos de nuestro documento. Con *emit* indicamos que la tupla hay que
pasársela a la función **Reduce**, que tendría más o menos esta pinta:

```javascript
 var reduce = function(keys,values)
 {
     var reduced = {        
         totalPeople:0,
         totalAge:0
     }

     for (var i=0; i < values.length;i++)
     {
        reduced.totalPeople+=1;
        reduced.totalAge+=values[i].age;        
     }   
     
     return reduced;
 }
```

Como ya hemos dicho, la función **Reduce** recibe como parámetro la
lista de elementos a procesar separados en dos arrays de claves y
valores. En el ejemplo, también se crea un objeto denominado
*reduced*con dos variables enteras. Estas variables se van incrementando
al recorrer los valores de la lista pasada como parámetro, cosa que
hacemos con un for.  Una vez se han procesado todos los datos se
devuelve el resultado. 

Una vez creadas las funciones, para ejecutar el método **mapReduce**,
deberemos realizar la siguiente consulta.

```javascript
db.people.mapReduce(map,reduce,{out:‘map_reduce_result’});
```

Como hemos indicado antes, al método **mapReduce** le pasamos la función
*map*, la función *reduce* y como opciones mínimas el nombre de la
colección dónde se van a almacenar los datos, que en este caso se
llamará *map_reduce_result*. Si esta colección existe, sus datos serán
eliminados, así que cuídado. Si consultamos esa colección, los datos
devueltos serán:

```javascript
 db.map_reduce_result.find();

 /* 0 */
 {
     “_id” : “female”,
     “value” : {
         “totalPeople” : 54,
         “totalAge” : 1570
     }
 }

 /* 1 */
 {
     “_id” : “male”,
     “value” : {
         “totalPeople” : 46,
         “totalAge” : 1428
     }
 }
```

Como vemos se han separado los datos por la clave que indicamos en la
función **Map**y se ha creado un subdocumento con los datos calculados
en la función **Reduce**.

### Conclusiones

Con **Aggregation Framework**, podíamos realizar prácticamente cualquier
consulta de agregación que se nos ocurriera. Pero puede pasar que a
veces las opciones se queden un poco cortas, por lo que no viene mal
poder utilizar una opción tan potente como **MapReduce**. Eso sí, hay
que tener en cuenta, que **MapReduce** es más complicado de utilizar,
así que es posible que nos de más problemas crear una consulta que
utilizando **Aggregation Framework**.


* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](http://charlascylon.com/tutorialmongo)*

