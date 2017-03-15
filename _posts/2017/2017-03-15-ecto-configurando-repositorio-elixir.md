---
layout: post
title:  Usando Ecto en Elixir I
subtitle: Configurando la aplicación 
share-img: https://s.yimg.com/ny/api/res/1.2/OQkvI_20nXmxyrTrs3zJIg--/YXBwaWQ9aGlnaGxhbmRlcjtzbT0xO3c9NzIwO2g9NDgwO2lsPXBsYW5l/http://listings.zenfs.com/en-US/cms/autos/Boldride/Ghostbusters-Ecto-1-2.jpg
---

Aunque estemos programando una aplicación con un lenguaje funcional, al final vamos a necesitar persistir los datos en algún sitio. Y lo más normal, es hacerlo en una base de datos. En Elixir, para estas tareas, tenemos la opción de utilizar [Ecto](https://hexdocs.pm/ecto/Ecto.html). Ecto es un DSL (Domain Specific Language) que nos permite acceder a base de datos utilizando una sintaxis parecida a la de SQL. Su funcionamiento se basa en la utilización de repositorios, esquemas, y migraciones, que permiten consultar la base de datos, insertar registros o actualizarlos. 

## Características de Ecto

Ecto es algo difícil de definir, ya que no es un ORM al uso (al fin y al cabo en Elixir no hay objetos). Así que lo voy a intentar definir con algunas de sus caracterísitcas más interesantes.

 - **Reositorios**: utilizados para *encapsular* toda la lógica utilizada para acceso y modificación de datos. Como es lógico podremos tener varios en nuestra aplicación, accediendo a distintos almacenes de datos.

 - **Migraciones**: utilizadas para crear tablas, actualizar campos etc. Dependiendo del tipo de base de datos que estemos utilizando esto puede ser algo importante, o no. Si usamos una base de datos relacional (PostgreSQL, MySQL etc.), las migraciones nos serán muy útiles, ya que nos permiten mantener concordancia entre nuestro modelo de datos y nuestra base de datos. Si usamos MongoDB las migraciones posiblemente no sean necesarias.

 - **Esquemas**: usemos una base de datos NoSQL o relacional, nuestros datos tendrán un esquema determinado. Con Ecto podremos hacer mapeo entre esos esquemas (que no son otra cosa que [estructuras](http://charlascylon.com/2016-08-03-usando-estructuras-en-elixir)), y las tablas de base de datos.

 - **Changesets**: se utilizan a la hora de insertar o actualizar datos y nos proporcionan elementos importantes como validación de datos, conversión de formatos, restricciónes (valores únicos, claves foráneas etc.). 

 - **Ecto.Query**: muy parecido a [LINQ](https://msdn.microsoft.com/es-es/library/mt693024.aspx) nos permite realizar consultas a nuestra base de datos desde el propio código de Elixir. Al igual que LINQ tiene dos formatos.

La versión típica parecida a SQL:

```elixir
# Create a query
query = from u in "users",
          where: u.age > 18,
          select: u.name

# Send the query to the repository
Repo.all(query)
```

Y la versión utilizada con *pipe operators*:

```elixir
"users"
|> where([u], u.age > 18)
|> select([u], u.name)
```

Puedes usar la que más te guste.

Una vez Ecto está configurado, no es difícil de usar, pero primero hay que ponerlo en funcionamiento, que es lo que voy a explicar en esta entrada.

> Nota importante. El resto del post solo va a explicar como configurar Ecto con MongoDB o PostgreSQL. Si no estás interesado en ese tema, no sigas leyendo, porque probablemente te aburriras mucho.


## Configuración manual de Ecto con MongoDB

Lo primero que tenemos que hacer para utilizar Ecto en nuestra aplicación, es **añadir las dependencias**. Vamos a nuestro archivo `mix.exs' y añadimos las siguientes líneas.

```elixir
 defp deps do
    [{:ecto, "~> 1.0"}, 
     {:mongodb_ecto, "~> 0.1.5"}]
  end
```

> Nota. La versión  de `Ecto` es la [2.1.4](https://hexdocs.pm/ecto/Ecto.html) (al menos en la publicación de este artículo).  Aunque tiene muchísimos cambios interesantes, todavía no soporta MongoDB (solo PostgreSQL y MySQL). Como yo estoy trasteando con Mongo, voy a usar la versión anterior. Más adelante en el post explico como configurar PostgreSQL.

Una vez tenemos añadidas nuestras dependencias, desde la consola hacemos un `mix.deps get` y Hex, se bajará las dependencias necesarias y las compilará. 

Satisfechas las dependencias, podemos configurar nuestro repositorio en el archivo `config.exs`. Si tuvieramos la base de datos configurada para requerir usuario y contraseña, deberíamos añadirlo en este archivo. Si vuestro MongoDB está en producción, no olvidéis configurar su seguridiad, o podréis sufrir [divertidas extorsiones](http://www.pcworld.com/article/3155258/security/more-than-10000-exposed-mongodb-databases-deleted-by-ransomware-groups.html)

```elixir
config :ecto_blog_samples, Repo,
  adapter: Mongo.Ecto,
  database: "blog_samples", 
  hostname: "localhost"
```

Y ahora tendremos que crear nuestro repositorio, cosa que haremos en un nuevo archivo `repo.ex`:

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

Y con esto "casi" podemos hacer consultas a la base de datos. Y digo casi porque si arrancamos `iex` y tratamos de ejecutar una consulta, recibiremos un error:

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

Como os comentaba en un [post anterior sobre OTP](http://charlascylon.com/2017-02-15-fail-fast), Elixir funciona iniciando procesos para casi todo. En este caso no tenemos configurado ningún proceso para `Repo` en nuestra aplicación, cosa que es necesaria para que funcione. Vamos a añadirlo. Primero vamos al archivo `mix.ex` que es dónde se configura la chicha, y deberemos cambiar la función `application`:

```elixir
def application do
  [applications: [:logger, :ecto, :mongodb_ecto],
  mod: {EctoBlogSamples, []}]
end
```

Aquí estamos diciendo que nuestra aplicación va a usar tres aplicaciones más, que son `logger`, `ecto` y `mongodb_ecto`. Además le estamos diciendo que nuestra aplicación está configurada en el módulo `EctoBlogSamples`. Así que en ese módulo deberemos añadir el código para iniciar nuestro `Supervisor`.

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

## Configuración semiautomática con PostgreSQL

Todo esto que os he contado viene bien para saber qué pasos hay que seguir, pero por suerte Elixir tiene una forma más automática para hacerlo. Así no nos aburriremos cada vez que haya que crear un repositorio. **En esta ocasión voy hacerlo con la nueva versión de Ecto, y PostgreSQL**.

Lo primero es que cuando creemos nuestro proyecto, podemos asegurarnos de que tiene un supervisor configurado. Esto lo hacemos con el comando `mix new ecto_blog_samples --sup`. Al añadir la opción `--sup`, nos evitamos tener que configurar esa parte.

Ahora, añadimos las dependencias, que en este caso son `ecto` y `postgrex`. Esta parte como siempre se hace en el archivo `mix.ex`.

```elixir
defp deps do
  [{:ecto, "~> 2.0"},
   {:postgrex, "~> 0.11"}]
end
```

No hay que olvidarse de hacer un `mix deps.get` para poder bajar con Hex esas dependencias. Y ahora, como hicimos antes, debemos añadir esas dependencias a la sección `application` del archivo `mix.ex`.  Como hemos creado el proyecto con la opción `--sup` esa sección la tenemos en parte configurada. 

```elixir
 # Configuration for the OTP application
 #
 # Type "mix help compile.app" for more information
 def application do
   # Specify extra applications you'll use from Erlang/Elixir
   [extra_applications: [:logger],
    mod: {Ecto2BlogSamples.Application, []}]
 end
```

Automáticamente ya se nos ha añaido parte de la configuración, así que solo tendremos que añadir `ecto` y `postgrex` a la lista `extra_applications`.

```elixir
 # Configuration for the OTP application
 #
 # Type "mix help compile.app" for more information
 def application do
   # Specify extra applications you'll use from Erlang/Elixir
   [extra_applications: [:logger, :ecto, :postgrex],
    mod: {Ecto2BlogSamples.Application, []}]
 end
```

El siguiente paso es generar el repositorio, para lo cual utilizaremos el comando siguiente:

```
mix ecto.gen.repo -r Ecto2BlogSamples.Repo
``` 

Esto nos genera el archivo `repo.ex` que contiene el módulo con el repositorio. El archivo contiene las siguientes líneas:

```elixir
defmodule Ecto2BlogSamples.Repo do
  use Ecto.Repo, otp_app: :ecto2_blog_samples
end
```

También nos crea la configuración en el archivo `config.ex`, que deberemos modificar para incluir nuestro usuario y contraseña, para conectar a la base de datos y también para inciar el `Repo`.

```elixir
config :ecto2_blog_samples, Ecto2BlogSamples.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "ecto2_blog_samples_repo",
  username: "user",
  password: "pass",
  hostname: "localhost"


config :ecto2_blog_samples, ecto_repos: [Ecto2BlogSamples.Repo]
```

Y como paso final, deberemos añadir nuestro repositorio, al archivo `Ecto2BlogSamples.Application`, para que el `Supervisor` lance el proceso necesario al arrancar la aplicación. En esta ocasión también tenemos parte del archivo configurado.


```elixir
defmodule Ecto2BlogSamples.Application do
  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    # Define workers and child supervisors to be supervised
    children = [ supervisor(Ecto2BlogSamples.Repo, []),
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Ecto2BlogSamples.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
```

Y listo. Después de unos cuantos pasos, ya está todo configurado. Como en esta ocasión estamos usando una base de datos relacional, hay que crear la base de datos. Esto lo podemos hacer con `mix` y el comando `mix ecto.create`. 

A partir de aquí habría que hacer otras operaciones, como crear `schemas` y crear migraciones para que Ecto, cree las tablas en nuestra base de datos. Pero eso lo dejamos para otro post.










