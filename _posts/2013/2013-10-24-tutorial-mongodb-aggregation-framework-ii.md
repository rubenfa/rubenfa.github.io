---
layout: post
title: Tutorial MongoDB. Pipelines en Aggregation Framework II
redirect_from:
  - /post/64941824393/tutorial-mongodb-aggregation-framework-ii.html
  - /post/64941824393/
---


Seguimos adelante con nuestro **tutorial de MongoDB**, en este caso con
una nueva entrega sobre **Aggregation Framework**. En la anterior
entrega estuvimos viendo, a través de varios ejemplos, como utilizar los
pipelines en **Aggregation Framework.** En concreto vimos con detalle
tres de esos pipelines: *$project, $group y $match*. Y en esta
entrega vamos a ver otros tres.

> Nota: Para utilizar el mismo conjunto de datos que he usado en los
> ejemplos, podéis [descargar el archivo con los
> datos](https://skydrive.live.com/download?resid=1F8D7C58B1FC74AE%211168 "Archivo JSON con datos de ejemplo").
> Podéis importarlo a vuestra base de datos con *mongoimport*, como se
> explica en [la primera entrada dedicada a las operaciones de
> consulta](https://www.charlascylon.com/post/61794340001/tutorial-mongodb-operaciones-de-consulta "entrada anterior de consultas simples en MongoDB"). 
> Si todavía no tenéis instalado **MongoDB**tenéis una pequeña guía
> [aquí](https://www.charlascylon.com/post/61794337102/tutorial-mongodb-instalacion-y-configuracion "Instalación y configuración de MongoDB").

### $sort

En cualquier consulta de agregación que se precie, es probable que nos
veamos en la necesidad de ordenar los resultados. Y es aquí dónde entra
el pipeline *$sort*. Su funcionamiento es el siguiente.

```javascript
db.people.aggregate({
    $sort: {
        age: 1
    }
})
```

Con esta consulta devolvemos todos los datos ordenados por edad, en
orden ascendente. Si quisieramos el orden inverso bastaría con escribir
un -1 en lugar de un 1 en la consulta.

```javascript
db.people.aggregate({
    $sort: {
        age: -1
    }
})
```

 Coo veis el pipeline es sencillo de entender. Pero ¿qué pasa cuándo
los tipos son diferentes? Como bien sabréis, **MongoDB** no tiene un
esquema definido, lo que en este caso quiere decir que el campo age
puede ser un número, una cadena de caracteres o incluso una fecha. Es
más, mientras que en un documento el valor de age puede ser un número,
en otro puede ser un string. Y **MongoDB** seguirá funcionando igual de
bien. Cuando tratemos con casos así, solo tenemos que tener en cuenta
que unos tipos de datos tienen prioridad sobre otros. En concreto, de
menor a mayor prioridad:

1.  Null
2.  Valores numéricos (int, log,  double)
3.  Cadenas de caracteres
4.  Objetos
5.  Arrays
6.  Datos binarios
7.  ObjectID (como el campo _id que MongoDB genera para cada documento)
8.  Boolean
9.  Fechas
10. Expresiones regulares

Así que cuando ordenemos de forma ascendente por campos que tengan
distintos tipos de datos, veremos que primero nos mostrará los valores
nulos, luego los números ordenados de menor a mayor, luego las cadenas
de caracteres ordenadas de menor a mayor y así sucesivamente.

### $limit y $skip

Estos dos pipelines son muy sencillos de utilizar.  Con *$limit*,
reduciremos el número de documentos devueltos por la consulta hasta el
número que indiquemos.  Con *$skip* lo que haremos será ignorar  un
número de elementos determinado que no serán devueltos en la consulta. 
Veamos dos ejemplos.

```javascript
db.people.aggregate({
    $limit: 5
})

db.people.aggregate({
    $skip: 2
})
```


Por supuesto estos pipelines los podemos combinar entre ellos o con
otros pipelines. Por ejemplo imaginemos que queremos mostrar la tercera
persona con más edad de nuestra base de datos. Podríamos hacer algo así:

```javascript
db.people.aggregate({
    $sort: {
        age: -1
    }
},
{
    $skip: 2
},
{
    $limit: 1
})
```

Como podéis ver, primero ordenamos los resultados por el campo age de
forma descentente. Luego ignoramos los dos primeros resultados, y
finalmente, de los restantes resultados, cogemos solo el primero de
ellos.

### $unwind

Este pipeline, aunque también sencillo de utilizar, es muy potente, y
nos puede solucionar la vida en más de una consulta difícil. Utilizando
*$unwind* conseguiremos separar los elementos de un array, creando como
resultado tantos documentos iguales como elementos tenga el array, pero
incluyendo sólo el valor del array. Es una forma de “aplanar” un
documento con arrays para luego poder operar sobre esos datos. Primero
veamos un ejemplo del resultado que devolvería una consulta
**Aggregation Framework** sin utilizar *$unwind*.

```javascript
db.people.aggregate({
    $match: {
        name: “BlanchardGiles”
    }
},
{
    $project: {
        name: 1,
        friends: 1
    }
})
```

Es una consulta que busca una persona cuyo nombre sea “Blanchard Giles”
y luego devuelve sus campos *name*y *friends*. El resultado sería algo
así:

```javascript
{
    “result”: [
        {
            “_id”: ObjectId(“5259c377dcdf4b98c24ca754”),
            “name”: “BlanchardGiles”,
            “friends”: [
                {
                    “id”: 0,
                    “name”: “NobleLogan”
                },
                {
                    “id”: 1,
                    “name”: “LessieFrancis”
                },
                {
                    “id”: 2,
                    “name”: “SusanaBallard”
                }
            ]
        }
    ],
    “ok”: 1
}
```

En la consulta normal, se puede ver que *friends* es un array con tantos
amigos como tenga la persona buscada. Ahora vamos a cambiar la consulta
para añaidr *$unwind*

```javascript
db.people.aggregate({
    $match: {
        name: “BlanchardGiles”
    }
},
{
    $project: {
        name: 1,
        friends: 1
    }
},
{
    $unwind: “$friends”
})
```


En este caso añadimos al final del todo el operador *$unwind* y le
pasamos como parámetro el campo *$friends*, que es de tipo array. El
resultado sería similar a este:

```javascript
{
    “result”: [
        {
            “_id”: ObjectId(“5259c377dcdf4b98c24ca754”),
            “name”: “BlanchardGiles”,
            “friends”: {
                “id”: 0,
                “name”: “NobleLogan”
            }
        },
        {
            “_id”: ObjectId(“5259c377dcdf4b98c24ca754”),
            “name”: “BlanchardGiles”,
            “friends”: {
                “id”: 1,
                “name”: “LessieFrancis”
            }
        },
        {
            “_id”: ObjectId(“5259c377dcdf4b98c24ca754”),
            “name”: “BlanchardGiles”,
            “friends”: {
                “id”: 2,
                “name”: “SusanaBallard”
            }
        }
    ],
    “ok”: 1
}
```


Podéis ver que se han devuelto tres documentos (tantos como elementos
tenía el array) que son exactamente iguales, salvo por el campo
*friends*, que ahora en lugar de ser un array es un subdocumento con un
solo elemento.


### Poniento todos los pipelines a trabajar juntos

Y ahora veamos un ejemplo con todos los pipelines que hemos visto en
esta entrega. También he añadido el pipeline*$project*, para que quede
un resultado más limpio.

```javascript
db.people.aggregate({
    $project: {
        friends: 1,
        _id: 0
    }
},
{
    $unwind: “$friends”
},
{
    $sort: {
        “friends.name”: 1
    }
},
{
    $skip: 3
},
{
    $limit: 5
})
```

Veamos paso a paso, como **MongoDB** va recuperando los datos. Primero
hacemos un *$project* para coger solamente el campo *friends*. Recordad
que el campo *_id* aparece siempre en las consultas, salvo que
explícitamente le indiquemos  a **Aggregation Framework** que no lo
muestre, que es lo que hemos hecho en este caso. Luego aplicamos el
pipeline *$unwind*, creando por cada persona tantos documentos como
elementos tenga el array *friends* de dicha persona. Después ordenamos
los elementos resultantes, por el campo *friends.name* (usando *dot
notation*). Y para finalizar ignoramos los tres primeros resultados
devueltos por la consuulta y devolvemos solo los 5 siguientes. Como
resultado obtendremos algo parecido a esto:

```javascript
{
    “result”: [
        {
            “friends”: {
                “id”: 0,
                “name”: “AdrianaPerry”
            }
        },
        {
            “friends”: {
                “id”: 0,
                “name”: “AdrienneHerrera”
            }
        },
        {
            “friends”: {
                “id”: 1,
                “name”: “AdrienneHester”
            }
        },
        {
            “friends”: {
                “id”: 1,
                “name”: “AguilarHolden”
            }
        },
        {
            “friends”: {
                “id”: 2,
                “name”: “AguilarMorris”
            }
        }
    ],
    “ok”: 1
}
```

### Conclusiones


Una vez repasados los pipelines de MongoDB, podemos concluir que son
una manera sencilla y potente de realizar consultas de agrupación
complejas. Es difícil encontrar algún tipo de informe o dato que no
podamos sacar con los pipelines que hemos visto. Sin embargo, aunque
hemos utilizado alguno, aun nos queda ralizar un repaso a los operadores
que podemos utilizar. Lo veremos en la siguiente entrega.

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*
