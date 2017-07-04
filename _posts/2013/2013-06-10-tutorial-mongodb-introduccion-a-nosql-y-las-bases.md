---
layout: post
title: Tutorial MongoDB. Introducción a NoSQL y las bases de datos documentales.
redirect_from:
  - /post/61794334554/tutorial-mongodb-introducción-a-nosql-y-las-bases.html
  - /post/61794334554/
---

Seguramente hayas oído hablar de las bases de datos [NoSQL (Not Only
SQL)](http://es.wikipedia.org/wiki/NoSQL). Es algo que últimamente está
muy de moda en el mundo del desarrollo. Casi tanto como que las chicas
lleven shorts en verano o que la gente utilice cascos grandes para el
MP3.

Resumiendo las bases de datos NOSQL, difieren en varios puntos a las
bases de datos relacionales de toda la vida como son: que no usan SQL ya
que no son bases de datos relacionales, que no se necesitan estructuras
fijas (tablas, columnas etc.) y en general no soportan
[ACID](http://es.wikipedia.org/wiki/ACID).

Hay muchos tipos distintos de bases de datos NoSQL que que podríamos
agrupar distintos tipos: documentales, de grafo, de clave/valor,
multivalor, orientadas a objetos o tabulares. Y dentro de cada tipo
hay[muchas implementaciones distintas](http://nosql-database.org/) lo
cual es bueno (mucho dónde elegir) y malo (mucho dónde elegir).

En nuestro caso vamos a hablar de **bases de datos documentales**.
Aunque esta primera toma de contacto se centrará más en las bases de
datos documentales, lo haremos teniendo en cuenta que en el futuro
utilizaremos **[MongoDB](http://www.mongodb.org/)**.

MongoDB es un sistema [gestor de base de datos orientado a
documentos](http://es.wikipedia.org/wiki/Base_de_datos_documental). Lo
cuál quiere decir, en lenguaje de andar por casa, que lo que guardamos
en la base de datos son documentos. MongoDB guarda los documentos en
BSON, que no es más que una implementación binaria del conocido JSON.
Por tanto todos los documentos guardados en la base de datos se pueden
tratar como haríamos en JavaScript. De hecho, ya iremos viendo que para
realizar consultas, en la consola de MongoDB utilizaremos JavaScript.
Por ejemplo:

```javascript
{
    "Nombre":"Charlas con un Cylon",
    "Twitter":"@_rubenfa",
    "Lenguajes": [
        {
            "Nombre":"C#",
            "Entorno":".NET"
        },
        {
            "Nombre":"Visual Basic",
            "Entorno":".NET"
        }
    ]
}
'''

Los documentos se guardan en **colecciones**, que podrían asemejarse a
las tablas que conocemos de los sistemas relacionales. La diferencia
principal es que los documentos no tienen porque tener los mismos
campos. Puede que un documento tenga un campo que no existe en otro, e
incluso los tipos de datos pueden ser diferentes. Por ejemplo que en la
colección ***Personas***, existan estos dos documentos, es totalmente
válido:

'''javascript
{
    "Nombre":"Perico",
    "Apellidos":"De los palotes"
    "DNI":"787978J"
},
{
    "Nombre":"John",    
    "DNI":232333233,
    "Telefono":"+7889987987789798"    
}
'''

Como se puede ver,**no tenemos un esquema definido**, por lo que el
enfoque que utilizaremos con MongoDB es totalmente distinto al que
utilizaríamos con un RDBMS. Al no existir las relaciones directamente,
tenemos que pensar un poco en como vamos guardar los documentos para no
sobrecargar nuestra base de datos haciendo consultas demasiado grandes o
duplicando consultas.

Por ejemplo imaginando que tenemos una colección que se llama clientes y
otra que se llama pedidos podríamos tener tres implementaciones
totalmente diferentes.

### Una colección para pedidos y clientes.

'''javascript
{
    "Cliente":1233,
    "Nombre":"Pedro Ramírez",
    "Dirección":"Calle de la piruleta 14",
    "Pedidos":[
        {
            "id_pedido": 1,
            "Productos":
            [    
                {
                    "id_producto":1, 
                    "Nombre":"Pentium IV", 
                    "Fabricante":"Intel", 
                    "Cantidad":1
                },
                {
                    "id_producto":2, 
                    "Nombre":"Tablet 8 pulgadas", 
                    "Cantidad":1
                }
            ]            
        },
        {
            "id_pedido": 2,
            "Productos":
            [    
                {
                    "id_producto":77, 
                    "Nombre":"Impresora Láser", 
                    "Fabricante":"Canon", 
                    "Cantidad":3
                }                
            ]
        }    
    ]
}
'''

En este caso los pedidos están embebidos dentro de los datos del
cliente. Esto hará que realizar consultas Pedido-Cliente sea sencillo y
rápido. Lo malo es que el tamaño de los clientes crecerá según vaya
haciendo pedidos, cosa que puede ser desaconsejable en muchos casos.
Imaginad un cliente con 100.000 pedidos. La muerte.

### Dos colecciones: una para pedidos y otra para clientes

**Clientes**

'''javascript
{
    "Cliente":1233,
    "Nombre":"Pedro Ramirez",
    "Dirección":"Calle de la piruleta 14",
}
'''


**Pedidos**

'''javascript
{
    "id_pedido":1,
    "id_cliente":1233,
    "Productos":
            [    
                {
                    "id_producto":1, 
                    "Nombre":"Pentium IV", 
                    "Fabricante":"Intel", 
                    "Cantidad":1
                },
                {
                    "id_producto":2, 
                    "Nombre":"Tablet 8 pulgadas", 
                    "Cantidad":1
                }
            ]
},
{
    "id_pedido": 2,
    "id_cliente":1233,
    "Productos":
        [    
            {
                "id_producto":77, 
                "Nombre":"Impresora Láser", 
                "Fabricante":"Canon", 
                "Cantidad":3
            }                
        ]
}    
'''

Ahora los datos están más separados. Lo bueno es que la colección de
clientes será más fácil de manejar, pero lo malo es que en nuestra
aplicación deberemos controlar las relaciones. Para buscar los pedidos
de un cliente, primero tendremos que conocer el identificador del mismo,
por lo que quizá necesitemos realizar dos consultas.

### Dos colecciones con datos duplicados: una para clientes y otra para pedidos.


**Clientes**

'''javascript
{
    "Cliente":1233,
    "Nombre":"Pedro Ramirez",
    "Dirección":"Calle de la piruleta 14",
    "ultimo_pedido:" 
    {
        "id_pedido": 2,    
        "Productos":
        [    
            {
                "id_producto":77, 
                "Nombre":"Impresora Láser", 
                "Fabricante":"Canon", 
                "Cantidad":3
            }                
        ]

    }
}
'''

**Pedidos**

'''javascript
{
    "id_pedido":1,
    "id_cliente":1233,
    "Dirección":"Calle de la piruleta 14",
    "Productos":
            [    
                {
                    "id_producto":1, 
                    "Nombre":"Pentium IV", 
                    "Fabricante":"Intel", 
                    "Cantidad":1
                },
                {
                    "id_producto":2, 
                    "Nombre":"Tablet 8 pulgadas", 
                    "Cantidad":1
                }
            ]
},
{
    "id_pedido": 2,
    "id_cliente":1233,
    "Dirección":"Calle de la piruleta 14",
    "Productos":
        [    
            {
                "id_producto":77, 
                "Nombre":"Impresora Láser", 
                "Fabricante":"Canon", 
                "Cantidad":3
            }                
        ]
}    
'''


En este caso tendríamos mucho más fácil consultar el último pedido de un
cliente o saber la dirección a la que ha sido enviado un pedido sin
tener que hacer dos consultas. La parte mala, es que estamos duplicando
datos, ya que hay campos que existen en distintas colecciones.

En definitiva tenemos un sistema mucho más flexible. Como no hay
restricciones, la lógica principal para controlar la integridad de los
datos, recaerá en la aplicación. Esto choca frontalmente con el
pensamiento relacional al que solemos estar acostumbrados. De hecho, hay
que pensar que si nuestros datos son mayoritariamente relacionales, lo
mejor es utilizar una base de datos relacional clásica.

Y de momento lo dejamos aquí. En próximas entradas veremos como ejecutar
MongoDB y realizar consultas simples.



* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde
aquí.](http://charlascylon.com/tutorialmongo)*