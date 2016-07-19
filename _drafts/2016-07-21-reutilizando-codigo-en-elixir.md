---
layout: post
title:  Reutilizando código en Elixir
subtitle: alias, use, import y require
---


Cuando uno viene de programar en `C#`, piensa que utilizar código de otros proyectos o `namespaces` será igual de sencillo en todos los lenguajes. Pero resulta que hay lenguajes como Elixir en los que la cosa no es tan sencilla y existen varias maneras de compartir código entre módulos. Sin duda es una de las cosas que más me ha costando pillar (igual es que soy un zote), así que he pensado en escribirlo para aclararme yo, y de paso aclarar a quién pueda leerlo.

## Alias

Esta es sin duda la directiva más fácil de entender. Aunque no se utiliza para compartir código, si puede simplificar mucho lo que escribamos. 

En Elixir, no existen `namespaces`, pero se pueden prefijar los módulos para tenerlos organizados. Podemos imaginar el siguiente módulo:

```elixir
defmodule Console.Writer do
  def write_line(text) do
    IO.puts(text)
  end
end
```

El módulo es sencillo de entender. Cuando dese otro módulo, queramos escribir algo en la consola, solo tendremos que escribir `Console.Writer.write_line "mensaje en pantalla"`. Si solo lo tenemos que escribir una vez, no hay problema, pero ¿y si lo utilizamos muchas veces? Entonces es cuando `alias` nos puede servir de ayuda. Por ejemplo si al principio de nuestro módulo, escribimos lo siguiente:

```elixir
alias Console.Writer 
```

Nos bastará con poner `Writer.write_line "mensaje en palntalla"`, para hacerlo funcionar. Pero si todavía queremos reducir más, o poner otro nombre diferente podemos hacer esto:

```elixir
alias Console.Writer as: console
```
Ahora usar nuestro `Writer` será tan sencillo como escribir `console.write_line "mensaje en pantalla"`

## Import

Con `import` podemos hacer algo parecido a `alias`, pero en este caso además importamos las funciones para que podamos utilizarlas directamente en nuestros módulos. Se ve mejor con un ejemplo. Si abrimos `iex` y directamente tratamos de usar la librería `Enum`, pasará esto:

```
iex(1)> sort [2, 1, 5]
** (CompileError) iex:1: undefined function sort/1
```

Si hacemos `Enum.sort [2, 1, 4]` el código funcionará, pero como vemos estamos obligados a escribir el nombre completo. En cambio con un `import` al principio funcionará sin problemas:

```
iex(1)> import Enum
Enum
iex(2)> sort [2,1,5]
[1, 2, 5]
```


