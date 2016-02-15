---
layout: post
title:  Tutorial MongoDB. Operadores de expresión III
redirect_from:
  - /post/66954001864/tutorial-mongodb-operadores-expresion-iii.html
---


Seguimos avanzando con el **tutorial de MongoDB**, en esta ocasión para
repasar algunos de los operadores de expresión de **Aggregation
Framework** que todavía nos quedan. En las anteriores entregas hemos
repasado los [operadores de
agrupación](http://www.charlascylon.com/post/65600378745/tutorial-mongodb-operadores-expresion-i "enlace a entrada de operadores de agrupación"),
[los
aritméticos](http://www.charlascylon.com/post/65600378745/tutorial-mongodb-operadores-expresion-i "enlace a entrada de operadores aritméticos")
y los [operadores de
comparación](http://www.charlascylon.com/post/66079577017/tutorial-mongodb-operadores-expresion-ii "enlace a entrada sobre operadores de comparación").
En esta entrega, vamos a repasar dos nuevos tipos de operadores de
expresión: los operadores booleanos y los operadores condicionales.

> **Recuerda**: que para los ejemplos estamos utilizando el conjunto de
> datos que puedes descargar de
> [aquí](https://skydrive.live.com/download?resid=1F8D7C58B1FC74AE%211168 "enlace a conjunto de datos de los ejemplos").
> Si todavía no sabes como importar estos datos a tu base de datos
> **MongoDB**tienes una pequeña guía de como hacerlo
> [aquí](http://www.charlascylon.com/post/61794340001/tutorial-mongodb-operaciones-de-consulta "enlace a entrada donde se explica el comando mongoimport").
> Si aún no tienes instalado
> **MongoDB**[aquí](http://www.charlascylon.com/post/61794337102/tutorial-mongodb-instalacion-y-configuracion "enlace a entrada de instalación de MongoDB")explico
> como puedes hacerlo.

### Operadores booleanos

Con el nombre que tienen ya os podréis imaginar para qué sirven. Un
operador booleano recibe parámetros booleanos y devuelve otro booleano
como resultado. Los operadores booleanos que podemos utilizar son:

-   *$and*: devuelve true si todos los parámetros de entrada son true.
-   *$or*: devuelve true si alguno de los parámetros de entrada es true.
-   *$not*: devuelve el valor contrario al parámetro de entrada. Si el parámetro es true, devuelve false. Si el parámetro es false, devuelve true.

Una vez vista la definición, vamos a ver como se utilizan. Aquí un
ejemplo:

```javascript
db.people.aggregate(
 {
     $match:{
         $and:[
             {isActive:true},
             {age:{$gte:25}}
         ]        
     }    
 });
```

El ejemplo es bastante sencillo. Al *pipeline $match* le pasamos el
operador *$and*, que recibe un array con las condiciones que deben
cumplirse. En este caso son dos, pero pueden ser tantas como sean
necesarias. En nuestro ejemplo estamos comprobando que isActive sea true
y que age sea mayor o igual a 25. Aunque esta consulta es válida y
funciona perfectamente, no tiene mucho sentido ya que *$match* ya
realiza un and implícito. Este ejemplo funcionaría igual que el
anterior, y sin utilizar *$and*.

```javascript
db.people.aggregate(
 {
     $match: {
             isActive:true,
             age:{$gte:25}
         }   
     
 });
 ```

Esta situación [es la misma que nos
encontramos](http://www.charlascylon.com/post/61794343130/tutorial-mongodb-operaciones-de-consulta-avanzadas-i "enlace a consultas avanzadas en MongoDB")
a la hora de ralizar consultas simples. Entonces, ¿para qué usar
*$and* si ya lo hace implícitamente? Pues porque en ocasiones, lo
utilizaremos para concatenar operadores *$and* y operadores *$or*.

```javascript
db.people.aggregate(
 {
     $match:{
         $and:
         [
            {
              $or:[
                 {age:{$gte:40}},
                 {age:{$lte:30}}
                 ]
             },
             {isActive:true}            
         ]
                 
    }    
 });
 ```

Este ejemplo es un poco más complicado que el anterior. Al igual que
antes utilizamos el pipeline *$match* con un operador *$and*. La
diferencia es que en este caso el operador recibe dos parámetros: el
resultado de una operación *$or* y el resultado de comprobar si isActive
es true. El operador *$or* devolvera true en el caso de que age sea
mayor o igual a 40 o age sea menor o igual que 30. Es decir, con que se
cumpla una de las dos condiciones del *$or* ya sería suficiente para
que devuelva true. 

Como veis el uso de *$or* es muy similar al de *$and*, y al igual que
este, puede recibir dos o más parámetros:

```javascript
db.people.aggregate(
 {
     $match:{        
         $or:
         [
             {age:{$gte:40}},
             {age:{$lte:30}},
             {isActive:true}            
        ]                
    }    
 });
 ```

Todavaía nos queda ver como funciona el operador *$not*, que es un poco
distinto a los anteriores. Un ejemplo:

```javascript
db.people.aggregate(
 {
     $match:{        
         age:{$not:{$gte:40}}                   
    }    
 });
 ```

En este caso, al usar el *$not*,  estamos verificando que el campo lo
contrario a que age sea mayor o igual a 40. Es decir, haremos el
*$match* cuando *age* sea menor que 40.

### Operadores condicionales

Los operadores condicionales en **MongoDB**se utilizan para verificar
una expresión y según el valor de esta expresión, devolver un resultado
u otro. En **Aggregation Framework**existen dos operadores
condicionales:

-   *$cond*: operador ternario que recibe tres expresiones. Si la primera es verdadera, devuelve la segunda. Si es falsa, devuelve la tercera. Muy similar, por ejemplo, al operador ternario de
    JavaScript
-   *$ifNull*: operador que recibe dos parámetros y en el caso de que el primero sea null, devuelve el segundo.  Muy similar al *IsNull* de  SQL Server o al *NVL* de Oracle.

Veamos un ejemplo de uso de *$cond*:

```javascript
db.people.aggregate(
 {
     $project:
     {           
         _id:-1,
         name:1,
         tipo:{
             $cond:[{$gte:[“$age”,65]},“Pensionista”,“Normal”]
         }
     }    
 });
```

En este caso estamos utilizando *$cond* en un pipeline *$project* para
verificar si la edad es mayor o igual a 65 años. Si es así, devolveremos
como resultado el string “Pensionista”, y si no es así, devolveremos el
string “Normal”.

El operador *$ifNull* es bastante similar:

```javascript
db.people.aggregate(
 {
     $project:
     {           
         _id:-1,
         name:1,
         location:{
             $ifNull:[“$latitude”,“Sin datos”]
         }
     }    
 });
```

En este caso estamos verificando si el campo latitude es nulo, en cuyo
caso se devolverá el string “Sin datos”.

### Conclusiones

Con los operadores de expresión que hemos repasado en anteriores
entregas, teníamos un amplio abanico de operadores que podíamos usar
para nuestras consultas de **Aggregation Framework**. Añadiendo los
operadores booleanos y condiconales, aumentamos las posibilidades,
haciendo que podamos sacar prácticamente cualquier dato que se nos
ocurra.

En la próxima entrega repasaremos algunos operadores más de **MongoDB**,
ya que todavía no hemos visto como podemos operar con strings o fechas.
No os lo perdáis.

* * * * *

* * * * *

*¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me
gusta en Facebook o de publicarlo en Twitter. ¡ Gracias !
*

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde
aquí.](http://www.charlascylon.com/p/tutorial-mongodb.html)*

¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog?
Suscríbete [por RSS](feed://www.charlascylon.com/rss).*[
](http://www.charlascylon.com/p/tutorial-mongodb.html)*

