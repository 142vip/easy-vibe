---
title: 'Plattform-, Pixel- und 3D-Spiele mit Godot bauen'
description: 'Godot anhand drei tatsächlich ausgeführter Prototypen und veröffentlichter Spiele lernen.'
---

# Plattform-, Pixel- und 3D-Spiele mit Godot bauen

Godot ist eine freie Open-Source-Engine für Szenen, Physik, Animation, Audio, Skripte und Export. Hier werden keine drei fertigen Spiele vorgetäuscht, sondern ein 2D-Plattformer, eine Pixel-Sammelschleife und ein 3D-Greybox ausgeführt.

## 1. Vier Grundbegriffe

Ein Node hat eine Aufgabe, eine Scene ist ein wiederverwendbarer Node-Baum, ein Script gibt Verhalten und GDScript ist Godots wichtigste Skriptsprache.

![Godot-Editor](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-editor-platformer.png)

## 2. 2D-Plattformer

Primal Light zeigt Plattformen, Gefahr und Ziel gut lesbar.

![Primal Light](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-primal-light.webp)

> Erstelle mit einfachen Formen Spieler, Boden, drei Plattformen und ein sichtbares Ziel.

> Ergänze Links/Rechts und Sprung, aber keinen zweiten Sprung in der Luft.

![Skyline Courier](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-platformer.png)

## 3. Pixel-Sammelschleife

Dome Keeper ordnet Ressourcen und Ziel auf kleinem Raum.

![Dome Keeper](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-dome-keeper.webp)

> Erstelle eine 320 × 180 große Szene mit Spieler, Wald, drei Sammelobjekten und Zähler.

![Lantern Woods](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-pixel.png)

Ganzzahlige Skalierung verhindert unscharfe Pixel.

## 4. 3D-Greybox

Wrought Flesh ist eine Referenz für Raumform, Licht und Führung. Eine Greybox prüft Maßstab und Bewegung mit Kästen vor den endgültigen Modellen.

![Wrought Flesh](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-wrought-flesh.webp)

> Erstelle eine kleine 3D-Greybox mit Boden, Wänden, Spieler, Kamera und leuchtendem Ausgang.

![Signal Garden](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-3d.png)

## 5. Immer nur eine Änderung

> Ergänze nur Bewegung und ändere das Level nicht.

> Behebe ausschließlich diesen Fehler: 【Fehler einfügen】 und nenne den Wiederholungstest.

## 6. Export ist ein eigener Schritt

Installiere passende Export Templates und erstelle ein Preset. Desktop wird auf einem Rechner ohne Godot, Web über Server oder HTTPS, Android/iOS mit SDK, Signierung und Gerät geprüft.

Die drei Prototypen liefen mit Godot 4.7.1 auf macOS. Windows-, Linux-, Web-, Android-, iOS- und Konsolenexport gelten nicht als abgeschlossen.
