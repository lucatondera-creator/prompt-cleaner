# prompt-aufraeumer

Ein Mod für Claude Code, gedacht für alle, die per Speech-to-Text mit Claude reden. Sobald der Entwurf im Eingabefeld mindestens `schwelle` Zeichen hat (Standard 200) und nicht mit `/` beginnt, erscheint über der Eingabeleiste ein Band mit dem Button **Aufräumen**. Ein Klick schickt den Entwurf an ein Modell (Standard `sonnet`) und ersetzt ihn durch eine strukturierte Fassung mit den Abschnitten Ziel, Kontext, Aufgaben, Randbedingungen und Unklar / Widersprüchlich. Danach bietet das Band **Original zurück** und **Behalten** an. Gesendet wird nie automatisch.

Das Modell soll nichts erfinden und nichts weglassen. Widersprüche und vermutlich falsch erkannte Wörter löst es nicht selbst auf, sondern listet sie unter „Unklar / Widersprüchlich“ (außer bei einer eindeutigen späteren Selbstkorrektur). Lies die Fassung trotzdem vor dem Senden.

## Installation

Im Terminal, in einer Claude-Code-Sitzung:

```
/plugin install prompt-aufraeumer --marketplace lucatondera-creator/prompt-cleaner
```

Danach `y`, um den Marketplace hinzuzufügen, und einen Scope wählen (User = in allen Sitzungen).

In der Desktop-App: auf **+** neben dem Eingabefeld, dann **Plugins**, **Add marketplace** mit `lucatondera-creator/prompt-cleaner`, dann **Add plugin**.

## Einstellungen

Über `/config`:
- `schwelle`: ab wie vielen Zeichen das Band erscheint (Standard 200)
- `modell`: Alias oder Modell-ID fürs Aufräumen (Standard `sonnet`)

## Wo es funktioniert

- **Lokale** Claude-Code-Sitzung im Terminal: ja.
- Desktop-App mit lokalem Ordner: vorgesehen, noch nicht live geprüft.
- **Cloud-Sitzungen** (claude.ai/code, Cloud-Umgebung in der App), Browser, Handy, VS Code: nein. Dort gehört das Eingabefeld der App, und der Mod sieht den Entwurf erst beim Senden.

Jeder Klick auf „Aufräumen“ ist ein Modellaufruf auf dem Konto der Sitzung.
