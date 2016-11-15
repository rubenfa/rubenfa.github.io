---
layout: post
title:  Behaviours en Elixir
---

En programación orientada a objetos, nos pasamos el día utilizando interfaces. Se podría decir que una interfaz es un contrato que especifica que métodos y propiedades deben tener las clases que  implementen dicho contrato. Así, si decimos que una clase implementa el contrato (interfaz) `IPrintable`, esa clase deberá tener un método `PrintMessage` que hará algo con un `string` 

Aunque Elixir no es un lenguaje orientado a objetos, también tenemos la posibilidad de utilizar algo parecido a las interfaces: los *behaviours* (comportamientos). Pero antes de hablar de *behaviours* hay que hablar de otra cosa: los *typespecs*.


## Typespecs

Elixir es un lenguaje dinámico, por lo que los tipos de datos se infieren en tiempo de ejecución. Esto tiene sus cosas buenas, y sus cosas malas, pero no vamos a discutirlas aquí. A pesar de ser dinámico, Elixir nos permite definir tipos personalizados y declarar el tipo que devolverá una función (especificaciones). Y eso lo podemos hacer a través de los *typespecs*.


### Declarando especificaciones

Una especificación en una función, nos permite saber qué tipo de dato va a devolver al ejecutarse.  Para hacer esto, deberemos usar `@spec`. Un ejemplo:

``` Elixir
defmodule Test do
    @spec increment(number) :: integer
    def increment(a) do
        a + 1
    end
end
``` 

Cómo veis el ejemplo es muy sencillo. Definimos una función `increment`, que lo único que hace es sumar uno, al número pasado como parámetro

¿Y para qué sirve esto en un lenguaje dinámico? Pues sirve para utilizar herramientas como [ExDoc](https://github.com/elixir-lang/ex_doc), utilizada para documentar); o [Dialyzer](https://github.com/elixir-lang/ex_doc) que se utiliza para analizar el código para encontrar posibles problemas con los tipos.

Por ejemplo si modificamos el código anterior:


``` Elixir
defmodule Test do
    @spec increment(number) :: integer
    def increment(a) do
       "Ahora devolvemos un string"
    end
end
``` 

Cuando compilamos, no recibimos ningún error. Ni siquiera un mísero *warning*. Elixir es dinámico, y ese código se lo traga perfectamente. Pero si utilizamos *Dialyzer* nos cantará el error antes que nadie.  


### Declarando tipos personalziados

Además de los tipos por defecto que existen en Elixir, también podemos declarar nuestros tipos personalizados, lo cual puede ser útil en algunas circunstancias. Por ejemplo, podemos declarar el tipo 


## Comportamientos en Elixir.

Y después del rollo, vamos a hablar de los comportamientos. En Elixir los comportamientos o *behaviours*, sirven para definir las funciones que debe implementar un módulo, y asegurarnos que todos los módulos que implementan ese comportamiento tengan dichas funciones. Para definir un comportamiento deberemos utilizar la directiva `callback`.

```Elixir
defmodule Printable do
  @callback print(String.t) :: String.t  
end
```

Aquí definimos un comportaminento, que podremos utilizar en otros módulos. Por ejemplo:

```Elixir
defmodule SmartWatch do
	@behaviour Printable
	
	def print(brand), do: "I'm a smartwatch of " <> brand	
end

defmodule Computer do
	@behaviour Printable
	
	def print(brand), do: "I'm a computer of " <> brand	
end
```

En ambos casos decimos que el módulo va a implementar el comportamiento `Printable` con la directiva `@behaviour`. ¿Pero qué pasa si no implementamos la función `print`? En ese caso recibiremos un *warning* al compilar.

```Elixir
defmodule MobilePhone do
	@behaviour Printable		
end
```

```
warning: undefined behaviour function print/1 (for behaviour Printable)
``` 

¿Y qué pasa si definimos una función `print`que devuelva un tipo diferente (por ejemplo un número)?

```Elixir
defmodule UnknownDevice do
	@behaviour Printable		
	
	def print(brand), do: 888
end
```

Pues no pasa absolutamente nada. Aunque hemos definido que tipo debe devolver la función con una especificación, no recibimos ni un triste *warning*. No debemos olvidar que estamos ante un lenguaje dinámico y esos detalles no le importan mucho al compilador.


## Y entonces ¿de qué vale esto?

Como hemos visto, a pesar de que Elixir nos da algunas opciones para gestionar tipos, estas no van más allá de poder utilizar algunas herramientas estáticas y generar documentación. 