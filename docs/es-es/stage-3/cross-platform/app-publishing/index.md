---
title: 'Cómo publicar la aplicación que has creado'
description: 'De la compilación Release y la firma a las pruebas, revisión, despliegue gradual, monitorización y actualizaciones.'
---

# Cómo publicar la aplicación que has creado

Que una app funcione en tu ordenador no significa que los usuarios puedan instalarla con seguridad.

> Elegir canal → fijar identidad → crear Release → firmar → probar → preparar la tienda → enviar → desplegar por fases → monitorizar y actualizar

## 1. Separa paquete, firma, distribución y revisión

El paquete es el instalador, la firma identifica al editor y protege las actualizaciones, la distribución lo entrega y la revisión comprueba las reglas de la plataforma.

## 2. Ordena propiedad e identidad

La organización debe controlar cuentas, correo, dominio, nube, certificados y datos de cobro. Activa doble factor. No cambies después el package name de Android ni el Bundle ID de Apple. Aumenta el Build number en cada subida.

## 3. Prepara un Release y materiales reales

No uses localhost, base de pruebas ni secretos de servidor. Crea icono, capturas reales, descripción, soporte, privacidad y notas de revisión desde la compilación candidata. Permisos, SDK, declaración de tienda y política de privacidad deben coincidir.

## 4. Rutas por plataforma

Android suele subir un `.aab` firmado a Google Play y empezar por prueba interna. iOS usa App Store Connect, Xcode Archive, TestFlight y revisión.

Windows usa MSIX en Microsoft Store o un instalador firmado en la web. macOS fuera de la tienda necesita Developer ID y notarización. Linux ofrece Flathub, Snap, AppImage, `.deb` y `.rpm`.

Web/PWA se publica en HTTPS y necesita DNS, certificados, variables de producción, 404, modo sin conexión, Manifest, Service Worker, monitorización y copia de seguridad.

## 5. Revisión y despliegue gradual

Son habituales los fallos exclusivos de Release, cuentas de revisión inválidas, declaraciones de privacidad incorrectas, botones incompletos, permisos excesivos y recursos sin licencia.

> Este es el mensaje de revisión: 【pégalo】. Señala la regla y el comportamiento que hay que cambiar. No adivines.

Prueba con desarrolladores, equipo interno, beta pequeña, revisión y un porcentaje reducido antes del total. Firma, privacidad, monitorización y rollback son parte del producto.
