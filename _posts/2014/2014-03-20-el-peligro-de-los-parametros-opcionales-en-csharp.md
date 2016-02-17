---
layout: post
title: El peligro de los parámetros opcionales en C#
redirect_from:
  - /post/80152144495/el-peligro-de-los-parametros-opcionales-en-csharp.html
---

<p>Lo que voy a contar en esta entrada, no es algo nuevo. Seguro que muchos ya habéis lidiado con esto, pero no viene mal explicarlo.</p>

<p>Cuando desarrollamos una librería que expone su funcionalidad a otras aplicaciones o ensamblados, <strong>tenemos que tener cuidado con utilizar los parámetros opcionales de C#</strong>.</p>

<h3>Parámetros opcionales en C#</h3>

<p>C# nos da la oportunidad de utilizar parámetros opcionales. Con ellos, entre otras cosas, se puede evitar tener que duplicar código al crear constructores o métodos que reciban distintos parámetros. Por ejemplo:</p>

<pre><code>public class SuperHeroWithOptionalParameters
{
    // Campos de la clase
    public readonly string Name;
    public readonly bool HasSuperPowers;
    public readonly bool CanFly;

    // Constructor de la clase
    public SuperHeroWithOptionalParameters(string HeroName, 
                                           bool HeroHasSuperPowers = false, 
                                           bool HeroCanFly = false)
    {
        Name = HeroName;
        HasSuperPowers = HeroHasSuperPowers;
        CanFly = HeroCanFly;        
    }        
}
</code></pre>

<p>Tenemos una clase con varios campos de solo lectura, que se inicializan a través del constructor. El constructor tiene campos opcionales que toman un valor por defecto, en el caso de que no se incluyan a la hora de instanciar el objeto.</p>

<p>La ventaja de esto es que nos evitamos escribir un constructor por cada combinación de parámetros de entrada que tengamos.</p>

<p>Si quisiéramos utilizar esta clase desde otro ensamblado, bastaría con añadir una referencia, incluir la librería en el <em>using</em> y hacer algo como esto:</p>

<pre><code>SuperHeroWithOptionalParameters batman = 
            new SuperHeroWithOptionalParameters("Batman");
</code></pre>

<p>Como solo hemos incluido el parámetro <em>Name</em> en el constructor, los otros parámetros se consideran opcionales, y toman el valor por defecto que habíamos definido en el constructor.</p>

<p>Y alguien se preguntará ¿dónde está el problema?</p>

<h3>Problemas al versionar la librería</h3>

<p>Los problemas aparecerán el día que queramos actualizar nuestra biblioteca de clases. Si las clases son públicas y modificamos su definición, nos veremos obligados a recompilar todos las aplicaciones que la utilicen para poder utilizar la nueva versión. Al menos si no queremos sufrir las excepciones.</p>

<p>Veamos con un ejemplo. Modificamos nuestra clase original, para incluir un nuevo parámetro.</p>

<pre><code>public class SuperHeroWithOptionalParameters
{
    // Campos de la clase
    public readonly string Name;
    public readonly bool HasSuperPowers;
    public readonly bool CanFly;
    public readonly bool IsRich;

    // Constructor de la clase
    public SuperHeroWithOptionalParameters(string HeroName, 
                                           bool HeroHasSuperPowers = false, 
                                           bool HeroCanFly = false,
                                           bool HeroIsRich = false)
    {
        Name = HeroName;
        HasSuperPowers = HeroHasSuperPowers;
        CanFly = HeroCanFly;
        IsRich = HeroIsRich;
    }        
}
</code></pre>

<p>El código es igual que el anterior, pero añadiendo el campo <em>IsRich</em>. Como ya he comentado, el problema de esto es que los ensamblados que utilizaban la anterior versión de esta clase, han dejado de ser compatibles con la nueva. Al menos sin volver a compilar. Si incluimos la nueva versión en otro ensamblado distinto, y creamos un objeto SuperHeroWithOptionalParameters recibiremos la siguiente excepción:</p>

<pre><code>Excepción no controlada: System.MissingMethodException: 
Método no encontrado: 'Void PublicAssembly.SuperHeroWithOptionalParameters..ctor
(System.String, Boolean, Boolean)'.
</code></pre>

<p>Esto sucede porque, en realidad, se realiza la llamada al constructor incluyendo los parámetros por defecto. Es decir que se está llamando a SuperHeroWithOptionalParameters(&ldquo;Batman&rdquo;,false,false). Pero ese constructor ya no existe. Al modificar el ensamblado, solo existe un constructor que  tiene que recibir cuatro parámetros.</p>

<h3>Mejor utilizar otras opciones</h3>

<p>Para no tener este problema podremos utilizar <a href="http://msdn.microsoft.com/es-es/library/bb384062.aspx">inicializadores de objetos</a>.</p>

<p>Los inicializadores de objetos llegaron de la mano de C# 3.0. Utilizando un poco de <a href="http://en.wikipedia.org/wiki/Syntactic_sugar">syntax sugar</a> conseguimos que instanciar objetos y definir los valores de sus propiedades o campos, sea mucho más sencillo. Por ejemplo, tenemos la siguiente clase:</p>

<pre><code>public class SuperHero
{
    public string Name { get; set; }
    public bool HasSuperPowers { get; set; }
    public bool CanFly { get; set; }
    public bool IsRich { get; set; }

    public SuperHero(string HeroName)
    {
        Name = HeroName;
        HasSuperPowers = false;
        CanFly = false;
        IsRich = false;
    }
}
</code></pre>

<p>Que podríamos instanciar de la siguiente manera:</p>

<pre><code>SuperHero ironman = 
    new SuperHero("Ironman") { IsRich = true };
</code></pre>

<p>En este caso, los parámetros opcionales se definen entre corchetes y a través de su nombre.</p>

<p>Lo bueno es que si añadimos parámetros, el código antiguo seguirá funcionando, ya que en ningún caso estamos haciendo referencia a otros parámetros, no incluidos en el código. De hecho el código anterior, es igual que este:</p>

<pre><code>SuperHero ironman = new SuperHero("Ironman");
ironman.IsRich = true;
</code></pre>

<p>La ventaja, al igual que con los parámetros opcionales, es que nos ahorramos tener que escribir varios constructores.</p>

<p>Pero esta forma de abordar el problema también tiene un lado malo. Los inicializadores de objetos necesitan que las propiedades tengan un <em>set</em>. Es decir, que no se pueden declarar como propiedades de solo lectura.</p>

<p>De hecho esta versión de la clase yo la he implementado con propiedades, pero de la misma manera podríamos haber usado campos de clase.</p>

<p>En el caso de que necesitemos inmutabilidad, estamos obligados a implementar los constructores específicamente y declarar las propiedades como solo lectura.</p>

<p>Así que lo dicho, <strong>cuidado con los campos opcionales en métodos públicos</strong>.</p>
