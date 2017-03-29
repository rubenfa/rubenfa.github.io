---
layout: post
title:  Jugando con strings en Elixir
share-img: https://s.yimg.com/ny/api/res/1.2/OQkvI_20nXmxyrTrs3zJIg--/YXBwaWQ9aGlnaGxhbmRlcjtzbT0xO3c9NzIwO2g9NDgwO2lsPXBsYW5l/http://listings.zenfs.com/en-US/cms/autos/Boldride/Ghostbusters-Ecto-1-2.jpg
---

En el Elixir a diferencia de otros lenguajes, los strings, son tratados directamente como binarios. De hecho la gente que programa en Elixir habla muy bien de la gestión que hace el lenguaje. En la [propia documentación de Elixir](http://elixir-lang.org/getting-started/binaries-strings-and-char-lists.html) "presumen" de que Elixir pasa todos los test del interesante post [the string type is broken](http://elixir-lang.org/getting-started/binaries-strings-and-char-lists.html). En este post voy a explicar algunas cosillas sobre los strings.


## El tipo string

Como ya he dicho en Elixir los strings son directamente binarios (codificados en UTF-8). ¿Y esto qué quiere decir? Pues por ejemplo que en `iex` podemos escribir cosas así:

```
iex(2)> <<97, 98, 99, 100>>
"abcd"
``` 

Con `<<` y `>>` en Elixir podemos representar binarios, que es lo que estamos haciendo en el ejemplo. En este caso estamos definiendo los caracteres *abcd* con su correspondiente representación UTF-8.

Una vez comprendido esto, podemos ver que los strings tienen muchas posibilidades.

## Listas de caracteres

Para definir un string en Elixir deberemos hacerlo con comillas dobles `"` ya que si lo hacemos con comillas simples `'` estaremos definiendo una lista de caracteres (representadas por números enteros). Un ejemplo:

```
iex(1)> char_list = 'abc' 
'abc'
iex(2)> "abc" = 'abc' 
** (MatchError) no match of right hand side value: 'abc'
    
iex(3)> char_list ++ 'd'
'abcd'

iex(4)> [head | tail] = char_list 
'abc'
iex(5)> head
97
iex(6)> tail
'bc'
```

## Heredocs

Al utilizar comentarios en el texto, lo más normal es que utilicemos saltos de línea y otros caracteres especiales.  Para poder realizar esas operaciones en Elixir utilizaremos los heredocs, que son strings representados por `"""`. Es muy común verlos en Elixir tras `@doc` ya que se utiliza para generar documentación de forma automática. Un ejemplo sacado de Ecto:

``` elixir
 @doc """
  Compare two datetimes.
  Receives two datetimes and compares the `t1`
  against `t2` and returns `:lt`, `:eq` or `:gt`.
  """
```
Es importante destacar que las triples comillas de cierre deben ir en una nueva línea.

## Interpolación de strings

Hasta hace no mucho en C# la interpolación de strings era un verdadero suplicio, ya que debíamos hacerlo con `String.format`. Desde que añadieron la interpolación de strings con `$`, esto ha mejorado muchísimo. En Elixir por suerte, esto viene desde el principio y se utiliza de forma similar.

``` 
iex(1)> name = "Pedro"
"Pedro"
iex(2)> "Hola #{name}"
"Hola Pedro"
```



### Pattern matching con strings

Ya sabéis que el [pattern matching en Elixir](http://charlascylon.com/2016-02-24-Elixir-y-el-pattern-matching) es una de las características más potentes del lenguaje. Lo bueno es que aprovechando que los strings son binarios, podemos hacer *pattern matching* sobre ellos. Un ejemplo:

``` elixir
defmodule StringsExamples do
  def command_parser("write:" <> text) do
    IO.puts(text)
  end

  def command_parser("reverse:" <> text) do
    String.reverse(text) |> IO.puts
  end

  def command_parser("uppercase:" <> text) do
    String.upcase(text) |> IO.puts
  end

  def command_parser(_) do
    IO.puts("Command not found")
  end
end
```

En un momento hemos hecho una especie de procesador de comandos, con las opciones `write:`, `reverse:` y `uppercase:`. Para que funcionen estamos diciendo por *pattern matching* que si por ejemplo un comando empieza por "write:" hagamos algo con el resto del string. Veamos como funciona en `iex`.

```
iex(1)> StringsExamples.command_parser("write:uno,dos,tres")
StringsExamples.command_parser("write:uno,dos,tres")
uno,dos,tres
:ok
iex(2)> StringsExamples.command_parser("reverse:uno,dos,tres")
StringsExamples.command_parser("reverse:uno,dos,tres")
sert,sod,onu
:ok
iex(3)> StringsExamples.command_parser("uppercase:uno,dos,tres")
StringsExamples.command_parser("uppercase:uno,dos,tres")
UNO,DOS,TRES
:ok
iex(4)> StringsExamples.command_parser("other:un,dos,tres")
StringsExamples.command_parser("other:un,dos,tres")
Command not found
:ok
```

No obstante el hacer *pattern matching* sobre strings tiene una limitación, y es que debemos conocer el tamaño del string. 

``` elixir
def invalid_parser(text <> ":no_compile") do
    IO.puts(text)
end
```

Si tratamos de añadir esa función a Elixir recibiremos un error de compilación diciendo que `a binary field without size is only allowed at the end of a binary pattern`, y esto es sencillamente porque como `text` puede tener cualquier tamaño, no puede procesarlo correctamente. 


