---
layout: post
title:  Cláusula With en Elixir
share-img: https://elixir-lang.org/images/logo/logo.png
---

Lo bueno de un lenguaje que está principalmente guiado por la comunidad, es que va evolucionando según las necesidades que se van encontrando sus usuarios. Un ejemplo es el que nos encontramos con la cláusula `with` de Elixir, que fue introducido en la versión 1.2 del lenguaje, y mejorado en la 1.3 para incluir la cláusula `else`.


## El problema

Primero vamos a ver el problema que soluciona. Supongamos que tenemos una [estructura](http://charlascylon.com/2016-08-03-usando-estructuras-en-elixir) del tipo `%User{}`. La estructura tendrá los campos típicos que tiene un usuario de una aplicación.

```elixir
defmodule Example.With.User do
  defstruct name: "", age: 0, mail: "", accept_privacy: false, mail_sucriber: false
end
```

Ahora vamos a definir una serie de validaciones que realizará nuestro programa para gestionar este usuario. Algunas de las validaciones serán comprobar que es mayor de 18, que el nombre es válido,  o que ha aceptado las políticas de privacidad.

```elixir
defmodule Example.With.Program1 do

  alias Example.With.User

  def verify(user = %User{}) do
    users
    |> validate_name
    |> validate_age
    |> accepted_privacy
  end

  defp validate_name(user = %User{ name: n}) when length(n) == 0 do
    {:error, "Name is mandatory"}
  end

  defp validate_name(user = %User{}) do
    n = user.name

    case Regex.match?(~r/^[A-Z]\w{5,}/, n) do
      true -> user
      false -> {:error, "Name is not correct"}
    end
  end

  defp validate_age(user = %User{ age: a}) when a >= 18 do
    user
  end

  defp validate_age(%User{ age: a}) when a < 18 do
    {:error, "You are not 18 years old"}
  end

  defp accepted_privacy(%User{ accept_privacy: p}) when p == false do
    {:error, "You have to accept our privacy policy"}
  end

  defp accepted_privacy(user = %User{}) do
    user
  end
end
```

¿Veis cuál es el problema? El operador pipe `|>` es un instrumento genial para enlazar funciones. Pero claro, estas funciones tienen que ser consistentes y devolver siempre un mismo tipo de resultado. El problema es que por ejemplo `validate_name` puede devolver un `:error`, haciendo que recibamos un error en tiempo de ejecución, ya que una función envía una tupla, pero la siguiente espera recibir una estructura `%User{}`. 

En este caso no nos sirve el pipe, así que en definitiva, necesitamos algo que sirva para concatenar funciones y que permita gestionar los errores. Y para eso entre otras cosas se utiliza `with`.


## With

Como el movimiento se muestra andando, vamos a reescribir el ejemplo anterior, pero usando `with`. Ahí va:

```elixir
 def verify(user = %User{}) do
    with %User{} <- validate_name(user),
         %User{} <- validate_age(user),
         %User{} <- accepted_privacy(user)
      do
        user 
      else
        {:error, e}->  IO.puts(e)
     end
  end
```

Como veis solo he cambiado la función `verify`, ya que el resto puede seguir igual. Con `with` iremos ejecutando las diferentes funciones, siempre que el [pattern matching](http://charlascylon.com/2016-02-24-Elixir-y-el-pattern-matching) se vaya cumpliendo. En el caso de que no se cumpla en algún caso se pasará al bloque `else`. En este bloque también podemos tener *pattern matching*, y tener varias cláusulas. Yo solo he puesto un `{:error, e}`, pero podríamos ponero distintos tipos de error según su mensaje y hacer diferentes opciones.


