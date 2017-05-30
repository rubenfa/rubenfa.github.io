---
layout: post
title:  Operador With en Elixir
share-img: https://elixir-lang.org/images/logo/logo.png
---

Lo bueno de un lenguaje que está principalmente guiado por la comunidad, es que va evolucionando según las necesidades que se van encontrando sus usuarios. Un ejemplo es el que nos encontramos con el operador `with` de Elixir, que fue introducido en la versión 1.2 del lenguaje, y mejorado en la 1.3 para incluir la cláusula `else`.


## El problema

Primero vamos a ver el problema que soluciona. Supongamos que tenemos una [estructura](http://charlascylon.com/2016-08-03-usando-estructuras-en-elixir) del tipo `%User{}`. La estructura tendrá los campos típicos que tiene un usuario de una aplicación.

```elixir
defmodule Example.With.User do
  defstruct   name: "", age: 0, mail: "", phone_number:"", accept_privacy: false, mail_sucriber: false
end
```

Ahora vamos a definir una serie de validaciones que realizará nuestro programa para gestionar este usuario. Algunas de las validaciones serán comprobar que es mayor de 18, que el nombre es válido, que el teléfono también es válido, o que ha aceptado las políticas de privacidad.


