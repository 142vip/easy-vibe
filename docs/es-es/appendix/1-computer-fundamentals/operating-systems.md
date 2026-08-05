# Principios de sistemas operativos: procesos, memoria y sistemas de archivos

::: tip Prologo
**Con una CPU perfecta y memoria infinita, se puede usar la computadora directamente?**
En el capitulo anterior, vimos como los transistores se combinan para formar una poderosa CPU. Pero incluso si tienes el mejor hardware, si lo dejas trabajar directamente, hasta mostrar una letra en pantalla requeriria cientos de lineas de oscuras instrucciones maquina. No solo es molesto, sino extremadamente peligroso -- con el mas minimo error, tu codigo podria sobreescribir los datos de otros.

Para resolver estas pesadillas, nacio el **Sistema Operativo (Operating System, OS)**. Es la capa de "software" mas grande entre ti y el hardware frio. En este capitulo dejaremos de lado el codigo oscuro y usaremos analogias sencillas para ver como este "super administrador" domestica el hardware caotico.
:::

**Que aprenderas en este articulo?**

Despues de completar este capitulo, obtendras:

- **Capacidad de diagnostico**: al enfrentar "programa colgado" o "memoria insuficiente", poder analizar desde el nivel del sistema operativo
- **Profundidad en terminologia**: entender que problemas resuelven "multiproceso", "memoria virtual", "permisos de archivos"
- **Pensamiento sistemico**: entender que los programas no se ejecutan de forma aislada, sino que interactuan con el sistema operativo, otros procesos y recursos de hardware
- **Base para aprendizaje futuro**: sentar las bases para programacion concurrente, ajuste de sistemas, tecnologia de contenedores

| Capitulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capitulo 1** | Gestion de procesos | Multiplexacion temporal de CPU, round-robin |
| **Capitulo 2** | Gestion de memoria | Memoria virtual, mecanismo de paginacion |
| **Capitulo 3** | Sistema de archivos | Organizacion de archivos, estructura de directorios |

---

## 0. Principios y necesidad de los sistemas operativos

Imagina que abriste una "fabrica de computo" extremadamente prometedora (tu computadora), con un trabajador de elite incansable (CPU), un almacen gigante (memoria) e innumerables contenedores (disco duro).

Si **no contratas** un director (sistema operativo):
1. **Crisis de monopolio de CPU**: La CPU solo puede hacer una cosa a la vez. Si alguien la usa para escuchar musica, todos los demas que quieren navegar? Lo sienten, deben esperar.
2. ** Accidente de pisoteo de memoria**: WeChat y el juego usan el almacen (memoria). Sin guardias de seguridad, el juego podria poner datos de equipamiento en la caja de WeChat, causando un crash inmediato.
3. **Laberinto del disco duro**: El hardware del disco es solo discos grabados con 0 y 1. Para encontrar la foto de ayer, debes recordar exactamente "plato 1, pista 56, sector 8" -- nadie puede recordar estas coordenadas inhumanas.

<OSArchitectureDemo />

Para resolver estas tres pesadillas, el sistema operativo despliega sus tres herramientas principales: **gestion de procesos**, **gestion de memoria** y **sistema de archivos**.

---

## 1. Gestion de procesos: Multiplexacion temporal de la CPU

Normalmente usas la computadora con WeChat abierto, escuchando musica y escribiendo. Pero si tu computadora solo tiene un nucleo de CPU, como hace estas tres cosas al mismo tiempo?

La respuesta: **no las hace al mismo tiempo. Es el sistema operativo haciendo una "gestion del tiempo" frenetica.**

<ProcessDemo />

### 1.1 Visión general de los procesos
Cada programa en ejecucion se llama un **proceso**. Puedes entenderlo como un "equipo de proyecto" con su propio codigo (lista de tareas), sus propios datos en memoria (fondos del proyecto), esperando su turno para ver la CPU.

### 1.2 Round-robin de tiempos
Para evitar que un software malicioso monopolice la CPU, el sistema operativo divide el tiempo de la CPU en fragmentos minusculos (~10 ms), asignandolos por turnos a cada proceso. Como el cambio es tan rapido, sientes que todo se ejecuta "simultaneamente".

---

## 2. Gestion de memoria: Espacio de direcciones virtuales

Resuelto el problema de turnarse la CPU, lo siguiente es el espacio de memoria. Sin gestion, todos los programas escribirian directamente en la memoria fisica, causando **pisoteo mutuo**.

<MemoryDemo />

### 2.1 Memoria virtual (Virtual Memory)
El sistema operativo le miente a cada proceso: "Hey, tienes toda la memoria de la computadora para ti solo, usa lo que quieras!"

Para el proceso, su memoria siempre es **continua** y **limpia**. Escribe datos tranquilamente.

### 2.2 Tabla de paginas (Page Table)
En realidad? El sistema operativo偷偷 mete los datos en **la memoria fisica real** en各种 huecos sueltos. Esto tiene dos beneficios geniales:
1. **Seguridad absoluta**: WeChat solo puede ver su propio espacio, no puede manipular datos de otros
2. **Aprovechamiento de fragmentos**: sin importar que tan fragmentada este la memoria fisica, el espacio virtual del proceso sigue ordenado

---

## 3. Sistema de archivos: Organizacion del almacenamiento persistente

Si compras un disco duro nuevo, es un terreno baldio de celdas de almacenamiento. Si quieres guardar una foto, el disco solo te pregunta: "Dime en que byte quieres guardarla?"

<FilesystemDemo />

### 3.1 Principios de los sistemas de archivos
1. **Cortar el disco**: Divide el disco en innumerables **bloques** de tamano fijo (generalmente 4KB)
2. **Crear un libro de cuentas**: Registra que bloques estan llenos y cuales vacios
3. **Traducir rutas**: Convierte `D:/Fotos/Mascota.jpg` en "bloques 3, 7, 11"

Por eso renombrar un archivo es instantaneo (solo cambias el nombre en el libro de cuentas), mientras que copiar toma mucho tiempo (hay que leer y escribir bloques reales del disco).

---

## 4. Coordinacion de los tres: Proceso completo de inicio de un programa

Ya conocemos los tres modulos principales del sistema operativo. Veamos como coordinan cuando **haces doble clic para abrir un programa**:

<ProgramLaunchDemo />

Ya sea que hagas clic en un icono del escritorio o escribas `print("Hello World")` en codigo, todo depende de este complejo trabajo oculto. Podemos navegar tan facilmente en el mundo digital gracias al sistema operativo que trabaja duro por nosotros en la base.

---

## Lectura adicional

Si encuentras fascinantes las diversas "tecnicas de gestion y engano" del sistema operativo, puedes explorar estos temas avanzados:
- **Procesos e hilos**: Si el proceso es un equipo de proyecto, el "hilo" es el empleado que trabaja en el equipo
- **Concurrencia y bloqueos**: Cuando dos procesos compiten por el mismo recurso, como prevenir interbloqueo
- **Llamadas al sistema**: La "ventana de servicios" que el sistema operativo proporciona a las aplicaciones
