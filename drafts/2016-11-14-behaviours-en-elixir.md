---
layout: post
title:  Behaviours en Elixir
---

En programacion orientada a objetos, nos pasamos el día utilizando interfaces. Se podría decir que una interfaz es un contrato que especifica que métodos y propiedades deben tener las clases que  implementen dicho contrato. Así, si decimos que una clase implementa el contrato (interfaz) `IPrintable`, esa clase deberá tener un método `PrintMessage` que hará algo con un `string` 

Aunque Elixir no es un lenguaje orientado a objetos, también tenemos la posibilidad de utilizar algo parecido a las interfaces: los behaviours (comportamientos).


## Los behaviours en Elixir.

En Elixir los comportamientos o *behaviours*, sirven para definir las funciones que debe implementar un módulo, y asegurarnos que todos los módulos que implementan ese comportamiento tengan dichas funciones. Para definir un comportamiento deberemos utilizar directivas

