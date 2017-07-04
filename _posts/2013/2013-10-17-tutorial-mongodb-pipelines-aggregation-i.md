---
layout: post
title: Tutorial MongoDB. Pipelines en Aggregation Framework I
redirect_from:
  - /post/64283434936/tutorial-mongodb-pipelines-aggregation-i.html
  - /post/64283434936/
---

En la pasada entrega del tutorial, vimos una pequeña introducción a cómo
funciona **Aggregation Framework** en **MongoDB**. En esa entrega
explicabamos lo que eran los *pipelines* de forma general, pero sin
explicar su funcionamiento. Y eso es lo que vamos a empezar a hacer en
esta nueva entrega.

> Nota: Para utilizar el mismo conjunto de datos que he utilizado en los
> ejemplos, podéis [descargar el archivo con los
> datos](https://skydrive.live.com/download?resid=1F8D7C58B1FC74AE%211168 "Archivo JSON con datos de ejemplo")
> que he utilizado. Podéis importarlo a vuestra base de datos con
> *mongoimport*, como se explica en [la primera entrada dedicada a las
> operaciones de
> consulta](http://www.charlascylon.com/post/61794340001/tutorial-mongodb-operaciones-de-consulta "entrada anterior de consultas simples en MongoDB"). 
> Si todavía no tenéis instalado **MongoDB** tenéis una pequeña guía
> [aquí](http://www.charlascylon.com/post/61794337102/tutorial-mongodb-instalacion-y-configuracion "Instalación y configuración de MongoDB").

### $project

Este *pipeline* tiene una funcionalidad parecida a la que tiene el
clásico *SELECT* en una consulta SQL. Con él, podremos cambiar los
campos originales que tiene un documento añadiendo otros nuevos,
eliminando, cambiando el nombre o añadiendo datos calculados. Veamos un
ejemplo sencillo.

```javascript
db.people.aggregate({
    $project: {
        isActive: 1,
        company: 1
    }
});
```

En este caso estamos cogiendo los datos originales de la colección
people, y estamos diciendo al *pipeline $project*, que solo queremos
mostrar dos de ellos: *isActive* y *company*.

 Claro que esto no es algo novedoso, ya que es algo que podemos hacer
con un *find* normal y corriente. Veamos otro ejemplo con más chicha:

```javascript
db.people.aggregate({
    $project: {
        isActive: 1,
        company: 1,
        name: 1,
        age: 1,
        addedAge: {
            $add: [
                "$age",
                10
            ]
        },
        upperName: {
            $toUpper: "$name"
        }
    }
});
```


En este ejemplo vemos que hemos creado dos campos que no están en el
documento original como son *addedAge* y *upperName*. Además estos campos
tienen valores calculados. El campo *addedAge*, tiene el mismo valor que
el campo *age*, pero incrementado en 10, ya que hemos utilizado el
operador de expresión *$add*. Por otro lado el campo *upperName*, tiene
el mismo valor que *name*, pero con el texto en mayúsculas, ya que hemos
usado el operador *$toUpper*. Existen otros operadores de este tipo
como *$divide*, *$multiply* o *$substract* etc. Veremos los
operadores de expresión de **MongoDB** con más detenimiento en futuras
entregas del tutorial

Otra utilidad interesante de *$project* es que podemos cambiar el
nombre a los campos, incluso de campos incluidos en subdocumentos o
arrays.

```javascript
db.people.aggregate({
    $project: {
        isActive: 1,
        name: 1,
        company: 1,
        age: 1,
        mainAddress: "$address.primary"
    }
});
```

Lo importante de esta consulta está en el *“$address.primary”*. El
campo *address* contiene un subdocumento con dos campos llamados primary
y secondary. En este caso lo que estamos diciendo a **MongoDB** es que
cree un nuevo campo en la proyección, pero que muestre solo el valor de
*primary*, que está contenido dentro delcampo *address* del subdocumento.

### $match

El *pipeline $match* se utiliza para filtrar los documentos que se
pasarán al siguiente pipeline de la consulta con **Aggregation
Framework**. Un ejemplo

```javascript
db.people.aggregate({
    $match: {
        isActive: true
    }
});
```

En este caso estamos filtrando, para que la consulta solo devuelva las
personas cuyo campo *isActive* es *true*. Como veis, es muy parecido al
WHERE de una sentencia SQL.

Como ya comentabamos en la anterior entrega, es importante utilizar
este *pipeline* tan pronto como sea posible. Y si es el primero que
utilizamos, mejor. Si tenemos que combinar *$match* y *$project*, la
sentencia será mucho más eficiente si el *pipeline $match* va primero,
ya que *$project*, tendrá que procesar muchos menos documentos.

```javascript
db.people.aggregate({
    $match: {
        isActive: true
    }
},
{
    $project: {
        isActive: 1,
        name: 1,
        mainAddress: "$address.primary"
    }
});
```

En el ejemplo primero filtramos por *isActive*, y una vez hemos
conseguido los registros que nos interesan, realizamos la proyección
para extraer solo los campos que necesitamos.

### $group

Ahora que ya sabemos filtrar documentos y mostrar solo los campos
deseados, vamos a ver como podemos agruparlos. Para esto utilizaremos el
*pipeline $group*. Veamos un ejemplo.

```javascript
db.people.aggregate({
    $group: {
        _id: "$age"
    }
});
```

Es importante destacar que *$group* siempre tiene que tener un
campo*_id*. Es el campo por el que vamos a agrupar los resultados, así
que, lógicamente, es obligatorio usarlo. En el ejemplo estamos agrupando
por el campo *age*. Si quisieramos agrupar por varios campos, tendremos
que utilizar una consulta similar a esta.

```javascript
db.people.aggregate({
    $group: {
        _id: {
            age: "$age",
            gender: "$gender"
        }
    }
});
```

El funcionamiento es muy similar al GROUP BY de una consulta SELECT. 

Ahora solo nos falta darle utilidad al pipeline $group, y esto se
consigue con los operadores de expresión para realizar cálculos como
*$sum*, *$avg*, *$max* etc.

```javascript
db.people.aggregate({
    $group: {
        _id: {
            gender: "$gender"
        },
        averageAge: {
            $avg: "$age"
        },
        count: {
            $sum: 1
        }
    }
});
```

En este ejemplo estamos agrupando por el campo gender, y una vez
agrupados los datos, mostramos la edad media de cáda género y la suma
separada de hombres y mujeres. El resultado sería similar a este.

```javascript
{
    "result": [
        {
            "_id": {
                "gender": "female"
            },
            "averageAge": 29.52830188679245,
            "count": 106
        },
        {
            "_id": {
                "gender": "male"
            },
            "averageAge": 28.91338582677165,
            "count": 127
        }
    ],
    "ok": 1
}
```

### Poniendo todos los pipelines a trabajar juntos

Ahora que hemos visto como funcionan *$project, $match y $group*,
vamos a poner un ejemplo en la que se utilizan los tres pipelines
conjuntamente.

```javascript
db.people.aggregate({
    $match: {
        isActive: true
    }
},
{
    $group: {
        _id: {
            gender: "$gender",
            age: "$age"
        },
        count: {
            $sum: 1
        }
    }
},
{
    $project: {
        _id: 0,
        type: "$_id",
        total: "$count"
    }
});
```

Como véis estamos filtrando los documentos mostrando solo aquellos cuyo
campo *isActive* es *true*. Luego estamos agrupando por *gender* y *age*,
y además, calculando el total de cada rango. Es decir que estamos
calculando cuántas personas del género femenino tienen 32 años, cuántas
del género másculino tienen 18 y así sucesivamente. Para finalizar
estamos mostrando el conjunto de resultados que deseamos, que es el
campo *_id* renombrado a *type* y el campo *count* renombrado a *total*.


El resultado será similar a este.

```javascript
{
    "type": {
        "gender": "female",
        "age": 24
    },
    "total": 1
},
{
    "type": {
        "gender": "male",
        "age": 35
    },
    "total": 3
},
{
    "type": {
        "gender": "female",
        "age": 23
    },
    "total": 4
}
```

### Conclusiones

Como hemos visto en esta primera entrada práctica de nuestro tutorial de
**MongoDB**, **Aggregation Framework** nos proporciona una manera fácil
y sencilla de realizar consultas de agregación, al más puro estilo SQL.

Los operadores *$project, $match y $group*, nos permiten realizar
prácticamente las mismas operaciones que haríamos con una consulta
SELECT … GROUP BY. 

No obstante, aun nos quedan algunos pipelines por repasar como
son*$limit, $skip, $order* y el potente *$unwind*. Pero esto lo
dejaremos para la siguiente entrega.

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](http://charlascylon.com/tutorialmongo)*

