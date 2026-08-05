# Principios de bases de datos: índices/transacciones/optimización de consultas
::: tip 🎯 Pregunta central
**¿Por qué tu consulta en Excel tarda 10 segundos mientras que una búsqueda en Taobao solo necesita 0,01 segundos?** Cuando los datos pasan de "unos pocos miles" a "mil millones", y de "uso individual" a "millones de accesos simultáneos", Excel ya no es suficiente. Las bases de datos nacieron precisamente para resolver este problema: son un "súper Excel" especializado en manejar datos masivos y accesos de alta concurrencia. Este capítulo te guiará desde cero para entender los principios fundamentales de las bases de datos.
:::

---

## 1. Motivación de "base de datos"

### 1.1 De una pequeña librería a Taobao: La evolución de la escala de datos

Imagina que abres una pequeña librería y vendes unos pocos libros al día. Anotas en un cuaderno:

```
2024-01-15: Zhang San compró "Cien años de soledad", 59 yuanes
2024-01-16: Li Si compró "Vivir", 39 yuanes
```

En ese momento, el cuaderno es más que suficiente. Pero cuando tu librería se convierte en "Amazon", con millones de pedidos diarios, surgen los problemas:

- **Gran volumen de datos**: no son decenas de filas, sino cientos de millones
- **Acceso concurrente**: no es una persona consultando, sino millones accediendo simultáneamente
- **Relaciones entre datos**: los pedidos se relacionan con usuarios, productos, inventario, logística... relaciones complejas que necesitan gestión eficiente
- **Seguridad de datos**: no puedes perder todos los pedidos por un corte de electricidad

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📓 Excel / Cuaderno**
- Adecuado para individuos o equipos pequeños
- Volumen de datos: miles a decenas de miles de filas
- Uso individual, acceso secuencial
- Búsqueda manual, velocidad lenta

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🗄️ Base de datos**
- Adecuada para aplicaciones empresariales
- Volumen de datos: miles de millones y más
- Millones de usuarios accediendo simultáneamente
- Velocidad de consulta en milisegundos

</div>
</div>

**Este es el problema que las "bases de datos" deben resolver: ¿cómo almacenar, consultar y gestionar datos masivos de forma eficiente y segura?**

### 1.2 Una historia real:Motivación: usar Excel para datos de usuarios

Podrías decir: "Mi proyecto tiene apenas unas decenas de miles de usuarios, ¿no basta con Excel?" Déjame contarte una historia real.

::: warning La experiencia de Xiao Lin emprendiendo
Xiao Lin emprendió con una aplicación social. Al principio, con pocos usuarios, usaba Excel para almacenar la información de los usuarios (nombre, teléfono, fecha de registro, etc.). Cada día exportaba a Excel para contabilizar el crecimiento de usuarios, y todo funcionaba bien.

Cuando los usuarios superaron los 100.000, empezaron los problemas:
- Abrir el Excel tardaba 5 minutos
- Filtrar "usuarios de Beijing" tardaba una eternidad
- Una vez el archivo Excel se corrompió y se perdieron miles de datos de usuarios

Lo más crítico fue que quería implementar la función "ver todos los pedidos de un usuario" — pero la información de usuarios y pedidos estaba en hojas Excel distintas, y solo podía copiar y pegar manualmente, tardando media hora cada vez.

Luego consultó a un compañero mayor, quien tras echar un vistazo sonrió: "Lo que necesitas no es Excel, sino una base de datos."

Tras cambiar a una base de datos, todo cambió:
- Consultar "usuarios de Beijing" tardaba solo 0,01 segundos
- La "relación" asociaba automáticamente usuarios y pedidos, con una sola sentencia SQL
- Respaldos automáticos, sin temer nunca más la corrupción de archivos

Xiao Lin comprendió desde entonces una verdad: **cuando los datos son pocos, cualquier cosa sirve; pero cuando los datos crecen, Excel es un desastre.**
:::

::: info 💡 Conclusión clave
Una base de datos no es "un Excel más complejo", sino un diseño conceptual completamente diferente:
- **Excel**: diseñado para pocos datos y uso individual
- **Base de datos**: diseñada para grandes volúmenes, alta concurrencia y relaciones complejas

Elegir la herramienta adecuada puede mejorar el rendimiento del sistema por un factor de miles.
:::

---

## 2. Conceptos fundamentales: Tablas, filas, columnas, clave primaria

::: tip 🤔 ¿Qué relación tienen estos conceptos con las bases de datos?
Tablas, filas, columnas y claves primarias son los "bloques de construcción" de las bases de datos.

Imagina que quieres construir una casa:
- **Tabla** = una habitación (almacena un tipo de datos)
- **Fila** = una caja en la habitación (un registro completo)
- **Columna** = una etiqueta en la caja (nombre, edad, etc.)
- **Clave primaria** = el número único de la caja (nunca se repite)

Entendiendo estos conceptos básicos, podrás saber cómo se organizan los datos.
:::

Antes de profundizar, necesitamos entender estos conceptos fundamentales. Usaremos la analogía de una biblioteca para ayudarte.

### 2.1 Entender la estructura de una base de datos con la analogía de una biblioteca

Imagina que entras en una biblioteca: su organización es sorprendentemente similar a una base de datos:

| Concepto | 📚 Analogía biblioteca | Función real | Ejemplo concreto |
|----------|------------------------|--------------|------------------|
| **Base de datos (Database)** | Toda la biblioteca | Contenedor que almacena todos los datos | La base de datos de un sitio de e-commerce |
| **Tabla (Table)** | Una estantería | Colección que almacena datos del mismo tipo | Tabla de usuarios, tabla de productos, tabla de pedidos |
| **Columna (Column)** | Etiqueta en el lomo del libro | Atributos de los datos (campos) | Nombre, edad, teléfono |
| **Fila (Row)** | Cada libro en la estantería | Un registro de datos concreto | "Zhang San, 25 años, Beijing" |
| **Clave primaria (Primary Key)** | ISBN de cada libro | ID que identifica unívocamente cada fila | user_id = 1001 |

**Veamos un ejemplo real**: Tabla de usuarios (users)

| user_id (clave primaria) | name | age | city | email |
|:------------------------:|------|-----|------|-------|
| 1001 | 张三 | 25 | 北京 | zhangsan@example.com |
| 1002 | 李四 | 30 | 上海 | lisi@example.com |
| 1003 | 王五 | 28 | 北京 | wangwu@example.com |

- **Tabla**: `users` (almacena todos los datos de usuarios)
- **Columnas**: `user_id`, `name`, `age`, `city`, `email` (atributos de cada usuario)
- **Filas**: cada fila es un usuario (por ejemplo, "张三, 25 años, 北京")
- **Clave primaria**: `user_id` (1001, 1002, 1003, nunca se repiten)

### 2.2 Clave primaria (Primary Key): El "identificador único" de los datos

::: tip 📖 ¿Qué es una clave primaria?
La **clave primaria** es el identificador único de cada fila en una tabla, como el número de DNI.

**Características clave**:
- **Unicidad**: nunca se repite (no hay dos personas con el mismo DNI)
- **No nula**: debe tener valor (no puede existir una persona "sin DNI")
- **Inmutabilidad**: una vez establecida, no se modifica (tu DNI no cambia)

**Prácticas comunes**:
- Usar enteros autoincrementales: 1, 2, 3, 4...
- Usar UUID (identificador único universal): `550e8400-e29b-41d4-a716-446655440000`
:::

¿Por qué necesitamos una clave primaria? Imagina un mundo sin ella:

**Escenario**: quieres cambiar la edad de "张三", pero hay 3 "张三" en la tabla. ¿Cuál modificas?

```sql
-- Sin clave primaria, esto modificaría todos los que se llaman "张三"!
UPDATE users SET age = 26 WHERE name = '张三';

-- Con clave primaria, modificación precisa
UPDATE users SET age = 26 WHERE user_id = 1001;
```

**La regla de oro de la clave primaria**: cada tabla debería tener una, y nunca debe modificarse.

### 2.3 Clave foránea (Foreign Key): El puente entre tablas

Esta es la clave de por qué las bases de datos son más potentes que Excel: **las tablas pueden establecer relaciones entre sí**.

::: tip 📖 ¿Qué es una clave foránea?
Una **clave foránea** es una columna que apunta a la clave primaria de otra tabla, y sirve para establecer relaciones entre tablas.

**Entendimiento simple**:
- Clave primaria = mi número de DNI
- Clave foránea = el DNI de otra persona que yo referencio

**Ejemplo**: `user_id` en la tabla de pedidos es una clave foránea que apunta a la clave primaria de la tabla de usuarios.
:::

Veamos un ejemplo real:

**Tabla de usuarios (users)**:

| user_id (clave primaria) | name | phone |
|:------------------------:|------|-------|
| 1001 | 张三 | 138xxxx |
| 1002 | 李四 | 139xxxx |

**Tabla de pedidos (orders)**:

| order_id (clave primaria) | product_name | price | user_id (clave foránea) |
|:--------------------------:|-------------|-------|:------------------------:|
| 5001 | iPhone 15 | 5999 | 1001 |
| 5002 | MacBook | 14999 | 1001 |
| 5003 | AirPods | 1999 | 1002 |

**Comprensión clave**:
- `user_id = 1001` en la tabla de pedidos apunta a `user_id = 1001` en la tabla de usuarios (张三)
- Cuando necesitas saber "quién hizo el pedido 5001", la base de datos busca automáticamente en la tabla de usuarios `user_id = 1001`

**Ventajas**:
- **Datos no duplicados**: aunque 张三 compre 100 productos, su información se almacena una sola vez en la tabla de usuarios
- **Fácil mantenimiento**: si 张三 cambia de teléfono, solo modificas la tabla de usuarios, y todos los pedidos se asocian automáticamente al nuevo número
- **Consultas flexibles**: puedes responder fácilmente a preguntas como "cuál es el gasto total de cada usuario"

<DatabaseRelationDemo />

---

## 3. Enfoque de comunicación con una base de datos Introducción a SQL y práctica

No puedes usar directamente el ratón para "hacer clic" en una base de datos (aunque existen herramientas gráficas, en esencia también generan comandos). Necesitas un lenguaje especial para dar instrucciones a la base de datos.

Ese lenguaje es **SQL (Structured Query Language, Lenguaje de Consulta Estructurada)**.

La buena noticia: SQL es muy cercano al inglés natural y se lee como si estuvieras hablando.

### 3.1 Operaciones fundamentales de SQL: CRUD

La mayor parte del tiempo solo necesitas dominar cuatro operaciones, conocidas como **CRUD**:

| Operación | Inglés | Palabra clave SQL | Entendimiento coloquial |
|-----------|--------|-------------------|-------------------------|
| **C**rear (Create) | Crear | `INSERT` | Añadir un dato |
| **R**ecuperar (Read) | Leer | `SELECT` | Consultar datos |
| **U**pdate (Actualizar) | Modificar | `UPDATE` | Modificar datos |
| **D**elete (Eliminar) | Borrar | `DELETE` | Eliminar datos |

::: tip 📊 ¿Qué puedes ver en esta tabla?
Estas cuatro operaciones cubren todos los escenarios de procesamiento de datos:
- **Create**: al registrar un usuario, insertar un nuevo registro
- **Read**: al iniciar sesión, consultar usuario y contraseña
- **Update**: al modificar el perfil, actualizar los datos de la tabla
- **Delete**: al eliminar una cuenta, borrar los datos del usuario

Recuerda estas cuatro y dominarás el 80% de las operaciones SQL cotidianas.
:::

### 3.2 Consultar datos (SELECT): La operación más utilizada

La consulta es la función más importante de una base de datos y la clave para la optimización del rendimiento.

**Ejemplo 1**: Buscar todos los usuarios de Beijing

```sql
SELECT name, age FROM users WHERE city = '北京';
```

**Comprensión palabra por palabra**:
- `SELECT name, age`: seleccionar las columnas name y age
- `FROM users`: de la tabla users
- `WHERE city = '北京'`: donde city sea igual a "Beijing"

**Resultado**:

| name | age |
|------|-----|
| 张三 | 25 |
| 王五 | 28 |

**Ejemplo 2**: Buscar productos con precio entre 5000 y 15000

```sql
SELECT name, price FROM products
WHERE price BETWEEN 5000 AND 15000;
```

**Ejemplo 3**: Búsqueda difusa (encontrar usuarios cuyo nombre contenga "张")

```sql
SELECT name FROM users WHERE name LIKE '%张%';
```

::: warning ⚠️ Trampa de rendimiento: uso de LIKE
`LIKE '%张%'` provoca un **escaneo completo de tabla**, que es muy lento con grandes volúmenes de datos.

**Recomendación de optimización**:
- ❌ No uses `LIKE '%张%'` (con % al principio y al final)
- ✅ Puedes usar `LIKE '张%'` (solo con % al final)

Porque `LIKE '张%'` puede usar un índice, mientras que `LIKE '%张%'` no puede.
:::

### 3.3 Insertar datos (INSERT): Añadir registros

**Ejemplo**: Añadir un nuevo usuario

```sql
INSERT INTO users (user_id, name, age, city, email)
VALUES (1004, '赵六', 35, '广州', 'zhaoliu@example.com');
```

**Comprensión palabra por palabra**:
- `INSERT INTO users`: insertar en la tabla users
- `(user_id, name, age, city, email)`: especificar las columnas
- `VALUES (1004, '赵六', ...)`: los valores correspondientes

**Inserción por lotes** (más eficiente):

```sql
INSERT INTO users (name, age, city) VALUES
('小明', 25, '北京'),
('小红', 28, '上海'),
('小刚', 30, '广州');
```

### 3.4 Actualizar datos (UPDATE): Modificar registros

**Ejemplo**: Incrementar en 1 la edad de todos los usuarios de Beijing

```sql
UPDATE users SET age = age + 1 WHERE city = '北京';
```

::: danger ❌ Muy peligroso: ¡no olvides WHERE!
Si olvidas la cláusula `WHERE`, ¡modificarás **todas las filas**!

```sql
-- ¡Peligro! Cambiará la edad de TODOS los usuarios a 26
UPDATE users SET age = 26;

-- Correcto: solo modifica el usuario con user_id = 1001
UPDATE users SET age = 26 WHERE user_id = 1001;
```

**Lección real**: en 2012, una empresa conocida sufrió un incidente porque un ingeniero olvidó escribir WHERE, lo que provocó que se actualizaran erróneamente los datos de millones de usuarios en producción, el sistema estuvo caído 4 horas y las pérdidas fueron enormes.
:::

### 3.5 Eliminar datos (DELETE): Borrar registros

**Ejemplo**: Eliminar el usuario con user_id = 1004

```sql
DELETE FROM users WHERE user_id = 1004;
```

::: danger ❌ Doble peligro: DELETE necesita WHERE aún más
```sql
-- ¡Peligro! Eliminará todos los datos de toda la tabla!
DELETE FROM users;

-- Correcto: solo elimina la fila especificada
DELETE FROM users WHERE user_id = 1004;
```

**Mejores prácticas**:
1. Antes de eliminar, confirma los datos con SELECT
2. En sistemas críticos, usa "eliminación suave" (añadir campo `is_deleted`)
3. Haz copia de seguridad antes de operar en producción
:::

### 3.6 Consultas multitabla (JOIN): El momento mágico de las bases de datos

¿Recuerdas las "claves foráneas"? Lo más potente de SQL es poder consultar múltiples tablas relacionadas en una sola operación.

**Escenario**: Consultar "todos los productos comprados por 张三"

Supongamos que tenemos tres tablas:

**Tabla de usuarios (users)**:
| user_id | name |
|---------|------|
| 1001 | 张三 |

**Tabla de productos (products)**:
| product_id | name | price |
|------------|------|-------|
| 201 | iPhone 15 | 5999 |
| 202 | MacBook | 14999 |

**Tabla de pedidos (orders)**:
| order_id | user_id | product_id | quantity |
|----------|---------|------------|----------|
| 5001 | 1001 | 201 | 1 |
| 5002 | 1001 | 202 | 2 |

**Consulta SQL**:

```sql
SELECT u.name, p.name AS product_name, p.price, o.quantity
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN products p ON o.product_id = p.product_id
WHERE u.name = '张三';
```

**Resultado**:

| name | product_name | price | quantity |
|------|--------------|-------|----------|
| 张三 | iPhone 15 | 5999 | 1 |
| 张三 | MacBook | 14999 | 2 |

**Entendiendo el proceso de JOIN**:
1. `FROM orders o`: empezar desde la tabla de pedidos
2. `JOIN users u ON o.user_id = u.user_id`: asociar la tabla de usuarios a través de user_id
3. `JOIN products p ON o.product_id = p.product_id`: asociar la tabla de productos a través de product_id
4. `WHERE u.name = '张三'`: filtrar los pedidos de 张三

<SqlPlaygroundDemo />

---

## 4. Motivación de bases de datos son tan rápidas Los secretos de los índices

Esta es la parte más fascinante de las bases de datos y una de las preguntas favoritas en las entrevistas.

Si buscas en Excel "todas las personas de apellido 张", Excel necesita escanear desde la primera hasta la última fila. Esto es un **escaneo completo de tabla** — cuantos más datos, más lento.

Pero en una base de datos, incluso con 1000 millones de filas, la búsqueda tarda solo unos milisegundos.

**El secreto es: el índice (Index)**.

### 4.1 Entendimiento intuitivo: La inspiración del diccionario

Imagina que necesitas buscar una palabra en un libro de 1000 páginas sin índice. ¿Qué harías?

**Solo puedes pasar página por página** — esto es un escaneo completo, que promedia 500 páginas.

¿Pero si el libro tiene un **índice por pinyin**?

Buscas la palabra "数据库":
1. Vas al índice y buscas la sección que empieza por "数"
2. Dentro de esa sección, buscas "据"
3. El índice te dice: está en la página 256

¡Solo necesitas 3 búsquedas! Esto es una **búsqueda por índice**.

**El índice de una base de datos es como el índice de un libro**:
- Sin índice: escaneo fila a fila (1000 millones de filas = varios minutos)
- Con índice: salto directo (1000 millones de filas = 3-4 lecturas de disco = milisegundos)

### 4.2 Escaneo completo vs Búsqueda por índice: Comparación de velocidad

Supongamos una tabla de usuarios con 10 millones de registros.

**Escenario**: Buscar el usuario con `user_id = 5,555,555`

| Método | Proceso | Filas a verificar | Tiempo estimado |
|--------|---------|-------------------|-----------------|
| **Escaneo completo** | Empezar desde la fila 1, revisar una por una | Promedio 5 millones | 5-30 segundos |
| **Búsqueda por índice** | Consultar el árbol de índices y saltar al destino | 3-4 comparaciones | 0,003 segundos |

**¡Diferencia de velocidad: miles de veces!**

::: tip 💡 Conclusión clave
El índice no es una bala de plata; tiene un coste:
- **Ocupa espacio**: el índice requiere espacio de almacenamiento adicional
- **Ralentiza las escrituras**: cada INSERT/UPDATE/DELETE debe actualizar el índice

**¿Cuándo crear un índice?**
- Columnas usadas frecuentemente en consultas (condiciones WHERE, JOIN)
- Tablas grandes (no se necesita con pocos miles de filas)

**¿Cuándo NO crear un índice?**
- Columnas rara vez consultadas
- Columnas actualizadas con mucha frecuencia
- Tablas con pocos datos
:::

### 4.3 Estructura de datos subyacente: Árbol B+

Los índices reales no son una simple "lista alfabética", sino una estructura de datos cuidadosamente diseñada llamada **Árbol B+ (B+ Tree)**.

::: tip 📖 ¿Qué es un Árbol B+?
Un **Árbol B+** es una estructura de datos en forma de árbol "baja y ancha":

- **Baja**: de la raíz a las hojas suele tener solo 3-4 niveles
- **Ancha**: cada nodo puede almacenar cientos de claves

**¿Por qué "baja y ancha"?**

Porque los datos se almacenan en disco, y cada lectura de disco (I/O) es muy lenta (miles de veces más que la memoria). El objetivo del diseño del Árbol B+ es **minimizar el número de I/O de disco**.

- 3-4 niveles = máximo 3-4 lecturas de disco
- Cada nivel almacena muchos datos = garantiza que el árbol no sea alto
:::

**Ejemplo real**:

Supongamos que cada nodo de un Árbol B+ puede almacenar 1000 claves:

- **Nodo raíz**: 1000 claves → apunta a 1000 nodos hijos
- **Nodos intermedios**: cada uno almacena 1000 claves → apunta a 1000 nodos hoja
- **Nodos hoja**: cada uno almacena 1000 registros reales

**Total de datos** = 1000 × 1000 × 1000 = **1000 millones de registros**

**Altura del árbol** = **3 niveles**

Esto significa: buscar cualquier registro entre 1000 millones solo necesita **3 lecturas de disco**.

Este es el secreto de la velocidad de las bases de datos.

<BPlusTreeDemo />

---

## 5. Transacciones: Enfoque de garantizar que los datos no se pierdan ni se corrompan

Imagina la escena de la compra de billetes de tren durante el Año Nuevo chino:

- Tiempo T1: el usuario A consulta y ve "el tren G1234 tiene 1 billete disponible"
- Tiempo T2: el usuario B consulta y también ve "queda 1 billete"
- Tiempo T3: el usuario A hace clic en "comprar", el sistema descuenta el inventario y el billete se vende a A
- Tiempo T4: el usuario B hace clic en "comprar" — sin un mecanismo de protección, el sistema descontaría el inventario otra vez y vendería el mismo billete a B.

Este es el problema clásico de **conflicto de concurrencia**.

### 5.1 Introducción a transacción (Transaction)

Una **transacción** es un conjunto de operaciones de la base de datos que **o se completan todas con éxito o fallan todas**, sin que haya un estado intermedio de "mitad hecha".

::: tip 🤖 Ejemplo de la vida cotidiana
Una **transferencia bancaria** es una transacción típica:

1. Descontar 100 yuanes de la cuenta A
2. Añadir 100 yuanes a la cuenta B

Si el paso 1 tiene éxito pero el paso 2 falla (por ejemplo, por un corte de electricidad), ¿qué pasaría?
- **Sin transacción**: el dinero desaparece de la cuenta A y la cuenta B no lo recibe — dinero evaporado
- **Con transacción**: el sistema detecta el fallo del paso 2 y revierte automáticamente el paso 1, ambas cuentas vuelven a su estado original

Esta es la **atomicidad** de las transacciones: o todo o nada.
:::

### 5.2 Las cuatro propiedades de las transacciones (ACID)

Las transacciones tienen cuatro propiedades, conocidas como **ACID**:

| Propiedad | Inglés | Significado | Ejemplo de transferencia bancaria |
|-----------|--------|-------------|----------------------------------|
| **A**tomicidad | Atomicity | Todo o nada | El descuento y el abono deben realizarse juntos; no se puede descontar sin abonar |
| **C**onsistencia | Consistency | Los datos siempre están en un estado válido | Antes y después de la transferencia, el total de ambas cuentas debe ser el mismo |
| **I**solación | Isolation | Las transacciones múltiples no se afectan entre sí | Si A está transfiriendo, B debería ver el saldo "antes" o "después" de la transferencia, nunca un estado intermedio |
| **D**urabilidad | Durability | Una vez confirmada, se guarda permanentemente | Tras una transferencia exitosa, incluso si hay un corte de electricidad, los saldos no vuelven atrás |

::: tip 📊 ¿Qué puedes ver en esta tabla?
Estas cuatro propiedades garantizan la seguridad de los datos:

- **Atomicidad**: evita "hecho a medias" (descontado pero no abonado)
- **Consistencia**: evita datos ilógicos (el total cambió después de la transferencia)
- **Aislamiento**: evita conflictos de concurrencia (dos personas modificando los mismos datos simultáneamente)
- **Durabilidad**: evita pérdida de datos (un corte de electricidad tras el commit no afecta)

Sin estas garantías, los sistemas bancarios no podrían funcionar.
:::

### 5.3 Niveles de aislamiento de las transacciones: Equilibrio entre seguridad y rendimiento

En teoría, querríamos que las transacciones estuvieran completamente aisladas. Pero **aislamiento completo = rendimiento muy bajo** (porque se necesitarían muchos bloqueos, y otras transacciones tendrían que esperar).

Por eso, las bases de datos ofrecen cuatro **niveles de aislamiento**:

| Nivel de aislamiento | Lectura sucia | No repetible | Lectura fantasma | Rendimiento | Escenario de uso |
|----------------------|---------------|--------------|------------------|-------------|------------------|
| **Read Uncommitted** | Posible | Posible | Posible | El más rápido | Casi no se usa (datos pueden ser erróneos) |
| **Read Committed** | Imposible | Posible | Posible | Rápido | Negocio normal (por defecto en Oracle) |
| **Repeatable Read** | Imposible | Imposible | Posible | Medio | Transferencias bancarias (por defecto en MySQL) |
| **Serializable** | Imposible | Imposible | Imposible | El más lento | Escenarios extremadamente estrictos (raro) |

::: tip 📖 ¿Qué significan los tres tipos de "lectura"?
- **Lectura sucia**: leer datos que otra transacción aún no ha confirmado (podrían revertirse, datos inexactos)
- **Lectura no repetible**: en la misma transacción, dos lecturas del mismo dato dan resultados distintos (fue modificado por otra transacción)
- **Lectura fantasma**: en la misma transacción, dos consultas devuelven un número diferente de filas (otra transacción insertó/eliminó datos)

**Ejemplos coloquiales** (consulta de saldo bancario):
- **Lectura sucia**: ves un saldo de 1000, pero la otra transacción se revirtió y en realidad solo hay 100
- **Lectura no repetible**: la primera consulta muestra 1000, la segunda muestra 800 (se descontó entre ambas)
- **Lectura fantasma**: la primera consulta muestra 5 transacciones, la segunda muestra 6 (se añadió una)
:::

<TransactionACIDDemo />

---

## 6. Optimización del rendimiento: Técnicas prácticas para acelerar las consultas 1000 veces

Ya entiendes los conceptos fundamentales de índices y transacciones. Pero en proyectos reales, puedes encontrarte con diversos problemas de rendimiento.

Esta sección ofrece **estrategias de optimización aplicables directamente**.

### 6.1 Guía de uso de índices y errores comunes

::: warning ⚠️ Error común: cuando el índice no funciona
Muchas veces, aunque hayas creado un índice, la consulta sigue siendo lenta — porque el índice **se ha invalidado**.

**Causas comunes de invalidación del índice**:
1. Usar funciones en columnas indexadas
2. Conversión implícita de tipos
3. LIKE que comienza con %
4. Condiciones OR (en algunos casos)
5. Índice compuesto que no cumple el principio del prefijo más a la izquierda
:::

**Trampa 1: Usar funciones en columnas indexadas**

```sql
-- ❌ Error: usar una función en la columna indexada impide usar el índice
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- ✅ Correcto: reescribir como consulta por rango para usar el índice
SELECT * FROM users
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

**Trampa 2: Conversión implícita de tipos**

```sql
-- Supongamos que user_id es de tipo int
-- ❌ Error: pasar una cadena causa conversión implícita, no se usa el índice
SELECT * FROM users WHERE user_id = '123';

-- ✅ Correcto: pasar el tipo correspondiente
SELECT * FROM users WHERE user_id = 123;
```

**Trampa 3: LIKE que empieza con %**

```sql
-- ❌ Error: empezar con % impide usar el índice
SELECT * FROM users WHERE name LIKE '%张三%';

-- ✅ Correcto: empezar con un prefijo fijo permite usar el índice
SELECT * FROM users WHERE name LIKE '张三%';

-- ✅ O usar un índice de texto completo (para búsqueda textual)
SELECT * FROM users WHERE MATCH(name) AGAINST('张三');
```

### 6.2 Plantillas prácticas de optimización SQL

**Plantilla 1: Optimización de paginación (problema de paginación profunda)**

::: details Ver el problema y la solución
```sql
-- ❌ Problema: con OFFSET grande, la consulta se ralentiza
SELECT * FROM orders
ORDER BY created_at DESC
LIMIT 10 OFFSET 1000000;

-- ✅ Solución 1: usar el timestamp de la última consulta como cursor
SELECT * FROM orders
WHERE created_at < '2024-01-15 12:00:00'
ORDER BY created_at DESC
LIMIT 10;

-- ✅ Solución 2: usar consulta por rango de clave primaria
SELECT * FROM orders
WHERE order_id > 1000000
ORDER BY order_id
LIMIT 10;
```
:::

**Plantilla 2: Optimización de inserción por lotes**

```sql
-- ❌ Ineficiente: múltiples inserciones individuales (múltiples viajes de red)
INSERT INTO users (name, age) VALUES ('张三', 25);
INSERT INTO users (name, age) VALUES ('李四', 30);
INSERT INTO users (name, age) VALUES ('王五', 28);

-- ✅ Eficiente: inserción por lotes en una sola SQL (un solo viaje de red)
INSERT INTO users (name, age) VALUES
('张三', 25),
('李四', 30),
('王五', 28);
```

**Plantilla 3: Evitar SELECT ***

```sql
-- ❌ Ineficiente: devuelve todas las columnas (incluyendo campos grandes innecesarios)
SELECT * FROM users WHERE user_id = 1;

-- ✅ Eficiente: devolver solo las columnas necesarias
SELECT user_id, name, email FROM users WHERE user_id = 1;
```

### 6.3 Estrategias para escenarios de alta concurrencia

| Escenario | Problema | Solución |
|-----------|----------|----------|
| **Datos热点** | Una fila es leída/escrita con mucha frecuencia, causando contención de bloqueos | Usar caché (Redis) + separación lectura/escritura |
| **Compras flash** | Reducción de inventario con alta concurrencia instantánea | Bloqueo optimista + precalentamiento de inventario + recorte de picos con cola de mensajes |
| **Consultas lentas** | Consultas complejas colapsan la base de datos | Optimización de índices + fragmentación de consultas + separación lectura/escritura |
| **Conexiones agotadas** | Demasiadas peticiones concurrentes agotan el pool de conexiones | Optimización del pool de conexiones + limitación de flujo + degradación del servicio |

::: tip 💡 Conclusión clave
Principios fundamentales de la optimización del rendimiento:
1. **Medir primero, optimizar después**: usar `EXPLAIN` para analizar el plan de consulta y encontrar el cuello de botella real
2. **Índices primero**: el 80% de los problemas de rendimiento se resuelven optimizando índices
3. **Reducir la presión en la base de datos**: usar caché cuando sea posible y procesos asíncronos cuando se pueda
4. **Dividir y conquistar**: dividir tablas grandes en pequeñas y consultas grandes en pequeñas
:::

<QueryOptimizationDemo />

---

## 7. Resumen y ruta de aprendizaje

Repasemos los conceptos fundamentales de las bases de datos con una tabla:

| Concepto | Explicación en una frase | Problema que resuelve | Punto clave |
|----------|-------------------------|----------------------|-------------|
| **Tablas, filas, columnas** | Forma de organizar los datos | Cómo almacenar datos estructurados | Tabla = hoja Excel, Fila = registro, Columna = campo |
| **Clave primaria** | Identificador único de cada fila | Cómo encontrar exactamente una fila | Único, no nulo, inmutable |
| **Clave foránea** | Puente entre tablas | Cómo relacionar datos de tablas distintas | Apunta a la clave primaria de otra tabla |
| **SQL** | Lenguaje para hablar con la base de datos | Cómo añadir, consultar, modificar y eliminar datos | SELECT, INSERT, UPDATE, DELETE |
| **Índice** | Estructura de datos que acelera las consultas | Cómo encontrar datos rápidamente | Árbol B+, reduce I/O de disco |
| **Transacción** | Mecanismo que garantiza la seguridad de los datos | Cómo evitar conflictos de concurrencia y pérdida de datos | ACID: Atomicidad, Consistencia, Aislamiento, Durabilidad |

::: info Nota final
Las bases de datos son un tema vasto y profundo; este artículo es solo una introducción. Si quieres seguir profundizando, se recomienda esta ruta:

**Próximos pasos**:
1. **Práctica**: instala MySQL o PostgreSQL, crea tablas, inserta datos y escribe consultas SQL
2. **Frameworks ORM**: aprende a usar bases de datos en tu código (como SQLAlchemy, Prisma, TypeORM)
3. **Optimización de índices**: profundiza en índices compuestos, índices de cobertura y empuje de índices
4. **Principios de transacciones**: conoce MVCC (Control de Concurrencia Multiversión), mecanismos de bloqueo e implementación de niveles de aislamiento
5. **Bases de datos distribuidas**: aprende sobre fragmentación de tablas, separación lectura/escritura y replicación maestro-esclavo

Recuerda: **Teoría + Práctica = Dominio real**.
:::
