---
layout: post
title:  Protocols en Elixir
---


Una de las partes más interesantes de un lenguaje es la de poder usar polimorfismo. Como os comenté [en el post sobre Behaviours]() en Elixir podíamos conseguir algo parecido. Pero además de los *Behaviours* también podemos usar *Protocols*, que nos permitirán usar el polimorfismo a nivel de tipo. Es decir que podemos tener distintas implementaciones de una función para distintos tipos de datos. Vamos a explicarlo.


## Definiendo Protocols

Bueno, pues vamos al lío para ver como podemos definir un protocolo. Para ello deberemos usar `defprotocol` de la siguiente manera (es un ejemplo sacado [de la documentación de Elixir](http://elixir-lang.org/getting-started/introduction.html):

```elixir
defprotocol Size do
  @doc "Calculates the size (and not the length!) of a data structure"
  def size(data)
end
```

Como se puede ver es algo bastante sencillo. Así que vamos a definir nuestro propio protocolo. Por ejemplo, vamos a crear un protocolo para la función `concat_reverse`, que generará un `string` para todos los elementos de una estructura y lo devolverá en orden inverso.

```elixir
defprotocol ConcatReverse do
  @doc "Devuelve un string con todos los elementos de la estructura concatenados y al revés"
  def concat_reverse(data)
end
```

Listo. Ya tenemos definido nuestro protocolo. Ahora solo tendremos que implementarlo para los tipos de datos que queramos. Primero el más sencillo para `string`

```elixir
defimpl ConcatReverse, for: BitString do
  def concat_reverse(data), do: String.reverse(data)
end
```

¿Qué hemos hecho aquí? Simplemente definir la implementación de un protocolo con `defimpl` para el tipo `string`. En esta implementación definimos la función `concat_reverse/1`, que lo único que hace es un `String.Reverse` del parámetro de entrada. ¿Fácil verdad?

Para usar esta implementación desde `Iex` solo tendremos que llamar a esa función y pasarle un `string` como parámetro.

```
iex(1)> import ConcatReverse
import ConcatReverse
ConcatReverse
iex(2)> ConcatReverse.concat_reverse("charlascylon")
ConcatReverse.concat_reverse("charlascylon")
"nolycsalrahc"
```

Podemos definir las implementaciones para cualquier tipo de Elixir. Por ejemplo para `Integer`, `List` o `Tuple`.

```elixir
defimpl ConcatReverse, for: Integer do
  def concat_reverse(data) do
    data
    |> to_string
    |> String.reverse
  end
end

defimpl ConcatReverse, for: List do
  def concat_reverse([]), do: ""
  def concat_reverse(data) do
    data
    |> Enum.join
    |> String.reverse
  end
end

defimpl ConcatReverse, for: Tuple do 
  def concat_reverse(data) do
    data
    |> Tuple.to_list
    |> Enum.join
    |> String.reverse
  end
end
```

Y para usar estas implementaciones solo tenemos que llamar a la función pasándole uno de los tipos especificados.

```
iex(3)> ConcatReverse.concat_reverse(12345)
ConcatReverse.concat_reverse(12345)
"54321"
iex(4)> ConcatReverse.concat_reverse([1,2,3,4,5])
ConcatReverse.concat_reverse([1,2,3,4,5])
"54321"    
iex(5)> ConcatReverse.concat_reverse({1,2,3,4,5})
ConcatReverse.concat_reverse({1,2,3,4,5})
"54321"
```

¿Y qué pasa si pasamos un tipo que no hemos definido? Pues lógicamente que recibiremos un bonito error:

```
iex(6)> ConcatReverse.concat_reverse(1.33)
ConcatReverse.concat_reverse(1.33)
** (Protocol.UndefinedError) protocol ConcatReverse not implemented for 1.33
    (blog_samples) lib/protocols/reverse_concat.ex:1: ConcatReverse.impl_for!/1
    (blog_samples) lib/protocols/reverse_concat.ex:3: ConcatReverse.concat_reverse/1
```

Para no sufrir estos errores, podemos utilizar implementaciones por defecto.

## Implementaciones por defecto

Definir implementaciones para todos los tipos puede ser un poco aburrido. Incluso puede ser que algunas implementaciones no tengan mucho sentido. Para paliar esto podemos hacer uso de implementaciones por defecto con `Any`. Un ejemplo sencillo para nuestra función `concat_reverse`

```elixir
defimpl ConcatReverse, for: Any do
  def concat_reverse(_), do: ""
end
```

En este caso estamos diciendo que da igual que tipo de dato entre como parámetro, que siempre devolveremos un `String` vacío. Antes de usar esta implementación por defecto, deberemos especificarlo en la definición del protocolo, con el atributo `@fallback_to_any`.

```elixir
defprotocol ConcatReverse do
  @fallback_to_any true

  @doc "Devuelve un string con todos los elementos de la estructura concatenados y al revés"
  def concat_reverse(data)
end
```

Y listo, ahora para otros tipos que no hayamos definido, en lugar de un error, recibiremos un `String` vacío.

```
iex(2)> ConcatReverse.concat_reverse(1.33)
ConcatReverse.concat_reverse(1.33)
""
iex(3)> ConcatReverse.concat_reverse(%{moto: 1222})
ConcatReverse.concat_reverse(%{moto: 1222})
""
```

## ¿Y cuándo usar protocols?

