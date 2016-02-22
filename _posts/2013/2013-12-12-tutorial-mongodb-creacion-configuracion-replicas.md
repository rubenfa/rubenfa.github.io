---
layout: post
title:  Tutorial MongoDB. Creación y configuración de conjuntos de réplicas
redirect_from:
  - /post/69774579592/tutorial-mongodb-creacion-configuracion-replicas.html
  - /post/69774579592/
---

La anterior entrega de este **tutorial de MongoDB**, explicaba de forma
teórica qué son las réplicas, para qué se utilizan y qué elementos las
componen. En esta entrada nos vamos a poner manos a la obra y vamos a
ver cómo podemos configurar un conjunto de réplicas que garantice que
nuestros datos estan siempre disponibles. 

 Para que la cosa no sea demasiado complicada, nuestro conjunto de
réplicas estará formado por tres servidores. Lo normal es que estos
servidores estén en distintas máquinas, con su propio procesador, su
propio disco duro y si propia RAM, pero como solo vamos a realizar
pruebas, lo que haremos será ejecutar tres instancias distintas de
**MongoDB**en nuestra propia máquina.

> **Nota**: para crear el conjunto de réplicas voy a partir del servidor
> de **MongoDB**que hemos estado utilizando para los ejemplos. Este
> servidor contiene datos, que puedes descargar de
> [aquí](https://skydrive.live.com/download?resid=1F8D7C58B1FC74AE%211168 "enlace a conjunto de datos de los ejemplos").
> Si todavía no sabes como importar estos datos a tu base de datos
> **MongoDB**tienes una pequeña guía de como hacerlo
> [aquí](http://www.charlascylon.com/post/61794340001/tutorial-mongodb-operaciones-de-consulta "enlace a entrada donde se explica el comando mongoimport").
> Si aún no tienes instalado
> **MongoDB**[aquí](http://www.charlascylon.com/post/61794337102/tutorial-mongodb-instalacion-y-configuracion "enlace a entrada de instalación de MongoDB")explico
> como puedes hacerlo.

### Convirtiendo nuestro servidor en miembro de un conjunto de réplicas

Vamos a partir de la idea de que ya tenemos un servidor con **MongoDB**.
Este servidor contiene los datos de nuestra aplicación y como el número
de usuarios está creciendo, queremos crear un sistema de alta
disponibilidad. 

 Bien, lo primero que debemos hacer es detener nuestra instancia de
**MongoDB**, porque tenemos que volver a iniciarla incluyendo las
opciones de replicación. Desde línea de comandos, y desde el directorio
en el que tenemos nuestros archivos de nuestra instancia **MongoDB**,
deberemos ejecutar el siguiente comando:

```
mongod --port 27666 --dbpath data --replSet rep1
```

 Como ya sabéis *mongod*es el nombre del proceso (y del ejecutable) que
hace de servidor de **MongoDB**. Con el primer parámetro indicamos el
puerto por el que nuestro servidor va a escuchar peticiones. Por defecto
**MongoDB** utiliza el 27017, pero en este caso lo he cambiado por algo
más sencillo de recordar. Tened en cuenta que vamos a ejecutar tres
instancias de **MongoDB** en la misma máquina, y que cada una de ellas
deberá escuchar por un puerto distinto.

Con el parámetro *dbpath*estamos indicando dónde están nuestros datos,
que en este caso están en un directorio llamado *data*, que está al
mismo nivel que *mongod*. Para finalizar el parámetro más importante,
*replSet*, que indica que estamos metiendo nuestro servidor en un
conjunto de réplicas que se llama *rep1*. 

 Al ejecutar el comando veréis que el servidor arranca. Si dejáis un
rato la ventana funcionando, se puede ver que no para de mostrarse el
siguiente mensaje

`[rsStart] replSet can't get local.system.replset config from self or any seed (EMPTYCONFIG)`

Esto es porque aunque hemos metido el servidor en un conjunto de
réplicas, no lo hemos inicializado. Para hacerlo conectamos a la shell
de **MongoDB**, con el típico comando **mongo localhost:27666** que
seguro que ya conocéis. Si no habéis leído las anteriores entradas del
tutorial, os recomiendo que os paséis por
[aquí](http://www.charlascylon.com/post/61794337102/tutorial-mongodb-instalacion-y-configuracion "Enlace a configuración de MongoDB")
para saber más sobre la consola.

 Una vez hemos conectado a la consola ejecutamos el
comando*rs.initiate()* que inicializará la réplica y generará la
configuración necesaria. Dependiendo de los datos que tenga el servidor,
puede tardar un poco, así que hay que ser pacientes. Cuando haya
terminado veréis que el prompt de la línea de comandos ha cambiado a
algo así como *rs1.PRIMARY *. Esto es para indicaros que estáis en el
servidor principal (y de momento único) del conjunto de réplicas
*rep1*.

 Para ver como ha quedado todo podemos ejecutar el comando *rs.conf(*)
que nos mostrará la configuración de la réplica.

```
{
         “_id” : “rep1”,
         “version” : 1,
         “members” : [
                 {
                         “_id” : 0,
                         “host” : “CYLON-MACHINE:27666”
                 }
         ]
 }
```

 En la configuración solo tenemos un miembro en nuestro conjunto de
réplicas, en el cual se indica el nombre del servidor y el puerto por el
que **MongoDB** está escuchando.

 Si lanzamos *rs.status()* veremos el estado de la máquina en el
conjunto de réplicas

```
{
         “set” : “rep1”,
         “date” : ISODate(“2013-12-10T10:42:29Z”),
         “myState” : 1,
         “members” : [
                 {
                         “_id” : 0,
                         “name” : “CYLON-MACHINE:27666”,
                         “health” : 1,
                         “state” : 1,
                         “stateStr” : “PRIMARY”,
                         “uptime” : 840,
                         “optime” : {
                                 “t” : 1386671943,
                                 “i” : 1
                         },
                         “optimeDate” : ISODate(“2013-12-10T10:39:03Z”),
                         “self” : true
                 }
         ],
         “ok” : 1
 }
```

 Ya véis que *rs.status* nos muestra un puñado de datos interesantes,
como el estado, el tiempo que ha estado el servidor funcionando, si es
el servidor principal o la versión actualizada de los datos.

 Vale, pues ya tenemos nuestro conjunto de réplicas configurado, pero si
no añadimos más miembros no va a servir de nada, así que vamos a ello.

### Añadiendo nuevos servidores al conjunto de réplicas

Para simular que tenemos varios servidores, basta con ejecutar distintas
instancias de *mongod*en nuestra máquina, pero lógicamente con distintos
puertos. Para usar distintas instancias habrá que tener varios
ejecutables *mongod*, cosa que podemos conseguir de forma sencilla
descargando los binarios de **MongoDB**y extrayéndolos en ubicaciones
distintas. Podéis copiar los ejecutables del servidor que ya está
funcionando o utilizar el archivo original que podéis descargar de la
página oficial de **MongoDB**..

 Una vez tengamos preparados los directorios de nuestros servidores,
bastará con configurarlos y arrancarlos añadiéndolos a una réplica como
hemos hecho con el servidor principal. En definitiva, en dos consolas
Powershell (una por cada servidor) ejecutaremos los siguientes
comandos:

` mongod --port 27667 --dbpath data --replSet rep1 mongod --port 27668 --dbpath data --replSet rep1`

 Así que si todo ha ido bien tendremos tres servidores corriendo en
nuestra máquina escuchando en los puertos 27666, 27667 y 27668. Eso sí, 
de momento solo uno de ellos está en un conjunto de réplicas, por lo que
tenemos que añadir los otros dos. Para ello nos conectamos a la shell
del servidor que ya está configurado (el que escucha por el puerto
27666) y lanzamoslos siguientes comandos:

` rep1:PRIMARY> rs.add("CYLON-MACHINE:27667") { "ok" : 1 }rep1:PRIMARY> rs.add("CYLON-MACHINE:27668") { "ok" : 1 }`

 Como véis añadir nuevos servidores a nuestro conjunto de réplicas es
muy sencillo. Si ahora lanzamos el comando *rs.conf()*, obtendremos los
siguientes datos:

```
{
         “_id” : “rep1”,
         “version” : 3,
         “members” : [
                 {
                         “_id” : 0,
                         “host” : “CYLON-MACHINE:27666”
                 },
                 {
                         “_id” : 1,
                         “host” : “CYLON-MACHINE:27667”
                 },
                 {
                         “_id” : 2,
                         “host” : “CYLON-MACHINE:27668”
                 }
         ]
 }
```

 Ahora ya podemos ver que tenemos tres servidores en nuestro conjunto de
réplicas. Si lanzamos un *rs.status()* obtendremos los siguientes datos:

```
{
         “set” : “rep1”,
         “date” : ISODate(“2013-12-11T21:33:19Z”),
         “myState” : 1,
         “members” : [
                 {
                         “_id” : 0,
                         “name” : “CYLON-MACHINE:27666”,
                         “health” : 1,
                         “state” : 1,
                         “stateStr” : “PRIMARY”,
                         “uptime” : 358,
                         “optime” : Timestamp(1386797270, 1),
                         “optimeDate” : ISODate(“2013-12-11T21:27:50Z”),
                         “self” : true
                 },
                 {
                         “_id” : 1,
                         “name” : “CYLON-MACHINE:27667”,
                         “health” : 1,
                         “state” : 2,
                         “stateStr” : “SECONDARY”,
                         “uptime” : 338,
                         “optime” : Timestamp(1386797270, 1),
                         “optimeDate” : ISODate(“2013-12-11T21:27:50Z”),
                         “lastHeartbeat” : ISODate(“2013-12-11T21:33:19Z”),
                         “lastHeartbeatRecv” : ISODate(“2013-12-11T21:33:19Z”),
                         “pingMs” : 1,
                         “syncingTo” : “CYLON-MACHINE:27666”
                 },
                 {
                         “_id” : 2,
                         “name” : “CYLON-MACHINE:27668”,
                         “health” : 1,
                         “state” : 2,
                         “stateStr” : “SECONDARY”,
                         “uptime” : 329,
                         “optime” : Timestamp(1386797270, 1),
                         “optimeDate” : ISODate(“2013-12-11T21:27:50Z”),
                         “lastHeartbeat” : ISODate(“2013-12-11T21:33:18Z”),
                         “lastHeartbeatRecv” : ISODate(“2013-12-11T21:33:18Z”),
                         “pingMs” : 0,
                         “syncingTo” : “CYLON-MACHINE:27666”
                 }
         ],
         “ok” : 1
 }
```

En el momento de extraer esos datos, la sincronización de los documentos
ya había terminado  y además todos los servidores estaban operativos. 

 Y con esto, y en un momentito, ya tenemos nuestro conjunto de réplicas
funcionando. Fácil ¿verdad?

### Conclusiones

Crear un conjunto de réplicas de **MongoDB** es muy sencillo. Con unos
cuántos comandos lo tendremos hecho, siempre que tengamos las cosas
claras. Ahora que sabemos como configurar los servidores, veremos como
insertar documentos, como hacer consultas o como se lleva a cabo la
sincronización de las réplicas. Y por supuesto a nuestros servidores les
haremos unas cuantas perrerías, solo para ver cómo se comportan. No os
lo perdáis.

* * * * *

* * * * *

*¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me
gusta en Facebook o de publicarlo en Twitter. ¡ Gracias !
*

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde
aquí.](http://www.charlascylon.com/p/tutorial-mongodb.html)*

¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog?
Suscríbete [por RSS](feed://www.charlascylon.com/feed.xml).*[
](http://www.charlascylon.com/p/tutorial-mongodb.html)*

