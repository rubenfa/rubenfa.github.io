---
layout: post
title: Spacemacs, mi configuración personal
share-img: http://www.enspire.com/wp-content/uploads/2014/02/LDS_Art_Home.png
---


Hace poco escribí un [artículo en GenbetaDev](https://www.genbetadev.com/herramientas/las-herramientas-del-programador-y-tu-cual-usas) en el que plasmaba lo que me decían unos cuantos programadores (muy majos todos), sobre el editor/IDE que utilizaban para trabajar. Ya os [he contado alguna vez](http://charlascylon.com/2016-06-20-spacemacs-el-editor-perfecto-Elixir) que con esto de aprender Elixir, yo he acabado usando Spacemacs. Por aquel entonces [lo utilizaba generalmente en Windows](http://charlascylon.com/2016-06-29-instalando-spacemacs-en-windows), aunque ahora la cosa ha cambiado y para desarrollar en Elixir utilizo Ubuntu 16.04. Las facilidades que da *apt* son difíciles de superar, y *chocolatey* para Windows, aunque es interesante, no tiene tanta potencia. 

En este tiempo que llevo utilizando Spacemacs, he ido personalizando el entorno para trabajar lo más cómodo posible. Toda la configuración de Spacemacs, se guarda en un solo archivo: el archivo `.spacemacs`. Lo bueno de esto, es que el archivo lo tengo [subido a GitHub](https://github.com/rubenfa/spacemacs-config), así que puedo replicar la configuración de forma rápida en cualquier ordenador en el que instale Spacemacs.


## Mi configuración actual

### Layers

Una de las cosas buenas que tiene Emacs, es que está separado en *layers* o capas. Las capas son configuraciones aisladas que permiten añadir funcionalidades o modificar el comportamiento de Emacs. Si una capa no nos gusta, bastará con desactivarla y todas sus funcionalidades desaparecerán. Si queremos añadir funcionalidad extra, bastará con añadir la capa que deseemos. Actualmente, algunas de las capas que yo tengo instaladas, es la capa `elixir` que añade [Alchemist](https://github.com/tonini/alchemist.el) y otras configuraciones para trabajar con Elixir, tengo la capa `javascript` para cuando hago algo en ese lenguaje o la capa `html`, útil en desarrollos web. 

Añadir capas es sencillo, porque solo hay que incluir el nombre de la capa en el archivo `.spacemacs` y esta se descargará y configurará tras reiniciar Spacemacs.

### Neotree

Neotree es un plugin que viene incluido por defecto en Spacemacs, que permite tener un árbol de exploración de proyectos. Es algo muy cómodo, ya que podemos navegar por los archivos del proyecto de forma sencilla, crear directorios nuevos, abrir archivos etc. El único problema, es que por defecto es un poco feo. Ya sé que no es algo demasiado importante, pero ¿a quién no le gusta tener su editor presentable? 

Para hacerlo más bonito tengo instalado [*all the icons*](https://github.com/domtronn/all-the-icons.el#resource-fonts), que a través de fuentes de texto, añade iconos a los nodos de Neotree. Queda bastante chulo.


### Tema

Aunque el tema de nuestro editor puede parecer una cuestión simplemente estética, no es del todo así. Un tema con colores demasiado chirriantes, puede acabar con tus ojos echos papilla. El contraste entre el fondo y el color del texto también es importante. Yo ya soy bastante miope, así que no quiero fastidiarme más la vista. 

Antiguamente yo era partidario de los temas claros, con fondo blanco y texto oscuro. Pero con el tiempo he ido tirando más hacia temas oscuros. Eso sí, el fondo no tiene que ser completamente negro, ya que las letras se iluminan demasiado y me resulta molesto. Prefiero un fondo más gris y textos de colores suaves. 

Añadir y configurar temas en Spacemacs es bastante sencillo. Tengo una capa llamada `themes-megapack` con montones de temas y luego tengo configurado el tema `smyx` por defecto. Podéis ir aplicando los temas de uno en uno, viendo como quedan, o podéis [visitar esta página](http://themegallery.robdor.com/) para echar un vistazo rápido a todos los temas y luego probar solo los que os resulten mejores.