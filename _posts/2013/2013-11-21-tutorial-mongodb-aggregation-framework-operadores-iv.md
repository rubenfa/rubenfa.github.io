---
layout: post
title: Tutorial MongoDB. Operadores de expresión IV
redirect_from:
  - /post/67646266729/tutorial-mongodb-aggregation-framework-operadores-iv.html
---


Continuamos con una nueva entrega del **tutorial de MongoDB**,  para
acabar con la parte de los operadores de expresión de**Aggregation
Framework**.  Ya os comenté en las conclusiones [del pasado artículo del
tutorial](http://www.charlascylon.com/post/66954001864/tutorial-mongodb-operadores-expresion-iii "enlace a aggregation framework operadores III"),
que aún nos quedan por repasar los operadores de fecha y los operadores
de cadena. Así que vamos a ello.'

> Recuerda: que para los ejemplos estamos utilizando el conjunto de
> datos que puedes descargar de
> [aquí](https://skydrive.live.com/download?resid=1F8D7C58B1FC74AE%211168 "enlace a conjunto de datos de los ejemplos").
> Si todavía no sabes como importar estos datos a tu base de datos
> **MongoDB**tienes una pequeña guía de como hacerlo
> [aquí](http://www.charlascylon.com/post/61794340001/tutorial-mongodb-operaciones-de-consulta "enlace a entrada donde se explica el comando mongoimport").
> Si aún no tienes instalado
> **MongoDB**[aquí](http://www.charlascylon.com/post/61794337102/tutorial-mongodb-instalacion-y-configuracion "enlace a entrada de instalación de MongoDB")explico
> como puedes hacerlo.

### Operadores de cadena

Como os habréis imaginado, los operadores de cadena son aquellos que se
utilizan para realizar operaciones con strings. Son los siguientes:

-   *'$concat*: concatena dos o más strings.
-   *'$strcasecmp:* compara dos strings y devuelve un entero con el  resultado. Devolverá un número positivo si el primer string es mayor, un número negativo si el segundo es mayor o un 0 en el caso de que sean iguales.
-   *'$substr:* crea un substring con una cantidad determinada de caracteres.
-   *'$toLower:* convierte el string a minúsculas.
-   *'$toUpper:* convierte el string a mayúsculas.

```javascript
db.people.aggregate(
{
   $project:{
     concatName:{
       $concat:['$name','$gender']},
       compWrong:{$strcasecmp:['$2,500.00','$2,600.00']
   },        
   comp:{
       $strcasecmp:['2,500.00',{$substr:['$balance',1,20]}]
   }, 
   nameUpper:{'$toUpper':'$name'},
   nameLower:{'$toLower':'$name'}
}
});
```


Vale, ya poodéis ver, que el uso de estos operadores es bastante
sencillo. Tenemos dos tipos: los que reciben un solo parámetro y los que
reciben un array con todos los parámetros necesarios. Si nos fijamos en
los que reciben en un solo parámetro vemos que son *'$toUpper* y
*'$toLower*, que simplemente convierten el string que llega como
parámetro a mayúsuculas o minúsuculas. De los que reciben un array
tenemos *'$concat*, que simplemente concatena todos los scripts del
array en uno solo. También tenemos *'$strcasecmp* que compara dos
strings devolviendo un entero como resultado. Y para acabar, tenemos
*'$substr* que funciona como suele funcionar este comando en cualquier
lenguaje de programación: un parámetro con el string, otro con el inicio
del substring y otro con el número de caracteres que tendrá el
substring. Si lanzamos la consulta, veremos un resultado parecido al que
sigue:

```json
{
    '“'_id”: ObjectId(“5259c377dcdf4b98c24ca723”),
    '“balance”: “'$2,
    345.00”,
    '“concatName”: “JulieAguirre,
    female”,
    '“compWrong”: 0,
    '“comp”: 1,
    '“nameUpper”: “JULIEAGUIRRE”,
    '“nameLower”: “julieaguirre”'
},
'{
    '“'_id”: ObjectId(“5259c377dcdf4b98c24ca72c”),
    '“balance”: “'$2,
    735.00”,
    '“concatName”: “YoungFrench,
    female”,
    '“compWrong”: 0,
    '“comp”: -1,
    '“nameUpper”: “YOUNGFRENCH”,
    '“nameLower”: “youngfrench”'
}
```

Si habéis estado atentos podréis ver cosas raras en la consulta. Lo
primero es que uso *'$strcasecmp* dos veces, una para calcular el campol
*compWrong*y otra para calcular el campo *comp*. Lo segundo es que
*'$substr* lo utilizo dentro de uno de las expresiones
*'$strcasecmp* ¿Por qué? Pues porque trasteando con los ejemplos he visto
que el comportamiento de*'$strcasecmp* es errático cuándo tratas de
comparar strings que empiezan por el signo del dólar. Ya habéis visto
que en **MongoDB**, todas los operadores de expresión de **Aggregation
Framework** hacen referencia al contenido de los campos empezando con el
símbolo “$”. Esto hace que si el contenido del campo empieza con ese
símbolo, nos encontremos con bastantes problemas. La inconsistencia de
los resultados devueltos me llevó [a buscar la luz en
StackOverflow](http://stackoverflow.com/questions/20066996/mongodb-strcasecmp-strange-behaviour-when-the-field-content-has-dollar-signs "enlace a StackOverflow con mi pregunta sobre strcasecmp")
y allí me dijeron dos cosas que ya sabía: que el símbolo “'$” da
bastante guerra y que no debo hacer comparaciones de strings como si
fueran números. Es cierto que no se deben tratar strings como si fueran
números (“230” es mayor que “200000”), pero como en este caso se trataba
de strings de tamaño fijo, decidí que el ejemplo era igualmente válido.
En fin, el caso es que uno de los usuarios de *StackOverflow* comenta que
en la versión 2.6 de **MongoDB** existirá un campo llamado *'$literal*,
que hará que tratemos todos los caracteres del string como parte del
mismo y no como caracteres especiales. Tenéis más información sobre este
campo [en este
enlace](http://docs.mongodb.org/master/reference/operator/aggregation/literal/ "enlace a MongoDB y el operador literal").
Como para los ejemplos yo estoy utilizando la versión 2.4, no puedo
utilizar el operador *'$literal*, así que lo que hago es utilizar
*'$substr* para crear un substring que no tenga el símbolo “'$” y luego
compararlo con “'$balance” a través de *'$strcasecmp*. Un poco
rebuscado, pero funciona. Y recordad, que por vuestra seguridad, si
queréis comparar números, es mejor que utilizar números con formáto
numérico que números con formato cadena.

### Operadores de fecha

Los operadores de fecha se utilizan para realizar operaciones con campos
de tipo fecha. Tenemos disponibles los siguientes operadores:

-   *'$dayOfYear*: convierte una fecha a un número entre 1 y 366.
-   *'$dayOfMonth*: convierte una fecha a un número entre 1 y 31.
-   *'$dayOfWeek*: convierte una fecha a un número entre 1 y 7.
-   *'$year:* convierte una fecha a un número que representa el año (2000,1998 etc.)
-   *'$month*: convierte una fecha a un número entre el 1 y el 12.
-   *'$week*: convierte una fecha a un número entre 0 y 53.
-   *'$hour:* convierte una fecha a un número entre 0 y 23.
-   *'$minute*: convierte una fecha a un número entre 0 y 59
-   *'$second*: convierte una fecha a un número entre 0 y 59. Aunque puede ser 60 para contar intervalos.
-   *'$millisecond:* devuelve los milisegundos de la fecha, con un número entre  0 and 999.

Un montón de operadores ¿verdad? Aunque sean muchos, lo bueno es que son
fáciles de utilizar. Antes de ver un ejemplo, tenemos que hacer una
transformación. Nuestro conjunto de datos de prueba, tiene un campo
fecha llamado *registered*. El problema es que este campo es de tipo
string, así que habrá que transformarlo para que los operadores de fecha
funcionen. Para ello lanzaremos el siguiente script:

```javascript
db.people.find().forEach(function (element) {
    element.registered = ISODate(element.registered);
    db.people.save(element);
})
```

Recordad que la shell de MongoDB funciona con un motor de JavaScript,
por lo que siempre podemos hacer uso de este lenguaje para realizar
operaciones. En este caso estamos buscando todos los documentos y para
cada uno estamos transformando el campo registered de string a ISODate.

Una vez transformados los datos, podemos ejecutar una consulta de
ejemplo:

```javascript
db.people.aggregate({
    $project: {
        dayOfYear: { $dayOfYear: '$registered' },
        dayOfMonth: { $dayOfMonth: '$registered' },
        dayOfWeek: { $dayOfWeek: '$registered' },
        year: { $year: '$registered' },
        month: { $month: '$registered' },
        week: { $week: '$registered' },
        hour: { $hour: '$registered' },
        minute: { $minute: '$registered' },
        second: { $second: '$registered' },
        millisecond: { $millisecond: '$registered' }
    }
});
```

los operadores, no necesitan mucha más explicación ya que son muy
sencillos. La consulta nos mostrará unos resultados parecidos a estos:

```json
 '_id': ObjectId(“528d34544ad3f28cecf29da2”),
'dayOfYear': 328,
'dayOfMonth': 24,
'dayOfWeek': 4,
'year': 1993,
'month': 11,
'week': 47,
'hour': 19,
'minute': 13,
'second': 0,
'millisecond': 0
},
{
'_id': ObjectId('528d34544ad3f28cecf29da5'),
'dayOfYear': 107,
'dayOfMonth': 17,
'dayOfWeek': 4,
'year': 1991,
'month': 4,
'week': 15,
'hour': 4,
'minute': 10,
'second': 3,
'millisecond': 0
}
```

### Conclusiones

A lo largo de varios artículos, hemos repasado todos y cada uno de los
operadores de expresión que podemos utilizar en el Aggregation Framework
de MongoDB. Con la variedad de operadores y pipelines, no debería haber
consulta de agregación que se nos resista.

De todas formas esta no es la única manera de hacer consultas de
agregación, ya que también podemos utilizar MapReduce. Pero eso lo
veremos en la siguiente entrega.

* * * * *

* * * * *

*¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me
gusta en Facebook o de publicarlo en Twitter. ¡ Gracias !'
*

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde
aquí.](http://www.charlascylon.com/p/tutorial-mongodb.html)*

¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog?
Suscríbete [por RSS](feed://www.charlascylon.com/feed.xml).*['
](http://www.charlascylon.com/p/tutorial-mongodb.html)*

