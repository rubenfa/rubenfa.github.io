---
layout: post
title: Los problemas de tener un cerebro fuertemente tipado
redirect_from:
  - /post/89958600002/los-problemas-de-tener-un-cerebro-fuertemente.html
  - /post/89958600002/
---

<p>Ayer sufrí en mis carnes una incidencia bastante curiosa. Bueno, en realidad no tan curiosa si eres un programador acostumbrado a lenguajes no tipados, como Javascript o PHP.  Ese no es mi caso.</p>

<p>Habíamos detectado un problema en una aplicación que no tenía mucho sentido. El software cliente hace de forma periódica llamadas a un pequeño script PHP, que devuelve una serie de datos. Pero esos datos eran incorrectos. Tras repasar el script de arriba abajo, no conseguíamos dar con el problema. El flujo del programa debía comportarse según lo esperado, pero por alguna razón, no estaba siendo así.</p>

<p>Al final, el fallo estaba en un simple signo = que se me había olvidado. Tontuna de las gordas que te hacen perder una mañana.</p>

<p>Por ejemplo hacemos lo siguiente en C#:</p>

<pre><code>var a = 2;

if (a = 2)
{
    //Lo que sea    
}
</code></pre>

<p>En este caso, el <em>if</em> espera un valor <em>booleano</em>. Pero lo que obtienes es un error de diciendo que <em>&ldquo;no se puede convertir implicitamente int en bool&rdquo;</em>. Esto ya nos da una pista de que hemos olvidado algo en el <em>if</em>, en concreto un signo =.</p>

<pre><code>var a = 2;

if (a == 2)
{
    //Lo que sea    
}
</code></pre>

<p>El código anterior ya compila, y funciona sin problemas.</p>

<p>¿Y qué pasa por ejemplo en Javascript? Pues depende de qué pongamos en la variable <em>a</em>. Al poner un solo signo igual, estamos haciendo una asignación un valor a una variable. Y como el <em>if</em> también espera un valor <em>booleano</em>, Javascript lo convierte de forma automática. Si  dicha asignación tiene un valor real, Javascript lo convertirá a <em>true</em>. Si no tiene un valor real lo convertirá a <em>false</em>. Podéis verlo mejor explicado <a href="http://www.w3schools.com/js/js_booleans.asp">aquí</a>. En definitiva que si asignamos 0, cadena vacía, <em>null</em>, <em>NaN</em>, <em>false</em>, o <em>undefined</em> a la variable, el resultado será <em>false</em>. En cualquier otro caso será <em>true</em>.</p>

<blockquote>
  <p><strong>Nota:</strong> Como dice <strong>jdonsan</strong> en los comentarios, en Javascript lo recomendable es utilizar el === para evitar estos problemas. Podéis verlo en el <a href="http://www.impressivewebs.com/why-use-triple-equals-javascipt/">enlace</a>  que ha dejado. De todas formas el ejemplo está pensado para fallar, simulando lo que a mi me pasó con PHP.</p>
</blockquote>

<p>En PHP, como podéis ver <a href="http://www.php.net/manual/es/language.types.boolean.php">aquí</a>, el comportamiento es bastante parecido.</p>

<p>En definitiva, que al haber olvidado un signo, estamos dependiendo del valor de la variable. La comparación no se realiza, y la entrada en el <em>if</em> dependerá de si el valor se convierte a <em>false</em> o a <em>true</em>. Un comportamiento, que en nuestro caso, era bastante errático.</p>

<p>Así que ya sabéis, cuidado con los signos.</p>
