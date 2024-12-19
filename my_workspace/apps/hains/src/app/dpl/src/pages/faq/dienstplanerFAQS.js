export const dienstplanerFAQS = [
  {
    question: "Wieso werden mir bei einigen Diensten im Dienstplaner keine Mitarbeiter vorgeschlagen?",
    answer:
      "Je nach Rolle (Urlaubsplaner oder Dienstplaner) sind die Eingabemöglichkeiten beschränkt.\n"
      + "Urlaubsplaner können nur sogenannte frei eintragbare Dienste (z.B. Urlaub) eintragen und bekommen dementsprechende Dienste, Einteilungen und Mitarbeiter freigegeben.\n"
      + "Dienstplaner können nur Mitarbeiter bestimmter Teams planen und bekommen dementsprechende Mitarbeiter, Einteilungen und Dienste freigegeben.\n"
  },
  {
    question: "Wieso werden Mitarbeiter in der Auswahl des Dienstplaners nicht angezeigt?",
    answer:
      "Hierbei sind unterschiedliche Möglichkeiten zu unterscheiden:\n"
      + "1. Mitarbeiter sind inaktiv.\n"
      + "2. Mitarbeiter sind nicht Teil des Vorlage-Teams (Dann kann man sie unter dem Filter Alle finden)\n"
      + "3. Mitarbeiter haben eine andere Funktion als in der Vorlage erwartet wird\n"
      + "4. Mitarbeiter gehören zu einem Team, für welches die Dienstplaner keine Berechtigung haben\n"
      + "5. Mitarbeiter passen nicht zum angegeben Filter\n"
      + "Zur Lösung des Problems kann man:\n"
      + "- benutzerdefinierte Filter erstellen\n"
      + "- in der Rotationsplanung die Teamzugehörigkeit der Mitarbeiter ansehen\n"
      + "- sich ggf. über seine eigene Berechtigungen als Dienstplaner informieren"
  },
  {
    question: "Wieso fehlen im Dienstplaner die Einträge aus letztem Monat?",
    answer:
      "Nach dem ein Dienstplan für einen Monat erstellt wurde, muss dieser aktuell noch in Josti "
      + "übertragen werden. Gelegentlich kann es sein, dass dieser Schritt übersprungen wurde. "
      + "Zur Lösung dieses Problems wende dich bitte an Herr Lichtenstern oder das HAINS Team, damit der Dienstplan von letztem Monat übertragen wird."
  },
  {
    question: "Wieso kann ich für einen Dienst im Dienstplaner keine Einträge machen?",
    answer:
      "Es kann unterschiedliche Fehlerursachen haben:\n"
      + "1. Es ist ein Dienst, zu dem ein Bedarf gehören sollte, welcher jedoch fehlt. Dann muss der Dienstbedarf angepasst/erstellt werden\n"
      + "2. Dienste gehören zu bestimmten Teams und als Dienstplaner fehlt dir die Berechtigung für dieses Team"
  },
  {
    question: "Wieso werden im Dienstplaner plötzich Konflikte angezeigt, die letztes Mal nicht da waren?",
    answer:
      "Andere Dienstplaner oder Urlaubsplaner könnten die Mitarbeiter über Josti oder den Dienstplaner "
      + "zu weiteren Diensten eingetragen haben."
  },
  {
    question: "Wofür brauche ich eine Vorlage im Dienstplaner?",
    answer:
      "Mit der Vorlage kannst du die Arbeit beschleunigen. Dazu können Mitarbeiter und Dienste nach Teams und Funktionen vorgefiltert werden. "
      + "Damit erhälst du eine kleinere Tabelle, für welche die Daten schneller geladen werden können und entlastest deinen Browser. "
  },
  {
    question: "Was macht die Führung im Dienstplaner?",
    answer:
      "Die Führung durchsucht die Dienstplan-Tabelle nach Feldern mit den wenigsten Auswahlmöglichkeiten."
  },
  {
    question: "Wieso läuft bei meinem Dienstplaner alles so langsam?",
    answer:
      "Dies kann entweder daran liegen, dass du sehr viele Mitarbeiter und Dienste in der Tabelle betrachtest. "
      + "Dann kann man das durch geeignete Vorlagen mit weniger Diensten verbessern. "
      + "Oder du benutzt einen veralteten oder ungeeigneten Browser. Mit einem aktuellen Mozilla Firefox oder Chrome Browser sollte die Planung "
      + "etwas schneller gehen."
  },
  {
    question: "Wieso habe ich ein ganz ungewöhnliches Layout?",
    answer:
      "Dies könnte passieren, wenn ein Browser getestet wurde, auf den das System nicht ausgelegt wurde. "
      + "Wir versuchen möglichst viele Browser zu unterstützen doch werden bestimmte Funktionen nicht von allen Browsern unterstützt bzw. "
      + "nur zum Teil unterstützt und führen somit zu einem ungewöhlichen Layout oder auch Verlust ganzer Funktionen."
      + "Beispielsweise scheint ein Safari Browser deutlich langsamer auf unser Programm zu reagieren als ein moderner Firefox oder Chrome Browser."
      + "Wir empfehlen einen modernen Firefox oder Chrome Brwoser, da diese die typischen Webstandards am ehesten und vollständigsten unterstützen."
  },
  {
    question: "Warum zeigt meine Dienstplaner-Statistik zu wenig Mitarbeiter?",
    answer:
      "Die Statistik wird anhand deiner Vorlage vorgefiltert. Falls Mitarbeiter fehlen, "
      + "kann der Filter entsprechend umgestaltet werden oder es können alle Filtereinstellungen abgeschaltet werden."
      + "Damit sollten alle Mitarbeiter angezeigt werden können."
  },
  {
    question: "Wie finde ich in der Dienstplaner-Statistik bestimmte Mitarbeiter?",
    answer:
      "Das Diagramm lässt sich alphabetisch sortieren. "
      + "Dann müssen nur noch die Balken unterhalb des Diagramms so verschoben werden, dass "
      + "gesuchte Mitarbeiter sich in dem Intervall befinden."
  },
  {
    question: "Wie kann ich Dienste und Wünsche im Dienstplaner farblich gruppieren?",
    answer:
      "Im Tabellen-Menü bei der Dienste einteilen-Ansicht kann man unter dem Menüpunkt Farben mehrere Farbgruppen erstellen. "
      + "Diese sind sitzungsbezogen und müssen nach jedem Neuladen erneut erstellt werden. "
      + "Hierbei kann man für jede Farbgruppe verschiedene Dienste und Wünsche auswählen. "
      + "Möchte man z.B. als Dienstplaner/in eine Gesamtübersicht von den anfangs verteilten Wünschen und Abwesenheiten haben, "
      + "so kann man diese Tabelle mit den Farbgruppen zusammen als PDF-Exportieren und muss die Farbgruppen nicht bei jedem Neuladen erneut erstellen."
  },
  {
    question: "Wie kann ich Konflikte im Dienstplaner ein- bzw. ausblenden?",
    answer:
    "Konflikte können im Tabellen-Menü über den Menüpunkt Konflikte ein- und ausgeblendet werden. "
    + "Dadurch werden die Konflikte in der Dienstplan-Tabelle nicht mehr farblich gekennzeichnet, jedoch lassen sich "
    + "die Informationen zu den Konflikten noch anzeigen, wenn man mit der Maus auf ein Feld mit Konflikten zeigt."
  },
  {
    question: "Wie kann ich die Dienste einteilen-Ansicht des Dienstplaners filtern?",
    answer:
    "Unter dem Tabellen-Menü kann man mit Hilfe des Menüpunktes Filter, die Tabelle nach unterschiedlichen Eigenschaften filtern."
  },
  {
    question: "Wie kann ich eigene Filter in der Mitarbeiter- bzw. Dienstauswahl des Dienstplaners erstellen?",
    answer:
    "In dem Fenster für die Auswahl zu einem bestimmten Feld, lassen sich die Vorschläge über den benutzerdefinierten Filter filtern. "
    + "Dieser Filter kann für eine Sitzung gespeichert werden, sodass er für mehrere Felder zur Verfügung steht. "
    + "Der Filter bezieht sich nur auf eine der Tabellen-Ansichten und funktioniert vorlageübergreifend."
  },
  {
    question: "Kann man nach einer Einteilung durch das Auswahl-Fenster im Dienstplaner automatisch zu einem anderen Feld springen?",
    answer:
    "Im Auswahl-Fenster für Einteilungen lässt sich die Möglichkeit einstellen, dass nach Auswahl einer Mitarbeiterin oder eines Dienstes, "
    + "automatisch in das nächste Feld gesprungen wird. Hierbei lässt sich auswählen, ob es das nächste linke, rechte, obere oder untere Feld ist oder "
    + "ggf. das Springen auch ganz unterbinden. Ist das Springen aktiviert, so wird nach jeder Auswahl die Suchleiste im Auswahl-Fenster geleert."
  },
  {
    question: "Wie können im Dienstplaner eigene Zeilen bzw. Spalten erstellt werden?",
    answer:
    "Im Tabellen-Menü unter dem Menüpunkt Zeilen bzw. Spalten, lassen sich neue Zeilen bzw. Spalten hinzufügen. "
    + "Diese Spalten und Zeilen sind benutzer- und vorlagebezogen, d.h. sie gelten nur für eine bestimmte Vorlage der jeweiligen Ersteller. "
    + "Beim Klick auf das + wird nach einem Namen für die Zeile bzw. Spalte gefragt. "
    + "Dabei werden Zeilen und Spalten im fixen Tabellenbereich angehängt. "
    + "Zeilen und Spalten können nur für eigene oder öffentliche Vorlagen erstellt werden, nicht für die Vorlagen Dienste mit Bedarf, Dienste ohne Bedarf, Alle Dienste. "
  },
  {
    question: "Wie können hinzugefügte Spalten bzw. Zeilen bearbeitet werden?",
    answer:
    "Zum Bearbeiten einer benutzerdefinierten Zeile bzw. Spalten kann man mit dem Doppelklick auf eines der Felder ein Menü-Fenster öffnen. "
    + "Darüber kann man eigene Zähler für die Tabelle definieren. Es können darüber Einteilungen oder die Arbeitszeit betrachtet werden. "
    + "Dabei können den Zählern Namen zur Unterscheidung mitgeben werden und Beschreibungen, damit man weiß, was gezählt wird."
    + "Die Zähler sind monatsübergreifend definiert, sodass die ausgewählten Tage auf die Tage des angezeigten Monats umgerechnet werden."
    + "Die Zähler können unterschiedlichen Kategorien angehören: \n"
    + "1. Zeile bzw. Spalte\n"
    + "Diese Zähler beziehen sich auf eine komplette Spalte bzw. Zeile. über die Auswahl von Mitarbeitern, Diensten oder Tagen, kann die Anzahl der Einteilungen "
    + "für komplette Zeilen bzw. Spalten angezeigt werden. Hierbei wird z.B in der Dienste einteilen-Ansicht entweder für jeden gewählten Tag oder für alle gewählten "
    + "Mitarbeiter jeweils eine Zeile bzw. Spalte gezählt, wobei beim Zählen die ausgewählten Eigenschaften berücksichtigt werden also z.B. welche Dienst-Einteilungen gezählt werden sollen.\n"
    + "2. Benutzerdefiniert\n"
    + "Hierbei werden in einem Feld alle Einteilungen bzw. Arbeitszeiten, auf die die gewählten Eigenschaften Mitarbeiter, Dienste, Tag zutreffen gezählt.\n"
    + "3. Summe\n"
    + "Mit diesem Zähler lassen sich unterschiedliche angelegte Zähler wiederum zusammenzählen. "
    + "Wurde zum Beispiel ein benutzerdefinierter-Zähler erstellt, der für jeden Montag alle Einteilungen aller Mitarbeiter in alle Dienste zählt und "
    + "ein Zähler für jeden Dienstag, "
    + "so kann man sich über den Summe-Zähler die Summe beider Zähler ausgeben. \n"
    + "Weiterhin lassen sich Farbregeln angeben, durch welche die Zähler je nach Wert ihre Farbe wechseln. Hierbei ist zu beachten, dass die erste zutreffende Regeln die Farbe bestimmt."
  },
  {
    question: "Navigation in der Dienstplan-Tabelle?",
    answer:
    "Es kann durch mit den Pfeil-Tasten nach oben/unten/links/rechts navigiert werden. "
    + "Durch Enter wird das nächste untere Feld fokussiert und durch Tab das nächste rechte Feld."
  },
  {
    question: "Wie lassen sich Vorlagen auf HAINS veröffentlichen?",
    answer:
    "Veröffentlichen lassen sich nur öffentliche Vorlagen, die zur Veröffentlichung gedacht sind. "
    + "Diese können von Administratoren angelegt werden und von allen Dienstplanern mit entsprechenden Berechtigungen genutzt werden. "
    + "Bei der Veröffentlichung kann ggf. nur eine der Ansichten aus der Dienstplan-Tabelle veröffentlicht werden. "
    + "Weiterhin wird die PDF anhand deinem persönlichen Standard-Filter veröffentlicht,, somit werden ggf. nicht alle deine angezeigten Zeilen / Spalten veröffentlicht, "
    + "du den Filter verändert hast."
  },
  {
    question: "Woran erkenne ich unbesetzte Bedarfe im Dienstplaner?",
    answer:
    "In den Spaltenköpfen steht unterhalb des Spaltentitels eine Zahl. "
    + "Diese gibt den Bedarf für die entsprechende Spalte an. Wenn alle Bedarfe ausgefüllt wurden, verschwindet diese Zahl."
  }
];
