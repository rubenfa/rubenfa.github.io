
La programación funcional está de moda. Cada vez hay más lenguajes que adoptan este paradigma, pero lo que es más importante, los desarrolladores cada vez adoptan más lenguajes de este tipo. Scala, F#, Clojure y otros viejos rockeros como Erlang o Haskell empiezan a estar en boca de muchos de los programadores del sector.

Uno de los nuevos en la ciudad, es Elixir, un lenguaje funcional, concurrente y pensado para hacer aplicaciones mantenibles y escalables.


## Elixir

Elixir es un lenguaje creado en 2011 por José Valim, y aunque la sintaxis es nueva, el lenguaje corre sobre la máquina virtual de Erlang (BEAM). Esto hace que el lenguaje, a pesar de ser muy joven, sea robusto y con mucha funcionalidad. Además, como el lenguaje se compila a bytecode de Erlang, se puden utilizar funciones de ese lenguaje, sin ningún tipo de penalización.

Elixir, al igual que Erlang, es un lenguaje dinámico, por lo que los fallos los recibiremos en tiempo de ejecución, por ejemplo si una función no existe, e intentamos llamarla. El tipado de Elixir, aun siendo dinámico, es fuerte, por lo que no están permitidas cosas que sí están permitidas en lenguajes con un tipado más débil, como JavaScript. Por ejemplo, la operación `1 + "1"` es perfectamente válida en JavaScript, pero provoca un error de ejecución en Elixir.

## Instalación y configuración

Instalar Elixir es muy sencillo y bastan con seguir los pasos [que se indican en su página web](https://elixir-lang.org/install.html). Podemos instalarlo en Linux, Windows o Mac sin demasiados problemas. 

Una vez lo hayamos hecho, no hay que realizar ninguna configuración adicional. Escribiendo `iex` en la línea de comandos accederemos al REPL(Read-Eval-Print-Loop) de Elixir, que nos permitirá ejecutar instrucciones de Elixir. De hecho, podríamos escribir una aplicación entera desde esta consola.



## Organización y sintaxis

La sintaxis de Elixir se basa en la sintaxis de Ruby, por lo que las personas con algo de experiencia en ese lenguaje encontrarán familiar la manera de escribir código en Elixir. Veamos un ejemplo:

```
defmodule GenbetaDev.Syntax.Example1 do

  def print(option) do
    option
    |> get_message
    |> IO.puts
  end

  defp get_message(opt) do
    cond  do
      opt == 1 -> "Hello"
      opt == 2 -> "Hello, World"
      true -> "Hello planet Earth"
    end
  end
end
```

Todo el código en Elixir, se organiza en módulos con `defmodule` y dentro de esos módulos se declaran las funciones que compondrán nuestro programa. Las funciones pueden ser públicas `def` y accesibles desde fuera del módulo, o privadas `defp` y solo accesibles si son llamadas desde dentro del mismo módulo. Las funciones en Elixir se distinguen por su nombre y número de parámetros (arity). La función `get_message` del ejemplo, es descrita por el compilador de Elixir como `get_message/1`. Si tuviéramos otra función con el mismo nombre, pero que recibiera dos parámetros sería `get_message/2`.

Aunque en Elixir no existen los namespaces, por convención, se suelen nombrar los módulos de manera que queden organizados. Por ejemplo en nuestro ejemplo el módulo se llama `GenbetaDev.Syntax.Example1`, lo que podría ser algo así como el nombre del proyecto o aplicación, luego el grupo de módulos, y al final el nombre concreto del módulo. Cuando estos nombres son demasiado largos, podemos utilizar el operador `alias`, y así escribir solo la última parte del nombre (en este caso `Example1`).

## La magia del Pattern-matching

Una de las características más interesantes de Elixir es el pattern matching. Si bien la mayoría de los lenguajes funcionales poseen este tipo de mecanismo, en Elixir se utiliza de una manera muy elegante. El pattern matching o concordancia de patrones, no es más que buscar una similitud con un patrón, para realizar una acción concreta. En Elixir, este pattern matching está continuamente presente, así que por ejemplo podemos ver cosas como estas (desde iex en este caso):

```
iex(1)> x = 1
1
iex(2)> 1 = x
1
iex(3)> 2 = x
** (MatchError) no match of right hand side value: 1
```

Primero asignamos el valor 1 a una variable. Luego utilizamos el operador `=` para comprobar si hay concordancia. En el primer caso sí la hay, ya que `x = 1`, en el segundo no, y Elixir nos muestra une error.

Si complicamos el ejemplo, podemos ver que el pattern matching funciona con también con tuplas:

```
iex(4)> {a, b, c} = {1, :error, "not found"}
{1, :error, "not found"}
iex(5)> {2, :error, "null exception"} = {a, b, c}
** (MatchError) no match of right hand side value: {1, :error, "not found"}
    
iex(5)> {1, :error, "not found"} = {a, b, c}     
{1, :error, "not found"}
iex(6)> 1 = a
1    
iex(7)> :error = b
:error
iex(8)> "not found" = c
"not found"
iex(9)> :ok = b
** (MatchError) no match of right hand side value: :error
```

O con listas:

```
iex(10)> [a, b, c] = [1, 2, 3]
[1, 2, 3]
iex(11)> a
1
iex(12)> 9 = a
** (MatchError) no match of right hand side value: 1
    
iex(12)> [3, 4, 5] = [a, b, c]
** (MatchError) no match of right hand side value: [1, 2, 3]
    
iex(12)> [1, 2, 3] = [a, b, c]
[1, 2, 3]
```

Pero sin duda, donde más útil es el pattern matching, es a la hora de llamar a funciones. Por ejemplo este sería el código del típico FizzBuzz. 

```
defmodule GenbetaDev.Examples.FizzBuzz do

  def start(first, last) do
    first..last
    |> Enum.each(fn(x) -> check(x) end)
  end

  defp check(number) when rem(number, 15) == 0, do: IO.puts("FizzBuzz") 
  defp check(number) when rem(number, 3) == 0, do: IO.puts("Fizz")
  defp check(number) when rem(number, 5) == 0, do: IO.puts("Buzz")
  defp check(number), do: IO.puts("#{number}")

end
```

Si un número es divisible por 3 escribimos "Fizz". Si es divisible por 5 escribimos "Buzz". Si es divisible por ambos escribimos "FizzBuzz". En cualquier otro caso escribimos el número.

En el ejemplo definimos cuatro funciones que se llaman igual, y que reciben el mismo número de parámetros. Con las cláusulas de guarda `when` definimos las condiciones que se debe cumplir para que el pattern matching utilice esa función. Elixir va comprobando de arriba a abajo, que función es la que debe utilizar. Por tanto el caso más específico deberá estar siempre al principio y el más general al final. Lo bueno es que el pattern matching en funciones, no tiene porque aplicarse con cláusulas de guarda, si no que podemos aplicarlo al valor del parámetro. Por ejemplo con tuplas:

``` 
def print_result({:ok, _}), do: IO.puts("operación completada con éxito")
def print_result({:error, message}), do: IO.puts(message)
def print_result(_), do: Io.puts("Error en el parámetro recibido")
```

En definitiva, el pattern matching nos evita tener que escribir multitud de sentencias condicionales que harían el código más complicado de seguir. De hecho, la recomendación general, es utilizar pattern matching siempre que se pueda.
