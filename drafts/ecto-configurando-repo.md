---
layout: post
title:  Usando Ecto en Elixir I
subtitle: Configurando la aplicación 
---


## Configuración manual

Lo primero que tenemos que hacer para utilizar Ecto en nuestra aplicación, es añadir las dependencias. Vamos a nuestro archivo `mix.exs' y añadimos las siguientes líneas.

```elixir
 defp deps do
    [{:ecto, "~> 1.0"}, 
     {:mongodb_ecto, "~> 0.1.5"}]
  end
```

> Nota importante. La versión actual de `Ecto` es la [2.x]() . Aunque tiene muchísimos cambios interesantes, todavía no soporta MongoDB (solo PostgreSQL). Como yo estoy trasteando con Mongo, voy a usar la versión anterior. En la medida de lo posible intentaré comentar los cambios que existan entre versiones, pero seguro que me dejo alguno.

Una vez tenemos añadidas nuestras dependencias, desde la consola hacemos un `mix.deps get` y Hex, se bajará las dependencias necesarias y las compilará. 

Satisfechas las dependencias, podemos configurar nuestro repositorio en el archivo `config.exs`. Si tuvieramos la base de datos configurada para requerir usuario y contraseña, deberíamos añadirlo en este archivo. Si vuestro MongoDB está en producción, no olvidéis configurar su seguridiad, o podréis sufrir [divertidas extorsiones](http://www.pcworld.com/article/3155258/security/more-than-10000-exposed-mongodb-databases-deleted-by-ransomware-groups.html)

```elixir
config :ecto_blog_samples, Repo,
  adapter: Mongo.Ecto,
  database: "blog_samples", 
  hostname: "localhost"
```

Y ahora tendremos que crear nuestro repositorio:fs

```elixir
defmodule Repo do
  use Ecto.Repo, otp_app: :ecto_blog_samples
end
```

Lo primero que necesitamos es crear un `Schema` que nos sirva para representar nuestro modelo de datos. Vamos a crear uno:

```elixir
defmodule Pelicula do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "peliculas" do
    field :titulo, :string
    field :fecha_estreno, :integer
    field :presupuesto, :integer
    field :generos, {:array, :string}
    timestamps
  end
end
```

Y con esto "casi" podemos hacer consultas a la base de datos. Si arrancamos `iex` y tratamos de ejecutar una consulta, recibiremos un error:

```
iex(2)> import Ecto.Query
import Ecto.Query
Ecto.Query
iex(3)> query = from p in Pelicula
query = from p in Pelicula
#Ecto.Query<from p in Pelicula>
iex(4)> Repo.all(query)
Repo.all(query)
** (ArgumentError) repo Repo is not started, please ensure it is part of your supervision tree
    (ecto) lib/ecto/query/planner.ex:91: Ecto.Query.Planner.cache_lookup/3
    (ecto) lib/ecto/query/planner.ex:72: Ecto.Query.Planner.query/4
    (ecto) lib/ecto/repo/queryable.ex:91: Ecto.Repo.Queryable.execute/5
    (ecto) lib/ecto/repo/queryable.ex:15: Ecto.Repo.Queryable.all/4
```

Como os comentaba en un [post anterior sobre OTP](), Elixir funciona iniciando procesos para casi todo. En este caso no tenemos configurado ningún proceso para `Repo` en nuestra aplicación, cosa que es necesaria para que funcione. Vamos a añadirlo. Primero vamos al archivo `mix.ex` que es dónde se configura la chicha, y deberemos cambiar la función `application`:

```elixir
def application do
  [applications: [:logger, :ecto, :mongodb_ecto],
  mod: {EctoBlogSamples, []}]
end
```

Aquí estamos diciendo que nuestr aplicación va a usar tres aplicaciones más que son `logger`, `ecto` y `mongodb_ecto`. Además le estamos diciendo que nuestra aplicación está configurada en el módulo `EctoBlogSamples`. Así que en ese módulo deberemos añadir el código para iniciar nuestro `Supervisor`.

```elixir
defmodule EctoBlogSamples do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      supervisor(Repo, [])
    ]

    opts = [strategy: :one_for_one, name: EctoBlogSamples.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
```

El módulo define una función `start` que se llamará al iniciar la aplicación. En esta función definimos un `Supervisor` que será el encargado de definir los procesos hijos que se arrancarán, y la extrategia que se seguirá con ellos. En este caso solo levantaremos un proceso `Repo`. Y listo. Si volvemos a arrancar `iex` con un `iex -S mix` y lanzamos la consulta anterior, obtendremos lo siguiente:

```
iex(4)> Repo.all(query)
Repo.all(query)

06:15:37.251 [debug] FIND coll="peliculas" query=[{"$query", []}, {"$orderby", %{}}] projection=%{_id: true, fecha_estreno: true, generos: true, inserted_at: true, presupuesto: true, titulo: true, updated_at: true} [] OK query=0.6ms queue=0.1ms
[]
```
Bueno, en la base de datos no tenemos nada, así que la consulta no devuelve nada.

## Configuración automática

Todo esto que os he contado biene bien para saber qué pasos hay que seguir, pero por suerte Elixir tiene una forma más automática para hacerlo. Así no nos aburriremos cada vez que haya que crear un repositorio.

Lo primero es que cuando creemos nuestro proyecto, podemos asegurarnos de que tiene un supervisor configurado. Esto lo hacemos con el comando `mix new ecto_blog_samples --sup`. Al añadir la opción `--sup`, nos evitamos tener que configurar esa parte.






