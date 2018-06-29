---
layout: post
title:  Debugging Elixir
subtitle: O depurando en Elixir.
share-img: https://us.123rf.com/450wm/blankstock/blankstock1409/blankstock140905634/31711534-icono-de-la-muestra-bug-virus-simbolo-error-error-de-software-desinfeccion-circulo-de-boton-plano-co.jpg?ver=6
---

Programemos en el lenguaje que programemos, siempre nos acabamos dando cuenta de que necesitamos hacer *debug*. **Por mucho test que tengamos, por muy bien diseñado que esté nuestra aplicación, en algún momento habrá algo que no nos cuadre**. Un valor que no debería estar ahí, pero que está, una función que no se llama cuando tiene que llamarse, o cosas así. Para eso siempre viene bien poder depurar nuestro código para obtener información sobre nuestra aplicación en tiempo de ejecución.

Como no podía ser de otra manera, en Elixir también tenemos algunas opciones para depurar. Vamos a ver cuáles son.


## Dejando un log para saber qué es lo que estamos haciendo

Esta es seguramente la más cutre, pero a veces lo cutre es sencillo y rápido. Y quizá en algún momento nos interese utilizar esta opción. Seguro que con otros lenguajes de programación lo habéis utilizado. Yo por ejemplo he llegado a escribir `print` en horribles procedimientos almacenados de MS-SQLServer, para descifrar el flujo de ejecución de un procedimiento. En alguna aplicación de consola hecha con C# he escrito algún que otro `Console.WriteLine`. Y por supuesto, no os voy a engañar, he utilizado y sigo utilizando el `console.log` de JavaScript.

En Elixir por supuesto, también tenemos esta opción, y podemos utilizar `IO.puts` para escribir mensajes en la consola mientras se ejecuta la aplicación. Si queremos inspeccionar el valor de estructuras de Elixir podemos utilizar `IO.inspect` que incluso podemos utilizar con el operador pipe:

``` elixir
[1, 2, 3]
|> IO.inspect(label: "before")
|> Enum.map(&(&1 * 2))
|> IO.inspect(label: "after")
|> Enum.sum
```

Si somos un poco más cucos, podemos utilizar [Logger](https://hexdocs.pm/logger/Logger.html), que es una librería de Elixir que nos permite configurar la inspección de nuestra aplicación de manera mucho maś sencilla. Lo bueno de Logger es que se puede configurar tanto en archivos de configuración, como en tiempo de ejecución, y tenemos distintos niveles, que nos permiten mostrar u ocultar ciertos tipos de mensajes. Los tipo son más o menos los de siempre: `:debug`, `:info`, `:warn` y `:error`.

En definitiva, que una vez tengamos configurado nuestro Logger en el archivo de configuración, y le hayamos indicado el `backend` en el que debe escribir (normalmente pantalla o un archivo), podemos escribir *logs* con la siguiente sintaxis:

``` elixir
Logger.info "Este es un mensaje de información"
Logger.debug fn -> inspect(mi_variable) end
Logger.error "Excepción no controlada en  #{funcion}"
```

Pero esta opción es un poco tediosa, y además nos dejará el código lleno de ruido, que seguramente se nos olvidará quitar en algún momento. Yo la dejaría para cuando realmente queremos crear un log de nuestra aplicación.


## Utilizando IEx

Otra opción, un poquito más interesante, es la de usar `IEx` para poder depurar de nuestro código. Para eso deberemos usar `IEx.pry` que nos permitirá detener la ejecución de nuestra aplicación para poder acceder a su estado actual. Un ejemplo:

``` elixir
defmodule BlogSamples.Debug.Example1 do
  require IEx

  def test(n) do
    a = n + 1
    b = n * 2
    IEx.pry

    other(a)
    other(b)
  end

  defp other(n) when n < 10 do
    IO.puts(n)
  end

  defp other(n) do
    IO.puts(n)
  end
end
```

Aquí hay que prestar atención a dos líneas. Una es la línea que dice `require IEx` y la otra la que dice `IEx.pry`. Con la primera importamos las librerías necesarias, y con la segunda introducimos un punto de interrupción. Si desde la consola ejecutamos la aplicación y llamamos a la función `test/1`, la ejecución se parará y podremos ver el valor de algunos de los elementos en ese mismo momento:

```iex
iex(2)> BlogSamples.Debug.Example1.test(1)
Request to pry #PID<0.151.0> at lib/debugging/test_debug.ex:7

        a = n + 1
        b = n * 2
        IEx.pry
    
        other(a)

Allow? [Yn] Y

Interactive Elixir (1.4.5) - press Ctrl+C to exit (type h() ENTER for help)
pry(1)> a
2
pry(2)> b
2    
pry(3)> respawn
warning: variable "respawn" does not exist and is being expanded to "respawn()", please use parentheses to remove the ambiguity or change the variable name
  lib/debugging/test_debug.ex:3


Interactive Elixir (1.4.5) - press Ctrl+C to exit (type h() ENTER for help)
2
2
:ok
```

Al ejecutar la función, `IEx` nos pregunta si queremos permitir el acceso a `pry`. Le decimos que sí y accederemos a una línea de comandos dónde podremos ver el valor actual de nuestras variables. Escribiendo `respawn()` continuamos con la ejecución de la aplicación.

Lo bueno de esta opción es que nos da muchas más posibilidades pudiendo acceder a funciones como `IO.inspect` y similares, además de poder consultar un valor concreto. 

Es importante decir que para que `IEx.pry` funcione correctamente, todo el código hay que ejecutarlo desde `IEx`. Es decir que nuestro proyecto deberemos arrancarlo con `iex -S mix`.  Si estamos utilizando Phoenix, deberemos ejecutar `iex -S mix phoenix.start`, para poder depurar nuestra aplicación web con `pry`.


## Utilizando el debugger de Erlang.

Bueno, y como opción final, podemos utilizar `:debugger` que es una herramienta propia de Erlang que nos permitirá hacer muchas más cosas. Supongamos otro ejemplo, con el siguiente código:

``` elixir
defmodule BlogSamples.Debug.Example2 do

  def square_sum(x, y) do
    squarer(x, y) 
  end

  defp squarer(x, y) do
    s1 = x * x
    s2 = y * y

    s1 + s2
  end
end
```

En este caso, como podéis ver **no hay ninguna línea extra y el código es el original**. No hace falta hacer referencia a `IEx.pry`. De hecho es lo bueno de este método de depuración. Pero aunque no hay que poner nada en el código, si que hay hacer algún paso más. Así que abrimos `IEx` y ejecutamos las siguientes líneas:

```iex
iex(3)> :debugger.start()
:debugger.start()
{:ok, #PID<0.202.0>}
iex(4)> :int.ni(BlogSamples.Debug.Example2)
:int.ni(BlogSamples.Debug.Example2)
{:module, BlogSamples.Debug.Example2}
```

La primera línea `:debugger.start()` nos abrirá una ventana con el **debugger** de Erlang. Con la segunda línea que escribimos, `:int.ni(BlogSamples.Debug.Example2)` le decimos al depurador, que módulo queremos depurar. Entonces veremos como en la parte izquierda de la ventana que habíamos abierto antes, se habrá añadido nuestro módulo.

A partir de aquí ya tenemos las opciones más típicas para hacer depuración. Añadir puntos de ruptura o *breakpoints* en líneas concretas, en funciones, o incluso *breakpoints* condicionales. Cuando ejecutemos una función o línea con un punto de interrupción, la ejecución del programa se detendrá, y podremos inspeccionar el estado actual de ejecución de nuestro código.


![Erlang :debugger](/img/posts/2017/debugger.png)


> **Nota importante**: he tenido muchos problemas en Ubuntu para ejecutar `:debugger`. El repositorio de Erlang Solutions, me instala siempre una versión *release candidate* de Erlang (la 20). Haciendo downgrade del paquete `esl-erlang` a la versión 1.9.3, el depurador volvió a funcionar. Podéis ver como pude solucionarlo [gracias a la gente del foro de Elixir](https://elixirforum.com/t/observer-start-is-not-working-on-ubuntu/6018/10)

Y aquí lo dejamos. Como vemos en Elixir también podemos depurar, lo cual siempre puede ser útil. Eso sí, hay que tener en cuenta que este tipo de depuración no es muy útil en aplicaciones que explotan la concurrencia, y como sabemos [Elixir/Erlang se presta mucho a ello con OTP](https://charlascylon.com/2017-02-15-fail-fast) .




