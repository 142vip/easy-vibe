# Fundamentos de expresiones regulares

> 💡 **Guía de aprendizaje**: ¿Las expresiones regulares parecen jeroglíficos? En realidad son solo un "mini-lenguaje para describir patrones de texto". Este capítulo te lleva desde cero a entender la esencia de las regex, aprendiendo a resolver el 80% de los problemas de búsqueda y validación de texto con unos pocos símbolos clave.

---

## 0. Motivación de expresiones regulares

Imagina los siguientes escenarios:
- Extraer todas las direcciones IP de un registro extenso
- Validar si el formato del correo electrónico introducido por el usuario es válido
- Reemplazar todas las fechas en un texto de `2024/01/15` a `2024-01-15`
- Extraer todos los enlaces del código fuente de una página web

**¿Usar búsqueda de cadenas normal?** Necesitarías escribir un montón de lógica `if-else`.
**¿Usar expresiones regulares?** Un patrón de una línea lo resuelve.

---

## 1. Introducción a las regex: operativo en tres minutos

👇 Pruébalo: introduce una expresión regular y ve los resultados en tiempo real

<RegexDemo />

::: tip 💡 Entendido en una frase
Expresión regular = **usar símbolos especiales para describir "qué tipo de texto buscas"**. `\d` significa dígito, `+` significa uno o más, así que `\d+` es "uno o más dígitos".
:::

---

## 2. Concepto central: combinar como si fueran bloques de construcción

La esencia de las regex es usar **tres tipos de bloques** para construir el patrón que deseas:

### 2.1 Bloque 1: Clases de caracteres (qué caracteres coincidir)

| Sintaxis | Significado | Ejemplo |
|---|---|---|
| `.` | Cualquier carácter | `a.c` → abc, a1c, a c |
| `\d` | Dígito [0-9] | `\d\d` → 42, 99 |
| `\w` | Letra/dígito/guion bajo | `\w+` → hello, user_1 |
| `\s` | Espacio en blanco | Coincide con espacios, tabulaciones |
| `[abc]` | Cualquiera del conjunto | `[aeiou]` → vocales |
| `[^abc]` | Ninguno del conjunto | `[^0-9]` → caracteres no numéricos |

### 2.2 Bloque 2: Cuantificadores (cuántas veces coincidir)

| Sintaxis | Significado | Ejemplo |
|---|---|---|
| `*` | 0 o más veces | `ab*` → a, ab, abbb |
| `+` | 1 o más veces | `ab+` → ab, abbb (no coincide con a) |
| `?` | 0 o 1 vez | `colou?r` → color, colour |
| `{3}` | Exactamente 3 veces | `\d{3}` → 123 |
| `{2,4}` | De 2 a 4 veces | `\d{2,4}` → 12, 1234 |

### 2.3 Bloque 3: Posición y agrupación

| Sintaxis | Significado | Ejemplo |
|---|---|---|
| `^` | Inicio de línea | `^Hello` → líneas que empiezan por Hello |
| `$` | Fin de línea | `end$` → líneas que terminan en end |
| `\b` | Límite de palabra | `\bcat\b` → cat (no coincide con catch) |
| `(...)` | Grupo de captura | `(\d+)-(\d+)` → captura por separado |
| `a\|b` | O | `cat\|dog` → cat o dog |

---

## 3. Práctica: Patrones de validación comunes

### 3.1 Validación de correo electrónico

```
[\w.+-]+@[\w-]+\.[\w.]+
```

Desglose:
- `[\w.+-]+` — Parte del nombre de usuario (letras, números, puntos, más, guiones)
- `@` — El símbolo @ literal
- `[\w-]+` — Parte del dominio
- `\.` — El punto escapado
- `[\w.]+` — Dominio de nivel superior

### 3.2 Validación de número de teléfono (China)

```
1[3-9]\d{9}
```

Desglose:
- `1` — Empieza por 1
- `[3-9]` — El segundo dígito es 3-9
- `\d{9}` — Seguido de 9 dígitos

### 3.3 Verificación de fortaleza de contraseña

```
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$
```

Desglose:
- `(?=.*[a-z])` — Al menos una letra minúscula (assertion anticipada)
- `(?=.*[A-Z])` — Al menos una letra mayúscula
- `(?=.*\d)` — Al menos un dígito
- `.{8,}` — Longitud total de al menos 8 caracteres

---

## 4. Usar expresiones regulares en el código

### JavaScript

```javascript
const text = '联系方式：13812345678 或 15099887766'
const regex = /1[3-9]\d{9}/g
const phones = text.match(regex)
// ['13812345678', '15099887766']

// Reemplazar
text.replace(/\d{4}(?=\d{4}$)/, '****')
// Ocultar los 4 dígitos centrales del teléfono

// Validar
/^[\w.+-]+@[\w-]+\.[\w.]+$/.test('user@example.com')
// true
```

### Python

```python
import re

text = '价格是 99 元，优惠 20 元'
numbers = re.findall(r'\d+', text)
# ['99', '20']

# Reemplazar
re.sub(r'\d+', 'X', text)
# '价格是 X 元，优惠 X 元'

# Captura por grupos
match = re.search(r'(\d+)-(\d+)', '2024-01-15')
match.group(1)  # '2024'
match.group(2)  # '01'
```

---

## 5. Codicioso vs. Perezoso: una diferencia clave

```
Texto: <b>hello</b> and <b>world</b>
```

| Patrón | Resultado | Explicación |
|---|---|---|
| `<b>.*</b>` | `<b>hello</b> and <b>world</b>` | Codicioso: coincide lo máximo posible |
| `<b>.*?</b>` | `<b>hello</b>` | Perezoso: coincide lo mínimo posible |

::: tip 💡 Recuerda
Por defecto es modo codicioso. Añade `?` después del cuantificador para cambiar a modo perezoso. La mayoría de las veces necesitas el modo perezoso.
:::

---

## 6. Resumen

::: tip 📚 Puntos clave
1. **Regex = mini-lenguaje para describir patrones de texto**, usado para buscar, coincidir y reemplazar
2. **Tres tipos de bloques**: Clases de caracteres (qué coincidir) + Cuantificadores (cuántas veces) + Posición/agrupación
3. **\d \w \s** son las tres clases de caracteres más usadas, cubriendo números, palabras y espacios
4. **No hace falta escribir desde cero**: los escenarios comunes ya tienen patrones regex maduros para reutilizar
5. **Codicioso vs. Perezoso**: Por defecto codicioso (coincide más), añade `?` para perezoso (coincide menos)
:::

**Siguiente paso**:
- [Introducción a las variables de entorno y PATH](./environment-path) - Entender la configuración del sistema
- [Introducción a SSH y autenticación por clave](./ssh-authentication) - Conexión segura a servidores remotos
