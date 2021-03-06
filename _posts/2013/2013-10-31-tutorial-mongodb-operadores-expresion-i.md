---
layout: post
title: Tutorial MongoDB. Operadores de expresión en Aggregation Framework I
redirect_from:
  - /post/65600378745/tutorial-mongodb-operadores-expresion-i.html
  - /post/65600378745/
---

En las anteriores entregas de nuestro **tutorial de MongoDB** hemos
aprendido a usar los pipelines de **Aggregation Framework**. En alguno
de esos artículos ya hemos utilizado algunos de los elementos que vamos
a explicar hoy. Estos elementos son los conocidos como operadores de
expresión y sirven para dotar de funcionalidad extra a los pipelines.
Los operadores de expresión, según la funcionalidad que cumplen, y el
ámbito en el que los podemos usar, se pueden agrupar en distintas
categorías: operadores de agrupación, booleanos, de comparación,
aritméticos, de cadenas, de fecha y condicionales. Para que la entrada
no quede muy larga, hoy vamos a centrarnos en los operadores de
agrupación y los operadores aritméticos.

### Operadores de agrupación

Los operadores de agrupación son aquellos que se utilizan a la hora de
agrupar información con el pipeline *$group*. [En el
artículo](https://www.charlascylon.com/post/64283434936/tutorial-mongodb-pipelines-aggregation-i)
dónde explicábamos el funcionamiento de *$group* en **MongoDB**, ya
vimos un par de ejemplos con *$avg* y *$sum*. Pero estos no son los
únicos operadores que puedemos utilizar. Existen otros muy útiles.
Primero veamos los más sencillos.

-   *$first*: Devuelve el primer valor de un campo en un grupo. Si el grupo no está ordenado, el valor mostrado será impredecible.
-   *$last*. Devuelve el último valor de un campo en un grupo. Si el grupo no está ordenado, el valor mostrado será impredecible.
-   *$max*. Devuelve el valor más alto de un determinado campo dentro un grupo.
-   *$min*. Devuelve el valor más pequeño de un determinado campo dentro de un grupo.
-   *$avg*. Calcula la media aritmética de los valores dentro del campo especificado y los devuelve.
-   *$sum*. Suma todos los valores de un campo y los devuelve.

Como siempre digo, mejor verlo con ejemplos, así que la siguiente
consulta utiliza todos ellos:

```javascript
db.people.aggregate({
    $sort: {
        name: 1
    }
},
{
    $group: {
        _id: {
            age: "$age",
            gender: "$gender"
        },
        count: {
            $sum: 1
        },
        maxLatitude: {
            $max: "$latitude"
        },
        minLatitude: {
            $min: "$latitude"
        },
        avgLatitude: {
            $avg: "$latitude"
        },
        firstPerson: {
            $first: "$name"
        },
        lastPerson: {
            $last: "$name"
        }
    }
});
```


En la consulta primero utilizamos un pipeline *$sort* para ordenar por
nombre. Luego utilizamos el pipeline *$group* para agrupar por los
campos *age* y *gender*. De esta manera conseguiremos agrupar por mujeres
de 27 años, hombres de 32 años etc. Dentro del pipeline utilizamos los
operadores para completar nuestra consulta.

-   *count:{$sum:1}*: sumamos uno por cada persona de una edad y género en un grupo. Por ejemplo si tenemos 12 mujeres de 27 años, contaremos los registros y devolveremos el valor 12.
-   *maxLatitude: {$max:”$latitude”}, minLatitude:{$min:”$latitude”} y avgLatitude:{$avg:” $latitude”}*: en este caso estamos devolviendo el valor más alto, más bajo y la media del campo
    *latitude*. Si hubiese tres documentos con latitudes iguales a 3, 2 y 7, $max devolvería 7, $min devolvería 2 y $avg devolvería 4.
-   *firstPerson:{$first:”$name”} y lastPerson:{$last:”$name”}:* en este caso se devolverán el primer y último nombre encontrados en el grupo. Los resultados serán los esperados ya que al inicio hemos
    utilizado el pipeline *$sort* para ordenar los documentos por nombre. Si no hubiésemos ordenado, los resultados devueltos en estos campos serían completamente impredecibles, ya que **MongoDB,**por
    defecto**,**no los recupera en un orden determinado.

Y aquí tenemos un ejemplo del resultado que devolvería la consulta

```javascript
{
    "_id": {
        "age": 26,
        "gender": "female"
    },
    "count": 2,
    "maxLatitude": -4.996029,
    "minLatitude": -34.082682,
    "avgLatitude": -19.5393555,
    "firstPerson": "Margo Fisher",
    "lastPerson": "Willie Cabrera"
},
{
    "_id": {
        "age": 23,
        "gender": "male"
    },
    "count": 4,
    "maxLatitude": 77.811061,
    "minLatitude": 7.844254,
    "avgLatitude": 39.4143065,
    "firstPerson": "Herring Flowers",
    "lastPerson": "Weeks Buchanan"
}
```

Además de los operadores de expresión que acabamos de explicar, con
*$group*, también podemos utilizar otros dos muy útiles, pero que
necesitan de un poco más de explicación. Son *$addToSet* y*$push*. Su
funcionamiento es igual en ambos casos, aunque con un ligero matiz. Si
los utilizamos crearemos un campo array que incluirá todos los valores
del campo que especifiquemos. Como ejemplo veamos la siguiente consulta

```javascript
db.people.aggregate({
    $group: {
        _id: {
            age: "$age",
            gender: "$gender"
        },
        persons: {
            $addToSet: "$name"
        }
    }
});
```

Al igual que en los ejemplos anteriores, estamos agrupando por *age* y
*gender*, pero en este caso también estamos creando un campo *persons*
que será un array con los nombres de las personas incluidas en el grupo.
El resultado de la consulta sería similar al siguiente:

```javascript
{
    "_id": {
        "age": 32,
        "gender": "male"
    },
    "persons": [
        "Skinner Wynn",
        "Dunn Estrada",
        "Good Howell"
    ]
},
{
    "_id": {
        "age": 34,
        "gender": "male"
    },
    "persons": [
        "Kelley Guthrie",
        "Branch Terrell",
        "Mccall Branch",
        "Duke Atkinson",
        "Zimmerman Callahan",
        "Roth Snow"
    ]
}
```

Si quisiéramos hacerlo con *$push,la consulta sería exactamente igual
que con *$addToSet*, pero deberemos tener en cuenta que el resultado
puede ser diferente. Mientras que *$push* puede mostrar varias veces un
elemento si este se repite en el grupo,*$addToSet* solo mostrará uno de
ellos, independientemente de las veces que aparezca en el grupo.
Imaginemos que nuestro grupo incluye los nombres “Mateo”, “Pedro”,
“María”, “Pedro” y “Ana”, con *$addToSet* devolveríamos solo
[“Mateo”,“Pedro”,“María”,“Ana”], mientras que*$push* devolvería
[“Mateo”,“Pedro”,“María”,“Pedro”,“Ana”]. Como véis en el segundo caso
“Pedro” aparecería dos veces.

### Operadores aritméticos

Con los operadores de agrupación tenemos la limitacón de que solo pueden
usarse con el pipeline *$group*. En cambio los operadores aritméticos,
podemos utilizarlos en otros pipelines como *$project*. Los operadores
que podemos utilizar son

-   *$add*: realiza la suma de un array de números.
-   *$divide*: divide dos números.
-   *$mod*: a partir de dos números calcula el resto producido al dividir el primero entre el segundo.
-   *$multiply*: multiplica dos números.
-   *$substract*: a partir de dos números realiza la resta.

Veamos un ejemplo.

```javascript
db.people.aggregate({
    $project: {
        _id: 0,
        latitude: 1,
        latitudeSum: {
            $add: [
                "$latitude",
                1000,
                10000
            ]
        },
        latitudeSubtract: {
            $subtract: [
                "$latitude",
                10
            ]
        },
        latitudeDivide: {
            $divide: [
                "$latitude",
                "$longitude"
            ]
        },
        latitudeMultiply: {
            $multiply: [
                "$latitude",
                "$longitude"
            ]
        },
        ageMod: {
            $mod: [
                "$age",
                2
            ]
        }
    }
});
```

En este caso estamos utilizando un pipeline *$project*, en el que
estamos cambiando distintos campos utilizando operadores aritméticos.

-   *latitudeSum:{$add:[“$latitude”,1000,10000]}*: suma a el valor de $latitude primero 1000 y luego 10000. En el array podríamos añadir tantos valores como quisiéramos, que pueden ser números o campos de la consulta.
-   *latitudeSubtract:{$subtract:[“$latitude”,10]}*: resta 10 al valor de *$latitude*.
-   *latitudeDivide:{$divide:[“$latitude”,”$longitude”]}*: divide *$laitude* entre*$logitude* y muestra el resultado.
-   *latitudeMultiply:{$multiply:[“$latitude”,”$longitude”]}*: mulitplica *$laitude* por *$logitude* y muestra el resultado.
-   *ageMod:{$mod:[“$age”,2]}*: divide *$age* entre 2 y devuelve el resto. En este caso podremos utilizarlo para saber si la edad es un número par o no.

Y el resultado sería similar al siguiente:

```javascript
{
    "latitude": 30.253596,
    "latitudeSum": 11030.253596,
    "latitudeSubtract": 20.253596,
    "latitudeDivide": 1.701632377365839,
    "latitudeMultiply"537.883554112956,
    "latitudeMod": 1
},
{
    "latitude": -30.016578,
    "latitudeSum": 10969.983422,
    "latitudeSubtract": -40.016578,
    "latitudeDivide": 0.2477577963253214,
    "latitudeMultiply": 3636.59577294198,
    "latitudeMod": 0
}
```
### Conclusiones

Los operadores de expresión del **Aggregation Framework** de **MongoDB**
son una herramienta imprescindible para crear consultas de agregación.
En este artículo hemos visto los operadores de expresión de agrupación y
los operadores aritméticos. Para la correcta creación de este tipo de
cláusulas es necesario conocerlos y saber utilizarlos correctamente. En
próximas entregas del tutorial repasaremos otros tipos de operadores de
expresión.

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*

