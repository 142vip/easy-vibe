# Principios de los tests A/B: tomar decisiones con datos

::: tip 🎯 Pregunta central
**¿Cómo verificar científicamente el efecto de los cambios en un producto?**
Es posible que hayas vivido esta situación: el equipo dedica un mes a desarrollar una nueva función que, tras su lanzamiento, hace que las métricas se disparen. Todos celebran, pero tres semanas después los datos caen misteriosamente a sus niveles originales. ¿Fue porque la nueva función realmente funcionó, o porque coincidió con una temporada de alto tráfico como las fiestas? Los tests A/B resuelven precisamente cómo eliminar el ruido de las interferencias externas y dejar que los datos revelen la verdad.
:::

---

## 0. Panorama general: Un arma científica contra las decisiones "a ciegas"

Antes de profundizar en los aspectos técnicos, pensemos en cómo los seres humanos toman decisiones.

Te enfrentas a dos diseños de color para un botón: uno es un azul sobrio, el otro es un rojo llamativo. Normalmente, quien decide se basa en su propia experiencia, intuición o incluso la preferencia del líder con mayor salario (en la industria se le llama **HiPPO** — Highest Paid Person's Opinion, la opinión de la persona mejor pagada).

Pero la retroalimentación real de los usuarios suele superar con creces nuestra imaginación. Quizás el rojo sea demasiado agresivo y reduzca la tasa de conversión, o tal vez el azul no sea lo suficientemente llamativo... ¿Cómo podemos estar seguros de que un cambio concreto es realmente mejor?

La respuesta proviene de un método científico clásico, el mismo que utiliza la medicina moderna para validar nuevos fármacos: **el experimento controlado**.

::: tip 💡 La esencia del test A/B
**Test A/B = Comparación + Observación**
Es como el "doble ciego" en la investigación médica:
- **Grupo de control (Grupo A)**: toma una pastilla de almidón que parece medicamento (ve la versión antigua de la página).
- **Grupo experimental (Grupo B)**: toma el nuevo fármaco en desarrollo (ve la versión nueva de la página).
Solo cuando la tasa de curación (tasa de conversión) del grupo experimental es extremadamente estable y significativamente superior a la del grupo de control, podemos declarar que el nuevo fármaco (el nuevo cambio) es realmente efectivo.
:::

---

## 1. Asignación de tráfico: Dividir universos paralelos

La primera regla de oro de los tests A/B es: **simultáneo, aleatorio y aislado**.

No puedes decir: "la primera quincena todos los usuarios ven el botón azul, la segunda quincena todos ven el botón rojo". Porque el lapso de tiempo introduce innumerables variables: es imposible saber si el aumento de la tasa de conversión en la segunda quincena se debió al botón rojo o a que coincidió con la temporada de compras de fin de año.

Lo que hacemos es crear "universos paralelos" en el mismo instante. Cada usuario que entra al sitio web recibe, a nivel del sistema, el lanzamiento de una moneda digital que determina si se le asigna al universo A o al universo B.

Puedes observar intuitivamente cómo el sistema distribuye el tráfico en la siguiente demostración:

<ABTestingDemo tab="traffic" />

### 1.1 Motivación de importante la asignación aleatoria

Solo una "aleatoriedad" al cien por cien puede eliminar al máximo las diferencias causadas por cualquier otra característica. Si se realiza una división aleatoria perfecta con un tamaño de muestra suficientemente grande, la proporción de usuarios jóvenes, el nivel de ingresos y la distribución geográfica del grupo A y del grupo B serán sorprendentemente similares.

En ese momento, si el rendimiento de los datos de ambos grupos difiere, se habrán descartado todas las demás interferencias y excusas. La única diferencia posible es que cambiaste el botón a rojo.

---

## 2. Muestra y pruebas: La lógica matemática que vence a las ilusiones

Bien, ya tenemos los grupos. ¿Basta con probar con 10 usuarios y ver los resultados? Aquí entra en juego la ley matemática más implacable de los tests A/B: **la Ley de los Grandes Números y el tamaño de muestra (Sample Size)**.

Imagina que lanzas una moneda 10 veces y obtienes 7 caras y 3 cruces. ¿Eso demuestra que la moneda está trucada? Obviamente no, porque la base es demasiado pequeña; 7:3 es pura fluctuación, suerte. Pero si la lanzas 100.000 veces y obtienes 70.000 caras, entonces puedes afirmar rotundamente: la moneda está sesgada.

De igual manera, si solo se prueba con 100 personas, un usuario más o menos que haga clic provoca una fluctuación del 1%. Por eso necesitamos calcular mediante fórmula cuánto tráfico debemos acumular antes de que el experimento comience.

<ABTestingDemo tab="calculator" />

### 2.1 Los dos guardianes de la estadística

Una vez que se alcanzan estas condiciones de tráfico, la estadística sitúa a dos guardianes en nuestro camino hacia la verdad:

- **Potencia estadística (Power, generalmente se requiere un 80%)**: representa la probabilidad de que, si tu nuevo cambio es realmente efectivo, puedas detectar ese efecto en lugar de descartarlo como ruido. (Evita los falsos negativos: decir "no funciona" cuando sí funciona.)
- **Nivel de significancia (P-Value, generalmente se requiere menor a 0,05)**: es lo que comúnmente se conoce como "P<0,05". Significa: si la diferencia entre ambos grupos fuera pura casualidad, ¿esa probabilidad sería inferior al 5%? Si el papel de la suerte ni siquiera alcanza el 5%, reconocemos que es **estadísticamente significativo** (Significant) y que el cambio realmente ha tenido un impacto notable. (Evita los falsos positivos: decir "funciona" cuando solo fue suerte.)

## 3. Enfrentamiento de resultados: El veredicto de la verdad

Tras recopilar datos suficientes, necesitamos evaluarlos con precisión a través del siguiente modelo de embudo profesional. Comparar los resultados no es una simple suma o resta, sino que implica intervalos de confianza y cálculos de distribución normal:

<ABTestingDemo tab="results" />

Cuando la página muestra un claro **"Significativo ✅"**, significa que podemos anunciar con orgullo a toda la empresa: dejemos de lado nuestros debates subjetivos e infantiles, ¡despleguemos inmediatamente la versión B para todos los usuarios! Todo está respaldado por principios matemáticos sólidos.

---

## 4. Trampas oscuras: Errores comunes en el análisis

Aunque el test A/B en sí es una manifestación de racionalidad y ciencia, quienes lo ejecutan están profundamente influenciados por las debilidades humanas. Las personas suelen ver solo lo que quieren ver, lo que puede distorsionar todo el test y provocar consecuencias indeseables:

<ABTestingDemo tab="pitfalls" />

### 4.1 Cuidado con el "efecto novedad"

Cuando algo aparece por primera vez, los usuarios pueden hacer clic en ese nuevo botón que parece desordenado por pura curiosidad y novedad, lo que hará que tu tasa de conversión se dispare como un cohete en los primeros tres días.

Muchos gerentes de producto detendrán el experimento al tercer día con datos perfectos y publicarán un informe de victoria. Pero si esperas pacientemente dos semanas, verás que, una vez que pasa la novedad, los datos caen por debajo de la línea base de la versión antigua. Por eso la duración del experimento es crucial: nunca te dejes cegar por un pico temporal artificial.

---

## 5. Conclusión: Cultivar el coraje de someterse a los datos

En resumen, pasar de las "conjeturas intuitivas" a los "tests A/B" es una enorme transformación mental para cualquier equipo.

1. **Plantear una hipótesis cautelosa**: basada en una observación rigurosa de los usuarios, establecer una hipótesis cuantificable.
2. **Dividir el mundo en paralelo**: dividir el tráfico de forma puramente aleatoria para eliminar el ruido externo.
3. **Aceptar el bautismo de la muestra**: esperar a que la Ley de los Grandes Números surta efecto, con suficiente tiempo y muestras para reducir las fluctuaciones.
4. **Realizar el veredicto matemático**: dejar que el valor P juzgue la calidad de la solución, sometiéndose estrictamente a los hechos de la significancia.

Como creadores de software, la mayor sabiduría es **aprender el coraje de someterse a los hechos**. Ya no necesitamos pasar horas en la sala de reuniones discutiendo acaloradamente sobre el azul y el rojo; solo necesitamos esperar dos semanas, y la tasa de clics nos demostrará cuál es la verdadera opción preferida por los usuarios.
