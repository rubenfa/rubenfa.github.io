---
layout: post
title: Tutorial MongoDB. Operaciones de consulta.
redirect_from:
  - /post/61794340001/tutorial-mongodb-operaciones-de-consulta.html
---

[En la anterior
entrega](http://www.charlascylon.com/post/61794337102/tutorial-mongodb-instalación-y-configuración)
de nuestro **tutorial de MongoDB**, veíamos como arrancar el proceso
*mongod*, como configurarlo y cómo conectarnos a la consola. Así que una
vez tenemos preparado el entorno, vamos a empezar a realizar consultas.

### Tipos de datos utilizados en MongoDB

Ya hemos visto que **MongoDB**guarda los datos utilizando **JSON**. En
realidad los datos se guardan en **BSON**(una representación binaria de
JSON), pero como nosotros vamos a realizar consultas y manipular los
datos con JSON, será en lo que nos centremos.

**MongoDB**, a través de JSON, puede utilizar los siguientes tipos:

-   String: guardados en UTF-8. Van siempre entre dobles comillas.
-   Number: números. Al guardarse en BSON pueden ser de tipo  byte,
    int32, in64 o double.
-   Boolean: con valor true o false.
-   Array: van entre corchetes [] y pueden contener de 1 a N elementos,
    que pueden ser de cualquiera de los otros tipos.
-   Documentos: un documento en formato JSON puede contener otros
    documentos embebidos que incluyan más documentos o cualquiera de los
    tipos anteriormente descritos.
-   Null.

Así que un documento completo puede tener el siguiente formato:

```javascript
{
    "People": 
        [
            {
                "_id": ObjectId("51c420ba77edcdc3ec709218"),
                "nombre": "Manuel",
                "apellidos": "Pérez",
                "fecha_nacimiento": "1982-03-03",
                "altura": 1.80,
                "activo": true,
                "intereses":["fútbol","tenis"],
                "tarjeta_credito": null,
                "dni": 
                    {
                        "numero":"465464646J",
                        "caducidad":"2013-10-21"
                    }
            },
            {
                "_id": ObjectId("51c420ba77ed1dc3ec705289"),
                "nombre": "Sara",
                "apellidos": "Ruano",
                "fecha_nacimiento": "1985-12-03",
                "altura": 1.65,
                "activo": false,
                "intereses":["moda","libros","fotografía","política"],
                "tarjeta_credito": null
            }
        ]
}
```

Como se puede ver en el ejemplo anterior, hemos utilizado prácticamente
todos los tipos que hemos descrito. Podéis ver también el campo especial
*\_id*,  creado con **ObjectId**. Este objeto, que es en realidad
tratado como un string, se crea automáticamente en todos los documentos
que insertemos en nuestra base de datos y tiene un valor único. Podemos
especificar nosotros el valor que queramos, pero deberemos tener en
cuenta que no puede haber dos documentos con el mismo *\_id*.

El campo *\_id*se crea automáticamente con la función ObjectId, pero
podemos insertar valores únicos generados con esta función en cualquier
campo de nuestro documento. Aquí vemos un ejemplo que hemos escrito en
la **shell**de **MongoDB**.

### Comandos útiles en la consola de MongoDB

Nada más conectarnos a la **consola o shell de MongoDB**, con el comando
*mongo*, tenemos disponibles muchas funciones que nos pueden ayudar a
recordar comandos o los parámetros que estos utilizan.

Por ejemplo si escribimos ***show dbs***, la consola nos mostrará las
bases de datos existentes y el espacio que están consumiendo. Con el
comando ***use nombredb***, podremos establecer el contexto para que a
partir de entonces todas las consultas realizadas se hagan sobre dicha
base de datos. Una vez estemos en dicho contexto podemos escribir el
comando ***show collections***, que nos mostrará las colecciones
existentes en la base de datos que estamos utilizando.

También tenemos los comandos de ayuda. Si escribimos ***help***veremos
una lista de comandos generales que podemos utilizar en la consola. Con
el comando ***db.help()*** veremos la ayuda de los comandos aplicables a
la base de datos . Con el comando***db.nombrecoleccion.help()***,
podremos ver los comandos aplicables a una colección en concreto.

### Consultas

Ahora que tenemos controlados los tipos de datos que podemos usar con
**MongoDB**, que sabemos los comandos básicos que tiene la consola, y
que sabemos manejarnos con la ayuda, vamos a ver como realizar
consultas.

Lo primero que vamos a hacer es**importar datos** para realizar las
consultas, ya que ahora mismo, nuestra base de datos está vacía.

Para importar datos utilizaremos el comando
[mongoimport](http://docs.mongodb.org/manual/reference/program/mongoimport/).
Este comando es capaz de importar datos en distintos formatos a nuestra
base de datos. Nosotros utilizaremos un archivo JSON, [que podéis
descargar de
aquí](https://skydrive.live.com/download?resid=1F8D7C58B1FC74AE!1171&authkey=!ACXsbC94anVewC0 "archivo JSON de ejemplo").
Una vez tengamos descargado el archivo, podremos importarlo a nuestra
base de datos con el siguiente comando.

```
./mongoimport --host localhost --port 27666 --db test --collection people --file data.json --jsonArray
```

Con este comando, lo que haremos será incorporar los datos a nuestro
servidor, que está en el puerto 27666, concretamente a una base de datos
llamada ***test*** y a una colección que hemos llamado ***people***.

Una vez hemos importado los datos, ya estamos listos para realizar
consultas. Nos conectaremos al servidor con el comando *mongo*, y nos
situaremos en la base de datos que se llama test.

```
PS C:> mongo localhost:27666 
MongoDB shell version: 2.4.4 
connecting to: localhost:27666/test 
> use test 
switched to db test 
>
```

Para realizar consultas a la base de datos, deberemos usar el comando
d*b.nombre\_de\_coleccion.find()*. Este comando puede recibir dos
parámetros: una consulta y una proyección. Ambos comandos son opcionales
por lo que si ejecutamos el comando:

```javascript
 db.people.find()
```

Obtendremos una larga lista con los primeros 20 elementos de la
colección. Digo primeros, porque **MongoDB**no muestra todos los
elementos. Para la consulta **MongoDB**crea un cursor. Es algo que
explicaremos en próximas entradas. Si queréis mostrar más documentos
deberéis escribir *it.*

De todas formas al ejecutar el comando podemos ver que el resultado no
está demasiado formateado, por lo que es muy difícil leerlo. Para
solucionar este problema podemos usar el modificador ***pretty***que nos
devolverá un resultado mucho más legible.

```javascript
db.people.find().pretty()
```

Ahora vamos a añadir la consulta al comando ***find***, para que filtre
los elementos según nuestras necesidades. Para ello especificaremos un
objeto **JSON**como primer parámetro del comando, con los campo por los
que queremos filtrar:

```javascript
db.people.find(
    {age:34}
  ).pretty()
```

Con ese comando obtendremos las personas cuya edad es de 34 años.
Podemos añadir tantos filtros como queramos.

```javascript
db.people.find(
    {age:34,isActive:true}
  ).pretty()
```

En este caso filtramos por *age*y por *isActive*.

Como veis los resultados nos muestran todos los campos de cada elemento.
Es como si hubiésemos utilizado el asterisco en una consulta *SELECT*.
Si queremos seleccionar solo algunos de los campos, deberemos utilizar
el segundo parámetro de la consulta find para **definir una
proyección**.

```
 db.people.find(
    {age:34,isActive:true},
    {name:1,age:1,isActive:1}
  ).pretty()
```

Que nos devuelve solo los campos que queremos … además de el *\_id*. El
*\_id*por defecto se muestra siempre, así que si queremos ocultarlo hay
que especificarlo en la proyección.

```javascript
db.people.find(
    {age:34,isActive:true},
    {name:1,age:1,isActive:1,_id:0}
  ).pretty()
```

Si queremos mostrar todos los campos, pero quitando solo algunos, lo que
haremos será desactivar los no deseados en la proyección:

```javascript
 db.people.find(
    {age:34,isActive:true},
    {name:0,age:0,isActive:0,_id:0}
  ).pretty()
```

### Comando findOne

El comando ***findOne***tiene el mismo funcionamiento que el comando
***find***, con la diferencia de que si el comando encuentra más de un
resultado que cumpla las condiciones de la consulta, tan solo nos
devolverá el primero.

```javascript
db.people.findOne(
    {age:34,isActive:true},
    {name:0,age:0,isActive:0,_id:0}
  )
```

Además findOne no acepta ***pretty***, pero ya devuelve el resultado
formateado.

### Aclaración acerca de las comillas dobles en los identificadores.

Si habéis realizado alguna consulta de prueba siguiendo las indicaciones
de este capítulo, probablemente os habréis percatado de que
**MongoDB**guarda los elementos con comillas dobles en el identificador.
Es decir que **MongoDB** guarda las duplas *“name”:“Helen”* o
*“age”:34*. En las consultas, en cambio, no he especificado dichas
comillas. Esto es porque el motor JavaScript de **MongoDB**se encarga de
añadirlas. Esto nos facilita la escritura de consultas, ya que no son
obligatorias. De hecho, la siguiente consulta, funcionará perfectamente:

```
db.people.findOne(
    {“age”:34,”isActive”:true},
    {“name”:0,”age”:0,”isActive”:0,”_id”:0}  
```

### Conclusión

Realizar consultas sencillas **con la shell o consola de MongoDB**es
bastante simple y no tiene demasiadas complicaciones. Pero nos hemos
dejado varias cosas en el tintero. Por ejemplo ¿cómo selecciono los
documentos cuyo campo age sea menor o igual a 34? ¿Cómo busco dentro de
arrays de elementos?

Estas son cosas que explicaremos en la siguiente entrada sobre consultas
avanzadas en **MongoDB**.

* * * * *

* * * * *

*¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me
gusta en Facebook o de publicarlo en Twitter. ¡ Gracias !\
*

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde
aquí.](http://www.charlascylon.com/p/tutorial-mongodb.html)*

¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog?
Suscríbete [por correo
electrónico](http://feedpress.it/e/mailverify?feed_id=charlascylon&loc=es)
o [por RSS](feed://www.charlascylon.com/feed.xml).*[\
](http://www.charlascylon.com/p/tutorial-mongodb.html)*

