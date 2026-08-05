# Fundamentos prácticos de plataformas cloud
> **Guía de aprendizaje**: Los proveedores de servicios cloud no son "sitios web para comprar servidores", sino "infraestructura que proporciona capacidad de cálculo como las compañías de agua y electricidad". Este capítulo se centra en una pregunta central: **¿Cómo entender y usar los servicios cloud desde cero?** Utilizaremos escenarios reales, analogías vívidas y pasos prácticos para ayudarte a construir un mapa cognitivo completo de los servicios cloud.

Antes de comenzar, se recomienda conocer:

- **Conceptos básicos de redes**: Si aún no estás familiarizado con direcciones IP, puertos, dominios, etc., se recomienda leer [Conceptos básicos de redes](/zh-cn/appendix/1-computer-fundamentals/computer-networks)
- **Qué es una API**: Si aún no conoces las APIs, puedes consultar [Introducción a las APIs](/zh-cn/appendix/4-server-and-backend/api-intro)

---

## 0. Introducción: Motivación de cada vez más empresas no compran servidores

Imagina este escenario:

Xiao Ming fundó su empresa en 2010 y quería crear un sitio web. ¿Qué experimentó?

Primero gastó 20.000 yuanes en comprar un servidor Dell, luego contactó con un centro de datos IDC, pagando 3.000 yuanes mensuales de hospedaje. Luego instaló Linux él mismo, configuró el entorno, y se preocupaba por problemas de hardware: si el disco duro se rompía, tenía que cambiarlo personalmente; si la máquina se sobrecalentaba, tenía que resolverlo. Lo más doloroso era que cuando los usuarios aumentaban repentinamente y el sistema no aguantaba, tenía que comprar otro servidor. Un año después, Xiao Ming había gastado 50.000 yuanes, pero la utilización del servidor era solo del 10%.

La empresa de Xiao Hong, fundada en 2024, ¿cómo lo hizo?

Abrió el sitio web del proveedor cloud, registró una cuenta, con unos pocos clics creó un servidor cloud en 2 minutos. Paga solo por lo que usa, si no usa no paga. Si el tráfico aumenta, un clic para mejorar la configuración. ¿Quiere abrir una sucursal en Estados Unidos? Simplemente cambia la región. Un mes después, Xiao Hong había gastado 500 yuanes, con una utilización del servidor del 80%.

**Intuitivamente, podríamos pensar: "los servicios cloud son alquilar servidores".**

Pero la esencia de los servicios cloud va mucho más allá: es una **revolución en la capacidad de cálculo**.

En el pasado, las empresas debían pasar por un largo proceso de comprar servidores, buscar centros de datos, instalar sistemas, preocuparse por el hardware y quedar impotentes ante picos de tráfico. Ahora, solo necesitan registrar una cuenta, hacer unos pocos clics, pagar según el uso, escalar automáticamente y desplegar globalmente. Esta transformación es como pasar de cavar tu propio pozo para obtener agua a abrir el grifo y tener agua corriente.

---

## 1. Introducción a proveedores de servicios cloud

### 1.1 Servicios de cálculo como las compañías de agua y electricidad

La esencia de los proveedores de servicios cloud es **empaquetar la capacidad de cálculo, almacenamiento y red en servicios estandarizados**, como las compañías de agua proporcionan agua y las eléctricas proporcionan electricidad, y proporcionarlos a los usuarios a través de internet.

Lo inteligente de este modelo es el **uso bajo demanda**. No necesitas comprar mucho hardware por adelantado, solo pagas según el uso real. ¿Necesitas más recursos? Un clic es suficiente. Algunos servicios incluso facturan por segundos, extremadamente flexibles. Además, los proveedores cloud tienen centros de datos en decenas de países, puedes desplegar aplicaciones a nivel global, todas las operaciones son autoservicio, disponibles las 24 horas, sin necesidad de aprobación manual.

### 1.2 Diferencia entre servicios cloud y hospedaje tradicional

El hospedaje IDC tradicional es como comprar tu propio generador de electricidad. Necesitas comprar hardware (servidores), luego encontrar dónde colocarlo (hospedaje en centro de datos), y mantenerlo tú mismo (instalar sistemas, reparar hardware). Si la energía no es suficiente, tienes que comprar otro generador. Este proceso puede tardar días o semanas, el costo es fijo, pagas lo uses o no.

Los servicios cloud son como conectarte a la red eléctrica. No necesitas comprar un generador, solo necesitas "enchufar un cable" (registrar una cuenta) y pagar según el consumo. ¿Necesitas más energía? Cambia a un plan de mayor potencia, listo en minutos. En este modelo, el costo es variable, pagas lo que usas, y el proveedor cloud se encarga de todo el mantenimiento del hardware, tú solo te enfocas en tu negocio.

### 1.3 Nube pública, privada e híbrida

Así como los restaurantes tienen diferentes modelos de negocio, los servicios cloud tienen tres tipos.

La **nube pública** es como un restaurante público, cualquiera puede usarla, con recursos compartidos. AWS, Alibaba Cloud y Azure son nubes públicas, adecuadas para la gran mayoría de empresas e individuos. Este es el enfoque de este libro, porque es la más común y la más adecuada para aprender.

La **nube privada** es como una cocina privada, construida por uno mismo, con recursos exclusivos. OpenStack y VMware son representantes típicos, adecuados para grandes empresas, gobiernos y bancos con requisitos extremos de seguridad de datos.

La **nube híbrida** es la combinación de ambas, parte del negocio usa nube pública y parte usa nube privada. Todos los proveedores tienen soluciones, adecuada para escenarios que necesitan tanto cumplimiento normativo como elasticidad.

👇 **Haz clic para explorar**:
Haz clic en las tarjetas de servicio a continuación para conocer las seis categorías principales de servicios cloud.

<CloudServicesOverview />

---

## 2. Selección de proveedores de servicios cloud más conocidos

### 2.1 Los tres gigantes internacionales: AWS, Azure, Google Cloud

En el mercado global de servicios cloud, tres proveedores dominan.

**AWS (Amazon Web Services)** fue lanzado por Amazon en 2006, con la mayor cuota de mercado global, aproximadamente el 32%. Es como el "grandes almacenes" del mundo cloud, con la mayor variedad de servicios, más de 200, las funciones más maduras y estables, y la documentación y recursos comunitarios más ricos. Aunque los precios son relativamente altos, la relación calidad-precio es buena, especialmente adecuada para empresas que se expanden internacionalmente, startups y grandes empresas de internet.

**Microsoft Azure** fue lanzado por Microsoft en 2010, con la segunda mayor cuota de mercado global, aproximadamente el 23%. Su mayor ventaja es la integración profunda con el ecosistema Windows y Office, ricos recursos de clientes empresariales, fuerte capacidad de nube híbrida, y es especialmente amigable para desarrolladores .NET. Si tu empresa ya usa la pila tecnológica de Microsoft, Azure es la elección natural.

**Google Cloud Platform (GCP)** fue lanzado por Google en 2011, con la tercera mayor cuota de mercado global, aproximadamente el 10%. Líder en Kubernetes, análisis de datos e IA, con gran capacidad de innovación tecnológica y precios relativamente bajos. Pero su cuota de mercado es menor y su ecosistema no es tan completo como los dos anteriores, adecuada para empresas tecnológicas, aplicaciones containerizadas y proyectos de IA.

### 2.2 Los tres gigantes nacionales: Alibaba Cloud, Tencent Cloud, Huawei Cloud

En el mercado de servicios cloud chino, también hay tres proveedores principales.

**Alibaba Cloud** es el departamento de computing cloud fundado por Alibaba en 2009, con la mayor cuota de mercado en China, aproximadamente el 40%. Como el proveedor cloud nacional más antiguo y maduro, Alibaba Cloud tiene una gama completa de servicios, con profunda experiencia técnica en e-commerce y el Double Eleven. Aunque los precios son relativamente altos, la estabilidad y completitud funcional son de primera clase, especialmente adecuada para empresas nacionales y proyectos relacionados con e-commerce.

**Tencent Cloud** es el departamento de servicios cloud fundado por Tencent en 2013, con la segunda mayor cuota de mercado en China, aproximadamente el 15%. Destaca en juegos, audio y video, con buena integración con el ecosistema WeChat y QQ, precios relativamente bajos y un rápido desarrollo en los últimos años. Si haces proyectos de juegos, social o streaming, Tencent Cloud es una buena opción.

**Huawei Cloud** es el departamento de servicios cloud fundado por Huawei en 2015, con la tercera mayor cuota de mercado en China, aproximadamente el 10%. Tiene fuerte acumulación tecnológica en hardware, ricos recursos de clientes gubernamentales y empresariales, fuerte capacidad de cumplimiento de seguridad, y sus chips AI (Ascend) son distintivos. Adecuado para proyectos gubernamentales, grandes empresas estatales y manufactura.

### 2.3 Enfoque de elegir un proveedor cloud

Elegir un proveedor cloud es como alquilar una vivienda, hay que considerar ubicación, precio, servicios incluidos y otros factores.

**Primero, mira el mercado objetivo**. ¿Dónde están tus usuarios? Si están en China, elige Alibaba Cloud o Tencent Cloud; si están en el extranjero, elige AWS o Azure; si es un negocio global, elige un proveedor con cobertura multi-región.

**Segundo, mira la pila tecnológica**. ¿Qué tecnología usas? Si usas tecnología Microsoft, elige Azure; si usas Kubernetes y big data, elige Google Cloud; si es un escenario general, AWS es una opción segura.

**Luego, mira los costos**. Para proyectos pequeños de prueba, elige opciones económicas como Tencent Cloud o UCloud; para producción a gran escala, hay que evaluar el costo total, AWS puede ser más económico a largo plazo.

**Finalmente, mira el ecosistema**. Si ya estás usando otros servicios como GitHub u Office 365, elegir un proveedor del mismo ecosistema será más conveniente.

La recomendación práctica: para principiantes o proyectos pequeños, elige Alibaba Cloud o Tencent Cloud, porque la documentación está en español y el soporte técnico es local; para proyectos de expansión internacional, elige AWS, porque es el más maduro y tiene la mejor cobertura global; las grandes empresas pueden necesitar una estrategia multi-cloud, con diferentes servicios en diferentes nubes.

---

## 3. Enfoque de uso común en servicios cloud

### 3.1 Flujo completo del registro al lanzamiento

El primer paso para usar servicios cloud es registrar una cuenta. Este proceso es como abrir una cuenta bancaria, necesitas verificar tu identidad. Abre el sitio web del proveedor cloud, haz clic en "Registro gratuito", completa el correo electrónico y la contraseña, verifica el número de teléfono, sube tu documento de identidad o certificado empresarial para autenticación de nombre real, y finalmente vincula un método de pago. Todo el proceso tarda unos 10 a 20 minutos.

Una vez registrado, necesitas conocer varios conceptos clave. **Región (Region)** es el área donde se encuentra el centro de datos del servicio cloud, como Este de China (Hangzhou), Este de EE.UU. (Virginia) y Asia-Pacífico (Singapur). El principio es elegir la más cercana a tus usuarios para menor latencia. **Zona de disponibilidad (Availability Zone, AZ)** son múltiples centros de datos dentro de una región, aislados entre sí, para mejorar la disponibilidad. Si una zona de disponibilidad falla, otra puede seguir funcionando. **Instancia (Instance)** es un servidor virtual, como un servidor cloud de 2 núcleos y 4 GB, facturado por tiempo o por uso.

### 3.2 Crear el primer servidor cloud

Crear un servidor cloud es como montar un ordenador, pero seleccionando la configuración en una página web. Primero elige el modo de pago: para entornos de prueba usa pago por uso, para ejecución a largo plazo usa suscripción anual o mensual. Luego selecciona la región, la más cercana a ti. Para las especificaciones de la instancia, 2 núcleos y 4 GB son suficientes para un entorno de prueba. Para la imagen, elige el sistema operativo, como CentOS 7.9 o Ubuntu 20.04. Para almacenamiento, usa 40 GB de disco del sistema; para red, usa la VPC predeterminada y paga el ancho de banda por uso. Finalmente, establece la contraseña del usuario root y guárdala bien. Todo el proceso tarda unos 5 minutos, y la instancia estará lista para usar tras esperar 1 a 2 minutos tras su creación.

👇 **Haz clic para explorar**:
Selecciona la configuración para conocer los precios y escenarios de uso de diferentes especificaciones.

<ComputeInstanceDemo />

### 3.3 Conectar al servidor cloud y desplegar una aplicación

Para conectar a un servidor Linux se recomienda usar SSH. Para iniciar sesión con contraseña: `ssh root@IP-pública-de-tu-servidor`, luego introduce la contraseña. Para iniciar sesión con clave (más seguro): `ssh -i tu-clave-privada.pem root@IP-pública-de-tu-servidor`.

Una vez conectado al servidor, puedes desplegar la aplicación. Primero actualiza el sistema: CentOS usa `sudo yum update -y`, Ubuntu usa `sudo apt update && sudo apt upgrade -y`. Luego instala el software necesario, como Node.js. Sube el código, usando git o scp. Finalmente instala las dependencias e inicia la aplicación.

### 3.4 Escenarios de uso comunes

**Alojar un sitio web personal o blog** necesita un servidor cloud y un dominio, 1 núcleo y 2 GB son suficientes, con un costo de unos 50 a 100 yuanes mensuales, usando Nginx con archivos estáticos o WordPress.

**Desplegar un backend API** necesita un servidor cloud y una base de datos, a partir de 2 núcleos y 4 GB, con un costo de unos 200 a 500 yuanes mensuales, usando Node.js o Python con MySQL o PostgreSQL.

**Almacenar imágenes o videos** se recomienda usar almacenamiento de objetos, facturado por almacenamiento y tráfico, con un costo de unos pocos yuanes a cientos mensuales. La ventaja es que no hay que gestionar discos duros, con backup automático y se puede combinar con CDN para acelerar.

👇 **Haz clic para explorar**:
Conoce los diferentes tipos de servicios de almacenamiento cloud y sus escenarios de uso.

<StorageTypeDemo />

---

## 4. Enfoque de comprar y llamar a APIs

### 4.1 Modelos de facturación de servicios cloud

Los servicios cloud tienen muchos modelos de facturación; entenderlos puede ahorrarte mucho dinero.

**Pago por uso (Pay-as-you-go)** es como comprar entradas individuales de cine, pagas por lo que usas. Adecuado para entornos de prueba y proyectos con tráfico inestable. Los servidores cloud se facturan por horas, el almacenamiento de objetos por GB y número de peticiones, las APIs de IA por número de llamadas.

**Suscripción anual/mensual o instancias reservadas** es como comprar un abono mensual o anual, con compromiso de uso por un período determinado y descuentos, normalmente ahorrando entre un 30% y un 60%. Adecuado para entornos de producción estables a largo plazo. Por ejemplo, un servidor de 2 núcleos y 4 GB, con pago por uso cuesta 200 yuanes mensuales, con suscripción anual puede ser solo 140 yuanes mensuales.

**Instancias spot o instancias preferentes** es como una lista de espera, con precios muy bajos, ahorrando hasta un 90%, pero pueden ser recuperadas forzosamente. Adecuadas para tareas de procesamiento por lotes, tareas con alta tolerancia a fallos, como procesamiento de datos y renderizado. El riesgo es que el proveedor cloud puede recuperar las instancias cuando los recursos son escasos.

**Serverless por número de llamadas** es como un taxi, no te preocupas por el servidor, solo por el número de llamadas. La facturación es por número de llamadas, tiempo de cálculo y tráfico, adecuada para interfaces API y tareas impulsadas por eventos. Por ejemplo, Alibaba Cloud Function Computing ofrece 1 millón de llamadas gratuitas, y a partir de ahí 1,33 yuanes por millón.

👇 **Haz clic para explorar**:
Usa la calculadora de precios para comparar las diferencias de costo entre diferentes modelos de facturación.

<PricingCalculator />

### 4.2 Flujo completo para comprar llamadas a APIs

Tomando como ejemplo la llamada a la API de Tongyi Qianwen, todo el proceso se divide en cuatro pasos.

**Paso 1: Activar el servicio**. Abre la plataforma AI abierta del proveedor cloud o la plataforma de aprendizaje automático PAI, encuentra Tongyi Qianwen o DashScope, haz clic en "Activar ahora" o "Prueba gratuita", completado en unos 2 minutos.

**Paso 2: Obtener la API Key**. Entra en la gestión de API-KEY de la consola, haz clic en "Crear mi API-KEY", copia y guarda esta Key. Importante: la API Key solo se muestra una vez, guárdala inmediatamente.

**Paso 3: Configurar permisos**. Entra en el control de acceso (RAM) o gestión de permisos (IAM), crea un usuario o rol, autorizando solo los permisos necesarios, como solo poder llamar a Tongyi Qianwen pero no eliminar servidores. Este es el principio de mínimo privilegio.

**Paso 4: Prueba de llamada**. Usa Python o JavaScript para hacer la primera llamada y verificar que la API funciona correctamente.

---

## 5. Práctica: Desplegar un sitio web desde cero

### 5.1 Escenario y selección de solución

Supongamos que eres un desarrollador frontend que quiere desplegar un sitio web de blog personal. Los requisitos son: sitio estático (HTML/CSS/JS), con dominio propio, acceso rápido a nivel global y costos mínimos.

Hay tres soluciones posibles. La solución de servidor cloud tiene costo medio, dificultad media, adecuada para escenarios que necesitan servicios backend. La solución de almacenamiento de objetos con CDN tiene bajo costo, baja dificultad, adecuada para sitios puramente estáticos, esta es nuestra recomendación. La solución Serverless tiene costo muy bajo, dificultad media, adecuada para contenido dinámico.

Se recomienda la solución de almacenamiento de objetos con CDN porque: el costo es el más bajo (posiblemente gratuito), la configuración es la más simple, y la velocidad es la más rápida (aceleración CDN).

👇 **Haz clic para explorar**:
Sigue las instrucciones paso a paso para conocer el flujo completo de despliegue de un sitio web.

<DeployWorkflowDemo />

### 5.2 Pasos de implementación

**Paso 1: Preparar los archivos del sitio web**. Crea un archivo index.html simple:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mi blog</title>
</head>
<body>
  <h1>Bienvenido a mi blog</h1>
  <p>Este es mi primer artículo.</p>
</body>
</html>
```

**Paso 2: Crear un Bucket de almacenamiento de objetos**. Inicia sesión en la consola cloud, encuentra el almacenamiento de objetos (OSS/S3), haz clic en "Crear Bucket". Configura el nombre (como my-blog-2024, único global), selecciona la región (la más cercana), establece los permisos como lectura pública (el sitio web necesita ser accesible).

**Paso 3: Subir archivos**. Entra en el Bucket, haz clic en "Subir archivo", selecciona index.html y espera a que se complete la subida.

**Paso 4: Configurar hosting de sitio web estático**. Entra en la configuración del Bucket, encuentra "Páginas estáticas" o "Hosting web", activa la función, establece index.html como página de inicio predeterminada y guarda la configuración.

**Paso 5: Vincular dominio (opcional)**. Compra un dominio (como Alibaba Cloud Wanwang), añade un registro CNAME apuntando al dominio del Bucket, vincula el dominio personalizado en el Bucket y configura HTTPS.

**Paso 6: Configurar CDN (recomendado)**. Activa el servicio CDN, añade el dominio de aceleración, selecciona el origen (tu Bucket), espera a que el CDN se active (de unos minutos a unas horas).

### 5.3 Estimación de costos

Estimación mensual: Almacenamiento de objetos 0 a 5 yuanes (facturado por almacenamiento), tráfico CDN 0 a 10 yuanes (facturado por tráfico, con cuota gratuita), dominio 5 a 10 yuanes (prorrateado anualmente). Total de 5 a 25 yuanes mensuales; para sitios pequeños, podría ser completamente gratuito.

---

## 6. Resumen y próximos pasos

### 6.1 Repaso de puntos clave

La esencia de los servicios cloud se puede resumir como: los proveedores cloud son las compañías de agua y electricidad de la capacidad de cálculo, proporcionando capacidades de uso bajo demanda, despliegue global y autoservicio. El flujo de uso es: elegir proveedor, registrar cuenta, crear recursos, configurar permisos y monitorear costos.

Los puntos de decisión clave incluyen: elegir proveedor según mercado, pila tecnológica y costos; elegir modelo de facturación entre pago por uso, suscripción y Serverless; configurar permisos siguiendo el principio de mínimo privilegio, activar MFA y auditar periódicamente; controlar costos monitoreando el uso, usando descuentos y liberando recursos innecesarios.

### 6.2 Ruta de aprendizaje recomendada

La primera semana, aprender los fundamentos teóricos, conocer los conceptos básicos de servicios cloud, registrar una cuenta cloud y crear el primer servidor cloud. La segunda semana, práctica hands-on, desplegar un sitio estático, configurar dominio y CDN, y aprender comandos básicos de Linux. La tercera semana, aprender habilidades avanzadas, incluyendo gestión de permisos (IAM), monitorización y alertas, y optimización de costos. La cuarta semana, proyecto práctico, desplegar una aplicación completa, configurar base de datos y almacenamiento, e implementar autoescalado.

### 6.3 Recursos recomendados

Documentación oficial: Centro de documentación de Alibaba Cloud, Documentación AWS en español, Documentación de Tencent Cloud. Plataformas de aprendizaje: Alibaba Cloud University, AWS Free Tier, Laboratorio de Tencent Cloud. Recursos comunitarios: Comunidad Cloud Native, Serverless en español, Columna de computing cloud de InfoQ.

---

## 7. Tabla de terminología

| Término en inglés | Traducción al español | Explicación |
| :--- | :--- | :--- |
| **Cloud Provider** | Proveedor de servicios cloud | Empresa que proporciona servicios de computing cloud, como AWS, Alibaba Cloud |
| **Region** | Región | Área geográfica donde se encuentra el centro de datos |
| **Availability Zone** | Zona de disponibilidad | Centro de datos independiente dentro de una región |
| **Instance** | Instancia | Un servidor virtual |
| **Image/AMI** | Imagen | Plantilla de sistema operativo preconfigurada |
| **VPC** | Nube privada virtual | Entorno de red virtual aislado |
| **IAM/RAM** | Gestión de identidad y acceso | Sistema de gestión de permisos |
| **User** | Usuario | Una identidad concreta |
| **Group** | Grupo de usuarios | Conjunto de usuarios |
| **Role** | Rol | Identidad temporal |
| **Policy** | Política | Documento JSON que define permisos |
| **API Key** | Clave API | Credencial para llamar a APIs |
| **AccessKey** | Clave de acceso | Credencial para acceso programático (ID + Secret) |
| **MFA** | Autenticación multifactor | Método de inicio de sesión que requiere contraseña y código de verificación |
| **CDN** | Red de entrega de contenidos | Servicio de aceleración global que almacena recursos estáticos en caché |
| **OSS/S3** | Almacenamiento de objetos | Servicio para almacenar archivos |
| **ECS/EC2** | Servidor cloud | Servicio de hosting virtual |
| **RDS** | Servicio de base de datos relacional | Base de datos gestionada |
| **Serverless** | Sin servidor | Modelo de computing sin gestión de servidores |
| **Pay-as-you-go** | Pago por uso | Modelo de facturación donde pagas lo que usas |
| **Reserved Instance** | Instancia reservada | Modelo de facturación por suscripción anual/mensual |
| **Spot Instance** | Instancia spot | Instancia de bajo precio pero que puede ser recuperada |
