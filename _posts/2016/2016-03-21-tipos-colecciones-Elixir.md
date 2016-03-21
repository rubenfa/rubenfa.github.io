---
layout: post
title: Tipos de colecciones en Elixir
---

Una parte importante de cualquier lenguaje de programación son las estructuras de datos que puede manejar, y entre ellas, las colecciones. Una colección estructura de datos utilizada para agrupar datos
con un significado común. Elixir puede manejar distintos tipos de colecciones y es importante que las conozcamos para poder utilizarlas de la mejor manera posible. Uno de los puntos importantes de 
Elixir, como buen lenguaje funcional, es que **todas las colecciones son inmutables**. Es decir, que una vez se ha creado una colección, ya no se puede modificar.

## Tuplas

Las tuplas son colecciones valores que pueden ser de distinto tipo. Normalmente tienen entre dos y cuatro valores, ya que hay otros tipos de colecciones mejor preparadas para trabajar con más datos. Las
tuplas se definen entre llaves `{}´.

```elixir
{"charlascylon", :elixir, 1}
```

Como ya sabemos, [todo en Elixir es pattern matching](www.charlascylon.com/2016-02-24-Elixir-y-el-pattern-matching), y por tanto podemos aprovecharlo. Una práctica común es devolver tuplas como resultado
de las operaciones de una función:

```elixir
defmodule Tuplas do
  def hi(string_arg) do        
    cond do
      string_arg == "hello" ->  {:ok, "hello"}
      string_arg == "bye" -> {:ok, "bye"}
      true -> {:error, :noval}
    end
  end
end
```
Con lo cual podemos utilizar la tupla devuelta para enlazar variables. Algunos ejemplos en `IEX`:

```
iex(5)> {:ok, resultado } = Tuplas.hi("bye")
{:ok, "bye"}
iex(6)> resultado
"bye"

iex(7)> {:ok, resultado } = Tuplas.hi("va a fallar")
** (MatchError) no match of right hand side value: {:error, :noval}
```

## Listas

Las listas son colecciones de datos enlazados. Una lista puede estar vacía, o contener una cabeza `head` y una cola `tail`. Es decir que una lista no vacía, estará compuesta por el primer elemento de la lista (`head`)
y el resto de elementos de la lista (`tail`). Con estos dos elementos y recursividad podemos hacer cosas muy interesantes, aunque lo dejamos para otro momento.

```
iex(11)> [cabeza | cola ] = [1, 2, 3, 4, 5, 6]
[1, 2, 3, 4, 5, 6]
iex(12)> cabeza
1
iex(13)> cola
[2, 3, 4, 5, 6]
```

Con las listas podemos hacer distintas operaciones como concatenar `++`, buscar los elementos diferentes `--` o comprobar si existe un elemento en la lista `in`.

```
iex(20)> lista1 = [1, 2 ,3]
[1, 2, 3]
iex(21)> lista2 = [2, 3, 4]
[2, 3, 4]
iex(22)> lista1 ++ lista2
[1, 2, 3, 2, 3, 4]
iex(23)> lista1 -- lista2
[1]
iex(24)> 1 in lista1
true
iex(25)> 1 in lista2
false 
```
 
## Listas clave-valor

Parecidas a las listas tenemos, las *keyword lists*, que no son más que listas de pares clave-valor. 

```
iex(10)> keywordlist = [nombre: "rubenfa", blog: "charlascylon", url: "charlascylon.com"]
[nombre: "rubenfa", blog: "charlascylon", url: "charlascylon.com"]
iex(11)> keywordlist[:nombre]
"rubenfa"
iex(12)> keywordlist[:url]
"charlascylon.com"
```

En el ejemplo podemos ver que para crear una lista de elementos clave valor utilizamos `:`. Elixir convierte las claves de la lista automáticamente en [atoms](http://www.charlascylon.com/2016-03-02-los-atoms-en-elixir) que podremos utilizar para acceder a valores
concretos.

Otro punto útil de este tipo de estructuras, es que podemos omitir los corchetes cuando, en una función se espera una lista de este tipo como último parámetro. Por ejemplo con esta función:

```elixir
defmodule Keyword.Test do    
  def concat(first_string , keyword_list) do   
      first_string <> keyword_list[:key_1] <> keyword_list[:key_2]
  end  
end
```

Podemos hacer lo siguiente:

```
iex(1)> Keyword.Test.concat "primero-", key_1: "uno", key_2: "dos"
"primero-unodos" 
```

Que es equivalente a esto:

``` 
iex(4)> Keyword.Test.concat "primero-", [key_1: "uno", key_2: "dos"]
"primero-unodos"
iex(5)> Keyword.Test.concat "primero-", [{:key_1, "uno"}, {:key_2, "dos"}]
"primero-unodos"
```
  
##Maps
 
Los mapas o  `Maps` son también colecciones de elementos clave-valor, pero se definen de forma diferente. Estos son algunos ejemplos:

``` 
iex(1)> provincias = %{"MAD" => "Madrid", "SEG" => "Segovia", "BCN" => "Barcelona"}
%{"BCN" => "Barcelona", "MAD" => "Madrid", "SEG" => "Segovia"}

iex(2)> provincias["BCN"]
"Barcelona"

iex(3)> provincias_atom = %{:mad => "Madrid", :seg => "Segovia", :bcn => "Barcelona"}
%{bcn: "Barcelona", mad: "Madrid", seg: "Segovia"}

iex(4)> provincias_atom[:bcn]
"Barcelona"

iex(5)> provincias_int = %{1 => "Madrid", 2 => "Segovia", 3 => "Barcelona"}
%{1 => "Madrid", 2 => "Segovia", 3 => "Barcelona"}

iex(6)> provincias_int[3]
"Barcelona"
```

En el caso de que las claves de los mapas sean `atoms`, podremos utilizar *notación punto* (traducción ~~cutre~~ libre de *dot notation*).

```
iex(7)> provincias_atom.bcn
"Barcelona"
iex(8)> provincias_atom.mad
"Madrid"
```

En cualquier caso, si la clave no existe, recibiremos un `KeyError`

```
iex(9)> provincias_atom.madd
** (KeyError) key :madd not found in: %{bcn: "Barcelona", mad: "Madrid", seg: "Segovia"}
```

Y bueno, aunque hay algún tipo de colección más, como los binarios, de momento lo dejamos aquí. Nos vemos en la siguiente entrada. 