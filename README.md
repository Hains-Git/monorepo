# monorepo

- Zum Starten der Umgebung muss hains_docker gestartet sein (dadurch ist die Datenbank erreichbar).
- Es braucht eine ./my_workspace/.env.
  - Diese enthält die Datenbank-Verbindung:
    DATABASE_URL="postgresql://USER:PW@host.docker.internal:5444/DB_NAME?schema=public"
  - USER, PW und DB_NAME entsprechend ersetzen!

### Befehle:

Innerhalb des hains_monorepo Containers ausführen!

- List nx Plugins:
  `npx nx list`
- Library erstellen:
  `npx nx g @nx/react:lib libs/ui`[^1]
  `npx nx g @nx/js:lib libs/prisma_hains`[^2]
  > Falls beim Import einer Komponente aus der Library ein Fehler angezeigt wird, dass die Komponente nicht gefunden wird. Kann ein Neustart des Containers helfen.
- Komponente der Bibliothek erstellen erstellen:
  `npx nx g @nx/react:component libs/ui/button/button --project=ui`
- Entfernen der Library:
  `npx nx g @nx/workspace:remove ui (--dry-run)`[^1]
- Next.js Page erstellen:
  `npx nx g @nx/next:page apps/hains/pages/my-new-page`
- Next.js Komponente erstellen:
  `npx nx g @nx/next:component apps/hains/components/my-new-component`

[^1]: Beispiel für die UI Bibliothek.
[^2]: Beispiel für die Prisma Bibliothek
