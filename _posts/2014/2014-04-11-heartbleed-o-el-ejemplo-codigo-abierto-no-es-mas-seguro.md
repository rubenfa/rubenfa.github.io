---
layout: post
title: Heartbleed, o el ejemplo de que el Código Abierto no es más seguro
redirect_from:
  - /post/82368632056/heartbleed-o-el-ejemplo-codigo-abierto-no-es-mas-seguro.html
  - /post/82368632056/
---

<p>Esta semana hemos conocido, el que probablemente sea el fallo de seguridad más grande en la historia de internet: <strong>Heartbleed</strong>. Debido a un error en la librería <a href="https://www.openssl.org/">OpenSSL</a>, multitud de sitios han sido vulnerables durante un tiempo indeterminado. El fallo permitía a un atacante poder leer direcciones de memoria a las que de otra manera no tendría acceso. Con un poco de suerte, los malvados pueden haber accedido a contraseñas, usuarios o claves privadas del servidor. El fallo ha sido terrible, y <a href="https://github.com/musalbas/heartbleed-masstest/blob/master/top10000.txt">multitud de los sitios de internet</a> presentes en el Top 1000 de los más visitados han quedado expuestos, ya que son muchos los servicios que utilizan esta librería.</p>

<p>No me quiero extender mucho más, porque el tema ya ha sido ampliamente comentado. Para más detalles de la cantidad de servidores afectados, o de una explicación mejor del bug, podéis leer el artículo de mi compi Juan Quijano <a href="http://www.genbetadev.com/seguridad-informatica/heartbleed-en-openssl-mas-del-50-de-los-sitios-de-internet-afectados">en GenbetaDev</a> o el de Guillermo Julián en <a href="http://www.genbeta.com/seguridad/heartbleed-otro-fallo-extremadamente-grave-en-una-libreria-ssl">Genbeta</a>.</p>

<h3>Pero, ¿el Código Abierto no era más seguro?</h3>

<p>Cuando se intenta defender el <em>Código Abierto u Open Source</em>, se tiende a usar <strong>el argumento de que es más seguro</strong>. La teoría de las personas que defienden esta postura es que, como el código puede ser revisado por miles de ojos, siempre va a ser más seguro que el código cerrado. Pues bien, aquí tenemos la prueba de que esto no es así. <em>OpenSSL</em> es código abierto, y esto no ha evitado el problema.</p>

<p>Ojo, que no se me malinterprete. No soy contrario al código Open Source. Simplemente pienso que ese argumento se utiliza muy a la ligera. De hecho me parece que es un argumento falso.</p>

<p>Es cierto que el código está accesible a cualquier usuario. Pero eso no implica que alguien se ponga a revisarlo. Hay miles de librerías Open Source, y cada día aparecen más. Es imposible que haya suficientes programadores para colaborar en todos estos proyectos, por lo que al final, los ojos que revisan el código no son tantos. Y aunque así fuera, las revisiones de código no va a detectar los errores.</p>

<p>Para evitar problemas de este tipo hay que hacer buen software. Para eso hay que aplicar todas las buenas prácticas que conozcamos: usar tests (muchos tests), mantener políticas de calidad, revisiones periódicas del software etc. Técnicas que podemos aplicar desarrollemos código abierto o no.</p>

<p>El Open Source tiene muchas ventajas sobre el código cerrado: cualquiera puede usarlo, las comunidades que se forman en torno a los proyectos son fantásticas, se gana independencia sobre los caprichos de las empresas, innovación en algunos casos etc. Pero que no nos engañen. El código abierto no es más seguro  que el código cerrado. Ni tampoco tiene porque ser mejor.</p>
