
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

Todo el código en Elixir, se organiza en módulos con `defmodule` y dentro de esos módulos se declaran las funciones que compondrán nuestra aplicación. Las funciones pueden ser públicas `def` y accesibles desde fuera del módulo, o privadas `defp` y solo accesibles si son llamadas desde dentro del mismo módulo. Las funciones en Elixir se distinguen por su nombre y número de parámetros (arity). La función `get_message` del ejemplo, es descrita por el compilador de Elixir como `get_message/1`. Si tuviéramos otra función con el mismo nombre, pero que recibiera dos parámetros sería `get_message/2`.

Aunque en Elixir no existen los *namespaces*, por convención, se suelen nombrar los módulos de manera que queden organizados. Por ejemplo en nuestro ejemplo el módulo se llama `GenbetaDev.Syntax.Example1`, lo que podría ser algo así como el nombre del proyecto o aplicación, luego el grupo de módulos, y al final el nombre concreto del módulo. Cuando estos nombres son demasiado largos, podemos utilizar el operador `alias`, y así escribir solo la última parte del nombre (en este caso `Example1`).

## La magia del Pattern-matching

Una de las características más interesantes de Elixir es el pattern matching. Si bien la mayoría de los lenguajes funcionales poseen este tipo de mecanismo, en Elixir se utiliza de una manera muy elegante. **El pattern matching o concordancia de patrones, no es más que buscar una similitud con un patrón, para realizar una acción concreta**. En Elixir, este pattern matching está continuamente presente, así que por ejemplo podemos ver cosas como estas (desde iex en este caso):

```
iex(1)> x = 1
1
iex(2)> 1 = x
1
iex(3)> 2 = x
** (MatchError) no match of right hand side value: 1
```

Primero asignamos el valor 1 a una variable. Luego utilizamos el operador `=` para comprobar si hay concordancia. En el primer caso sí la hay, ya que `x = 1`, en el segundo no, y Elixir nos muestra une error.

Si complicamos el ejemplo, podemos ver que el pattern matching funciona también con tuplas:

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

Y que también funciona con listas:

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

Como ya he dicho el pattern matching suele ser una característica de los lenguajes funcionales, pero en Elixir está incluido de tal manera, que casi se nos invita a usarlo. Por ejemplo, a la hora de llamar a funciones es terriblemente útil. Por ejemplo este sería el código del típico FizzBuzz. 

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

En el ejemplo definimos cuatro funciones que se llaman igual, y que reciben el mismo número de parámetros. Con las cláusulas de guarda `when` definimos las condiciones que se debe cumplir para que el pattern matching utilice esa función. Elixir va comprobando de arriba a abajo, que función es la que debe utilizar. Por tanto el caso más específico deberá estar siempre al principio y el más general, al final. Lo bueno del pattern matching en funciones, es que no tiene porque aplicarse con cláusulas de guarda, si no que podemos aplicarlo al valor del parámetro. Por ejemplo con tuplas:

``` 
def print_result({:ok, _}), do: IO.puts("operación completada con éxito")
def print_result({:error, message}), do: IO.puts(message)
def print_result(_), do: Io.puts("Error en el parámetro recibido")
```

En definitiva, el pattern matching nos evita tener que escribir multitud de sentencias condicionales que harían el código más complicado de seguir. De hecho, la recomendación general, es utilizar pattern matching siempre que se pueda. Y de hecho es tan sencillo hacerlo, que no solemos encontrar impedimentos.


## Funciones como ciudadanos de primera clase

Como buen lenguaje funcional, Elixir utiliza las funciones como ciudadanas de primera clase. Esto quiere decir que las funciones pueden pasarse como parámetros, o recibirlas como resultado de una función. 

Ya hemos visto antes que podemos definir funciones con `def` y `defp`. Además podemos también definir funciones anónimas:

```
iex(18)> myfun = fn(x) -> x * 2 end
#Function<6.87737649/1 in :erl_eval.expr/5>    
iex(19)> myfun.(2)  
4
iex(23)> myfun3 = fn(x) -> myfun.(x) + 1 end
#Function<6.87737649/1 in :erl_eval.expr/5>
iex(24)> myfun3.(2)
5
```

En cualquier caso, las funciones las podemos asignar a variables, o incluso pasarlas como parámetro de otra función.  Por ejemplo

```
defmodule GenbetaDev.Examples.FirstClassFunctions do
  def executor(func, n) do
    func.(n)
  end
end
```
La función del ejemplo recibe otra función como primer parámetro y la ejecuta con el segundo parámetro `n`. En elixir para ejecutar una función contenida en una variable, siempre hay que hacerlo añadiendo `.()`. Dos ejemplos:

```
iex(3)> alias GenbetaDev.Examples.FirstClassFunctions
alias GenbetaDev.Examples.FirstClassFunctions
GenbetaDev.Examples.FirstClassFunctions

iex(4)> FirstClassFunctions.executor(fn(x) -> x * 3 end , 4)
FirstClassFunctions.executor(fn(x) -> x * 3 end , 4)
12

iex(5)> FirstClassFunctions.executor(fn({x, y}) -> x <> y  end , {"hola", " GenbetaDev"})
FirstClassFunctions.executor(fn({x, y}) -> x <> y  end , {"Hola", " GenbetaDev"})
"Hola GenbetaDev" 
```

## OTP la *killer feature* de Elixir

La sintaxis de Elixir es bastante asequible para todo tipo de programadores y el pattern matching, está muy logrado y es fácil de utilizar, pero ¿es esto suficiente para adoptar Elixir? Probablemente no, pero si pensamos en las posibilidades que tenemos con OTP, la cosa cambia.

OTP (Open Telecom Platform) es un conjunto de librerías y funcionalidades de Erlang, que permiten trabajar de forma fácil y asequible con programación concurrente. Y como no podía ser de otra manera Elixir bebe de ello para ofrecernos la posibilidad de utilizarlo. 

Hay que tener en cuenta que Erlang y OTP estaban pensados inicialmente para su uso en centralitas telefónicas, así que a la hora de diseñar OTP se basaron en un modelo de actores. Esto quiere decir, que los procesos concurrentes, son totalmente independientes y no comparten ningún tipo de información. Cuando un proceso quiere comunicarse con otro, solo puede hacerlo a través de un buzón, que el proceso de destino procesará cuando crea conveniente.

Esto hace que los procesos (actores) que arranquemos con OTP sean muy livianos y apenas consuman recursos. El resultado es que podemos arrancar cientos de miles de procesos sin apenas penalización para el sistema. Esto nos da una potencia verdaderamente increíble.

Obviamente, con este nivel de de concurrencia, necesitamos herramientas que nos permitan gestionar la ejecución (y fallo) de los procesos que se lancen. Y para esto tenemos los supervisores. 


### Usando supervisores

Un supervisor se encarga de arrancar tantos procesos hijos como sean necesarios. Los supervisores se configuran con una estrategia determinada, que seguirán en caso de que alguno de los procesos hijos tenga problemas. Por ejemplo, la estrategia puede ser la de reiniciar un proceso cuando falla, reiniciar todos los procesos hijos cuando uno falla, o no reiniciar ningún proceso cuando falla. Y de todo esto se encargan los supervisores, de forma eficiente, por lo que nos podemos olvidar de ello. 

### Let it crash

Al ser los procesos de Elixir tan baratos en cuanto a consumo de recursos, y al estar tan controlados en el caso de fallo, aparece un concepto intereseante: **let it crash**. Algo así, como *déjalo que falle*. Y es que no tiene ningún sentido llenar la lógica de nuestros procesos con control de excepciones. Es más sencillo y mucho más eficiente, dejar morir el proceso y arrancar otro en su lugar. Y es la práctica recomendada cuando utilizamos OTP.

## Macros

Otra de las características importantes de Elixir, son las macros. Con ellas, podemos expandir el lenguaje tanto como queramos, incluyendo elementos que no existen en la base. Es lo que se conoce, como metaprogramación. De hecho, Elixir está lleno de macros y muchas de las cosas que se encuentran en su núcleo, lo son. Por ejemplo, la cláusula `if` no es más que una macro. Un ejemplo que nos crea un `if` personalizado sería el siguiente:

```
defmodule GenbetaDev.Macro.If do
  defmacro my_if(expr, do: if_block), do: if(expr, do: if_block, else: nil)
  defmacro my_if(expr, do: if_block, else: else_block) do
    quote do
      case unquote(expr) do
        result when result in [false, nil] -> unquote(else_block)
        _ -> unquote(if_block)
      end
    end
  end
end
```

La parte interesante de las macros está en la cláusula `quote do`. Y es que todo el código de Elixir puede expresarse como AST (Abstract Syntax Tree). Y es que todo código de Elixir se puede escribir como una estructura de datos similar a la siguiente:

```
iex> quote do: 1 + 2
{:+, [context: Elixir, import: Kernel], [1, 2]}
```

Así que como podemos ver con `quote` podemos acceder a la representación interna del código de Elixir. Si lo usamos en una macro, lo que hacemos, es escribir código que escribe más código, y a la hora de compilar, todo lo que sea definido con una macro, es sustituido por lo que hay representado dentro del `quote`. 

Volviendo al ejemplo del `if` personalizado, podríamos usarlo de la siguiente manera:

```
iex(2)> import GenbetaDev.Macro.If
import GenbetaDev.Macro.If
GenbetaDev.Macro.If
iex(3)> my_if 1 == 1 do "yes" else "no" end
my_if 1 == 1 do "yes" else "no" end
"yes"
```

La manera que tiene Elixir de acceder al valor de un elemento y no a su representación AST es utilizando `unquote`. Es importante saber que las macros en Elixir son higiénicas, es decir, que Elixir hace el mapeo de variables como último paso, por lo que las variables definidas por el programador, no serán sustituidas por una Macro. Hay maneras de saltarse esta regla, pero deben ser definidas explícitamente, dando a entender que sabemos lo que estamos haciendo.


## Elixir tiene muchas más cosas.

Si bien las que hemos comentado son las características más interesantes de Elixir, hay muchas más cosas a tener en cuenta. Algunas son las siguientes:

- **Mix**.  Herramienta utilizada para la generación de *builds* y gestión de proyectos. Puede realizar multitud de operaciones como compilar, crear un proyeto, ejecutar los tests, descargar las dependencias etc.
- **ExUnit**. Framework de test incluido de serie con Elixir. Con algunas opciones curiosas, como que los nombres de los test, son un string largo diciendo lo que hace el test, en lugar de un nombre corto como en otros lenguajes.
- **Hex**. Gestor de paquetes de Erlang/Elixir, que nos permite descargar dependencias al más puro estilo npm y similares.

Con todas estas características podemos concluir que Elixir es un lenguaje bastante potente.


## Uso y futuro de Elixir

Con Elixir podemos escribir cualquier tipo de programa. Sus posibilidades de concurrencia lo hacen ideal para cierto tipos de programas **backend**. No obstante, y teniendo en cuenta que el desarrollo web es la disciplina predominante, también existe un framework para desarrollar aplicaciones web llamado Phoenix. Al igual que Elixir está inspirado en Elixir, Phoenix está inspirado en Rails, aunque intentando simplificar las cosas y eliminando parte de la **magina negra** de rails. El framework es bastante potente y muchos desarrolladores de Ruby están empezando a usarlo, ya que su rendimiento es realmente bueno. 

Como cada vez más desarrolladores de Ruby se pasan a Elixir, la comunidad está creciendo rápidamente. Si bien no llega a la amplitud de otras comunidades, es una comunidad bastante activa, que propone cosas y que ayuda a los demás a progresar. En [la lista de distribución de Elixir](https://groups.google.com/forum/#!forum/elixir-lang-core) se discuten posibles nuevas funcionalidades o cambios en las existentes; en [el foro de Elixir](https://elixirforum.com/) se dicuten problemas más generales y típicos que nos podemos encontrar; en [el canal de Slack](https://elixir-slackin.herokuapp.com/) podemos encontrar programadores debatiendo sobre el lenguaje y los problemas que se encuentran; y como no siempre podremos obtener ayuda en StackOverflow, donde no es raro que el propio creador del lenguaje, José Valim, responda a nuestras preguntas. Por supuesto, **Elixir es Open Source y podemos acceder [a su código fuente en GitHub](https://github.com/elixir-lang/elixir)**.

## Conclusión

Elixir es un lenguaje moderno y potente, pero que corre sobre la máquina de Erlang, creada en los ochenta. Esto lo hace un lenguaje muy robusto y lleno de funcionalidades, a pesar de su juventud. La sintaxis, similar a la de Ruby, lo hace más asequible para todo tipo de programadores, alejándolo un poco del espíritu académico de otros lenguajes funcionales. 

En instalar y probar Elixir se tardan minutos, por lo que no lo pienses y dale una oportunidad a este lenguaje. 

