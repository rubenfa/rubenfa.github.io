---
layout: post
title:  Usando Ecto en Elixir I
subtitle: Configurando la aplicación 
---



Lo primero que tenemos que hacer para utilizar Ecto en nuestra aplicación, es añadir las dependencias. Vamos a nuestro archivo `mix.exs' y añadimos las siguientes líneas.

```elixir
 defp deps do
    [{:ecto, "~> 1.0"}, 
     {:mongodb_ecto, "~> 0.1.5"}]
  end
```

> Nota importante. La versión actual de `Ecto` es la [2.x]() . Aunque tiene muchísimos cambios interesantes, todavía no soporta MongoDB (solo PostgreSQL). Como yo estoy trasteando con Mongo, voy a usar la versión anterior. En la medida de lo posible intentaré comentar los cambios que existan entre versiones, pero seguro que me dejo alguno.

Una vez tenemos añadidas nuestras dependencias, desde la consola hacemos un `mix.deps get` y Hex, se bajará las dependencias necesarias y las compilará. 

Satisfechas las dependencias, podemos configurar nuestro repositorio en el archivo `config.exs`. Si tuvieramos la base de datos configurada para requerir usuario y contraseña, deberíamos añadirlo en este archivo. Si vuestro MongoDB está en producción, no olvidéis añadir seguridiad, o podréis sufrir [divertidas extorsiones](http://www.pcworld.com/article/3155258/security/more-than-10000-exposed-mongodb-databases-deleted-by-ransomware-groups.html)

```elixir
config :ecto_blog_samples, Repo,
  adapter: Mongo.Ecto,
  database: "blog_samples", 
  hostname: "localhost"
```

Y para acabar, solo tendremos que crear nuestro repositorio

```elixir
defmodule Repo do
  use Ecto.Repo, otp_app: :ecto_blog_samples
end
```


