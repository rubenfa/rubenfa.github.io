---
layout: post
title: Spacemacs, el editor perfecto para programar con Elixir
---

Desde que empecé a programar con Elixir, he estado buscando el editor perfecto para estar cómodo. En el trabajo, normalmente utilizo Visual Studio
que encaja de maravilla para programar con .NET (aunque la versión 2015, sea bastante inestable). Para proyectos web sencillos, también utilizo Visual Studio Code,
ya que es muy rápido y tiene muchos plugins útiles. De hecho, ahora mismo estoy escribiendo en Markdown, desde VS Code.

Mis primeros pasos con Elixir fueron con el editor de GitHub: Atom. Aunque la integración con Elixir no era mala, lo peor sin duda era el rendimiento de Atom en Windows. Muchas veces se quedaba atascado, y tenía que reiniciarlo. Otras veces se volvía lento, como si estuviera haciendo alguna operación complicada. 

Tras la experiencia con Atom, me pasé a VS Code cuando leí la noticia de que ya tenía integración con Elixir. El editor funciona muy bien. Si ningún tipo de retardo. Pero la integración con Elixir es bastante floja. Solo existe un plugin de la comunidad, poco actualizado, y que solo incluye la definición de algunas de las palabras claves del lenguaje. Tampoco soporta las vistas HTML en Phoenix, por lo que se es bastante difícil usarlo.

Como principalmente iba a realizar proyectos Web con Elixir, también probé WebStorm. 
Existe un plugin para programar en Elixir, pero tras probarlo no me convenció (además es de pago y yo buscaba algo gratuito). 

Acabé resignado a usar VS Code, ya que de los más flojos, me parecía el mejor, pero un día, descubrí que ya existía la integración perfecta de Elixir con un editor. Y el editor era Emacs.

![Leonidas gritando Emacs](/img/posts/2016/this_is_emacs.jpg)

## Emacs y Spacemacs

Desde que internet es internet, existen varios puntos de fricción que siempre acaban en discusión. Coca-cola o  Pepsi, Linux o Windows, PC o Mac y la que seguramente sea la discusión por antonomasia: Emacs vs Vim. Y es que ambos son los editores utilizados por los programadores "hardocore". Y esto no es más que porque la curva de aprendizaje que tienen es ~~jodidamente~~ bastante pronunciada.

<blockquote class="twitter-tweet" data-lang="es"><p lang="en" dir="ltr">I&#39;ve been using Vim for about 2 years now, mostly because I can&#39;t figure out how to exit it.</p>&mdash; I Am Devloper (@iamdevloper) <a href="https://twitter.com/iamdevloper/status/435555976687923200">17 de febrero de 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

¿Por qué Emacs? Bueno, como no estaba contento con mi configuración para trabajar con Elixir, estuve investigando alternativas. Aunque mucha gente recomendaba Vim, pronto empecé a ver una opinión mayoritaria: **usar Spacemacs con Alchemist**.  

[Spacemacs](http://spacemacs.org/) es Emacs y Vim a la vez. Como ellos mismos dicen *Emacs focused on Evil*. Por si no lo has imaginado el `evil mode` es la manera tan graciosa que tiene esta gente de decir que usan la configuración de teclado de Vim en Emacs (el  `holly mode` es el modo normal de Emacs).

La otra pata de esta configuración es [Alchemist](https://github.com/tonini/alchemist.el), que es la herramienta responsable de la integración de Elixir en Emacs. Leyendo las funcionalidades que trae a uno le entran ganas de probarlo: integración con **Mix**, funciones de compilación, consulta de documentación, completado de código, integración con IEX, soporte para Phoenix Framework ...      


![Tira Ecol](/img/posts/2016/tiraecol-3.jpg)


## Pagando el peaje

Como he dicho **el principal problema de usar Spacemacs es que la curva de aprendizajes es grande**. Aunque se puede utilizar el ratón para algunas cosas, te pasas el tiempo escribiendo combinaciones de teclas para todo. Si eres como yo, incapaz de recordar más de 3 atajos de teclado, al principio estarás totalmente perdido, y tendrás ganas de dejarlo. Y nadie te culpará.

![Curvas de aprendizaje en algunos editores](/img/posts/2016/learning_curve.jpg)

Para que os hagáis una idea, ni el *copy & paste* se hace igual. Esta gente ha decidido llamarlo *Kill-ring save* y *yank*. Y es que `kill-ring` es más o menos como el *clipboard* de toda la vida. Y claro olvídate del `Ctrl+C` y el `Ctrl+V`.  

En fin, que cuando estás decidio a abandonar, es cuando descubres que existe el atajo `Alt + X` (en mundo **Emacs** `M-x`). Este simple comando te muestra una lista de las acciones más comunes ordenadas alfabéticamente. 

![Meme de Alt+M](/img/posts/2016/lost_emacs.jpg)

Después de eso, es cuestión de tiempo que vayas cogiendo el truco al editor, y empieces a diferenciar entre *buffers* y *windows*, seas capaz de guardar archivos e incluso abrir `IEX` o compilar un proyecto en Elixir. Yo cada vez soy capaz de recordar más atajos de teclado, e incluso el otro día estaba en Visual Studio y intenté guardar un archivo escribiendo `M-m-f-s`. Esto es una prueba clarísima. Si yo puedo, cualquiera puede.

## Conclusión

Con **Spacemacs** cada día soy más productivo. Aun estoy lejos de rendir tanto como con Visual Studio, pero creo que será cuestión de tiempo. Ahora mis proyectos son pequeños, y no me he tenido que meter a fondo con *Projectile* (gestión de proyectos), *Helm* (para buscar archivos, completar nombres de archivo etc), o *dired* (para hacer operaciones con archivos) o *Magit* (para usar Git en Emacs), pero seguramente lo iré haciendo poco a poco.

Lo que no he podido saborear, es lo de usar el **evil mode**. Dicen que editar en *Vim* es un placer, pero yo no he conseguido pasar del tutorial que viene con **Spacemacs**. Veremos si soy capaz de darle una oportunidad en el futuro.






