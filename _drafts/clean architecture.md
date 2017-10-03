Estoy seguro de que si te dedicas a programar, conoces a Robert "Uncle" Martin. Su libro *Clean Code* es uno de los más recomendados en la lista de libros que todo desarrollador debería leer. Martin, con sus cosas buenas y malas, es uno de los desarrolladores más influyentes del panorama ingenieril. Fuerte defensor de TDD, de la cobertura de tests y otras buenas prácticas, hay personas que siguen sus enseñanzas a rajatabla. 

Recientemente, Bob Martin, ha publicado un nuevo libro llamado Clean Architecture. ¿Pero qué se entiende por arquitectura limpia?


## Clean Code

Como comentaba antes, *Clean Code* es un libro muy recomendable, que desgrana algunas ideas importantes para poder escribir código limpio.

El código limpio es aquel código que está estructurado de forma compresible, que es claro en sus intenciones, fácil de leer, que es fácilmente mantenible y que está testeado. En el libro se van dando algunas ideas para conseguir escribir código limpio, hablando de principios SOLID, de la importancia de dar nombres a variables y clases etc. En GenbetaDev [ya hemos hablado del libro y de sus ideas en alguna ocasión](https://www.genbetadev.com/metodologias-de-programacion/12-ideas-de-la-filosofia-clean-que-no-pueden-faltar-en-tu-codigo)

## Conceptos de la arquitectura limpia

Aunque seamos capaces de escribir código limpio, podemos encontrarnos que al crecer nuestro sistema, la arquitectura del mismo nos haga de lastre. Y es que no es lo mismo escribir código limpio para un proyecto sencillo, que para un proyecto complejo, compuesto de varios componentes obligados a cooperar. A veces las arquitecturas son demasiado complejas, nos obligan a repetir código, o nos hacen tener demasiadas dependencias entre componentes, causándonos muchos problemas.

Si hacéis programación orientada a objetos, seguro que conocéis los conceptos de cohesión y acoplamiento. Esos conceptos también pueden aplicarse de forma parecida a los componentes de un sistema, ya que siendo *dlls* o archivos *jar*, tienen que cooperar unos con otros. Y la manera en la que cooperen, pueden hacer un sistema fracasar.

### Cohesión

- **The Reuse/Release Equivalence Principle**: que nos dice que los componentes deben poder ser desplegados de forma independiente sin afectar a los demás. Las clases, o código que van en ese componente, deben tener una relación, y por tanto deben poderse desplegar de forma conjunta. 

- **The common closure principle**: se podría decir que hablamos del [principio de responsabilidad única (SRP)](https://www.genbetadev.com/metodologias-de-programacion/doce-principios-de-diseno-que-todo-desarrollador-deberia-conocer) aplicado a componentes. La idea es agrupar clases que puedan cambiar por la misma razón en un solo componente. Si tenemos que hacer un cambio, y hay que tocar varios componentes, esto supondrá tener que desplegarlos todos, en lugar de solo uno.

- **The common reuse principle**: este principio nos habla de evitar que los usuarios que utilizan un componente dependan de cosas que no necesitan. Si un componente depende de otro, hay que intentar que sea porque necesita todas las clases que lo componen. Lo contrario nos obligará a trabajar de más, cuando nos toque hacer el despliegue. De esta manera será más fácil reutilizar componentes.

Conseguir cumplir estos tres principios a la vez es algo bastante difícil, por lo que a veces hay que aceptar compromisos. Por ejemplo es común sacrificar un poco la reusabilidad,  para conseguir que los componentes sean fáciles de desplegar.


### Acomplamiento


