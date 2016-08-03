---
layout: post
title:  Usando estructuras en Elixir
subtitle: 
---

Hace un tiempo, os hablaba [de los tipos de colecciones que podíamos encontrar en Elixir](http://charlascylon.com/2016-03-21-tipos-colecciones-Elixir), y entre ellas se encontraban los *Maps*. Un *Map* no es más que una colección de elementos clave-valor, cuya clave no puede repetirse. En este caso vamos a hablar de *Structs*, que vienen a ser una especie de *Maps* tipados, lo cual nos da muchas posibilidades.

## Struct

Como os comentaba antes los *Structs* son muy parecidos a los *Maps* (de hecho internamente son *Maps*). Si recordáis, un *Map* se definía así:

```
iex(3)> jugador = %{:health => 1000, :level => 1, :status => :alive }
```

En este caso estamos definiendo una lista clave-valor, a la que podremos acceder a través de los `atom` que hemos usado como claves (puedes ver qué son los `atom` [en esta otra entrada](http://charlascylon.com/2016-03-02-los-atoms-en-elixir) ).

Con los *Maps* podemos hacer [pattern matching](http://charlascylon.com/2016-02-24-Elixir-y-el-pattern-matching) a su contenido, pero si usamos *Structs* además podremos hacerlo por el tipo.

Para definir un *Struct*, debemos utilizar un módulo. El nombre del módulo será también el tipo del *Struct*. Si el ejemplo anterior lo transformamos en un *Struct*, quedaría de la siguiente manera:

```elixir
defmodule CombatKata.Player do
   defstruct health: 1000, level: 1, status: :alive  
end
```                                                                                           
En el ejemplo se define un *Struct* con unos valores por defecto. Desde ese momento, podremos utilizar nuestra estructura para generar nuevos jugadores:

```
iex(2)> jugador = %Player{}
jugador = %Player{}
%Player{health: 1000, level: 1, status: :alive}
```

¿Cuál es la ventaja de definir los *Structs* en un módulo? Pues la ventaja es que de esta manera podemos añadir funcionalidad:

```elixir
defmodule CombatKata.Player do
   defstruct health: 1000, level: 1, status: :alive

   def print_health_level(player = %Player{}) do
    IO.puts("Health: #{player.health}")
   end
end
```

## Pattern matching con Structs

Lo bueno que tienen las estructuras, es que al estar tipadas, nos permiten hacer **pattern matching** de una forma muy sencilla.

Por ejemplo, imagina que tenemos un módulo para controlar las heridas que nuestro personaje recibe, y por tanto la salud (`health`) que tiene disponible:

``` elixir
defmodule CombatKata.Damage do

  alias CombatKata.Player
 
  def deal_damage(%Player{ health: player_health} = player, damage) when damage > player_health do
    %Player {
      health: 0,
      status: :dead,
      level: player.level
    }
  end  

  def deal_damage(%Player{health: player_health } = player, damage) do
    %Player {
      health: player.health - damage,
      level: player.level     
    }
  end
end
```

Como se puede ver en el ejemplo, tenemos dos funciones iguales, pero Elixir sabrá cual tiene que utilizar en cada caso. Para empezar, las funciones tienen que recibir una estructura de tipo `%Player`. Para decidir entre una u otra función, utilizamos la cláusula  de guarda `when damage > player_health`. Si esta condición se cumple, deberemos cambiar el estado del personaje a `:dead`. En caso de que la condición de guarda no se cumpla, accederemos a la otra función, que refleja daño que ha sufrido el jugador.

También podemos ver que podemos extraer valores de clave específicos de un *Struct* para usarlos dentro de las funciones `%Player{ health: player_health}`, o que podemos obtener la estructura completa `%Player{} = player`. Lo que si es importante destacar es que en las claúsulas de guarda no se pueden utilizar estructuras, por lo que solo podremos acceder a los valores que ya se han extraído. Por esta razón en el ejemplo no se usa `when damage > player.health`, ya que no es válido.

## Inicializaciones avanzadas de Structs

En el ejemplo que hemos visto, la inicialización de la estructura, se hace con tipos simples. Pero imaginemos que queremos que nuestros personajes necesitan un identificador que se genere aleatoriamente. ¿Podríamos hacerlo llamando a una función? Sí, pero para eso tendríamos que hacer uso de `__struct__`, ya que directamente, no podemos utilizar funciones para inicializar los valores de la estructura. Un ejemplo:

```elixir
defmodule CombatKata.Player do
  def __struct__() do
    reseed_random()
    %{__struct__: __MODULE__, id: get_next(), health: 1000, level: 1, status: :alive}
  end

  def reseed_random do
    :random.seed(:os.timestamp())
  end

  def get_next do
    :random.uniform(10000000)
  end
end
```

La función ´__struct__´ se podría asemejar a los constructores de clases de POO (como siempre salvando las distancias). Esta función se llama siempre que creemos una nueva estructura. En el ejemplo lo que hacemos en ella es generar un número aleatorio, que asignamos al campo `id`.

Como he comentado varias veces a lo largo de la entrada, en realidad un *Struct* es un *Map* vitaminado. En el ejemplo podemos ver que la función `__struct__` al final acaba devolviendo un *Map* con una clave que también se llama `__struct__` y que hace referencia al módulo

Y lo dejamos aquí. Espero que el artículo haya sido interesante y no un ladrillo difícil de entender.

Por cierto, los ejemplos que he puesto en el artículo son parte de la solución a [esta kata](http://www.slideshare.net/DanielOjedaLoisel/rpg-combat-kata) que conocí a través de [@msanjuan](https://twitter.com/msanjuan) y [@vgaltes](https://twitter.com/vgaltes). Todavía no he podido terminarla, y seguro que se puede hacer mejor, pero por si os interesa, el código está [en este repo de GitHub](https://github.com/rubenfa/rpg_combat_kata)











