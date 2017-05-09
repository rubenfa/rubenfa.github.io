---
layout: post
title:  Lenguajes dinámicos y lenguajes estáticos
share-img: http://charlascylon.com/img/posts/2017/deal_with_it.jpg
---

Cuenta la leyenda, que una vez una princesa fue capturada por un terrible dragón. El abominable monstruo encerró a la princesa en la más alta torre de su castillo dejándola atrapada durante años. Muchos valientes caballeros intentaron rescatarla, pero no lo consiguieron y perecieron en el intento. La princesa estaba desesperada, ya que pensaba que nunca podría salir de aquel horrible castillo. 

El caballero Dinámico, que conocía la triste historia de la princesa, entrenó día y noche para poder enfrentarse al dragón. Él sabía que podría rescatarla, ya que tenía un arma secreta: una espada mágica. Esta espada, que emitía una luz azulada, era capaz de inflingir terribles heridas a todo tipo de monstruos, pero en el caso de los dragones, era mortal. Con un solo golpe, el dragón sería destruído y la princesa sería rescatada.

Cuando el caballero Dinámico estuvo preparado viajó hasta el castillo del dragón dispuesto a enfrentarse al monstruo. El dragón que nunca dormía y siempre estaba vigilante, escuchó llegar al caballero y salió a su encuentro. El momento había llegado. Dinámico había estado preparándose durante años para aquel enfrentamiento y sabía que con la ayuda de su espada mágica podría vencer. Con decisión, Dinámico llevó la mano a la empuñadura de su espada mágica, dispuesto a desenvainarla. El horrible dragón, recibiría su merecido. Pero entonces ... `undefined`, la espada no estaba allí, ya que el caballero Dinámico se había olvidado de cogerla. El dragón aniquiló al caballero y la princesa siguió encerrada para siempre.

Esta historia con dramático final, refleja lo que los programadores de lenguajes estáticos opinan de los lenguajes dinámicos. Un error que el compilador podría haber detectado sin problemas, se convierte en un terrible error en tiempo de ejecución. Para los programadores de lenguajes dinámicos, tampoco es para tanto, ya que errores de ese tipo se podrían detectar con tests.


## Lenguajes de tipado estático y lenguajes de tipado dinámico

Decimos que un lenguaje es de tipado estático, porque los tipos tienen que definirse en tiempo de compilación para que el programa funcione. Si definimos una variable de tipo `StringBuilder` esta solo podrá contener instancias de este tipo, y si no es así, el compilador nos mostrará un error. Lo mismo puede pasar cuando llamamos a un método o función. Si no existe o hemos escrito mal el nombre, el compilador nos mostrará un error y no nos dejará ejecutar el programa hasta que lo arreglemos.

En el caso de los lenguajes de tipado dinámico, esto no pasa, y los tipos de las variables se definen en tiempo de ejecución. El ejemplo que se suele dar es que una variable puede contener valores de distintos tipos durante la ejecución del programa, pero me parece un ejemplo bastante malo, porque salvo casos excepcionales, es algo que yo no haría. Al final en los lenguajes dinámicos, lo que cuenta es que si te equivocas en algo, casi siempre lo vas a ver en tiempo de ejecución, ya que no tienes el paracaídas del compilador. Si pones mal el nombre de una función, fallará cuando vayas a usarla.

Otra cosa que suele confundirse aquí, es el tipado fuerte, o el tipado débil. Tanto Elixir como JavaScript, son lenguajes dinámicos, pero Elixir tiene un tipado mucho más fuerte que JavaScript. Si sumas `1 + "1"` en Elixir, recibes un error en tiempo de ejecución. Si haces la misma operación en JavaScript obtienes `"11"`. En definitiva, unos lenguajes son más permisivos que otros cuando tienen que hacer conversiones entre tipos y JavaScript tiende a convertirlo todo para poder continuar con la ejecución. De hecho yo creo que el tipado tan débil (y raruno) de JavaScript, es lo que ha hecho que este lenguaje tenga a veces tan mala fama.


## ¿Y qué opción es mejor?

Desde que el mundo es mundo, la humanidad se ha dividido en dos bandos. ¿Tortilla de patata con cebolla o sin cebolla? ¿Pizza con piña o sin piña? ¿Lenguajes dinámicos o lenguajes estáticos? Mientras que todo el mundo sabe que la tortilla de patata tiene que ser con cebolla, el debate entre si debemos usar lenguajes de un tipo u otro continua. ¿Pero qué ventajas e inconvenientes tiene cada uno?

### Lenguajes de tipado estático

**Supuestas Ventajas**:
- Detención temprana de algunos tipos de errores
- Es más sencillo refactorizar nombres de variables, funciones, métodos etc.

**Supuestas Desventajas**:


### Lenguajes de tipado dinámico

**Supuestas Ventajas**:
- 

**Supuestas Desventajas**:




## No hay una opción buena, ni una opción mala

La mayor parte de mi carrera como programador ha transcurrido trabajando con lenguajes de tipado estático (Visual Basic .NET, C# etc.). Mis contactos con lenguajes dinámicos se reducían a las cosas que me ha tocado hacer con JavaScript.