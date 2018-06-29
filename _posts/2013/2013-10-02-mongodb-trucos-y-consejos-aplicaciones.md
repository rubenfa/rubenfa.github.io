---
layout: post
title: MongoDB. Trucos y consejos. Aplicaciones multitenant.
redirect_from:
  - /post/62897226381/mongodb-trucos-y-consejos-aplicaciones.html
  - /post/62897226381/
---

¿Cómo podemos implementar este tipo de aplicaciones sobre **MongoDB**?
[En este estupendo artículo de
MongoHQ](http://support.mongohq.com/use-cases/multi-tenant.html)nos dan
las opciones más interesantes. Vamos a analizarlas.

### ¿Qué es una aplicación multitenant?

Una aplicación [multitenant](http://en.wikipedia.org/wiki/Multitenancy)
es aquella que, corriendo en el mismo servidor, proporciona accceso a
distintos usuarios o instituciones, aislando los datos de cada uno de
ellos. Es un esquema muy común en el *SaaS* (software como servicio).
Por ejemplo, podemos pensar en una aplicación de gestión de clientes en
la nube. Cada usuario tendrá acceso a sus clientes, a sus carpetas o a
su perfil, pero nunca tendrá acceso a los datos de otros usuarios. Por
lo que respecta al usuario, la aplicación solo funciona para él. **Está
completamente aislado del resto.**Entonces ¿qué opciones tenemos a la
hora de utilizar MongoDB?

### La opción mala

Una opción podría ser tener una colección para cada usuario, pero en la
misma base de datos. Por ejemplo en nuestro sistema de gestión de
clientes en la nube, podríamos tener una colección *customers* para cada
usuario. Para identificarlas podríamos poner un prefijo al nombre de la
colección, por ejemplo *u0000001_customers*. Luego en la aplicación
controlaremos a que colección tenemos que atacar.

Lo malo de esta solución, es que generará tantas colecciones como
usuarios tengamos, lo cual es una pesadilla a la hora de mantener la
base de datos.

También tenemos que pensar que **MongoDB** no está pensado para escalar a
nivel de colección. En este caso tendremos dificultades para realizar el
[sharding](http://docs.mongodb.org/manual/core/sharded-cluster-shards/),
ya que es inviable crear los *shards* necesarios para cada colección. Por
ejemplo, si creamos dos *shards* para cada colección *customers*, y
tenemos 100.000 usuarios, tenemos que crear 200.000 shards. Obviamente
esto es imposible.

### La opción buena

Probablemente la mejor opción sea la de utilizar una base de datos para
cada usuario. Es decir, que para cada usuario crearemos una base de
datos **MongoDB** con sus propias colecciones y documentos. Un usuario
sólo tendrá acceso a los datos que están almacenados en la base de datos
que le corresponde, consiguiendo aislarlo del resto de los usuarios. La
aplicación solo debe preocuparse de conectar con la base de datos
adecuada.

El problema que tiene este enfoque, es que no se adapta a todos los
entornos. Imaginemos que nuestra aplicación de gestión de clientes en la
nube da acceso a un millón de usuarios. Aunque los usuarios tengan pocos
datos, deberíamos tener un millón de bases de datos funcionando.
Obviamente es algo inviable, tanto por motivos de mantenimiento, como de
costes.

Por tanto esta solución es útil si tenemos un número reducido de
clientes a los que dar servicio.

### La opción buena, bonita y barata

Otra opción interesante, es la de utilizar la misma base de datos para
todos los usuarios. Para evitar que un usuario pueda acceder a datos de
otro, deberemos añadir a cada documento un campo que identifique el
usuario al que pertenece. Pensando en el ejemplo del gestor de clientes,
cada documento almacenado en la colección *customers* deberá tener un
campo *user_id*. Este campo debe ser único y no  ser nulo. Una vez
tenemos identificado cada documento, simplemente deberemos controlar que
todas las consultas que se realicen, incluyan este campo.

El problema de este enfoque, es que hay que tener mucho cuidado en el
desarrollo de la aplicación. Cuando un documento se inserta hay que
asegurarse de que se guarda el identificador de usuario correcto. Y
cuando se consulta un documento, hay que asegurarse de que siempre se
comprueba que el identificador de usuario coincide.

Lo bueno de este método es que es muy útil para implementar
*sharding* por el campo *user_id*. De esta manera los datos de los
clientes quedarán agrupados en un *shard* concreto. Así podremos
balancear la carga de acceso a datos, ya que cada cliente atacará a un
solo *shard*, evitando cuellos de botella. Eso sí, hay que tener en
cuenta que el campo *user_id* debe ser lo suficientemente aleatorio
para que los clientes se repartan de forma equitativa por todos los
shards disponibles.

### Conclusiones

Para crear aplicaciones *multitenant* con **MongoDB** tenemos dos opciones
a considerar: la buena y la triple B (buena, bonita y barata). Si
tenemos pocos usuarios, mucho dinero y la necesidad de aislar
completamente los clientes, lo mejor es crear una base de datos por cada
usuario. Si tenemos muchos usuarios y/o poco dinero, mejor una base de
datos para todos e identificar de forma unívoca a que usuario pertenece
cada documento almacenado en las colecciones.

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*

