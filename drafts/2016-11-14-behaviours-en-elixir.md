---
layout: post
title:  Behaviours en Elixir
---

En programación orientada a objetos, nos pasamos el día utilizando interfaces. Se podría decir que una interfaz es un contrato que especifica que métodos y propiedades deben tener las clases que  implementen dicho contrato. Así, si decimos que una clase implementa el contrato (interfaz) `IPrintable`, esa clase deberá tener un método `PrintMessage` que hará algo con un `string` 

Aunque Elixir no es un lenguaje orientado a objetos, también tenemos la posibilidad de utilizar algo parecido a las interfaces: los *behaviours* (comportamientos). Pero antes de hablar de *behaviours* hay que hablar de otra cosa: los *typespecs*.


## typespecs

Elixir es un lenguaje dinámico, por lo que los tipos de datos se infieren en tiempo de ejecución. Esto tiene sus cosas buenas, y sus cosas malas, pero no vamos a discutirlas aquí. A pesar de ser dinámico, Elixir nos permite definir tipos personalizados y declarar funciones tipadas. Y eso lo podemos hacer a través de los *typespecs*.

### Declarando funciones tipadas

Con funciones tipadas, me refiero a que podremos saber qué tipo de dato va a devolver una función en tiempo de compilación. Para hacer esto, deberemos usar `@spec`. Un ejemplo:

``` Elixir
defmodule Test do
    @spec increment(number) :: integer
    def increment(a), do: a + 1
end
``` 

Cómo veis el ejemplo es muy sencillo. Definimos una función `increment`, que lo único que hace es sumar uno, al número pasado como parámetro



## Comportamientos en Elixir.

En Elixir los comportamientos o *behaviours*, sirven para definir las funciones que debe implementar un módulo, y asegurarnos que todos los módulos que implementan ese comportamiento tengan dichas funciones. Para definir un comportamiento deberemos utilizar directivas

