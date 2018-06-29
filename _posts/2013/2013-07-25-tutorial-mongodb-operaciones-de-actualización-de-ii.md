---
layout: post
title: Tutorial MongoDB. Operaciones de actualización de datos II
redirect_from:
  - /post/61794348269/tutorial-mongodb-operaciones-de-actualización-de.html
  - /post/61794348269/
---

[En la pasada entrada](https://www.charlascylon.com/2013-07-18-tutorial-mongodb-operaciones-de-actualización-de), vimos como podíamos realizar operaciones que insertaran, borraran o modificaran documentos en **MongoDB**. Para ello utilizabamos comandos como _insert, save, update o remove_, pero con consultas sencillas y sin entrar en modificación de _arrays_ o _subdocumentos_. Así que en esta entrada nos vamos a centrar en la realización de acciones de ese tipo, que lógicamente son muy comunes.

## Operadores $set y $unset

Ya vimos en la anterior entrada, que para actualizar o añadir un campo a un documento existente, debemos utilizar el comando _$set_.

     db.products.update({
      _id: ObjectId("51e6681a2b7e6dab80c1ebd6")},
      {
        $set:{cantidad:52,
              descripcion:"Disco duro de alta densidad"
              }
      })

En la anterior consulta, nos valemos de _$set_ para modificar el documento con __id 51e6681a2b7e6dab80c1ebd6_. En ese documento actualizamos el campo cantidad y añadimos un nuevo campo, que todavía no existe, llamado _descripción_. El documento resultante es el siguiente.

    { 
      "_id": ObjectId("51e6681a2b7e6dab80c1ebd6"),
      "cantidad" : 52,
      "descripcion" : "Disco duro de alta densidad",
      "nombre" : "Kingston 4Gb",
      "precio" : 26.5,
      "tipo" : "RAM"<br>
    }

Si queremos eliminar un campo de un documento, deberemos hacer una consulta similar, pero utilizando _$unset_.

     db.products.update(
      { _id: ObjectId("51e6681a2b7e6dab80c1ebd6")},
      {
        $unset:{descripcion:1}
      })

La consulta es bastante similar a la que utilizabamos antes, pero en este caso _$unset_ recibe como parámetro el nombre del campo y un 1 indicando que este campo debe eliminarse del documento. Si ejecutamos un _find_ para ver el resultado, encontramos que el campo descripción ya no existe.

    {
      "_id": ObjectId("51e6681a2b7e6dab80c1ebd6"),
      "cantidad": 52,
      "nombre" : "Kingston 4Gb",
      "precio" : 26.5,
      "tipo" : "RAM"
    }

## Actualización de arrays y subdocumentos con Dot Notation

Actualizar datos simples es sencillo, pero la cosa puede complicarse cuando queremos actualizar arrays con varios elementos o subdocumentos con varios campos. Vamos a insertar un nuevo producto para hacer algunas pruebas.

     db.products.insert(
    	{
    		nombre : " Placa Base Asus",
    		cantidad : 10,
    		precio : 78.25,
    		tipo : "PLACA",
    		caracteristicas : ["PCI-E", "USB 3.0", "AMD socket"],
    		extrainfo :
    		{
    			fabricante : "Asus ltd.",
    			anoSalida : 2013,
    			manual : "user-guide.pdf",
    			drivers : ["XP", "W7", "W8" "Linux"]
    		}
    }
    )/code>

`  

Una vez tenemos un documento de ejemplo, vamos a realizar algunas operaciones con él. Lo primero que vamos a probar es a modificar el array de características. Imaginemos que queremos cambiar ese _"AMD socket"_ por _"Intel Socket"_ con **Dot Notation**.

     db.products.update(
      {tipo:"PLACA"}, 
      {$set:{"caracteristicas.2":"IntelSocket"}}
    )

En este caso volvemos a usar _$set_ para modificar un campo en concreto, solo que esta vez le decimos que queremos modificar el campo _"caracteristicas.2"_. Si recordáis el post sobre consultas avanzadas, de esta manera le estamos diciendo a **MongoDB** que queremos actualizar el elemento 2 del array de características. Los arrays empiezan con el índice 0, por lo que estamos modificando el tercer valor de dicho array. Si ese valor no existe, será añadido al array. Hay que tener cuidado con la posición del array utilizada, porque si añadimos un elemento a un índice cuyos valores anteriores no existen, esos valores serán rellenados con valores nulos. Por ejemplo, en la siguiente consulta añadimos un valor en la posición 5 del array, pero como no hay elementos en las posiciones 3 y 4 se rellenan con valores nulos.

     db.products.update({tipo:"PLACA"}, {$set:{"caracteristicas.5":"Ethernet"}})

    {
            "_id" : ObjectId("51ef8531f62f3dac9e75f13e"),
            "cantidad" : 10,
            "caracteristicas" : [
                    "PCI-E",
                    "USB 3.0",
                    "Intel Socket",
                    null,
                    null,
                    "Ethernet"
            ],
            "extrainfo" : {
                    "fabricante" : "Asus ltd.",
                    "anoSalida" : 2013,
                    "manual" : "user-guide.pdf",
                    "drivers" : [
                            "XP",
                            "W7",
                            "W8",
                            "Linux"
                    ]
            },
            "nombre" : " Placa Base Asus",
            "precio" : 78.25,
            "tipo" : "PLACA"
    }

Si desconocemos la posición del elemento a modificar, pero sabemos que valor tiene, podemos utilizar **Dot Notation** con el operador _$_.

     db.products.update(
     {
    	tipo : "PLACA",
    	caracteristicas : "Intel Socket"
     }, {
    	$set : {
    		"caracteristicas.$" : "Intel Haswell Socket"
    	}
     })

Con el operador _$_ le decimos a **MongoDB** que tiene que actualizar el elemento del array que cumpla la condición de la query (_caracteristicas:"Intel Socket"_). Cuando usamos _$_ es obligatorio que el campo que lo usa (en este caso características) esté en la query. Si no es así la **Shell** de <span style="font-weight: bold;">MongoDB</span> nos devolverá un error. En el ejemplo estamos cambiando el elemento caracteristicas:_"Intel Socket"_ por _"Intel Haswell Socket"_.

Si bien podemos actualizar arrays con **Dot Notation**, veremos en el siguiente apartado que hay algunos operadores que pueden facilitarnos la tarea. **Dot Notation** se usa de forma más intuitiva cuándo queremos actualizar subdocumentos.

     db.products.update(
    {
    	tipo : "PLACA"
    }, {
    	$set : {
    		"extrainfo.manual" : "admin-guide.pdf"
    	}
    }
    ) 

Las operaciones que podemos realizar sobre subdocumentos son similares a las que hemos descrito con los arrays.

## Actualización de arrays con operadores

Si queremos añadir un valor a un campo array de un documento existente, podemos utilizar el operador _$addToSet_. Este operador añade el valor que le pasamos como parámetro justo al final del array. Si el campo ya existe, el valor no se añade.

     db.products.update(
      {
        tipo : "PLACA"
      }, {
        $addToSet : {
          caracteristicas : "WIFI"
        }
      }
    )

Si volvemos a ejecutar el comando, veremos que no se añaden nuevos valores _"WIFI"_, ya que el valor ya existe en el array. Si queremos añadir varios elementos en un mismo comando, tendremos que añadir el operador _$each_ y un array de elementos justo después del operador _$addToSet_.

       db.products.update(
        {
            tipo : "PLACA"
        },
        {
            $addToSet :
            {
                caracteristicas :
                {
                    $each : ["WIFI", "Chipset"]
                }
            }
        }
      )  

Otra opción para añadir elementos a un array es usar el operador _$push_. Este comando es exactamente igual que _$addToSet_, con la diferencia de que, en este caso, el elemento siempre se añade, exista o no.

     db.products.update(
    	{
    		tipo : "PLACA"
    	},
    	{
    		$push :
    		{
    			caracteristicas : "Audio 5.1"
    		}
    	}
      )  

Si ejecutamos el anterior comando y luego un _find_, veremos que el elemento se añade tantas veces como lo hayamos ejecutado.

**Desde la versión 2.4 de MongoDB**, _$push_ también permite el uso de _$each_, así que como hacíamos con _$addToSet_ podemos escribir el siguiente comando que añadirá dos elementos al array, existan o no.

      db.products.update(
    	{
    		tipo : "PLACA"
    	},
    	{
    		$push :
    		{
    			caracteristicas :
    			{
    				$each : ["Audio 3.0", "Audio 6.0"]
    			}
    		}
    	}
    	) 

Si lo que queremos es eliminar elementos de un array, también tenemos distintas opciones. Una de ellas es el operador _$pop_, que elimina el primer o último elemento de un array.

     db.products.update(
    	{
    		tipo : "PLACA"
    	},
    	{
    		$pop :
    		{
    			caracteristicas : 1
    		}
    	}
    )

Si al operador _$pop_ le pasamos un 1, borrará el último elemento del array. Si le pasamos un -1, eliminará el primer elemento del array. Pero ¿y si queremos borrar un elemento en concreto sin saber su posición?. Para eso utilizaremos el operador _$pull_.

      db.products.update(
    	{
    		tipo : "PLACA"
    	},
    	{
    		$pull :
    		{
    			caracteristicas : "Chipset"
    		}
    	}
    ) 

Este comando realiza una consulta sobre el array, borrando todos los elementos del mismo que la cumplan. En el ejemplo anterior hemos borrado todos los elementos _"Chipset"_.

Si lo que necesitamos es borrar varios elementos de un array, realizaremos una acción similar, pero utilizando el comando _$pullAll_.

      db.products.update(
    	{
    		tipo : "PLACA"
    	},
    	{
    		$pullAll :
    		{
    			caracteristicas : ["Audio 5.1", "Ethernet"]
    		}
    	}
    ) 

## Otras operaciones de actualización

Para finalizar, vamos a hablar de dos operadores que nos pueden ser útiles a la hora de realizar actualizaciones.

Una operación habitual es la de incrementar un valor numérico en una determinada cantidad.  Imaginemos que nos llegan 5 placas base Asus nuevas y queremos aumentar la cantidad en la base de datos. Podríamos realizar una consulta a la base de datos, recuperar la cantidad existente, incrementarla y realizar una actualización. Pero no hace falta complicarse tanto ya que es mucho más sencillo utilizar el operador _$inc_.

       db.products.update(
    	{
    		nombre : "Placa Base Asus"
    	},
    	{
    		$inc :
    		{
    			cantidad : 5
    		}
    	}
    ) 

El comando agrega 5 unidades más al campo cantidad. Por ejemplo si hay 10 a la hora de actualizar, pasarán a ser 15\. Si utilizamos un valor negativo, se restarán las unidades.

También puede ser que nos equivoquemos a la hora de crear un campo, y el nombre que establezcamos sea incorrecto. Podríamos borrarlo y volverlo a crear, pero es  algo que consumiría recursos de forma innecesaria. Para cambiar el nombre de un campo deberemos utilizar el comando _$rename_.

      db.products.update(
    	{
    		nombre : "Placa Base Asus"
    	},
    	{
    		$rename :
    		{
    			extrainfo : "masinfo"
    		}
    	}
    ) 

## Conclusión

En esta nueva entrega de nuestro tutorial, hemos recorrido la mayoría de los comandos disponibles para actualizar documentos en nuestra **base de datos NoSQL**. Con todo lo visto en esta entrega y las anteriores, podremos enfrentarnos en el día a día a una base de datos **MongoDB**. Podremos realizar consultas, inserciones, borrados o modificaciones para garantizar que nuestras aplicaciones funcionan correctamente.

Sin embargo hay operaciones que todavía no sabemos como llevar a cabo. Por ejemplo a la hora de realizar informes de explotación, suele ser importante realizar operaciones de agregación como agrupar datos, contar, sumar para calcular totales etc. Esas y otras cosas las veremos en las siguientes entregas. Aquí nos vemos.

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*