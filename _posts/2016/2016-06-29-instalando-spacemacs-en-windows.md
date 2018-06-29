---
layout: post
title: Instalando Spacemacs en Windows
---


![spacemacs](/img/posts/2016/spacemacs.png)


Ya os comentaba en la entrada anterior, estoy siendo un valiente y [estoy usado Emacs para programar en Elixir](https://charlascylon.com/2016-06-20-spacemacs-el-editor-perfecto-Elixir). Bueno, en realidad no estoy usando Emacs puro y duro, si no que **estoy usando Spacemacs**, que es una especie de personalización de Emacs para poder utilizar como si fuera Vim.

Instalarlo no es difícil, pero como suele pasar con todo programa venido de Unix/Linux, hay cosas que te pueden hacer perder un poco el tiempo hasta que consigues hacerlas funcionar. Y como yo ya he perdido el tiempo con ello ¿por qué no escribir un post para evitar que más gente pierda el tiempo?

## Instalando Emacs

Voy a suponer que ya tienes instalado Elixir y Erlang. Con esos dos componentes, y el `PATH` de Windows bien configurado, ya podrías trabajar con cualquier editor. Abres Notepad++, escribes tu programa en Elixir y compilas con `Mix`. Incluso puedes abrir una línea de comandos y trastear con `IEX`. Pero como estamos hablando de Emacs, pues vamos a instalarlo.

Para instalar Emacs, bastan con ir a su [flamante y remozada página web](https://www.gnu.org/software/emacs/) y descargarlo. Suele venir en un *zip*, y no es necesario instalarlo. Descomprimimos en una ruta conocida, y ya tenemos Emacs instalado.

Otra opción es usar [Chocolatey](https://chocolatey.org/) un gestor de paquetes parecido a los `apt` de Linux. El comando que deberíamos utilizar es:

```bat
choco install emacs
```
Y listo. Emacs se instalará en tu equipo.


## Añadiendo Spacemacs

Con los pasos anteriores habremos instalado Emacs, y podremos usarlo sin problemas. Pero si no estás seguro de querer usar Emacs, porque te han hablado bien de Vim, puedes tener lo mejor de los dos mundos con Spacemacs. De esta manera podrás elegir entre el `holly-mode`, con la distribución de teclado de Emacs, y su forma de funcionar; o podrás elegir el `evil-mode`, que os hará sentir como si estuvierais en Vim.  Además de eso, Spacemacs viene muy bien preparado, con todos los accesos configurados y listo para ser funcional desde el principio.

Para instalarlo, tendremos que tener localizado nuestro directorio `emacs.d`. Este directorio en Linux, normalmente se guarda en la carpeta `home` del usuario, pero si estás en Windows, la cosa es un poco más complicada (aunque no mucho). En este caso se guarda en la ruta:

```bat
%UserProfile%\AppData\Roaming\.emacs.d
```

Este directorio es el que tendremos que modificar para usar Spacemacs, así que no está de más hacer una copia por si rompemos algo.

Para instalar Spacemacs, lo haremos directamente desde [su repositorio en GitHub](https://github.com/syl20bnr/spacemacs). Para ello utilizaremos el siguiente comando, estando en en directorio `Roaming`:

```
git clone https://github.com/syl20bnr/spacemacs .emacs.d
```

Como es obvio, necesitaréis tener Git instalado para poder ejecutar instrucciones contra el repositorio. Si no lo tienes puedes descargarlo de [aquí](https://git-scm.com/download/win).

Una vez haya terminado la descarga del repositorio de GitHub, y si todo ha ido bien, tendréis Spacemacs listo para funcionar. Podéis comprobarlo si abrís Emacs, ya que la *interface* de usuario habrá cambiado completamente.


## Configurando Spacemacs para trabajar con Elixir y Alchemist

Una vez Spacemacs está instalado y funcionando, podemos ponernos a configurarlo para que quede a nuestro gusto. Lo primero que deberíamos hacer es instalar las capas o *layers* que necesitemos. En Spacemacs *layer* es un conjunto de configuraciones que podremos añadir o desactivar según nos interese. Para ello deberemos buscar el archivo `.spacemacs` que es el que guarda toda la configuración de nuestro editor.  Este archivo podemos encontrarlo directamente en la carpeta `Roaming` que hemos visto antes. Allí buscaremos la sección `dotspacemacs-configuration-layers`, y añadiremos las capas que necesitemos. Estas son las que yo tengo actualmente configuradas:

```lisp
dotspacemacs-configuration-layers
   '(
     ;; ----------------------------------------------------------------
     ;; Example of useful layers you may want to use right away.
     ;; Uncomment some layer names and press <SPC f e R> (Vim style) or
     ;; <M-m f e R> (Emacs style) to install them.
     ;; ----------------------------------------------------------------
     emacs-lisp
     markdown
     syntax-checking
     auto-completion
     company-mode
     erlang
     elixir
     git	 
     html
     org
     colors
     editorconfig
     themes-megapack
     perspectives
     javascript
     )
```

Técnicamente, con la capa `elixir` nos bastaría para usar el lenguage, pero si utilizáis el editor para más cosas, no viene mal tener alguna capa extra (como por ejemplo la capa `javascript`).

Las capas se encargan de añadir todos los paquetes necesarios para tener un lenguaje (u otros componentes) funcionando. En la carpeta `Roaming\.emacs.d\layers\+lang\elixir` podéis encontrar el archivo `packages.el` que contiene los paquetes que se instalarán con esta capa. Podemos ver como se instalarán `alchemist`, `company` o `elixir-mode`.

Una vez cerremos y abramos Spacemacs, los paquetes se descargarán automáticamente y quedarán instalados.

> Si al igual que yo,  tenéis problemas a la hora de instalar paquetes al iniciar Spacemacs, intentad establecer el parámetro `dotspacemacs-elpa-https` con  `nil`. Por alguna razón los paquetes no se me descargaban utilizando https.

## Configuraciones adicionales

En el archivo `.spacemacs` podremos configurar algunas cosas para hacer nuestro entorno más funcional. Por ejemplo con `dotspacemacs-themes` podemos configurar el *theme* de Spacemacs. Yo estoy usando `smyx` pero hay muchos más. Podéis ver ejemplos de como quedan [aquí](http://themegallery.robdor.com/). 

También podéis añadir la opción para que os aparezcan los números de línea con `dotspacemacs-line-numbers t` o añadir una configuración especial para incrementar el tamaño de la fuente con (`Ctrl +` y `Ctrl -`):

```lisp
(defun dotspacemacs/user-config () 
	(define-key global-map (kbd "C-+") 'text-scale-increase)
	(define-key global-map (kbd "C--") 'text-scale-decrease)
  )
```

## Alchemist en funcionamiento

La gracia de todo este proceso, es la de poder usar [Alchemist](https://github.com/tonini/alchemist.el), que es la mejor manera de trabajar con Elixir. Las posibilidades que nos da Alchemist son muchas, como autocompletado de código (incluyendo de nuestros propios módulos), ejecución de `IEX`, compilación, ejecución de proyectos y muchas más. Te invito a probarlas para que las veas en funcionamiento. 

![autocompletado en Alchemist](http://alchemist.readthedocs.io/en/latest/images/alchemist-company.gif)


