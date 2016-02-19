---
layout: post
title: Tutorial MongoDB. Operaciones de actualización de datos II
redirect_from:
  - /post/61794348269/tutorial-mongodb-operaciones-de-actualización-de.html
---

 <p>
 <a href="http://www.charlascylon.com/2013/07/tutorial-mongodb-operaciones-de_18.html">En
        la pasada entrada</a>, vimos como podíamos realizar operaciones que
      insertaran, borraran o modificaran documentos en <strong>MongoDB</strong>.
      Para ello utilizabamos comandos como <em>insert, save, update o remove</em>,
      pero con consultas sencillas y sin entrar en modificación de <em>arrays </em>o
      <em>subdocumentos</em>. Así que en esta entrada nos vamos a centrar en la
      realización de acciones de ese tipo, que lógicamente son muy comunes.</p>
    
    
    <h2>Operadores $set y $unset</h2>
    <p>Ya vimos en la anterior entrada, que para actualizar o añadir un campo a
      un documento existente, debemos utilizar el comando <em>$set</em>.</p>
    <p><br>
    </p>
    
    <pre class="consolestyle"><code>
&amp;gt; db.products.update({
  _id: ObjectId(&quot;51e6681a2b7e6dab80c1ebd6&quot;)},
  {
    $set:{cantidad:52,
          descripcion:&quot;Disco duro de alta densidad&quot;
          }
  })</code></pre>
    <br>
    <p>En la anterior consulta, nos valemos de <em>$set</em> para modificar el
      documento con <em>_id 51e6681a2b7e6dab80c1ebd6</em>. En ese documento
      actualizamos el campo cantidad y añadimos un nuevo campo, que todavía no
      existe, llamado <em>descripción</em>. El documento resultante es el
      siguiente.</p>
    <p><br>
    </p>
    
<pre class="consolestyle"><code>
{ 
  &quot;_id&quot;: ObjectId(&quot;51e6681a2b7e6dab80c1ebd6&quot;),
  &quot;cantidad&quot; : 52,
  &quot;descripcion&quot; : &quot;Disco duro de alta densidad&quot;,
  &quot;nombre&quot; : &quot;Kingston 4Gb&quot;,
  &quot;precio&quot; : 26.5,
  &quot;tipo&quot; : &quot;RAM&quot;&lt;br&gt;
}</code></pre>
    <br>
    <p>Si queremos eliminar un campo de un documento, deberemos hacer una
      consulta similar, pero utilizando <em>$unset</em>.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
&amp;gt; db.products.update(
  { _id: ObjectId(&quot;51e6681a2b7e6dab80c1ebd6&quot;)},
  {
    $unset:{descripcion:1}
  })</code></pre>
    <br>
    <p>La consulta es bastante similar a la que utilizabamos antes, pero en este
      caso <em>$unset</em> recibe como parámetro el nombre del campo y un 1
      indicando que este campo debe eliminarse del documento. Si ejecutamos un <em>find
        </em>para ver el resultado, encontramos que el campo descripción ya no
      existe.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
{
  &quot;_id&quot;: ObjectId(&quot;51e6681a2b7e6dab80c1ebd6&quot;),
  &quot;cantidad&quot;: 52,
  &quot;nombre&quot; : &quot;Kingston 4Gb&quot;,
  &quot;precio&quot; : 26.5,
  &quot;tipo&quot; : &quot;RAM&quot;
}</code></pre>
    <h2>Actualización de arrays y subdocumentos con Dot Notation</h2>
    <p>Actualizar datos simples es sencillo, pero la cosa puede complicarse
      cuando queremos actualizar arrays con varios elementos o subdocumentos con
      varios campos. Vamos a insertar un nuevo producto para hacer algunas
      pruebas.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
&amp;gt; db.products.insert(
	{
		nombre : &quot; Placa Base Asus&quot;,
		cantidad : 10,
		precio : 78.25,
		tipo : &quot;PLACA&quot;,
		caracteristicas : [&quot;PCI-E&quot;, &quot;USB 3.0&quot;, &quot;AMD socket&quot;],
		extrainfo :
		{
			fabricante : &quot;Asus ltd.&quot;,
			anoSalida : 2013,
			manual : &quot;user-guide.pdf&quot;,
			drivers : [&quot;XP&quot;, &quot;W7&quot;, &quot;W8&quot; &quot;Linux&quot;]
		}
}
)/code>
 </pre>
    <br>
    <p>Una vez tenemos un documento de ejemplo, vamos a realizar algunas
      operaciones con él. Lo primero que vamos a probar es a modificar el array
      de características. Imaginemos que queremos cambiar ese <em>"AMD socket"</em>
      por <em>"Intel Socket"</em> con <strong>Dot Notation</strong>.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
&amp;gt; db.products.update(
  {tipo:&quot;PLACA&quot;}, 
  {$set:{&quot;caracteristicas.2&quot;:&quot;IntelSocket&quot;}}
)
</code></pre>
    <p><br>
    </p>
    <p>En este caso volvemos a usar <em>$set</em> para modificar un campo en
      concreto, solo que esta vez le decimos que queremos modificar el campo <em>"caracteristicas.2"</em>.
      Si recordáis el post sobre consultas avanzadas, de esta manera le estamos
      diciendo a <strong>MongoDB </strong>que queremos actualizar el elemento
      2 del array de características. Los arrays empiezan con el índice 0, por
      lo que estamos modificando el tercer valor de dicho array. Si ese valor no
      existe, será añadido al array. Hay que tener cuidado con la posición del
      array utilizada, porque si añadimos un elemento a un índice cuyos valores
      anteriores no existen, esos valores serán rellenados con valores nulos.
      Por ejemplo, en la siguiente consulta añadimos un valor en la posición 5
      del array, pero como no hay elementos en las posiciones 3 y 4 se rellenan
      con valores nulos.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
&amp;gt; db.products.update({tipo:&quot;PLACA&quot;}, {$set:{&quot;caracteristicas.5&quot;:&quot;Ethernet&quot;}})

{
        &quot;_id&quot; : ObjectId(&quot;51ef8531f62f3dac9e75f13e&quot;),
        &quot;cantidad&quot; : 10,
        &quot;caracteristicas&quot; : [
                &quot;PCI-E&quot;,
                &quot;USB 3.0&quot;,
                &quot;Intel Socket&quot;,
                null,
                null,
                &quot;Ethernet&quot;
        ],
        &quot;extrainfo&quot; : {
                &quot;fabricante&quot; : &quot;Asus ltd.&quot;,
                &quot;anoSalida&quot; : 2013,
                &quot;manual&quot; : &quot;user-guide.pdf&quot;,
                &quot;drivers&quot; : [
                        &quot;XP&quot;,
                        &quot;W7&quot;,
                        &quot;W8&quot;,
                        &quot;Linux&quot;
                ]
        },
        &quot;nombre&quot; : &quot; Placa Base Asus&quot;,
        &quot;precio&quot; : 78.25,
        &quot;tipo&quot; : &quot;PLACA&quot;
}
</code>
</pre>
    <p><br>
    </p>
    <p>Si desconocemos la posición del elemento a modificar, pero sabemos que
      valor tiene, podemos utilizar <strong>Dot Notation</strong> con el
      operador <em>$</em>.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
&amp;gt; db.products.update(
 {
	tipo : &quot;PLACA&quot;,
	caracteristicas : &quot;Intel Socket&quot;
 }, {
	$set : {
		&quot;caracteristicas.$&quot; : &quot;Intel Haswell Socket&quot;
	}
 })</code>
 </pre>
    <br>
    <p>Con el operador <em>$</em> le decimos a <strong>MongoDB </strong>que
      tiene que actualizar el elemento del array que cumpla la condición de la
      query (<em>caracteristicas:"Intel Socket"</em>). Cuando usamos <em>$ </em>es
      obligatorio que el campo que lo usa (en este caso características) esté en
      la query. Si no es así la <strong>Shell</strong> de <span style="font-weight: bold;">MongoDB
        </span>nos devolverá un error. En el ejemplo estamos cambiando el
      elemento caracteristicas:<em>"Intel Socket"</em> por <em>"Intel Haswell
        Socket"</em>.</p>
    <p><br>
    </p>
    <p>Si bien podemos actualizar arrays con <strong>Dot Notation</strong>,
      veremos en el siguiente apartado que hay algunos operadores que pueden
      facilitarnos la tarea. <strong>Dot Notation</strong> se usa de forma más
      intuitiva cuándo queremos actualizar subdocumentos.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
&amp;gt; db.products.update(
{
	tipo : &quot;PLACA&quot;
}, {
	$set : {
		&quot;extrainfo.manual&quot; : &quot;admin-guide.pdf&quot;
	}
}
) </code>
 </pre>
    <p><br>
    </p>
    <p>Las operaciones que podemos realizar sobre subdocumentos son similares a
      las que hemos descrito con los arrays.</p>
    <h2>Actualización de arrays con operadores</h2>
    <p>Si queremos añadir un valor a un campo array de un documento existente,
      podemos utilizar el operador<em> $addToSet</em>. Este operador añade el
      valor que le pasamos como parámetro justo al final del array. Si el campo
      ya existe, el valor no se añade.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
&amp;gt; db.products.update(
  {
    tipo : &quot;PLACA&quot;
  }, {
    $addToSet : {
      caracteristicas : &quot;WIFI&quot;
    }
  }
)</code>
 </pre>
    <br>
    <p>Si volvemos a ejecutar el comando, veremos que no se añaden nuevos
      valores <em>"WIFI"</em>, ya que el valor ya existe en el array. Si
      queremos añadir varios elementos en un mismo comando, tendremos que añadir
      el operador <em>$each</em> y un array de elementos justo después del
      operador<em> $addToSet</em>.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
  &amp;gt; db.products.update(
    {
        tipo : &quot;PLACA&quot;
    },
    {
        $addToSet :
        {
            caracteristicas :
            {
                $each : [&quot;WIFI&quot;, &quot;Chipset&quot;]
            }
        }
    }
  )  </code>
 </pre>
    <p><br>
    </p>
    <p>Otra opción para añadir elementos a un array es usar el operador <em>$push</em>.
      Este comando es exactamente igual que <em>$addToSet</em>, con la
      diferencia de que, en este caso, el elemento siempre se añade, exista o
      no. </p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
&amp;gt; db.products.update(
	{
		tipo : &quot;PLACA&quot;
	},
	{
		$push :
		{
			caracteristicas : &quot;Audio 5.1&quot;
		}
	}
  )  </code>
 </pre>
    <p><br>
    </p>
    <p>Si ejecutamos el anterior comando y luego un <em>find</em>, veremos que
      el elemento se añade tantas veces como lo hayamos ejecutado.</p>
    <p><br>
    </p>
    <p><strong>Desde la versión 2.4 de MongoDB</strong>, <em>$push</em> también
      permite el uso de <em>$each</em>, así que como hacíamos con <em>$addToSet</em>
      podemos escribir el siguiente comando que añadirá dos elementos al array,
      existan o no.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
 &amp;gt; db.products.update(
	{
		tipo : &quot;PLACA&quot;
	},
	{
		$push :
		{
			caracteristicas :
			{
				$each : [&quot;Audio 3.0&quot;, &quot;Audio 6.0&quot;]
			}
		}
	}
	) </code>
 </pre>
    <p><br>
    </p>
    <p>Si lo que queremos es eliminar elementos de un array, también tenemos
      distintas opciones. Una de ellas es el operador <em>$pop</em>, que
      elimina el primer o último elemento de un array.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
&amp;gt; db.products.update(
	{
		tipo : &quot;PLACA&quot;
	},
	{
		$pop :
		{
			caracteristicas : 1
		}
	}
)</code>
 </pre>
    <p><br>
    </p>
    <p>Si al operador <em>$pop</em> le pasamos un 1, borrará el último elemento
      del array. Si le pasamos un -1, eliminará el primer elemento del array.
      Pero ¿y si queremos borrar un elemento en concreto sin saber su posición?.
      Para eso utilizaremos el operador <em>$pull</em>.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
 &amp;gt; db.products.update(
	{
		tipo : &quot;PLACA&quot;
	},
	{
		$pull :
		{
			caracteristicas : &quot;Chipset&quot;
		}
	}
) </code>
 </pre>
    <p><br>
    </p>
    <p>Este comando realiza una consulta sobre el array, borrando todos los
      elementos del mismo que la cumplan. En el ejemplo anterior hemos borrado
      todos los elementos <em>"Chipset"</em>.</p>
    <p><br>
    </p>
    <p>Si lo que necesitamos es borrar varios elementos de un array,
      realizaremos una acción similar, pero utilizando el comando <em>$pullAll</em>.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
 &amp;gt; db.products.update(
	{
		tipo : &quot;PLACA&quot;
	},
	{
		$pullAll :
		{
			caracteristicas : [&quot;Audio 5.1&quot;, &quot;Ethernet&quot;]
		}
	}
) </code>
 </pre>
    <h2>Otras operaciones de actualización</h2>
    <p>Para finalizar, vamos a hablar de dos operadores que nos pueden ser
      útiles a la hora de realizar actualizaciones. </p>
    <p><br>
    </p>
    <p>Una operación habitual es la de incrementar un valor numérico en una
      determinada cantidad.&nbsp; Imaginemos que nos llegan 5 placas base Asus
      nuevas y queremos aumentar la cantidad en la base de datos. Podríamos
      realizar una consulta a la base de datos, recuperar la cantidad existente,
      incrementarla y realizar una actualización. Pero no hace falta complicarse
      tanto ya que es mucho más sencillo utilizar el operador<em> $inc</em>.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
  &amp;gt; db.products.update(
	{
		nombre : &quot;Placa Base Asus&quot;
	},
	{
		$inc :
		{
			cantidad : 5
		}
	}
) </code>
 </pre>
    <p><br>
    </p>
    <p>El comando agrega 5 unidades más al campo cantidad. Por ejemplo si hay 10
      a la hora de actualizar, pasarán a ser 15. Si utilizamos un valor
      negativo, se restarán las unidades.</p>
    <p><br>
    </p>
    <p>También puede ser que nos equivoquemos a la hora de crear un campo, y el
      nombre que establezcamos sea incorrecto. Podríamos borrarlo y volverlo a
      crear, pero es&nbsp; algo que consumiría recursos de forma innecesaria.
      Para cambiar el nombre de un campo deberemos utilizar el comando <em>$rename</em>.</p>
    <p><br>
    </p>
    <pre class="consolestyle"><code>
 &amp;gt; db.products.update(
	{
		nombre : &quot;Placa Base Asus&quot;
	},
	{
		$rename :
		{
			extrainfo : &quot;masinfo&quot;
		}
	}
) </code> </pre>
    <h2>Conclusión</h2>
    <p>En esta nueva entrega de nuestro tutorial, hemos recorrido la mayoría de
      los comandos disponibles para actualizar documentos en nuestra <strong>base
        de datos NoSQL</strong>. Con todo lo visto en esta entrega y las
      anteriores, podremos enfrentarnos en el día a día a una base de datos <strong>MongoDB</strong>.
      Podremos realizar consultas, inserciones, borrados o modificaciones para
      garantizar que nuestras aplicaciones funcionan correctamente.</p>
    <p><br>
    </p>
    <p>Sin embargo hay operaciones que todavía no sabemos como llevar a cabo.
      Por ejemplo a la hora de realizar informes de explotación, suele ser
      importante realizar operaciones de agregación como agrupar datos, contar,
      sumar para calcular totales etc. Esas y otras cosas las veremos en las
      siguientes entregas. Aquí nos vemos.</p>
    <p><br>
    </p>