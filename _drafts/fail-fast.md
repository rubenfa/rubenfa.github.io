---
layout: post
title:  Mis progresos aprendiendo Elixir
---

Hay un concepto en Elixir que siempre me ha maravillado por su sencillez: el **Fail fast** o *falla pronto*. En lenguajes orientados a objetos estamos acostumbrados a utilizar excepciones, y aunque en Elixir también existen, capturarlas se considera casi un *code smell*. En Elixir es tan barato lanzar procesos, que es mejor dejar que mueran a tratar de recuperarlos. Por eso lo de *fail fast*.

## Un poquito de OTP

*OTP (Open Telecom Platform)* es un concepto que viene de Erlang y su máquina virtual, porque no hay que olvidar que Elixir [funciona sobre la máquina virtual de Erlang](). Erlang es un lenguaje pensado inicialmente para usar con centralitas telefónicas y la forma de controlar la concurrencia y distribución de este tipo de operaciones está reflejada en OTP.

Volviendo a Elixir, que en este caso funciona muy parecido a Erlang, podríamos decir que todo código se ejecuta dentro de procesos. Ojo, no hay que pensar en procesos del sistema operativo. En este caso los procesos de Elixir son gestionados por OTP y tienen mucho menos impacto en el sistema al necesitar muchos menos recursos. Los procesos no comparten datos, y solo se comunican entre ellos a través del paso de mensajes. Aprovechando la inmutabilidad de Elixir, tenemos un sistema muy robusto para manejar concurrencia. Al ser los procesos tan livianos, es muy normal lanzar miles de ellos sin demasiado problema.

Gracias a OTP, encapsular nuestro código en un proceso es muy sencillo, y lanzar *instancias* del mismo mucho más. Para ello se suele usar `GenServer` que es un [behaviour o comportamiento]() muy útil para implementar en nuestros sistemas. Este post no va a tener código (hablaré de OTP en futuras etradas) así que si queréis saber más podéis visitar [la guía de inicio de Elxir]().

A todo esto se le añade el concepto de **supervisor** o *supervisor*. Un `Supervisor` es otro comportamiento, que nos ayuda a gestionar la creación de procesos y la estrategia que vamos a seguir para iniciarlos (especialmente cuando fallan). Por ejemplo el supervisor puede seguir la estrategia de reiniciar solo un proceso hijo cuando falla, reiniciar todos los procesos hijos cuando fallan, o reiniciar todos los procesos hijos creados después de que uno de ellos fallara.

Además podemos crear un árbol de supervisión, ya que un supervisor, puede contener supervisores.

## Excepciones

Como os decía antes, en Elixir existen las excepciones. Y de hecho estas se usan a menudo. Si usais `Enum` y sus diferentes funciones, veréis que hay algunas de ellas que se llaman igual, pero con la diferencia de que una tiene un símbolo de exclamación en el nombre. Por ejemplo `fetch` y `fetch!` se utilizan para recuperar un elemento determinado en base a su posición. Si el elemento no se encuentra con `fetch` obtendremos un [atom]() `:error` mientras que con `fetch!` recibiremos una excepción. Esta convención es muy típica en Elixir para así estar seguros de cuando lanzaremos excepciones.













