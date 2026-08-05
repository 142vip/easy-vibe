# Principios de representación de datos: codificación, almacenamiento y transmisión

::: tip Prologo
Cuando envias una foto a un amigo, un mensaje por WeChat, o descargas un juego de varios GB, como llega esa informacion a traves de medio mundo intacta a tu pantalla? Este capitulo se centra en una pregunta que suele confundir a los principiantes: **por que el archivo que recibi se convirtio en caracteres ilegibles?** A partir de esta pregunta, descubriremos los tres pilares fundamentales de la computacion: **codificacion, almacenamiento y transmision**.
:::

**Que aprenderas en este articulo?**

Despues de completar este capitulo, obtendras:

- **Capacidad de diagnostico de caracteres ilegibles**: al enfrentar "archivo con caracteres raros", poder analizar la causa desde la perspectiva de la codificacion
- **Conciencia multiplataforma**: saber por que hay que prestar atencion al formato de codificacion y al endianness al intercambiar datos
- **Vision global de la codificacion**: entender como la computadora representa todo con 0 y 1 -- desde texto hasta imagenes y objetos complejos
- **Base para aprendizaje futuro**: sentar las bases para protocolos de red, formatos de archivo y serializacion

| Capitulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capitulo 1** | Codificacion de caracteres | ASCII, UTF-8, GBK |
| **Capitulo 2** | Almacenamiento de datos | Binario, endianness |
| **Capitulo 3** | Transmision de datos | Serializacion, compresion |

---

## 0. Problemática de la descodificación incorrecta y codificación de datos

Imagina que recibes un archivo importante de un colega, lo abres con doble clic y esta lleno de caracteres extranos como "浣犲ソ" o "ä½ å¥½".

La verdad es que la gran mayoria de los supuestos "archivos danados" tienen una unica explicacion -- **tu computadora "no encontro el diccionario correcto"**.

**Comprendimiento central: Diccionarios desalineados**

Los bytes (secuencias de 0 y 1) no tienen significado absoluto por si mismos. Son las **reglas de codificacion** creadas por humanos las que les dan significado.

Si el remitente uso el diccionario UTF-8 para traducir caracteres chinos a numeros y tu intentas leer esos numeros con el diccionario GBK, el resultado sera caracteres ilegibles.

<GarbledTextDemo />

---

## 1. Visión general de la codificación de datos

**La codificacion de datos (Encoding)** es crear un "diccionario bidireccional" que mapee informacion del mundo real (texto, color, sonido) a 0 y 1 que la computadora puede entender.

### 1.1 De texto a numeros: De ASCII a Unicode

**Primera etapa: El pequeno mundo de ASCII**

Cuando se invento la computadora, los estadounidenses pensaron que solo existian 26 letras, numeros y simbolos de puntuacion, asi que crearon un diccionario muy delgado llamado **ASCII**. Solo definio 128 simbolos.

**Segunda etapa: La era de los reinos divididos**

Cuando la computadora llego al mundo, todos descubrieron que los caracteres chinos son decenas de miles, y un solo byte no era suficiente. China creo GBK, Japon creo Shift_JIS... El mundo cayo en el caos.

**Tercera etapa: Unicode unifica todo**

Los expertos en computacion se sentaron juntos y crearon **Unicode**, que asigna un numero unico a cada caracter, emoji incluido. **UTF-8** es la regla de almacenamiento mas popular de Unicode: ingles usa 1 byte, chino usa 3 bytes.

<CharacterEncodingExplorer />

### 1.2 Principios de codificación multimedia (imagen y audio)

* **Codificacion de imagenes**: Una foto se compone de millones de pixeles. Asignamos un numero a cada color (como `#FF0000` para rojo).
<ImageEncodingDemo />

* **Codificacion de audio**: El sonido es una onda. Si medimos la altura de esta onda 44,100 veces por segundo (muestreo) y registramos los valores, el sonido continuo se convierte en una serie de numeros discretos.
<AudioEncodingDemo />

---

## 2. Puente de almacenamiento: Antes de enviar, hay que guardarlo en algun lugar

Despues de codificar los datos, antes de enviarlos, debemos almacenarlos. Hay una ley de hierro del hardware: **cuanto mas rapido es el almacenamiento, mas caro es y menor es la capacidad.**

<StoragePyramidDemo />

El sistema operativo actua como un administrador de almacen extremadamente inteligente:
1. Guarda peliculas y juegos en almacenamiento lento pero grande (SSD o disco duro)
2. Cuando juegas, mueve los datos necesarios a la memoria rapida (RAM)
3. Cuando cierras el juego, limpia la memoria para otros usos

---

## 3. Visión general de la transmisión de datos

### 3.1 Transmision en hardware y LAN

Dentro del chasis o entre computadoras cercanas, enfrentamos un **desafio puramente fisico**. Hoy en dia, USB Type-C, PCIe y otros interfaces usan **transmision serial** (un solo canal principal).

<DataTransmissionDemo />

### 3.2 Transmision WAN e Internet

Cuando tus datos deben llegar a un servidor en otro pais, atraviesan cables submarinos, estaciones base y enrutadores. El desafio aqui es la **tolerancia a fallos**.

1. **Segmentacion en paquetes**: La red corta el video en miles de "paquetes de datos" (~1500 bytes cada uno)
2. **Suma de verificacion (Checksum)**: Se calcula un codigo de verificacion antes de enviar
3. **Retransmision TCP**: Si un paquete se pierde o se dana, el receptor solicita su reenvio

Gracias a este mecanismo **TCP (Protocolo de Control de Transmision)**, incluso en WiFi inestable, los archivos descargados siempre estan 100% intactos.

---

## 4. Caso práctico: flujo completo de codificación, almacenamiento y transmisión

<PhotoUploadJourneyDemo />

---

## 5. Tabla de terminologia

| Termino | Explicacion |
| :--- | :--- |
| **Bit (b)** | La unidad mas pequena, solo puede ser 0 o 1 |
| **Byte (B)** | 8 Bits juntos. Unidad basica de tamano de archivo |
| **Character Set** | El "indice del diccionario", define que caracteres existen |
| **Encoding** | La "regla de almacenamiento", determina que bytes corresponden a cada caracter |
| **RAM** | Memoria de trabajo rapida pero volatil |
| **SSD** | Disco de estado solido, almacenamiento permanente rapido |
| **Serial / Parallel** | Serial = un canal en cola; Paralelo = multiples canales juntos |
| **Checksum** | Codigo de verificacion adjunto a los datos transmitidos |
| **TCP** | Protocolo de Control de Transmision, garantiza entrega 100% intacta |

---

## Resumen

- **Por que el mismo archivo se ve ilegible cuando lo recibes?** Los datos no estan danados, solo tu software uso el diccionario equivocado (problema de codificacion).
- **Por que los cables Type-C son mas delgados pero mas rapidos?** Porque antes eran multiples carruajes en paralelo (paralelo), ahora es un tren de alta velocidad en via dedicada (serial).
- **Por que los juegos grandes tardan en cargar?** Porque necesitan mover decenas de GB del disco lento a la memoria rapida.

La esencia de la computacion es simple: **convertir** (codificar), **almacenar** (guardar), y **enviar** (transmitir) toda la informacion como impulsos electricos.
