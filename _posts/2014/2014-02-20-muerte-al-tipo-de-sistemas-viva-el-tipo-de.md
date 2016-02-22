---
layout: post
title: Muerte al tipo de sistemas. Viva el tipo de sistemas
redirect_from:
  - /post/77264626972/muerte-al-tipo-de-sistemas-viva-el-tipo-de.html
  - /post/77264626972/
---

<p>Seguro que esto os suena. Habéis terminado un desarrollo, que os toca subir a producción o preproducción. En esos entornos no tenéis permisos ni para abrir el <em>Notepad</em>. No vaya a ser que rompáis algo.</p>

<p>Al final otra persona es la encargada de subir vuestro desarrollo al nuevo entorno, con todo lo que eso implica. Scripts de base de datos, creación de usuarios, despliegue en servidor web o de aplicaciones, configuración de librerías externas etc. Mil cosas.</p>

<p>Para que la persona encargada de realizar esta tarea - <em>A.K.A</em> el <strong>tipo de sistemas</strong> - pueda realizar todas las operaciones necesarias, tienes que escribir un extenso documento detallando los pasos. Si alguna vez habéis escrito uno de estos documentos, sabréis que al final se acaban describiendo los pasos a nivel usuario. Es decir, <strong>explicando hasta la cosa más simple</strong>.</p>

<p>Las personas de sistemas suelen ser gente capaz, con muchos conocimientos, pero que generalmente están dedicadas a mil proyectos distintos. Es lo que te obliga a escribir el documento de despliegue. El problema es que al final, acaba sucediendo eso del <em><a href="http://es.wikipedia.org/wiki/Tel%C3%A9fono_descompuesto" title="teléfono estropeado">teléfono estropeado</a></em>. Tu explicas los pasos lo mejor que puedes para que el <strong>tipo de sistemas</strong> los ejecute en el nuevo entorno. Pero eso no garantiza que el otro los vaya a ejecutar correctamente. Si no te explicas bien es muy probable que algo falle. Aunque te expliques muy bien, puede pasar que el <strong>tipo de sistemas</strong> no te entienda. Como resultado puede suceder que el nuevo desarrollo no funcione. O todavía peor, que un desarrollo que estaba funcionando, deje de funcionar.</p>

<p>El resultado de todo esto, es que subir cambios a un nuevo entorno es un proceso largo y lento. Si las cosas fallan, el margen de maniobra que tiene el desarrollador es escaso. Y para colmo, el <strong>tipo de sistemas</strong>, que sí tiene margen de maniobra, no sabe como actuar. No es algo que él comprenda del todo, porque no lo ha desarrollado.</p>

<p>Resumiendo, el conocimiento de la aplicación lo tiene los desarrolladores, pero las herramientas las tiene el personal de sistemas. Es como contratar a una empresa de carpintería. Te asignan dos operarios: uno que sabe dar los martillazos, y otro que lleva el martillo. El problema es que el que lleva el martillo no sabe usarlo. Y si los operarios están en distintas comunidades autónomas y tienen que comunicarse por teléfono, la cosa empeora.</p>

<h3>¿Y esto no puede ser de otra forma?</h3>

<p>Por suerte parece que sí, y es hacia dónde nos está llevando el sector. En un mundo globalizado, en el que los desarrollos deben salir a producción con mucha rapidez, no tiene sentido separar departamentos de desarrollo y de sistemas.</p>

<p>Seguro que habéis oído de las <a href="http://en.wikipedia.org/wiki/DevOps" title="DevOps Wikipedia">DevOps</a> o de los equipos multifuncionales (<a href="http://www.javiergarzas.com/2014/02/equipo-multifuncional.html" title="equipo multifuncional">aquí tenéis un estupendo artículo de Javier Garzás</a>  sobre el tema). La idea es tener equipos autónomos, capaces de <strong>hacer el desarrollo, desplegarlo y mantenerlo</strong>. Para ello es necesario que los integrantes del equipo sean capaces de realizar distintas tareas. Ojo, distintas tareas no quiere decir que todo el mundo sepa hacer de todo. No necesitamos un maestro de C#, que sepa administrar bases de datos, el repositorio de código fuente y además hacer paella. Se trata de conseguir un equipo que se complemente. Tendremos un administrador de bases de datos. También algún experto en servidores de aplicaciones. Por supuesto que también tendremos buenos programadores. Pero también tendremos personas que sin saber todo sobre una base de datos, son capaces de realizar multitud de tareas sobre ella.</p>

<p>Eso sí, para eso hay que conocer bien a los miembros del equipo, saber que conocimientos tienen, y qué estarían dispuestos a aprender para ayudar al equipo. La clave es esa: <strong>el equipo</strong>.</p>

<p>En España pasarán años hasta que esto sea algo común. Pero sucederá. Habrá compañías de sofware con equipos brillantes. Equipos rápidos y eficientes. Capaces de construir buen sofware y desplegarlo muy rápidamente. <strong>Y estas compañías serán las que se coman la tostada de el resto</strong>.</p>
