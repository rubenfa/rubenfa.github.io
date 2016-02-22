---
layout: post
title: Mejorando la consola de Windows con ConEmu y PowerShell
redirect_from:
  - /post/61794335283/mejorando-la-consola-de-windows-con-conemu-y.html
  - /post/61794335283/
---

[El otro día
empecé](http://charlascylon.com/post/61794334554/tutorial-mongodb-introducción-a-nosql-y-las-bases.html)
lo que va a ser una serie de artículos sobre **MongoDB**. Aunque la
intención es explicar como trabajar con **.NET** en MongoDB, la primera
tanda de artículos estará relacionada directamente con el gestor de base
de datos y su uso desde la consola. Y cómo la consola de Windows es un
poco “ligth”, vamos a ver como dotarla de funcionalidades extra.

Si habéis utilizado algún sistema Linux en alguna ocasión, os habréis
dado cuenta que la consola es una gran herramienta que permite  realizar
muchas tareas de forma rápida y flexible. Aunque la consola asusta mucha
gente, usada con sabiduría puede hacernos ser mucho más eficientes, e
incluso, sacarnos de algún lío. Podemos abrir pestañas, editores de
texto y ejecutar multitud de comandos y scripts, para interactuar con el
sistema operativo.

Como la consola de Windows de toda la vida (CMD) aporta pocas opciones,
Microsoft lanzó con Windows Vista una versión avanzada, conocida como
[PowerShell](http://es.wikipedia.org/wiki/Windows_PowerShell). Esta
nueva consola nos permite lanzar comandos al sistema operativo, como
hacía la antigua consola, pero además nos permite conectar con SLQ
Server o IIS. La intención de este artículo no es profundizar en los
comandos de PowerShell, pero bastará con ejecutar un “help about” en la
misma consola de **PowerShell**para descubrir mucha información sobre la
misma. En definitiva, con PowerShell tenemos una herramienta similar a
las shell existentes en Linux.

### Ampliar las opciones de la consola

Ahora que nos hemos decidido por usar PowerShell, nos encontramos con el
problema de que más allá de las funcionalidades que ofrece, el entorno
no es del todo amigable. Para solucionarlo vamos hacer uso de
[Conemu](https://code.google.com/p/conemu-maximus5/), que nos permite
usar la consola tradicional de Windows o PowerShell, pero añadiendo un
montón de opciones interesantes.

Instalarlo es tan fácil como instalar cualquier programa de Windows, y
nada más abrirlo ya vemos las diferencias. Tenemos opción de abrir
muchas pestañas (algo que nos será muy útil con MongoDB), configurar el
color del fondo, del texto, la fuente, que la ventana sea
semitransparente …  Pero nada más abrir, vemos un problema: se nos abre
la consola normal de Windows y no PowerShell. Afortunadamente arreglarlo
es muy sencillo y basta con agregar los siguiente parámetros al arranque
del programa: 


{% highlight powershell %}
"C:\Program Files\ConEmu\ConEmu64.exe" /config "shell" /dir "c:\" /cmd powershell -new_console:n
{% endhighlight %}

De todas formas si queremos abrir una consola normal, podremos hacerlo
en cualquier momento si al abrir insertamos:


{% highlight powershell %}
C:\Windows\System32\cmd.exe
{% endhighlight %}

### Añadir Notepad++ para editar texto

Pues ya tenemos consola con opciones avanzadas, que arranca PowerShell
¿qué nos falta? Personalmente lo primero que he echado de menos es un
editor de texto. Sí, podemos editar archivos de texto con notepad, pero
no es precisamente la mejor manera de crear y editar scripts. 

Personalmente un editor que utilizo bastante para estos temas y que
tiene un gran número de opciones es
[Notepad++](http://notepad-plus-plus.org/). Este editor nos permite
resaltar la sintaxis de muchísimos lenguajes (SQL, C\#, JavasScript,
Java …), comparar archivos y además tiene un sistema de plugins para
añadir funcionalidades extra. Muy recomendable. Para poder utilizarlo
basta con descargarlo e instalarlo. No requiere de ninguna configuración
especial, así que ponerlo a funcionar, es muy sencillo.

Una vez instalado, si abrimos una consola PowerShell desde ConEmu y
ejecutamos Notepad++, se nos mostrará un error diciendo que no se
encuentra el comando. Podemos solucionar esto añadiendo la ruta de
instalación de Notepad++ a las variables de entorno, pero vamos a
hacerlo de una manera más elegante. Utilizaremos
los [alias](http://technet.microsoft.com/en-us/library/ee692685.aspx).
 Una alias no es más que una manera distinta de llamar a un comando o
programa, de manera que cuando introduzcamos el alias en la consola
Powershell se realice la acción deseada.

Para añadir un nuevo alias debemos hacerlo en
un [perfil](http://technet.microsoft.com/en-us/library/ee692764.aspx),
así que vamos a ello. Para ver la ruta dónde está nuestro perfil, basta
con ejecutar el comando


{% highlight powershell %}
$profile
{% endhighlight %}

Esto nos indica dónde está nuestro perfil, pero es posible que la ruta
no exista. Cosa que podemos comprobar con el comando


{% highlight powershell %}
test-path $profile
{% endhighlight %}

Este comando devuelve true si el archivo existe o false si no existe. En
cualquier caso ahora vamos a abrir el perfil con el comando


{% highlight powershell %}
notepad $profile
{% endhighlight %}

Lo abrimos con Notepad, porque aun no tenemos ningún otro editor
configurado. Si el archivo no existe PowerShell nos preguntará si
queremos crearlo. Le diremos que sí y añadiremos las siguientes líneas:


{% highlight powershell %}
$NOTEPADPLUS = "C:\Program Files (x86)\Notepad++\notepad++.exe"Set-Alias notepadp $NOTEPADPLUS
{% endhighlight %}


Las líneas son bastante sencillas. Estamos declarando una variable
$NOTEPADPLUS con la ruta al ejecutable de Notepad++. Luego creamos un
alias con Set-Alias y elegimos que se abra la ruta con el comando
notepadp. Yo he puesto notepadp, pero podéis poner lo que mejor os
parezca (editor,notepad++ o chorizo).

Ahora si guardamos los cambios del archivo creado, cerramos y volvemos a
abrir ConEmu, nos aparecerá un error diciendo que la ejecución de
scripts no está permitida. Esto es porque al arrancar la consola se
trata de ejecutar el script que hemos creado antes y que carga los
valores del perfil, pero por seguridad, no pueden ejecutarse scripts que
no estén firmados. La seguridad siempre es buena, pero en este caso el
script lo hemos creado nosotros, así que deberíamos poder ejecutarlo. Si
ejecutamos: 


{% highlight powershell %}
Get-Help About_Signing
{% endhighlight %}

Obtendremos mucha información sobre la firma de scripts. Nosotros en
este caso ejecutaremos simplemente el comando:


{% highlight powershell %}
Set-ExecutionPolicy RemoteSigned
{% endhighlight %}

Que nos permitirá ejecutar scripts creados localmente. Una vez hecho
esto, cerramos y abrimos ConEmu, y veremos que el error ya no aparece. Y
ahora si ejecutamos el alias se nos abrirá Notepad++ e incluso nos
creará el archivo si se lo pasamos el nombre como parámetro:

{% highlight powershell %}
notepadp test.sql
{% endhighlight %}

### Añadir nano para tener un editor de texto interno

Notepad++ está muy bien, pero a veces simplemente queremos editar
archivos de forma rápida y sencilla. Es un poco molesto que se abra una
nueva ventana para editar un par de líneas. En Linux para estas cosas yo
suelo usar [nano](http://www.nano-editor.org/) que es un editor bastante
potente, pero muy sencillo de utilizar. No obstante también se puede
usar [vim](http://www.vim.org/) o cualquier otro. Para gustos los
colores.

Así que bajamos nano y lo descomprimimos en una ruta conocida. No es
necesario instalarlo. Y siguiendo los mismos pasos que hemos seguido
antes, añadimos un alias para nano en nuestro perfil de PowerShell.

{% highlight powershell %}
$NANOPATH = "C:\Program Files (x86)\Nano\nano.exe"Set-Alias nano $NANOPATHFunction Edit-Profile{    nano $profile}
{% endhighlight %}

La idea es la misma que con Notepad++. Creamos un alias llamado nano
(podéis poner lo que queráis) que se ejecutará desde cualquier consola
PowerShell. Y como bonus track, sobreescribimos la funcionalidad de la
función Edit-Profile para que use nano. Así que si en PowerShell
ejecutamos:

{% highlight powershell %}
Edit-Profile
{% endhighlight %}

Veremos nuestro perfil dentro de PowerShell en un editor nano.

[![image](http://3.bp.blogspot.com/-kZrY9aGLNP4/Ubru5YefjRI/AAAAAAAAAy4/92X3kiM0plU/s1600/console.png)](http://3.bp.blogspot.com/-kZrY9aGLNP4/Ubru5YefjRI/AAAAAAAAAy4/92X3kiM0plU/s1600/console.png)

Y ahora, con nuestra vitaminada consola, las próximas entradas sobre
MongoDB serán más sencillas.




