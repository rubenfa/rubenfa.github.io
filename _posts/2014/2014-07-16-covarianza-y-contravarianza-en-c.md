---
layout: post
title: Covarianza y contravarianza en C#
redirect_from:
  - /post/91933019083/covarianza-y-contravarianza-en-c.html
  - /post/91933019083/
---

<p>La <strong>covarianza y la contravarianza</strong> son de esos conceptos de C# que no son fáciles de asimilar. De primeras parece algo fácil de entender, pero cuando te pones a ello te das cuenta de hay que pensarlo más detenidamente. Incluso muchas veces los estamos usando sin darnos cuenta.</p>

<p>En este artículo voy a tratar de explicar ambas propiedades. Espero que se entienda</p>

<blockquote>
  <p>Nota: estos conceptos provienen de una rama matemática llamada <a href="http://es.wikipedia.org/wiki/Teor%C3%ADa_de_categor%C3%ADas">Teoría de categorías</a>. En el blog de  Tomas Petricek <a href="http://tomasp.net/blog/variance-explained.aspx/">hay una explicación muy buena</a>, sobre la teoría matemática y la relación con C#.</p>
</blockquote>

<h3>Clases derivadas, covarianza y contravarianza</h3>

<p>La <strong>covarianza</strong> y <strong>contravarianza</strong> son propiedades que se atribuyen a jerarquías de clases. Por ejemplo podemos tener un clase <em>Burger</em>, de la cual heredan otras como <em>KangreBurger</em> y <em>DobleKangreBurger</em>. Simplificando podríamos decir que la clase <em>Burger es mayor que</em> las clases <em>KangreBurger</em> y <em>DobleKangreBurger</em>. Y como .NET toda clase hereda de <em>Object</em> podríamos decir que <em>Object es mayor que Burger</em>, <em>Kangreburger</em> o <em>DobleKangreburger</em>. Como digo es una simplificación para que nos entendamos, ya que no estamos comparando cuantitativamente las clases.</p>

<p>Hasta aquí la parte fácil.</p>

<p>Entrando en la parte difícil, podríamos decir que la <strong>covarianza</strong> es la propiedad por la cual podemos utilizar instancias de clases más pequeñas como si fueran una instancia de una clase mayor. Por ejemplo podríamos utilizar instancias de la clase <em>KangreBurger</em>, en lugar de especificar una instancia de la clase <em>Burger</em>.</p>

<pre><code>IEnumerable&lt;burger&gt; = new List&lt;kangreburger&gt;;
</code></pre>

<p>El fragmento anterior funciona porque <em>IEnumerable</em> es covariante y acepta clases más pequeñas sin necesidad de conversiones.</p>

<p>La <strong>contravarianza</strong>, va en el sentido contrario. Podemos utilizar instancias de clases más grandes, como si fueran instancias de clases más pequeñas.</p>

<pre><code>IComparer&lt;kangreburger&gt; comparador = new CustomComparer&lt;burger&gt;();
</code></pre>

<p>En este caso el fragmento funciona porque la interface <em>IComparer</em> es contravariante.</p>

<h3>¿Y dónde se aplica la contravarianza y la covarianza?</h3>

<p>Como hemos visto en los ejemplos anteriores, estas propiedades se pueden aplicar en interfaces genéricas, como <em>IEnumerable</em> o <em>IComparer</em>. Pero se pueden dar en más casos. Por ejemplo en Arrays:</p>

<pre><code>Burger[] burgers = new KangreBurger[5];
</code></pre>

<p>Lo que hacemos en el ejemplo es totalmente válido, porque los <em>Arrays</em> en C# son covariantes. Aunque son covariantes con &ldquo;peros&rdquo;. El siguiente ejemplo provocaría un error en tiempo de ejecución:</p>

<pre><code>Burger[] burgers = new KangreBurger[5];
burgers[0] = new DobleKangreBurger() { Name = "Doble Kangre Burger" };
</code></pre>

<p>El <em>Array</em>, debido a la covarianza, es un <em>Array</em> de <em>KangreBurgers</em>. Asignar una <em>DobleKangreBurger</em> a ese mismo <em>Array</em> provoca un error porque los tipos son diferentes. Esta comprobación se realiza en tiempo de ejecución, por lo que existe una penalización en el rendimiento. Eric Lippert <a href="http://blogs.msdn.com/b/ericlippert/archive/2007/10/17/covariance-and-contravariance-in-c-part-two-array-covariance.aspx">explica</a> que la decisión de hacer los <em>Arrays</em> covariantes fue polémica en su momento, e impuesta por la necesidad de hacer que C# se comportara como Java.</p>

<p>La <strong>covarianza</strong> también se puede dar en delegados. Por ejemplo:</p>

<pre><code>Func&lt;kangreburger&gt; func = () =&gt; { return new KangreBurger(); };
Burger b = func();
</code></pre>

<p>La función <em>func</em> devuelve un objeto <em>KangreBurger</em>, que puede ser asignado a un <em>Burger</em>, sin tener que hacer ninguna conversión.</p>

<p>Un ejemplo de contravarianza lo podemos encontrar también en genéricos que reciben parámetros. Por ejemplo:</p>

<pre><code>Action&lt;burger&gt; act = (newBurger) =&gt; { Console.WriteLine(newBurger.Name); };
Action&lt;doblekangreburger&gt; act2 = act;
</code></pre>

<p>En este caso creamos una función delegada que recibe un parámetro <em>Burger</em>. Y luego se lo asignamos a otra función que acepta parámetros de tipo <em>DobleKangreBurger</em>. Como <em>Action<t></t></em> es contravariante, la operación está permitida.</p>

<p>Si queréis una lista de interfaces y delegados que son covariantes o contravariantes que existen en C#, podéis encontrarla en <a href="http://msdn.microsoft.com/es-es/library/dd799517%28v=vs.110%29.aspx#InterfaceCovariantTypeParameters">este artículo de MSDN</a></p>

<h3>Definiendo nuestras propias interfaces covariantes o contravariantes</h3>

<p>Si queremos crear interfaces genéricas covariantes o contravariantes, tendremos que usar los parámetros de tipo con modificadores <a href="http://msdn.microsoft.com/en-us/library/dd469487.aspx">out</a> o <a href="http://msdn.microsoft.com/en-us/library/dd469484.aspx">in</a> según corresponda.</p>

<h4>Interfaces covariantes</h4>

<p>Por ejemplo supongamos las siguientes interfaces:</p>

<pre><code>interface IPrintable&lt;out t&gt;
{
    IPropertyPrinter GetPrinter();
}

interface IPropertyPrinter 
{
    void PrintProperty&lt;t&gt;(T element, string propertyName);
}
</code></pre>

<p>Como se puede ver, <em>IPrintable</em> utiliza <em>out</em>, lo que quiere decir que es covariante. Podemos implementar las interfaces, en dos clases de la siguiente manera:</p>

<pre><code>class Printer&lt;t&gt; : IPrintable&lt;t&gt;
{
    public IPropertyPrinter GetPrinter()
    {
        return new PropertyPrinter();
    }
}

class PropertyPrinter : IPropertyPrinter 
{

    public void PrintProperty&lt;t&gt;(T element, string propertyName)
    {
        var property = typeof(T).GetProperty(propertyName);
        Console.WriteLine(property.GetValue(element));
    }
}
</code></pre>

<p>Y como la interface es covariante, podremos hacer lo siguiente:</p>

<pre><code>  var kangreBurger = new KangreBurger() { Name = "KangreBurger" };

  // Ejemplo de Covarianza
  // Al tener el out en IPrintable estamos permitiendo que Kangreburger actue como Burger
  IPrintable&lt;burger&gt; printer = new Printer&lt;kangreburger&gt;();
  var namePrinter = printer.GetPrinter();            
  namePrinter.PrintProperty&lt;burger&gt;(kangreBurger,"Name");
</code></pre>

<p>Quizá el ejemplo no sea el mejor, pero creo que se entiende. Como <em>IPrintable</em> es covariante, podemos utilizar objetos más pequeños sin recibir ningún error al realizar la conversión. Si quitáis el <em>out</em> de la interface, recibiréis un error diciendo que falta una conversión.</p>

<h4>Interfaces contravariantes</h4>

<p>Para este ejemplo utilizaremos las siguiente interface y su implementación:</p>

<pre><code>interface IPropertyEditor&lt;in t&gt;
{
    void ChangeProperty(T element, string propertyName, object newValue);
}

class PropertyEditor&lt;t&gt; : IPropertyEditor&lt;t&gt;
{
    public void ChangeProperty(T element, string propertyName, object newValue)
    {
        var property = typeof(T).GetProperty(propertyName);
        property.SetValue(element,newValue);
    }
}
</code></pre>

<p>La contravarianza se aplica a parámetros de entrada. Aquí un ejemplo de su uso:</p>

<pre><code>IPropertyEditor&lt;kangreburger&gt; editor = new PropertyEditor&lt;burger&gt;();
editor.ChangeProperty(kangreBurger, "Name", "KangreBurger con queso");
namePrinter.PrintProperty&lt;burger&gt;(kangreBurger, "Name");
</code></pre>

<p>En este caso utilizamos una clase <em>Burger</em>, pero como <em>IPropertyEditor</em> es contravariante no habrá problema. Si quitamos el <em>in</em> de la interface, entonces recibiremos un error de conversión no especificada.</p>

<h3>Conclusiones</h3>

<p>Tanto la <strong>covarianza</strong>, como la <strong>contravarianza</strong> son conceptos densos. Aunque los usamos a menudo sin darnos cuenta, no está de más conocerlas para poder saber que está pasando por detrás. O incluso utilizarlas en nuestras interfaces, sabiendo lo que estamos haciendo.</p>
