---
layout: post
title:  Protocols en Elixir
---


Una de las partes más interesantes de un lenguaje es la de poder usar polimorfismo. Como os comenté [en el post sobre Behaviours](http://charlascylon.com/2016-11-30-behaviours-en-elixir) en Elixir podíamos conseguir algo parecido. Pero además de los *Behaviours* también podemos usar *Protocols*, que nos permitirán usar el polimorfismo a nivel de tipo. Es decir que podemos tener distintas implementaciones de una función para distintos tipos de datos. Vamos a explicarlo.


## Definiendo Protocols

Bueno, pues vamos al lío para ver como podemos definir un protocolo. Para ello deberemos usar `defprotocol` de la siguiente manera (es un ejemplo sacado [de la documentación de Elixir](http://elixir-lang.org/getting-started/introduction.html)):

```elixir
defprotocol Size do
  @doc "Calculates the size (and not the length!) of a data structure"
  def size(data)
end
```

No tiene mucho misterio, así que vamos a definir nuestro propio protocolo. Por ejemplo, vamos a crear un protocolo para la función `concat_reverse`, que generará un `string` para todos los elementos de una estructura y lo devolverá en orden inverso.

```elixir
defprotocol ConcatReverse do
  @doc "Devuelve un string con todos los elementos de la estructura concatenados y al revés"
  def concat_reverse(data)
end
```

Listo. Ahora solo tendremos que implementar el protocolo para los tipos de datos que queramos. Primero el más sencillo para `string`

```elixir
defimpl ConcatReverse, for: BitString do
  def concat_reverse(data), do: String.reverse(data)
end
```

¿Qué hemos hecho aquí? Simplemente definir la implementación de un protocolo con `defimpl` para el tipo `string`. En esta implementación definimos la función `concat_reverse/1`, que lo único que hace es un `String.Reverse` del parámetro de entrada. ¿Fácil verdad?

Para usar esta implementación desde `Iex` solo tendremos que llamar a esa función y pasarle un `string` como parámetro.

```iex
iex(1)> import ConcatReverse
import ConcatReverse
ConcatReverse
iex(2)> ConcatReverse.concat_reverse("charlascylon")
ConcatReverse.concat_reverse("charlascylon")
"nolycsalrahc"
```

De la misma manera podemos definir las implementaciones para otros tipos de Elixir como `Integer`, `List` o `Tuple`.

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

Y al igual que antes, para usar estas implementaciones solo tenemos que llamar a la función pasándole uno de los tipos especificados.

```iex
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

```iex
iex(6)> ConcatReverse.concat_reverse(1.33)
ConcatReverse.concat_reverse(1.33)
** (Protocol.UndefinedError) protocol ConcatReverse not implemented for 1.33
    (blog_samples) lib/protocols/reverse_concat.ex:1: ConcatReverse.impl_for!/1
    (blog_samples) lib/protocols/reverse_concat.ex:3: ConcatReverse.concat_reverse/1
```

Para no sufrir estos errores, podemos utilizar implementaciones por defecto.

## Implementaciones por defecto

Definir implementaciones para todos los tipos puede ser un poco aburrido. Incluso puede ser que algunas implementaciones no tengan mucho sentido. Para paliar esto podemos hacer uso de implementaciones por defecto con `Any`. Un ejemplo sencillo para nuestra función `concat_reverse`:

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

```iex
iex(2)> ConcatReverse.concat_reverse(1.33)
ConcatReverse.concat_reverse(1.33)
""
iex(3)> ConcatReverse.concat_reverse(%{id: 1222})
ConcatReverse.concat_reverse(%{id: 1222})
""
```

## Usando protocolos en el mundo real ™

Ya hemos visto cómo funcionan los protocolos, pero ¿cuándo usarlos en el mundo real? **Los protocolos, son una estupenda herramienta para extender código en Elixir, aunque nosotros no seamos los propietarios del código**. Por ejemplo si creamos una librería para parsear páginas web, podemos crear un protocolo e implementarlo para los tipos comunes de Elixix (`String`, `Integer`, `List` etc.), pero dejar que los desarrolladores que la utilicen, puedan extenderla para sus propias estructuras.

Esto es algo que hace *[Poison](https://github.com/devinus/poison#encoder)*, una librería utilizada para serializar y deserializar **JSON**. Vamos a definir una nueva estructura:

```elixir
defmodule CustomParser.Product do
  @derive [Poison.Encoder]
  defstruct [:id, :name, :description, :price]
end
```
En nuestra estructura `Product` estamos diciendo que esta debe derivar de `Posion.Encoder` que es el protocolo que utiliza *Poison*. Ahora vamos a definir una implementación personalizada.


```elixir
defimpl Poison.Encoder, for: CustomParser.Product do
  def encode(%{id: id, name: name, description: description, price: price}, options) do
    %{
      id: id,
      name: name,
      description: description,
      price: "€ #{price}"
    } |>  Poison.Encoder.encode(options)
  end
end
```
En esta implementación, lo único que hacemos es cambiar el campo `price` para incluir el símbolo del euro. Y aquí un ejemplo de como se utilizaría.

```iex
iex(1)> alias CustomParser.Product
alias CustomParser.Product
CustomParser.Product
iex(2)> product = %Product{id: 122, name: "Laptop", description: "Lenovo laptop", price: 345.55}
product = %Product{id: 122, name: "Laptop", description: "Lenovo laptop", price: 345.55}
%CustomParser.Product{description: "Lenovo laptop", id: 122, name: "Laptop",
 price: 322.44}
iex(3)> Poison.encode(product)
Poison.encode(product)
{:ok,
 "{\"price\":\"€ 345.55\",\"name\":\"Laptop\",\"id\":122,\"description\":\"Lenovo laptop\"}"}
```

Y con este último ejemplo acabamos. Hemos visto que junto con los *behaviours*, los *protocols* son una herramienta potente para extender código en Elixir. Espero que te haya sido útil.
