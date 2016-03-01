---
layout: post
title: Los atoms en Elixir
---


A día de hoy, me gano la vida programando en entornos .NET, concretamente con C#. El principal objetivo de aprender Elixir era el de salir completamente del entorno al que estaba acostumbrado. Otro lenguaje,
otro entorno de desarrollo, otra forma de pensar etc. Y es que es un ejercicio muy sano para abrir la mente. Y de esta manera he llegado a descubrir un tipo de datos que no conocía, aunque por lo que parece existe en muchos
otros lenguajes (Ruby, Erlang-Elixir, Clojure y [otros cuantos más](https://en.wikipedia.org/wiki/Symbol_%28programming%29)).

Los *atoms*, son simples de entender, fáciles de usar, y muy útiles. Un *atom* es básicamente una constante cuyo valor es su propio nombre. Unos cuántos ejemplos de *atoms* serían:
`:error`, `:ok`, `is_enabled?`, `:paused` ...

Como se puede ver en los ejemplos, un *atom* se define con `:` y unos cuantos caracteres, que representan su valor. La gracia de este tipo de datos, es que el *atom* `:error` tiene el mismo valor en cualquier
programa escrito en Elixir, por lo que es muy útil para dar consistencia a nuestro código.

Por ejemplo, podemos tomar como norma, que el resultado devuelto en una operación de entrada salida, sea siempre una *tupla*. El primer valor de la tupla será un *atom* que representará el estado de la
operación. En este caso usaremos `:ok` para las operaciones correctas y `:error` cuando se produce algún fallo. El segundo valor de la tupla será el resultado en el caso de que la operación sea correcta,
o el mensaje de error en el caso contrario.

Por ejemplo:

```elixir
defmodule Atoms.Test do  
  def read_file(file_name) do  
    read_result = Fake.File.read(file_name) 
    print_result read_result
  end

  defp print_result({:ok, result}) do
    IO.puts "File content is " <> result
  end

  defp print_result({:error, message}) do
    IO.puts message
  end
end
```

Tenemos una función que lee de un archivo, en el módulo `Fake.File` que se llama `read` y que recibe el nombre de un fichero. Llamando a esa función y aprovechándonos del 
[pattern matching](www.charlascylon.com/2016-02-24-Elixir-y-el-pattern-matching), llamamos a la función `print_result` que escribirá el resultado según corresponda. Si se ha recibido un *atom*
`:ok` usaremos la primera función `print_result`. Si se recibe un `:error`, utilizamos la segunda.

Un ejemplo del funcionamiento:

```
iex(1)> Atoms.Test.read_file("filenotexists.txt")      
File not found                                         
:ok                                                    
iex(2)> Atoms.Test.read_file("filename.txt")           
File content is En un lugar de la Mancha               
:ok                                                    
```                                                

Lo bueno, como digo, es que estos valores son constantes para cualquier programa que escribamos en Elixir. Siguiendo ciertas convenciones, como la comentada de devolver `:ok` cuando una
operación es correcta, nuestro código será fácil de leer y de interpretar. Si además eso lo unimos con el *pattern matching*, el código queda muy limpio. De un vistazo podemos ver qué función
es la encargada de procesar las peticiones correctas, y qué función se encarga de procesar los errores.
