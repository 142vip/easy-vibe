# API-Einführung: Schnittstellengrundlagen

::: tip 🎯 Kernfrage
**Was ist eine API?** Das ist wie die Frage: Wie sollte die Speisekarte eines Restaurants gestaltet sein, damit die Gäste sie sofort verstehen? Wie merkt sich der Kellner die Bestellungen, ohne Fehler zu machen? API löst das Problem, wie "Programme miteinander kommunizieren". Du verwendest seit deinem ersten Tag beim Programmieren APIs, auch wenn du es vielleicht nicht bemerkt hast.
:::

---

## 0. Drei häufige Verwirrungen für Anfänger

**Verwirrung 1: Ist API etwas sehr Kompliziertes?**

Viele denken bei API sofort an ein Konzept, das nur fortgeschrittene Ingenieure verstehen können. Tatsächlich hast du schon längst APIs verwendet:

```python
len("hello")        # Das ist eine von Python bereitgestellte API
open("file.txt")    # Das ist auch eine API
requests.get(url)   # Das ist ebenfalls eine API
```

**Verwirrung 2: Was ist der Unterschied zwischen Web-API und normaler API?**

| Typ | Aufrufobjekt | Kommunikationsweise | Typisches Szenario |
| :--- | :--- | :--- | :--- |
| **Funktions-API** | Lokaler Code | Funktionsaufruf | `len()`, `open()` |
| **Betriebssystem-API** | Betriebssystem | Systemaufruf | Dateien lesen/schreiben, Prozesse erstellen |
| **Web-API** | Remote-Server | HTTP-Anfrage | KI-Modelle aufrufen, Wetterdaten abrufen |

**Verwirrung 3: Soll ich HTTP oder SDK verwenden?**

```python
# HTTP-Methode: Alle Details selbst behandeln
import requests
response = requests.post(
    "https://api.deepseek.com/v1/chat/completions",
    headers={"Authorization": "Bearer sk-xxx"},
    json={"model": "deepseek-chat", "messages": [...]}
)
result = response.json()["choices"][0]["message"]["content"]

# SDK-Methode: Der Butler erledigt alles für dich
from openai import OpenAI
client = OpenAI(api_key="sk-xxx")
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[...]
)
result = response.choices[0].message.content
```

---

## 1. Die Essenz der API: Stecker und Steckdose

**API** (Application Programming Interface, Schnittstelle zur Anwendungsprogrammierung) ist die "Vereinbarung für die Kommunikation zwischen Programmen".

### 1.1 Analogie mit Elektrogeräten

| Konzept | Elektro-Analogie | API-Entsprechung |
| :--- | :--- | :--- |
| **Schnittstelle** | Steckdosenform | Funktionssignatur / URL |
| **Eingabe** | Stromversorgung | Funktionsparameter / Anfragekörper |
| **Ausgabe** | Gerät arbeitet | Rückgabewert / Antwortkörper |

### 1.2 Vergleich von drei API-Formen

<ApiTypesComparison />

### 1.3 Unterschied zwischen Funktions-API und HTTP-API

Viele Anfänger sind verwirrt: Was ist eigentlich der Unterschied zwischen einer Funktions-API und einer HTTP-API? Wie unterscheidet man sie in der Dokumentation?

<ApiFunctionVsHttp />

### 1.4 Wie liest man verschiedene Arten von API-Dokumentation

Bei verschiedenen Arten von API-Dokumentation sind die Schwerpunkte unterschiedlich:

<DocumentTypesComparison />

---

## 2. Ein vollständiger API-Aufruf

👇 **Probier es aus**: Klicke auf die Schaltfläche unten und beobachte einen vollständigen API-Anfrage-Antwort-Ablauf:

<ApiRequestDemo />

### 2.1 Die vier Phasen eines API-Aufrufs

| Phase | Was passiert | Elektro-Analogie |
| :--- | :--- | :--- |
| **Anfrage** | Client sendet Anfrage an den Server | Schalter drücken |
| **Übertragung** | Anfrage wird über das Netzwerk zum Server übertragen | Strom fließt durch das Kabel |
| **Verarbeitung** | Server verarbeitet die Anfrage und gibt Daten zurück | Gerät beginnt zu arbeiten |
| **Antwort** | Client empfängt und verarbeitet das zurückgegebene Ergebnis | Glühbirne leuchtet |

### 2.2 Restaurant-Analogie

| Restaurant-Rolle | API-Entsprechung | Beschreibung |
| :--- | :--- | :--- |
| **Speisekarte** | API-Dokumentation | Sagt dir, welche "Gerichte" bestellt werden können |
| **Kellner** | HTTP-Protokoll | Standardisierte "Kommunikationsweise" |
| **Küche** | Server | Verarbeitet "Bestellungen" |
| **Servieren** | Antwort | Liefert das Ergebnis an den "Gast" |

---

## 3. HTTP-Methoden: Fragst du oder tust du

Beim Aufrufen einer Web-API musst du dem Server mitteilen, was du tun möchtest. Dafür gibt es HTTP-Methoden.

### 3.1 Mit der Restaurantbestellung verstehen

| Szenario | Was würdest du in der Realität sagen? | Entsprechende HTTP-Methode |
| :--- | :--- | :--- |
| Du möchtest wissen, was es heute gibt | "Kellner, bringen Sie mir die Speisekarte" | **GET** - Nur "fragen", keine Daten ändern |
| Du möchtest Kung Pao Huhn bestellen | "Ich hätte gerne Kung Pao Huhn" | **POST** - Etwas "tun", Daten erstellen |
| Du möchtest ein Gericht ändern | "Bitte das Kung Pao Huhn durch Süß-Sauer Fisch ersetzen" | **PUT** - Daten ersetzen |
| Du möchtest den Geschmack ändern | "Kung Pao Huhn bitte ohne Erdnüsse" | **PATCH** - Teilweise Änderung |
| Du möchtest es nicht mehr | "Lassen Sie das Gericht weg" | **DELETE** - Daten löschen |

<HttpMethodsDemo />

::: warning Zur Idempotenz
**Idempotenz**: Führt mehrmalige Ausführung zum gleichen Ergebnis?

- **Idempotente Operationen** (GET/PUT/DELETE): 10 Mal klicken hat das gleiche Ergebnis wie 1 Mal
- **Nicht-idempotente Operationen** (POST): 10 Mal klicken kann 10 Bestellungen erstellen

**Lösung**: POST-Operationen mit eindeutiger ID überprüfen, um doppelte Verarbeitung zu vermeiden.
:::

### 3.2 HTTP-Methoden-Schnellreferenz

| Methode | Zweck | Idempotenz | Sicherheit | Typische Szenarien |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Ressource abrufen | Ja | Ja | Listen abfragen, Details anzeigen |
| **POST** | Ressource erstellen | Nein | Nein | Neuen Benutzer anlegen, Bestellung aufgeben |
| **PUT** | Vollständige Aktualisierung | Ja | Nein | Gesamte Benutzerdaten ersetzen |
| **PATCH** | Teilaktualisierung | Nein | Nein | Nur den Spitznamen ändern |
| **DELETE** | Ressource löschen | Ja | Nein | Benutzer löschen, Bestellung stornieren |

---

## 4. HTTP-Statuscodes: Überblick über dir der Server mitteilt

Wenn der Server antwortet, gibt er zuerst einen Statuscode zurück, der dir mitteilt, ob die Anfrage erfolgreich war.

### 4.1 Statuscode-Kategorien

<StatusCodeCategories />

### 4.2 Häufige Statuscodes im Detail

| Statuscode | Bedeutung | Typisches Szenario | Client-Behandlung |
| :--- | :--- | :--- | :--- |
| **200 OK** | Erfolg | Anfrage erfolgreich verarbeitet | Daten anzeigen |
| **201 Created** | Erstellt | POST-Anfrage hat Ressource erfolgreich erstellt | Zur neuen Ressource navigieren |
| **400 Bad Request** | Anfrageformat fehlerhaft | Parameter fehlen oder Format falsch | Parameter überprüfen |
| **401 Unauthorized** | Nicht authentifiziert | Kein gültiger API-Key bereitgestellt | Benutzer zur Anmeldung auffordern |
| **403 Forbidden** | Keine Berechtigung | API-Key hat keine Zugriffsberechtigung auf diese Ressource | Auf unzureichende Berechtigungen hinweisen |
| **404 Not Found** | Nicht vorhanden | Angeforderte Adresse oder Ressource existiert nicht | URL überprüfen |
| **429 Too Many Requests** | Zu viele Anfragen | Ratenlimit überschritten | Später erneut versuchen |
| **500 Internal Server Error** | Serverfehler | Serverseitiges Problem | Benutzer auffordern, es später erneut zu versuchen |

👇 **Probier es aus**: Klicke auf die Schaltfläche unten, um die Bedeutung häufiger Statuscodes zu verstehen:

<StatusCodeDemo />

---

## 5. HTTP vs SDK: Selbst erledigen oder den Butler schicken

### 5.1 Vergleich der beiden Aufrufmethoden

| | 🏃 **HTTP-API** | 🤵 **SDK** |
| :--- | :--- | :--- |
| **Analogie** | Selbst erledigen | Butler erledigt es |
| **Vorteile** | ✓ Von allen Sprachen nutzbar<br>✓ Vollständige Kontrolle über Anfragedetails<br>✓ Keine zusätzlichen Abhängigkeiten | ✓ Code ist prägnant und lesbar<br>✓ Automatische Authentifizierungsverarbeitung<br>✓ Eingebaute Fehler-Wiederholung |
| **Nachteile** | ✗ Alle Details selbst behandeln<br>✗ Code ist lang und fehleranfällig | ✗ Abhängigkeit muss installiert werden<br>✗ Mögliche Versionsprobleme |
| **Code-Beispiel** | `requests.post(url, json=..., headers={...})` | `client.chat.completions.create(...)` |

### 5.2 Wie wählen

| Szenario | Empfohlene Methode | Grund |
| :--- | :--- | :--- |
| **Schnelle Entwicklung** | SDK | Automatische Authentifizierung, Fehlerbehandlung, Wiederholung |
| **Prinzipien lernen** | HTTP | Zugrundeliegende Mechanismen verstehen |
| **Nicht unterstützte Sprache** | HTTP | Von jeder Sprache nutzbar |
| **Anpassung erforderlich** | HTTP | Flexible Kontrolle über jedes Detail |

::: tip 💡 Empfehlung
**SDK verwenden, wenn möglich**, die lästigen Aufgaben der Bibliothek überlassen und die Zeit für sich selbst nutzen.
:::

---

## 6. Wie liest man API-Dokumentation

API-Dokumentation ist wie eine Kombination aus Bedienungsanleitung und Speisekarte. Du musst sie nicht von vorne bis hinten lesen, sondern nur lernen, "im Wörterbuch nachzuschlagen".

### 6.1 Checkliste für die Dokumentation

Öffne eine beliebige API-Dokumentation (z.B. OpenAI oder DeepSeek) und suche nur nach diesen Dingen:

<ApiDocumentDemo />

| Element | Beschreibung | Beispiel |
| :--- | :--- | :--- |
| **Base URL** | Die Stammadresse der API | `https://api.deepseek.com` |
| **Authentication** | Wie man seine Identität nachweist | `Authorization: Bearer sk-xxx` |
| **Endpoints** | Die konkrete Liste der Schnittstellen | `/v1/chat/completions` |
| **Parameters** | Pflicht-/Optionale Parameter | `model` (Pflicht), `temperature` (Optional) |
| **Response** | Rückgabedatenstruktur | `{"choices": [...]}` |

### 6.2 Schritte zum Lesen der Dokumentation

1. **Base URL finden** - Das ist das Präfix für alle Anfragen
2. **Authentifizierungsmethode verstehen** - API-Key im Header oder Query?
3. **Benötigten Endpoint finden** - Die konkrete Schnittstelle, die du aufrufen möchtest
4. **Anfrageparameter prüfen** - Welche sind Pflicht? Welche optional?
5. **Rückgabeformat verstehen** - Wie sind die Daten organisiert?

---

## 7. Praxisübung: API-Aufruf simulieren

Reden allein hilft nicht. Hier ist eine simulierte API, bei der du Parameter und Adresse frei ausfüllen und ändern kannst, um zu sehen, was passiert.

<ApiPlayground />

Versuche, folgende Szenarien auszulösen:
- ✅ **Erfolgreiche Anfrage**: Korrekten Endpoint und API-Key eingeben
- ❌ **401-Fehler**: Keinen API-Key eingeben und sehen, wie der Server dich abweist
- ❌ **404-Fehler**: Eine nicht existierende Adresse eingeben

---

## 8. Zusammenfassung

::: info Kernpunkte
1. **API ist ein Sprachrohr**, das deine Worte an einen anderen Codeabschnitt oder Remote-Server weitergibt
2. **Du hast schon längst APIs verwendet**, von `len()` bis `open()` sind alles APIs
3. **Web-APIs sind Superkräfte**, die dich Supercomputer Tausende von Kilometern entfernt aufrufen lassen
4. **SDKs sind gute Butler**, wenn du ein SDK verwenden kannst, erledige die Aufgaben nicht selbst
5. **Bei der Dokumentation drei Dinge suchen**: Adresse, Authentifizierung, Parameter
:::

Im Zeitalter der KI-Programmierung musst du dir nur diese wenigen Kernkonzepte merken. Die restlichen Details werden von IDE und KI-Assistenten für dich erledigt.

---

## Glossar

| Begriff | Vollständige Bezeichnung | Erklärung |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Schnittstelle zur Anwendungsprogrammierung, definiert, wie Software miteinander interagiert |
| **Web-API** | - | Auf dem HTTP-Protokoll basierende API für die Netzwerkkommunikation |
| **Endpoint** | - | Endpunkt, die konkrete Adresse einer API |
| **HTTP** | HyperText Transfer Protocol | Das von Web-APIs verwendete Kommunikationsprotokoll |
| **GET** | - | Methode zum Abrufen von Ressourcen |
| **POST** | - | Methode zum Übermitteln von Daten |
| **SDK** | Software Development Kit | Software-Entwicklungskit, kapselt Low-Level-API-Aufrufe |
| **URL** | Uniform Resource Locator | Netzwerkadresse einer API |
| **JSON** | JavaScript Object Notation | Häufig verwendetes Datenformat |
| **Authentication** | - | Prozess der Identitätsüberprüfung |
| **Status Code** | - | Statuscode in einer HTTP-Antwort |
| **Request** | - | Anfrage |
| **Response** | - | Antwort |
| **Header** | - | HTTP-Header, enthält Metainformationen |
| **Payload** | - | Die tatsächlichen Daten einer Anfrage oder Antwort |
| **Rate Limit** | - | Ratenbegrenzung |
| **Idempotent** | - | Idempotenz, mehrmalige Ausführung führt zum gleichen Ergebnis |
| **REST** | Representational State Transfer | Ein API-Architekturstil |
| **RPC** | Remote Procedure Call | Entfernter Prozeduraufruf |
| **GraphQL** | - | Eine Abfragesprache-API |
| **gRPC** | - | Ein von Google entwickeltes Hochleistungs-RPC-Framework |
