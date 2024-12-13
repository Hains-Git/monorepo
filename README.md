# monorepo

- Zum Starten der Umgebung muss hains_docker gestartet sein (dadurch ist die Datenbank erreichbar).
- Es braucht eine ./my_workspace/.env.
  - Diese enthält die Datenbank-Verbindung:
    DATABASE_URL="postgresql://USER:PW@postgres:5432/DB_NAME?schema=public"
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

### Create new app.

- `npx nx g @nx/nest:app --dry-run`
  -> Which directory do you want to create the application in? · apps/apiv2
  > Important here is, to specify the apiv2, that is the new folder which would be created.

[^1]: Beispiel für die UI Bibliothek.

[^2]: Beispiel für die Prisma Bibliothek

# Prisma

## Prisma Schema

- changing schema and adding just relations no need for migration.
- just run `npx prisma generate` or docker restart

### Prisma pull DB

- `npx prisma db pull`

  > Jedoch sollte im prisma ordner zuerst die Datei schem.prisma erstellt sein mit folgendem Content.

  ```prisma
  generator client {
  provider = "prisma-client-js"
  }

  datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  }
  ```

- Dann in den Container den Befehl ausfuehren `npx prisma db pull`

### Prisma Migrations

- `prisma migrate dev --name bigint_to_int`
  > LOESCHT DIE DATEN IN DER DATENBANK!!! DANGER!!!

### Migration richtig ausfuehren!!:

> Info Bei jeder Migration die 0 => 1,2,3,4,.. hoch zaehlen!

- `mkdir -p prisma/migrations/0_init`
- `npx prisma migrate diff \
--from-empty \
--to-schema-datamodel prisma/schema.prisma \
--script > prisma/migrations/0_init/migration.sql`
- Im docker container run `npx prisma migrate resolve --applied 0_init`


## Mastering Prisma Migrations

- https://www.youtube.com/watch?v=_-YCDwm9M7M
