---
layout: post
title: MongoDB. Comprobando el rendimiento de usePowerOf2Sizes
redirect_from:
  - /post/79152194969/mongodb-comprobando-el-rendimiento-de.html
  - /post/79152194969/
---

<p>Hace unos días escribí un artículo para GenbetaDev <a href="http://www.genbetadev.com/bases-de-datos/mongodb-la-vida-cambia-tus-datos-tambien-operaciones-de-actualizacion-simples">a propósito de la actualización de datos</a> en <strong>MongoDB</strong></p>

<p>En ese artículo además de hablar sobre como hacer actualizaciones de datos, comentaba cómo almacena <strong>MongoDB</strong> los documentos en la versión 2.4. Cuándo tenemos una colección vacía y empezamos a insertar documentos, <strong>MongoDB</strong> los almacena sin dejar espacio entre ellos. Es decir, que por cada documento almacenado, se reserva el espacio justo que se necesita. Si un documento se actualiza, habrá que moverlo para conseguir el espacio que necesita. Para evitar movimientos constantes -que penalizan el rendimiento- <strong>MongoDB</strong> calcula dinámicamente un <em>factor de separación</em> de manera que se reserva espacio extra en el documento. Si se vuelve a actualizar, como tiene espacio libre adicional, es posible que no sea necesario moverlo.</p>

<p>Por tanto cuándo no hemos realizado ninguna operación de actualización, <em>el factor de separación</em> (en inglés <em>padding factor</em>), es 1. Es decir que <strong>MongoDB</strong> no está dejando espacio entre documentos. Si se producen actualizaciones, habrá que mover los documentos, por lo que <strong>MongoDB</strong> aumentará el <em>factor de separación</em>. Un valor de 1.5, implica que se está añadiendo un 50% más al espacio que necesita un documento. Si el documento ocupa 1KB se reservará un espacio de 1,5KB.</p>

<p>Con la nueva versión 2.6 de <strong>MongoDB</strong> -ahora en release candidate-, este sistema se va a modificar para pasar a utilizar por defecto <strong>usePowerOf2Sizes</strong>.</p>

<h3>¿Qué es usePowerOf2Sizes?</h3>

<p>Este sistema se puede utilizar desde hace varias versiones de <strong>MongoDB</strong>. A partir de la versión 2.6, será el sistema utilizado por defecto, en lugar del actual cálculo dinámico del <em>padding factor</em>.</p>

<p>La idea es muy sencilla, y se trata de redondear el espacio que ocupa un documento a la potencia de 2 superior más cercana. Si nuestro documento tiene un tamaño de 3 bytes, se reservarán 4 bytes. Si su tamaño es de 90 bytes, se reservarán 128 bytes. Y si tiene un tamaño de 1800 bytes se guardará ocupando 2048 bytes.</p>

<p>Esto tiene una ventaja y un inconveniente. La ventaja es que <strong>MongoDB tendrá que mover menos documentos</strong> al realizar actualizaciones. Eso significa que el rendimiento mejorará. La desventaja es que, en teoría, el consumo de disco aumentará. Si por cada documento reservamos más espacio del necesario, está claro que necesitaremos más disco.</p>

<p>Las eliminaciones de documentos también influyen. Cuándo se borra un documento, el espacio que ocupa queda libre. Si se va a insertar un documento, y el espacio libre es suficiente, se utiliza para almacenarlo.</p>

<p>Ahora que hemos visto la teoría, vamos a realizar unos test para ver como se comportan ambos sistemas.</p>

<h3>Componentes necesarios para los test</h3>

<p>Necesitamos dos colecciones para hacer las pruebas</p>

<pre><code>db.createCollection("noPowerOf2Sizes");
db.createCollection("powerOf2Sizes");
db.runCommand( {collMod: "powerOf2Sizes", usePowerOf2Sizes : true });
</code></pre>

<p>La primera colección, la creamos de forma normal. Con la segunda establecemos el parámetro <em>usePowerOf2Sizes</em> a <em>true</em> para usar potencias de 2 para el almacenamiento.</p>

<p>También creamos una función JavaScript que genere números aleatorios en un intervalo dado.</p>

<pre><code>function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
</code></pre>

<p>Otro elemento que voy a utilizar, es un script para generar documentos e insertarlos en las dos colecciones.</p>

<pre><code>//Definición de variables
var myArray;    
var startDate;
var noPowerOf2Milliseconds =0;
var powerOf2Milliseconds = 0;

//Insertamos 1.000.000 documentos
for(var i=0;i&lt;=1000000;i++){

    myArray=new Array();

    for (var a=0;a&lt; getRandomInt(1,10);a++)
    {
      myArray[a] = getRandomInt(1,10) * getRandomInt(1,50);
    }

    startDate= new Date();
    db.noPowerOf2Sizes.insert(
    {
        _id:i,
        foo:myArray
    }); 
    noPowerOf2Milliseconds += Math.abs(new Date() - startDate);  

    startDate= new Date();
    db.powerOf2Sizes.insert(
    {
        _id:i,
        foo:myArray
    }); 
    powerOf2Milliseconds += Math.abs(new Date() - startDate);  
}

print("noPowerOf2 " + noPowerOf2Milliseconds);
print("powerOf2 "+ powerOf2Milliseconds);
print("");
</code></pre>

<p>El script crea 1.000.000 de documentos, con un campo <em>_id</em> y un campo <em>foo</em> que contendrá un array de tamaño y contenido aleatorio. El script hace dos inserciones, una en cada colección, y va almacenando los tiempos  que tardan esas inserciones. Posiblemente haya alguna forma mejor de medir los tiempos, pero yo creo que para los test que voy a realizar es más que suficiente. Aquí un ejemplo de documento insertado:</p>

<pre><code>{
    "_id" : 142184,
    "foo" : [ 
        387, 
        153, 
        32, 
        230, 
        220, 
        26, 
        40,        
        126,        
        160
    ]
}
</code></pre>

<p>El último script, es el que ejecutaré varias veces para ver como se comportan los dos sistemas de almacenamiento. Es el siguiente:</p>

<pre><code>//Definición de variables
var startDate; 
var noPowerOf2Milliseconds =0;
var powerOf2Milliseconds = 0;
var myArray;
//recuperamos el _id más alto que haya sido insertado
var lastElement=db.powerOf2Sizes.find().sort({_id:-1}).limit(1).toArray()[0]._id;


//Realizamos 100.000 actualizaciones aleatorias
for (i=0;i&lt;=100000;i++){
    objectToUpdate= getRandomInt(0,lastElement);

    myArray = new Array();

    for (a=0;a&lt; getRandomInt(1,10); a++){
        myArray[a] = getRandomInt(1,10) * getRandomInt(1,50);  
    }

    startDate= new Date();
    db.noPowerOf2Sizes.update(
        { _id:objectToUpdate},
        {$pushAll:{foo:myArray}}
    );   
    noPowerOf2Milliseconds += Math.abs(new Date() - startDate);

    startDate = new Date();
    db.powerOf2Sizes.update(
      { _id:objectToUpdate},
      {$pushAll:{foo:myArray}}
    );
    powerOf2Milliseconds += Math.abs(new Date() - startDate);            
}

//Realizamos 20.000 eliminaciones aleatorias
for (d=0;d&lt;=20000;d++){
    objectToUpdate= getRandomInt(0,lastElement);

    startDate = new Date();
    db.noPowerOf2Sizes.remove({_id:objectToUpdate});
    noPowerOf2Milliseconds += Math.abs(new Date() - startDate);

    startDate = new Date();
    db.powerOf2Sizes.remove({_id:objectToUpdate});
    powerOf2Milliseconds += Math.abs(new Date() - startDate);
}

//Insertamos 20.000 documentos nuevos
for (j=lastElement + 1; j&lt;= (lastElement + 20000); j++){

    myArray=new Array();    

    for (p=0;p&lt; getRandomInt(1,10); p++)
    {
      myArray[p] = getRandomInt(1,10) * getRandomInt(1,50);
    }

    startDate= new Date();
    db.noPowerOf2Sizes.insert(
    {
        _id:j,
        foo:myArray
    }); 
    noPowerOf2Milliseconds += Math.abs(new Date() - startDate);  

    startDate= new Date();
    db.powerOf2Sizes.insert(
    {
        _id:j,
        foo:myArray
    }); 
    powerOf2Milliseconds += Math.abs(new Date() - startDate);  
}

//Mostramos los tiempos
print("noPowerOf2 " + noPowerOf2Milliseconds);
print("powerOf2 "+ powerOf2Milliseconds);
print("");
</code></pre>

<p>El funcionamiento es sencillo. Primero realizamos 100.000 actualizaciones filtrando por el campo <em>_id</em>. Luego borramos 20.000 documentos y finalmente insertamos otros 20.000. Tanto con las actualizaciones, como con las eliminaciones, es posible que no se realice ninguna operación. Esto es debido a que al ejecutar varias veces el script, es posible que el documento que se trata de borrar o actualizar aleatoriamente, ya no exista.</p>

<p>En el script he usado $pushAll por simplificar las consultas, pero en la versón 2.4 ya ha sido marcado como <em>deprecated</em>. Para cosas más serias es mejor utilizar $push junto con el operador <a href="http://docs.mongodb.org/manual/reference/operator/update/each/">$each</a>.</p>

<p>En todas las operaciones, se realiza la misma acción sobre las dos colecciones.</p>

<h3>Tomando medidas</h3>

<p>Lo primero que hacemos es ejecutar el script de inserción. Una vez ha finalizado el proceso, se lanza el comando <em>stats</em> en cada colección. Por ejemplo, esto es lo que hay en las colecciones <em>noPowerOf2Sizes</em> y  <em>powerOf2Sizes</em> después de la inserción de 1.000.001 documentos.</p>

<pre><code>db.noPowerOf2Sizes.stats();
{
    "ns" : "test.noPowerOf2Sizes",
    "count" : 1000001,
    "size" : 71490776,
    "avgObjSize" : 71.4907045092955,
    "storageSize" : 123936768,
    "numExtents" : 11,
    "nindexes" : 1,
    "lastExtentSize" : 37625856,
    "paddingFactor" : 1,
    "systemFlags" : 1,
    "userFlags" : 0,
    "totalIndexSize" : 27921040,
    "indexSizes" : {
        "_id_" : 27921040
},
"ok" : 1
}

db.powerOf2Sizes.stats();
{
    "ns" : "test.powerOf2Sizes",
    "count" : 1000001,
    "size" : 107887632,
    "avgObjSize" : 107.8875241124759,
    "storageSize" : 123936768,
    "numExtents" : 11,
    "nindexes" : 1,
    "lastExtentSize" : 37625856,
    "paddingFactor" : 1,
    "systemFlags" : 1,
    "userFlags" : 1,
    "totalIndexSize" : 27921040,
    "indexSizes" : {
        "_id_" : 27921040
},
"ok" : 1  }
</code></pre>

<p>Para las mediciones, además de los tiempos que devuelven los scripts, nos vamos a fijar en el parámetro <em>size</em> que nos muestra el comando <em>stats</em>. Este parámetro indica el tamaño de los documentos almacenados (que no es lo mismo que el espacio que ocupan los datos en disco).</p>

<p>Una vez insertados los datos, realizamos varias pasadas del segundo script. Con cada pasada obtenemos el tiempo que tarda en realizarse la operación para cada script, y con <em>stats</em> el tamaño que ocupan los datos.</p>

<h3>Resultados</h3>

<p>Los datos que yo he obtenido son los siguientes:</p>

<table><thead><tr><th></th>
  <th>ms noPowerOf2</th>
  <th>ms PowerOf2</th>
  <th>Espacio noPowerof2</th>
  <th>Espacio PowerOf2</th>
</tr></thead><tbody><tr><td>1</td>
  <td>20970</td>
  <td>16797</td>
  <td>87763784</td>
  <td>113968192</td>
</tr><tr><td>2</td>
  <td>24109</td>
  <td>19084</td>
  <td>102019032</td>
  <td>119836736</td>
</tr><tr><td>3</td>
  <td>20690</td>
  <td>18000</td>
  <td>114495248</td>
  <td>125442720</td>
</tr><tr><td>4</td>
  <td>17660</td>
  <td>20309</td>
  <td>125581096</td>
  <td>130835712</td>
</tr><tr><td>5</td>
  <td>18284</td>
  <td>18519</td>
  <td>135444200</td>
  <td>136044416</td>
</tr><tr><td>6</td>
  <td>23637</td>
  <td>30972</td>
  <td>144322368</td>
  <td>141061744</td>
</tr><tr><td>7</td>
  <td>24374</td>
  <td>23672</td>
  <td>152318472</td>
  <td>145963744</td>
</tr><tr><td>8</td>
  <td>16919</td>
  <td>17293</td>
  <td>159640784</td>
  <td>150733920</td>
</tr><tr><td>9</td>
  <td>22379</td>
  <td>18692</td>
  <td>166309496</td>
  <td>155405968</td>
</tr><tr><td>10</td>
  <td>17199</td>
  <td>15448</td>
  <td>172489584</td>
  <td>159979968</td>
</tr><tr><td>11</td>
  <td>15915</td>
  <td>25677</td>
  <td>178227256</td>
  <td>164397712</td>
</tr><tr><td>12</td>
  <td>18456</td>
  <td>17995</td>
  <td>183622696</td>
  <td>168715264</td>
</tr><tr><td>13</td>
  <td>21171</td>
  <td>19542</td>
  <td>188779584</td>
  <td>172981552</td>
</tr><tr><td>14</td>
  <td>22439</td>
  <td>33075</td>
  <td>193657648</td>
  <td>177145888</td>
</tr><tr><td>15</td>
  <td>21426</td>
  <td>30141</td>
  <td>198368448</td>
  <td>181273584</td>
</tr><tr><td>16</td>
  <td>24909</td>
  <td>26866</td>
  <td>202882568</td>
  <td>185336912</td>
</tr><tr><td>17</td>
  <td>24919</td>
  <td>22370</td>
  <td>207172096</td>
  <td>189340096</td>
</tr><tr><td>18</td>
  <td>28614</td>
  <td>20103</td>
  <td>211301216</td>
  <td>193269904</td>
</tr><tr><td>19</td>
  <td>24280</td>
  <td>33770</td>
  <td>215432120</td>
  <td>197177120</td>
</tr><tr><td>20</td>
  <td>14813</td>
  <td>17014</td>
  <td>219394088</td>
  <td>200983296</td>
</tr><tr><td>21</td>
  <td>23832</td>
  <td>17642</td>
  <td>223309000</td>
  <td>204765904</td>
</tr></tbody></table><p>Para verlo más claro, unos gráficos.</p>

<p><img src="http://38.media.tumblr.com/36431df1c3f77e83a963c63988c19f38/tumblr_inline_n255o96Pto1sno6e9.png" alt=""/></p>

<p><img src="http://33.media.tumblr.com/2facd736a27c36cf16ddc29a7a53313e/tumblr_inline_n255oiBoD41sno6e9.png" alt=""/></p>

<h3>Conclusiones</h3>

<p>Lo primero que podemos ver es que con <em>usePowerOf2Sizes</em> se requiere más espacio de disco al inicio. Sin embargo, el consumo de disco con este sistema tiene un crecimiento más sostenido y predecieble. Por eso, llega un momento en el que los documentos ocupan menos espacio que el modelo de reserva de espacio tradicional. El modelo tradicional, que utiliza el <em>padding factor</em>, crece con saltos pronunciados. Es algo curioso, porque a priori podríamos pensar que el <em>usePowerOf2Sizes</em> utilizaría mayor espacio en disco. El problema yo creo que está en la fragmentación. El método que usa el factor de separación mueve los documentos, pero deja más huecos libres, dejando el espacio disponible fragmentado. Con <em>useOfPowerOf2Sizes</em> el espacio que deja un documento cuándo se mueve, es más fácil de identificar, y por tanto el hueco se puede reutilizar de manera más sencilla, reduciendo la fragmentación.</p>

<p>En cuánto a la velocidad de ejecución de las operaciones, podemos decir que utilizar <em>usePowerOf2Sizes</em> es más o menos igual que el sistema tradicional. Dependiendo de las operaciones realizadas, y de los documentos que haya que mover, el rendimiento variará bastante. Si puedo decir, que haciendo pruebas con menos documentos, el uso de <em>usePowerfOfSizes</em> mejora un poco el rendimiento.</p>

<p>Con este sencillo test, hemos podido comprobar por qué <em>usePowerOf2Sizes</em> será el modo de reserva de espacio que la nueva versión 2.6 de <strong>MongoDB</strong> utilizará por defecto. El espacio requerido por la base de datos será más previsible, y estable que con el método tradicional.</p>

<p>Eso sí, hay que tener en cuenta que el método actual de <em>padding factor</em> no se elimina. Simplemente pasará a ser opcional.</p>

* * * * *

* * * * *

*Recuerda que puedes ver el índice del tutorial y acceder a todos los
artículos de la serie [desde aquí.](https://charlascylon.com/tutorialmongo)*