---
layout: post
title: Tutorial MongoDB. Operaciones de actualización de datos I
redirect_from:
  - /post/61794347245/tutorial-mongodb-operaciones-de-actualización-de.html
  - /post/61794347245/
---

En los anteriores capítulos de este **tutorial de MongoDB**, nos hemos
centrado en repasar la mayoría de las operaciones de lectura que podemos
realizar con esta base de datos **NoSQL**. Como todos sabéis una base de
datos es capaz de realizar cualquier
operación[CRUD](http://es.wikipedia.org/wiki/CRUD) (Create, Read,
Update, Delete), así que una vez entendida la parte del Read, nos queda
ver como insertar, modificar y borrar datos de nuestra sistema.\

Para que el tutorial sea más sencillo de seguir, vamos a dividir las
operaciones de modificación en dos capítulos. En este primer capítulo
veremos los comandos básicos para ejecutar operaciones de modificación.
En el siguiente mostraremos los operadores que podemos utilizar a la
hora de modificar datos.

### Inserción de datos

#### Insert

Para insertar documentos en nuestra base de datos, utilizaremos el
comando *insert*. La sintaxis es la que ya hemos utilizado anteriormente
con un *db*, seguido por el *nombre de la colección* y el comando a
ejecutar, que en este caso es *insert*. Veamos un ejemplo:\
\

```javascript
db.test.insert({ 
  _id:1,   
  nombre:"Pedro Ramírez",
  telefonos:["465465456","4545654"],
  direccion: 
  {
    calle:"C\ Este",
    numero:25,
    extra: "Portal 7, 4º izquierda",
    ciudad:"Madrid"
  }
})
```

\
Como se puede ver, la inserción es muy sencilla. Nos basta con pasar
como parámetro el documento *JSON* que queremos insertar. Si hacemos una
búsqueda en nuestra colección *test*, encontraremos un único documento,
que es el que acabamos de crear.\
\

```javascript
db.test.find().pretty();

{
    "_id": 1,
    "nombre": "Pedro Ramírez",
    "telefonos": [
        "465465456",
        "4545654"
    ],
    "direccion": {
        "calle": "C Este",
        "numero": 25,
        "extra": "Portal 7, 4º izquierda",
        "ciudad": "Madrid"
    }
}
```

Lo importante de la anterior consulta de inserción, es que hemos añadido
manualmente el campo *_id*. Esto es algo totalmente válido, siempre que
tengamos en cuenta que el *_id* es un campo único. Si tratamos de
ejecutar otra inserción, pero con el mismo *_id*, la **shell de
MongoDB** nos mostrará un error.


```javascript
db.test.insert({
    _id: 1,
    nombre: "Ramón Ramírez",
    telefonos: [
        "465465456"
    ],
    direccion: {
        calle: "C\ Este",
        numero: 26,
        extra: "Portal 8, 4º izquierda",
        ciudad: "Madrid"
    }
})

E11000duplicatekeyerrorindex: test.test.$_id_dupkey: {
    : 1.0
}
```


**MongoDB** crea siempre un índice único para el campo *_id* que existe
en todas las colecciones y en todos los documentos. Si no tenemos
necesidad de que el campo *_id* tenga un formato especial, lo más
sencillo es dejar que **MongoDB** lo genere automáticamente para cada
inserción. Para ello deberemos ignorar el campo *_id* y no introducirlo
junto con el documento *JSON* que estamos insertando.


```javascript
db.test.insert({
    nombre: "Ramón Ramírez",
    telefonos: [
        "465465456"
    ],
    direccion: {
        calle: "C\ Este",
        numero: 26,
        extra: "Portal 8, 4º izquierda",
        ciudad: "Madrid"
    }
})
```

Tras ejecutar una búsqueda encontraremos los dos documentos insertados,
el segundo de ellos, con un campo *_id* autogenerado con ObjectId\

```javascript
db.test.find().pretty()

{
    "_id": 1,
    "nombre": "Pedro Ramírez",
    "telefonos": [
        "465465456",
        "4545654"
    ],
    "direccion": {
        "calle": "C Este",
        "numero": 25,
        "extra": "Portal 7, 4º izquierda",
        "ciudad": "Madrid"
    }
}

{
    "_id": ObjectId("51e63d2c403754f2073712cf"),
    "nombre": "Ramón Ramírez",
    "telefonos": [
        "465465456"
    ],
    "direccion": {
        "calle": "C Este",
        "numero": 26,
        "extra": "Portal 8, 4º izquierda",
        "ciudad": "Madrid"
    }
}
```

Otra opción interesante del comando *insert*, es que permite insertar
varios documentos *JSON* en una misma inserción. Para ello deberemos
pasar como parámetro un array de documentos en lugar de un solo
documento.

```javascript
db.products.insert([
    {
        nombre: "Portátil Asus",
        cantidad: 25,
        precio: 459.99
    },
    {
        nombre: "Portátil HP",
        cantidad: 1,
        precio: 765.50
    }
])
```


Tras ejecutar una búsqueda en la colección *products*, vemos que los dos
documentos se han insertado sin problemas.

```javascript
db.products.find().pretty()

{
    "_id": ObjectId("51e63e49403754f2073712d0"),
    "nombre": "Portátil Asus",
    "cantidad": 25,
    "precio": 459.99
}

{
    "_id": ObjectId("51e63e49403754f2073712d1"),
    "nombre": "Portátil HP",
    "cantidad": 1,
    "precio": 765.5
}
```

#### Save

Para insertar documentos también podemos utilizar el comando *save*, que
se utiliza de la misma manera que *insert*.

```javascript
db.products.save({
    _id: 890,
    nombre: "Portátil Lenovo",
    cantidad: 7,
    precio: 800
})
```

Al igual que con insert, si no especificamos el campo *_id*,
**MongoDB** lo insertará automáticamente. Aquí tenemos el resultado de la
búsqueda.


```javascript
db.products.find().pretty()

{
    "_id": ObjectId("51e63e49403754f2073712d0"),
    "nombre": "Portátil Asus",
    "cantidad": 25,
    "precio": 459.99
}
{
    "_id": ObjectId("51e63e49403754f2073712d1"),
    "nombre": "Portátil HP",
    "cantidad": 1,
    "precio": 765.5
}
{
    "_id": 890,
    "nombre": "Portátil Lenovo",
    "cantidad": 7,
    "precio": 800
}
```

Supongo que ahora os habrá surgido la pregunta ¿qué diferencia hay entre
*insert* y *save*? ¿No es lo mismo? En realidad no, ya que con *save*, si
el *_id* que especificamos ya existe,  el documento será modificado.

```javascript
db.products.save({
    _id: 890,
    nombre: "Portátil Lenovo",
    cantidad: 25,
    precio: 750
})
```

El *_id 890* es el que habíamos utilizado para la inserción anterior,
por lo que al utilizar *save*, en lugar de devolvernos un error de clave
duplicada como haría el comando *insert*, el documento se actualiza con
los nuevos datos.

```javascript
db.products.find().pretty()

{
    "_id": ObjectId("51e63e49403754f2073712d0"),
    "nombre": "Portátil Asus",
    "cantidad": 25,
    "precio": 459.99
}
{
    "_id": ObjectId("51e63e49403754f2073712d1"),
    "nombre": "Portátil HP",
    "cantidad": 1,
    "precio": 765.5
}
{
    "_id": 890,
    "nombre": "Portátil Lenovo",
    "cantidad": 25,
    "precio": 750
}
```

### Eliminación de datos

Para eliminar datos de nuestra colección, utilizaremos el comando
*remove*. Este comando recibe como parámetro la consulta que se
utilizará para filtrar los documentos que se borrarán. Si no
especificamos ninguna consulta, se eliminarán todos los datos de la
colección. Como podéis ver el comportamiento es muy similar al de una
operación *DELETE* de una base de datos relacional. Si no especificamos
un filtro con la sentencia *WHERE* se borrarán todos los datos de la
tabla.

```javascript
db.products.remove({_id:890})
```

Si hacemos la consulta sobre productos, vemos que el documento con el
*_id 890* ya no existe.

```javascript
db.products.find().pretty()

{
    "_id": ObjectId("51e63e49403754f2073712d0"),
    "nombre": "Portátil Asus",
    "cantidad": 25,
    "precio": 459.99
}
{
    "_id": ObjectId("51e63e49403754f2073712d1"),
    "nombre": "Portátil HP",
    "cantidad": 1,
    "precio": 765.5
}
```

El comando *remove* acepta un segundo parámetro de tipo booleano llamado
*justOne*. Por defecto es *false*, pero si lo establecemos como *true*,
solo se borrará un documento de la colección, aunque existan varios que
cumplan las condiciones especificadas en la consulta.

### Actualización de datos

Para actualizar datos, utilizaremos el comando *update*. Este comando,
en su forma básica, recibe dos parámetros: uno con la consulta para
filtrar los documentos a modificar y otro con los elementos que se
modificarán. En definitiva un parámetro con el *WHERE* y un parámetro con
el *SET* de una sentencia *UPDATE* relacional.

Primero para nuestras pruebas, vamos a introducir algún elemento más en
nuestra colección de productos.


```javascript
db.products.insert([
    {
        nombre: "HDD Seagate",
        cantidad: 45,
        precio: 79.99,
        tipo: "HDD"
    },
    {
        nombre: "HDD Maxtor",
        cantidad: 20,
        precio: 65.50,
        tipo: "HDD"
    }
])   
```

```javascript
db.products.find().pretty()

{
    "_id": ObjectId("51e64cd2403754f2073712d9"),
    "nombre": "HDD Seagate",
    "cantidad": 45,
    "precio": 79.99,
    "tipo": "HDD"
}
{
    "_id": ObjectId("51e64cd2403754f2073712da"),
    "nombre": "HDD Maxtor",
    "cantidad": 20,
    "precio": 65.5,
    "tipo": "HDD"
}
{
    "_id": ObjectId("51e64d83403754f2073712db"),
    "nombre": "Portátil Asus",
    "cantidad": 25,
    "precio": 459.99
}
{
    "_id": ObjectId("51e64d83403754f2073712dc"),
    "nombre": "Portátil HP",
    "cantidad": 1,
    "precio": 765.5
}
```

Y ahora vamos a probar el comando *update*. Por ejemplo, si queremos
actualizar la cantidad de *“HDD Maxtor”* a 30 utilizaríamos la siguiente
consulta. Ya os aviso de que la consulta tiene trampa

```javascript
db.products.update({nombre:"HDD Maxtor"},{cantidad:30}) 
```

Y si ahora hacemos una búsqueda, nos encontramos una sorpresa


```javascript
db.products.find().pretty()

{
    "_id": ObjectId("51e64cd2403754f2073712d9"),
    "nombre": "HDD Seagate",
    "cantidad": 45,
    "precio": 79.99,
    "tipo": "HDD"
}
{
    "_id": ObjectId("51e64cd2403754f2073712da"),
    "cantidad": 30
}
{
    "_id": ObjectId("51e64d83403754f2073712db"),
    "nombre": "Portátil Asus",
    "cantidad": 25,
    "precio": 459.99
}
{
    "_id": ObjectId("51e64d83403754f2073712dc"),
    "nombre": "Portátil HP",
    "cantidad": 1,
    "precio": 765.5
}
```


En el parámetro con los elementos a modificar solo hemos especificado el
campo cantidad y **MongoDB** ha actualizado el documento dejando solo ese
campo. El documento siempre se cambia por el documento *JSON* que pasamos
como parámetro. Para realizar la operación tendremos que incluir un
documento con  todos los datos, pero cambiando los que queramos
actualizar.

```javascript
db.products.update({
    _id: ObjectId("51e64cd2403754f2073712da")
},
{
    nombre: "HDD Maxtor",
    cantidad: 30,
    precio: 65.5,
    tipo: "HDD"
})
```

Ahora hemos filtrado por *_id* ya que el campo nombre había sido
eliminado tras la anterior actualización, y hemos añadido todos los
campos que debe incluir el documento. Si hacemos la búsqueda veremos que
ahora obtenemos los resultados esperados.


```javascript
db.products.find().pretty()

{
    "_id": ObjectId("51e64cd2403754f2073712d9"),
    "nombre": "HDD Seagate",
    "cantidad": 45,
    "precio": 79.99,
    "tipo": "HDD"
}
{
    "_id": ObjectId("51e64cd2403754f2073712da"),
    "nombre": "HDD Maxtor",
    "cantidad": 30,
    "precio": 65.5,
    "tipo": "HDD"
}
{
    "_id": ObjectId("51e64d83403754f2073712db"),
    "nombre": "Portátil Asus",
    "cantidad": 25,
    "precio": 459.99
}
{
    "_id": ObjectId("51e64d83403754f2073712dc"),
    "nombre": "Portátil HP",
    "cantidad": 1,
    "precio": 765.5
}
```


Está claro que especificar todos los campos cuándo solo queremos
modificar uno de ellos es bastante molesto, por eso entra en escena el
operador *$set*. Este operador nos permite modificar (o crear si no
existe) uno o varios campos sin tener que introducir el documento
*JSON* completo.

```javascript
db.products.update({
    _id: ObjectId("51e64cd2403754f2073712da")
},
{
    $set: {
        cantidad: 35,
        precio: 60
    }
})
```

#### Opción multi

En las consultas anteriores el filtro devolvía un solo documento. Vamos
a hacer una que devuelva y actualice varios documentos.

```javascript
db.products.update({tipo:"HDD"},{$set:{cantidad:0}})
```


Esta consulta busca los productos de tipo “HDD” y actualiza su cantidad
a 0. Si hacemos un find veremos algo raro.

```javascript
db.products.find().pretty()

{
    "_id": ObjectId("51e64cd2403754f2073712d9"),
    "nombre": "HDD Seagate",
    "cantidad": 0,
    "precio": 79.99,
    "tipo": "HDD"
}
{
    "_id": ObjectId("51e64cd2403754f2073712da"),
    "nombre": "HDD Maxtor",
    "cantidad": 35,
    "precio": 60,
    "tipo": "HDD"
}
{
    "_id": ObjectId("51e64d83403754f2073712db"),
    "nombre": "Portátil Asus",
    "cantidad": 25,
    "precio": 459.99
}
{
    "_id": ObjectId("51e64d83403754f2073712dc"),
    "nombre": "Portátil HP",
    "cantidad": 1,
    "precio": 765.5
}
```

Y lo raro que podemos ver es que de los dos documentos de tipo *“HDD”*,
**MongoDB** solo ha actualizado uno de ellos. Por defecto
**MongoDB** solo actualiza un documento a no ser que le indiquemos lo
contrario. Es una manera de evitar errores. Para actualizar todos
deberemos usar la opción multi que debe incluirse como tercer
parámetro.

```javascript
> db.products.update({tipo:"HDD"},{$set:{cantidad:10}},{multi:true})
```

Y si hacemos la consulta, vemos los documentos correctamente
actualizados.

```javascript
db.products.find().pretty()

{
    "_id": ObjectId("51e64cd2403754f2073712d9"),
    "nombre": "HDD Seagate",
    "cantidad": 10,
    "precio": 79.99,
    "tipo": "HDD"
}
{
    "_id": ObjectId("51e64cd2403754f2073712da"),
    "nombre": "HDD Maxtor",
    "cantidad": 10,
    "precio": 60,
    "tipo": "HDD"
}
{
    "_id": ObjectId("51e64d83403754f2073712db"),
    "nombre": "Portátil Asus",
    "cantidad": 25,
    "precio": 459.99
}
{
    "_id": ObjectId("51e64d83403754f2073712dc"),
    "nombre": "Portátil HP",
    "cantidad": 1,
    "precio": 765.5
}
```

#### Opción upsert

Además de la opción multi, tenemos disponible la opción *upsert*, que lo
que hace es insertar el documento si este no existe. Es bastante
parecido al comando *save* que hemos visto en las operaciones de
inserción En este caso se comprueba toda la consulta en lugar de solo el
*_id*. Por ejemplo la consulta siguiente buscará elementos de tipo
*“RAM”*, pero al no existir ninguno insertará un nuevo documento.

```javascript
db.products.update({
    tipo: "RAM"
},
{
    nombre: "Kingston 2Gb",
    cantidad: 50,
    precio: 26.50,
    tipo: "RAM"
},
{
    upsert: true
})
```

Si volvemos a ejecutar la consulta, cambiando *“2Gb*” por *“4Gb”*, el
documento se actualizará ya que tras ejecutar la anterior consulta ya
existe un documento del tipo *“RAM”*.


```javascript
db.products.update({
    tipo: "RAM"
},
{
    nombre: "Kingston 4Gb",
    cantidad: 50,
    precio: 26.50,
    tipo: "RAM"
},
{
    upsert: true
})
```

### Conclusión

Como hemos podido ver las operaciones de inserción, modificación o
borrado son bastante sencillas. Parte de la modificación de datos
implica realizar los filtros correctos, cosa que podemos realizar
utilizando lo aprendido en las entradas de operaciones de consulta.

Para la siguiente entrada veremos como actualizar arrays o
subdocumentos. No os lo perdáis 

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*

