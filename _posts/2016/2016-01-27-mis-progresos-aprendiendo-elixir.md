---
layout: post
title:  Mis progresos aprendiendo Elixir
redirect_from:
  - /post/138142174936/mis-progresos-aprendiendo-elixir.html
  - /post/138142174936/
---

<p>Como comentaba en mi último post, para acabar el año, me había propuesto aprender algo nuevo, <a href="https://www.charlascylon.com/post/134644391731/aprendiendo-elixir-o-intent%C3%A1ndolo">y había empezado a aprender Elixir</a>. Han pasado casi dos meses desde aquella declaración de intenciones, y de momento sigo con ello. Este post no va a ser técnico, simplemente una forma de revisar el camino que llevo recorrido hasta ahora.</p>

<h3>Documentación y materiales de consulta utilizados</h3>

<p>Lo primero que hice fue buscar libros sobre Elixir, y en seguida me topé con <a href="https://pragprog.com/book/elixir/programming-elixir">Programming Elixir</a>, de Dave Thomas. El libro está muy bien, ya que enseña los conceptos más importantes de Elixir, pero sin olvidarse de que es un lenguaje funcional, e intentando que <strong>dejemos de pensar en orientación a objetos</strong>. Dave explica muy bien, y el libro es bastante entretenido.</p>

<p>Una vez cogidos los conceptos generales, y la sintaxis de Elixir tenía dos opciones: ponerme a programar ejemplos facilones, o intentar hacer algo de verdad. La primera opción no está mal, pero uno aprende de verdad cuando tiene que pelear en las trincheras. Así que decidí seguir aprendiendo Elixir, programando una aplicación web con <a href="http://www.phoenixframework.org/">Phoenix Framework</a>.</p>

<p>Phoenix tiene lo que cualquier programador buscaría en un framework para hacer aplicaciones web, utilizando la potencia de la máquina virtual de Erlang, y la sintaxis de Elixir.</p>

<p>Para aprender este framework me lancé a comprar el libro <a href="https://pragprog.com/book/phoenix/programming-phoenix">Programming Phoenix</a> escrito por Chris McCord (creador de Phoenix), Bruce Tate y José Valim (creador de Elixir). El libro está todavía en fase beta, que es una manera de decir que no está terminado, pero que ya lo puedes comprar. La versión actual tiene los capítulos necesarios para hacerse a la idea de como funciona Phoenix. Según van actualizando el contenido, puedes acceder a las nuevas versiones.</p>

<p>Este libro también me ha gustado mucho. Tanto con <em>Programming Elixir</em> como con <em>Programming Phoenix</em>, me he quedado muy impresionado con las posibilidades de la <a href="http://learnyousomeerlang.com/what-is-otp">OTP</a> de Erlang. La concurrencia y los sistemas distribuidos parecen un juego de niños, y aun sin entender muchos de los conceptos, parece que ahí debajo se esconde mucha, pero que mucha potencia. Estas características y otras hacen que supuestamente y <a href="https://gist.github.com/omnibs/e5e72b31e6bd25caf39a">según los benchmarks</a> Phoenix vuele.</p>

<p>En cuanto a otros materiales de apoyo, la verdad es que Elixir está ganando mucha tracción. Hay un podcast llamado <a href="https://soundcloud.com/elixirfountain">Elixir Fountain</a> con periodicidad más o menos semanal, en el que entrevistan a gente que utiliza Elixir. Entre ellos a Rob Connery, que también está metido en el mundillo de Elixir, y que incluso ha hecho de presentador en alguno de los capítulos del podcast.</p>

<p>En Reddit hay un subreddit bastante activo, y en Stack Overflow se responden bastantes dudas sobre el lenguaje. De hecho yo publiqué allí una pregunta, <a href="http://stackoverflow.com/questions/34761709/phoenix-framework-with-code-reloading-enabled-is-pretty-slow-on-windows">sobre el rendimiento de mi equipo de desarrollo</a>. Obtuve bastantes comentarios intentando ayudar, entre ellos de José Valim, el creador de Elixir. Que te conteste el creador del lenguaje, es muestra de lo implicada que está la comunidad de Elixir. Por cierto, al final el problema se arregló, aunque no sé cómo.</p>

<h3>Entorno de desarrollo</h3>

<p>Para programar con Elixir y Phoenix, estoy usando Windows 10. Como editor de texto empecé con GitHub Atom, pero el rendimiento en mi máquina no acababa de convencerme. Aprovechando que Code ya tenía soporte para plugins, y que se podía <a href="https://marketplace.visualstudio.com/items/mjmcloug.vscode-elixir">instalar uno para tener soporte de Elixir</a>, me lancé a probarlo. El rendimiento es bastante mejor, y Code no se me queda colgado, como si me pasaba a menudo con Atom. Eso sí, el soporte a Elixir tiene que mejorar, en especial en vistas que mezclan HTML y código Elixir. Por cierto, siendo programador .NET, echo mucho de menos Razor. La sintaxis basada en los típicos <em> me parece muy confusa.</em></p>

<p>Phoenix utiliza por defecto PostgreSQL así que lo tengo instalado en mi máquina. Ecto, el &ldquo;ORM&rdquo; (entre comillas porque es como mucho un ORM ligero) que utiliza Phoenix, puede funcionar también con MongoDB, pero de momento no lo he probado. Vamos a seguir con bases de datos relacionales, y luego ya veremos.</p>

<p>Phoenix viene por defecto con Brunch para gestionar las dependencias de frontend, pero no es obligatorio usarlo. De hecho yo lo primero que hice fue sustituirlo por JSPM, System.js y Gulp.</p>

<h3>Pet Project</h3>

<p>Como he comentado antes, la intención es hacer algo que funcione, aunque no le sirva a nadie. De momento los lentos progresos los voy guardando en <a href="https://github.com/rubenfa/schoolmaster">este un repo de GitHub</a>. No hay mucho que enseñar a día de hoy, pero espero que en un futuro esto sea algo funcional. Y de paso espero aprender muchas cosas para poder contaros aquí.</p>
