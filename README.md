# monorepo

- Zum Starten der Umgebung muss hains_docker gestartet sein (dadurch ist die Datenbank erreichbar).
- Es braucht eine ./my_workspace/.env.
  - Diese enthält die Datenbank-Verbindung:
    DATABASE_URL="postgresql://USER:PW@host.docker.internal:5444/DB_NAME?schema=public"
  - USER, PW und DB_NAME entsprechend ersetzen!

### Befehle:

Innerhalb des hains_monorepo Containers ausführen!

- Library erstellen:
  `npx nx g @nx/next:lib libs/ui`[^1]
- Komponente der Bibliothek erstellen erstellen:
  `npx nx g @nx/next:component button --project=ui`
- Entfernen der Library:
  `npx nx g @nx/workspace:remove ui (--dry-run)`[^1]
- Next.js Page erstellen:
  `npx nx g @nx/next:page apps/hains/pages/my-new-page`
- Next.js Komponente erstellen:
  `npx nx g @nx/next:component apps/hains/components/my-new-component`

[^1]: Beispiel für die UI Bibliothek.
