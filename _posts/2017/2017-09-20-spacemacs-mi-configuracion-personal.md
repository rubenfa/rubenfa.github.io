---
layout: post
title: Spacemacs, mi configuración personal
share-img: https://camo.githubusercontent.com/f64bd3e47045358060788cfc035e3bf1961439aa/687474703a2f2f7777772e6e61737333722e636f6d2f73706163656d6163732e706e67
---


Hace poco escribí un [artículo en GenbetaDev](https://www.genbetadev.com/herramientas/las-herramientas-del-programador-y-tu-cual-usas) en el que plasmaba lo que me decían unos cuantos programadores (muy majos todos), sobre el editor/IDE que utilizaban para trabajar. Ya os [he contado alguna vez](http://charlascylon.com/2016-06-20-spacemacs-el-editor-perfecto-Elixir) que con esto de aprender Elixir, yo he acabado usando Spacemacs. Por aquel entonces [lo utilizaba generalmente en Windows](http://charlascylon.com/2016-06-29-instalando-spacemacs-en-windows), aunque ahora la cosa ha cambiado y para desarrollar en Elixir utilizo Ubuntu 16.04. Las facilidades que da *apt* son difíciles de superar, y *chocolatey* para Windows, aunque es interesante, no tiene tanta potencia. 

En este tiempo que llevo utilizando Spacemacs, he ido personalizando el entorno para trabajar lo más cómodo posible. Toda la configuración de Spacemacs, se guarda en un solo archivo: el archivo `.spacemacs`. Lo bueno de esto, es que el archivo lo tengo [subido a GitHub](https://github.com/rubenfa/spacemacs-config), así que puedo replicar la configuración de forma rápida en cualquier ordenador en el que instale Spacemacs.


## Mi configuración actual

### Holy Mode

Spacemacs tiene una característica interesante y es que puedes utilizar la configuración de teclado de Emacs (*Holy Mode*) o la configuración de teclado de VIM (*Evil Mode*). Así una persona acostumbrada a VIM, podría usar esta versión de Emacs sin problemas. 

Esto se configura en la instalación, aunque también se puede cambiar luego. Cuando empecé con Spacemacs, me sonó mejor lo de *Holy Mode* (yo soy buena gente y lo de *Evil* no me convenció), y elegí esa opción. Así que ahora mismo estoy acostumbrado al usar el teclado con esta configuración. Esto quiere decir que los comandos principales suelen empezar al teclear `M-` (es decir *Alt*). Por ejemplo para guardar un archivo hay que pulsar `M-fs`, o para cerrar un *buffer* `M-bd`.

![Neotree con all-the-icons](/img/posts/2017/minibufer.png)

### Layers

Una de las cosas buenas que tiene Emacs, es que está separado en *layers* o capas. **Las capas son configuraciones aisladas que permiten añadir funcionalidades o modificar el comportamiento de Emacs**. Si una capa no nos gusta, bastará con desactivarla y todas sus funcionalidades desaparecerán. Si queremos añadir funcionalidad extra, bastará con añadir la capa que deseemos. Actualmente, algunas de las capas que yo tengo instaladas, es la capa `elixir` que añade [Alchemist](https://github.com/tonini/alchemist.el) y otras configuraciones para trabajar con Elixir, tengo la capa `javascript` para cuando hago algo en ese lenguaje o la capa `html`, útil en desarrollos web. 

Añadir capas es sencillo, porque solo hay que incluir el nombre de la capa en el archivo `.spacemacs` y esta se descargará y configurará tras reiniciar Spacemacs. [Aquí podéis ver las capas disponibles](http://spacemacs.org/layers/LAYERS.html)

### Neotree

**Neotree es un plugin que viene incluido por defecto en Spacemacs, que permite tener un árbol de exploración de proyectos**. Es algo muy cómodo, ya que podemos navegar por los archivos del proyecto de forma sencilla, crear directorios nuevos, abrir archivos etc. El único problema, es que es un poco feo. Ya sé que no es algo demasiado importante, pero ¿a quién no le gusta tener su editor presentable? 

Para hacerlo más bonito tengo instalado [*all the icons*](https://github.com/domtronn/all-the-icons.el#resource-fonts), que a través de fuentes de texto, añade iconos a los nodos de Neotree. Queda bastante chulo.

![Neotree con all-the-icons](/img/posts/2017/all_the_icons.png)

### Tema

Aunque el tema de nuestro editor puede parecer una cuestión simplemente estética, no es del todo así. **Un tema con colores demasiado chirriantes, puede acabar con tus ojos hechos papilla**. El contraste entre el fondo y el color del texto también es importante. Yo ya soy bastante miope, así que no quiero fastidiarme más la vista. 

Antiguamente yo era partidario de los temas claros, con fondo blanco y texto oscuro. Pero con el tiempo he ido tirando más hacia temas oscuros. Eso sí, el fondo no tiene que ser completamente negro, ya que las letras se iluminan demasiado y me resulta molesto. Prefiero un fondo más gris y textos de colores suaves. 

Añadir y configurar temas en Spacemacs es bastante sencillo. Tengo una capa llamada `themes-megapack` con montones de temas y luego tengo configurado el tema `smyx` por defecto. Me gusta porque tiene un fondo grisáceo y unos tonos de letra bastante agradables.

Podéis ir aplicando los temas de uno en uno, viendo como quedan, o podéis [visitar esta página](http://themegallery.robdor.com/) para echar un vistazo rápido a todos los temas y luego probar solo los que os resulten más adecuados.

### Fuente

Otra cosa importante, aunque no lo parezca, es la fuente de texto utilizada. **Una buena fuente ayuda mucho a leer el código fuente que escribes*, porque no es lo mismo que escribir un texto normal. A la hora de programar utilizamos muchos caracteres especiales como `[]`, `{}`, `()` etc. Así que es importante que sea una fuente clara en la que se distingan bien todos estos símbolos.

Durante mucho tiempo he estado utilizando la fuente [Source Code Pro](https://github.com/adobe-fonts/source-code-pro), pero recientemente he cambiado a [Hack](http://sourcefoundry.org/hack/). Está bastante chula y de momento me gusta.

### Posición de las ventanas

El sistema de *buffers* y ventanas de Emacs tiene su truco. Emacs abre los archivos en *buffers*, pero estos no tienen porque estar visibles en la pantalla en todo momento. Para eso se utiliza el concepto de *window*, que es una porción de pantalla que mostrará un *buffer* de nuestra elección. Toda esta configuración se puede ir modificando al vuelo a través de los atajos de teclado: podemos mover una pantalla a la derecha, ponerla abajo, rotar las pantallas, cerrarlas etc. 

Por defecto cuando abres un archivo, se abre en la ventana en la que tengas el cursor ahora mismo. Eso no me molesta, ya que si quiero abrir un archivo en otra ventana, lo puedo especificar directamente. Lo que si que me molestaba, es que al ejecutar tests, los resultados de los mismos se abriesen en la misma ventana. Así que esto lo modifiqué y **ahora cuando ejecuto los tests, se abre una ventana justo debajo con los resultados**. Así mi configuración suele ser Neotree a la izquierda, fichero fuente en medio y fichero fuente (generalmente con tests) a la derecha, dejando el resultado de la ejecución de los tests abajo.

![Mi layout habitual](/img/posts/2017/emacs_layout.png)

### Exploración de código fuente

Una funcionalidad muy útil, es la de poder moverte por el código fuente. Por ejemplo, si en un módulo llamas a una función, y quieres navegar hasta la definición de esa función, puedes ponerte encima del texto y pulsar `M-.` (es decir Alt+punto). **Aprovechando que Elixir es open source, podemos hacer que podamos saltar hasta la definición de funciones o módulos del propio lenguaje**. Por ejemplo si queremos saber como funciona `Enum.any?`, pues pulsamos `M-.` y se nos abrira el archivo de código fuente que define esa función. Lógicamente para esto tendremos que haber descargado previamente [el código fuente de Elixir](https://github.com/elixir-lang/elixir).


### Otras configuraciones extras

Ya para acabar, os cuento que tengo configuradas algunas teclas, como por ejemplo la opción de pulsar `Ctrl - +` o `Ctrl - -` para aumentar o disminuir el tamaño de la fuente. Al principio lo usé un poquito, pero cuando conseguí configurar en el archivo `.spacemacs` el tamaño de letra ideal, he dejado de usarlo.

También tengo configurado que al arrancar Spacemacs, este se maximice. Generalmente me gusta que ocupe toda la pantalla así que ¿por qué no abrirlo así por defecto?

Otra cosa que tengo habilitada, es la capacidad de Spacemacs para guardar la sesión. Es decir, que cuando abres Spacemacs, sea capaz de abrir los archivos en los que estabas trabajando y la configuración de ventanas que tenías en el momento de cerrar. Esto funciona más o menos bien, menos Neotree, que por alguna razón hace cosas raras y no se abre correctamente. A ver si lo depuro y consigo arreglarlo.