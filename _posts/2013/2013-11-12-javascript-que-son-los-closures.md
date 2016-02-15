---
layout: post
title: JavaScript. ¿Qué son los closures?
redirect_from:
  - /post/66767656253/javascript-que-son-los-closures.html
---


Hablar sobre closures en *JavaScript* no es algo novedoso. A nada que
busquéis en Google, encontrarás montones de blogs y tutoriales dónde
explican qué son y para que sirven los **closures**. Algunos buenos
ejemplos son [este artículo de
Mozilla](https://developer.mozilla.org/es/docs/JavaScript/Guide/Closures),
[este otro publicado en
variablenotfound](http://www.variablenotfound.com/2012/10/closures-en-javascript-entiendelos-de.html)
o [este otro en
inglés.](http://www.javascriptkit.com/javatutors/closures.shtml)
Probablemente todos lo expliquen mejor que yo, así que no dejéis de
visitar esos artículos para comprender esta potente herramienta de
*JavaScript*.

### ¿Qué son los closures?

Una definición formal podría ser aquella que dice que **un closure es una
referencia a una función y a al contexto en el que se ejecuta**. Esto
que suena tan raro, en JavaScript quiere decir, que un closure es una
función que dentro realiza la llamada a otra función, que además utiliza
variables del contexto en el que se ejecuta. ¿Pero en qué queremos decir
con contexto? Pensemos en esta función:

```javascript
function Hucha(monedas) {
    var monedasGuardadas = 0;
    monedasGuardadas += monedas;
    document.write('La hucha tiene ' + monedasGuardadas + 'monedas');
}
 ```

*JavaScript* maneja esta función de forma que, cuándo se llama por
ejemplo con un `Hucha(5)`, se crea un contexto con el valor de las
variables a las que la función tiene acceso (en este caso 'monedas' y
'monedasGuardadas'). Una vez realizadas las operaciones de la función,
el contexto es destruído, de tal manera que si volvemos a ejectuar la
función por ejemplo con 'Hucha(10)', volverá a crearse un contexto nuevo
y a realizar las operaciones que hay dentro de la función. En este caso
'monedasGuardadas' siempre valdrá 0, por lo que se le sumará el parámetro
monedas cada vez que ejecutemos la función. Este es el comportamiento
normal de *JavaScript* y el que todos conocemos. Pero veamos la siguiente
función:

```javascript
function Hucha(nombre) {
    var nombreHucha = nombre;
    var monedasGuardadas = 0;

    return function contarMonedas(monedas) {
        monedasGuardadas += monedas;
        document.write(nombreHucha + ' tiene ' + monedasGuardadas + 'monedas');
    }
}
```

Vamos a pensar en el ejemplo como en una hucha que inicialmente está
vacía. Cada vez que insertamos una cantidad de monedas, la hucha imprime
un ticket mostrándonos la cantidad de monedas que tiene dentro. Por
tanto si hacemos esto:

```javascript
var hucha1 = Hucha('hucha1');
hucha1(5);
hucha1(15);
```

Obtendríamos el siguiente resultado:

```
hucha1 tiene 5 monedas 
hucha1 tiene 20 monedas
```

En este caso la función `Hucha` devolverá un objeto con una referencia a
la función interna `contarMonedas`. Esta función puede acceder a las
variables de su contexto, incluyendo las variables de la función
exterior `Hucha`, `nombreHucha` y `monedasGuardadas`.  Como podéis ver el
valor de `monedasGuardadas` se va acumulando, lo cual quiere decir que la
función y su contexto no se destruyen una vez son ejecutados. Y esto es
lo que se conoce como **closure** en *JavaScript*.

Compliquemos el ejemplo añadiendo otra hucha y añadiendo cierta cantidad
de monedas en cada hucha.

```javascript
var hucha1 = Hucha('hucha1');
var hucha2 = Hucha('hucha2');
hucha1(5);
hucha1(15);

hucha2(5);
hucha2(40);
```


En este caso es como si tuviéramos dos huchas completamente distintas,
cada una con sus correspondientes monedas. Esto es lo que veríamos en
los ticket que imprime de cada hucha.

```
hucha1 tiene 5 monedas 
hucha1 tiene 20 monedas

hucha2 tiene 5 monedas 
hucha2 tiene 45 monedas
```

Efectivamente, podemos comprobar que tendríamos dos huchas completamente
independientes a las que hemos ido añadiendo distinto número de
monedas.

Ahora qué ya sabemos qué son los closures, nos queda saber para qué se
utilizan, pero eso lo dejaremos para la siguiente entrega.

* * * * *

* * * * *

*¿Te ha gustado el artículo? No te olvides de hacer +1 en Google+, Me
gusta en Facebook o de publicarlo en Twitter. ¡ Gracias !*

¿Quiéres que te avisemos cuando se publiquen nuevas entradas en el blog?
Suscríbete [por RSS](feed://www.charlascylon.com/feed.xml).*[
](http://www.charlascylon.com/p/tutorial-mongodb.html)*

