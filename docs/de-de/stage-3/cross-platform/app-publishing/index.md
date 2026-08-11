---
title: 'Die fertige Anwendung veröffentlichen und in Stores bringen'
description: 'Von Release-Build und Signierung über Tests und Prüfung bis zu gestaffeltem Rollout und Updates.'
---

# Die fertige Anwendung veröffentlichen und in Stores bringen

Eine lokal laufende App ist noch kein sicher installierbares Produkt.

> Kanal wählen → Identität festlegen → Release bauen → signieren → testen → Store-Material → Prüfung → gestaffelter Rollout → überwachen und aktualisieren

## 1. Paket, Signierung, Verteilung und Prüfung trennen

Das Paket ist der Installer, die Signatur belegt Herausgeber und Update-Kette, die Verteilung liefert ihn aus, die Prüfung kontrolliert Plattformregeln.

## 2. Eigentum und Identität ordnen

Organisationen kontrollieren Konten, E-Mail, Domain, Cloud, Zertifikate und Zahlungsdaten mit Zwei-Faktor-Schutz. Android-Paketname und Apple Bundle ID bleiben nach Veröffentlichung stabil. Jede neue Einreichung erhöht die Build-Nummer.

## 3. Ein echtes Release vorbereiten

Kein localhost, keine Testdatenbank, keine Servergeheimnisse. Symbol, echte Screenshots, Beschreibung, Support, Datenschutz und Review-Hinweise entstehen aus dem Kandidaten. Rechte, SDK-Verhalten, Store-Angaben und Datenschutz müssen übereinstimmen.

## 4. Plattformwege

Android lädt meist ein signiertes `.aab` zu Google Play und beginnt intern. iOS nutzt App Store Connect, Xcode Archive, TestFlight und Review.

Windows nutzt MSIX im Store oder einen signierten Website-Installer. macOS außerhalb des Stores braucht Developer ID und Notarisierung. Linux bietet Flathub, Snap, AppImage, `.deb`, `.rpm`.

Web/PWA wird per HTTPS veröffentlicht und benötigt DNS, Zertifikat, Produktionsvariablen, 404, Offline-Modus, Manifest, Service Worker, Monitoring und Backup.

## 5. Review und gestaffelter Rollout

Typisch sind Release-Abstürze, unbrauchbare Review-Konten, falsche Datenschutzangaben, unfertige Schaltflächen, zu viele Rechte und unlizenzierte Assets.

> Hier ist die Review-Nachricht: 【einfügen】. Bestimme Regel und zu änderndes Verhalten, ohne zu raten.

Entwicklertest, intern, kleine Beta, Review, kleiner Anteil, alle Nutzer: So bleibt das Risiko kontrollierbar. Signierung, Datenschutz, Monitoring und Rollback gehören zum Produkt.
