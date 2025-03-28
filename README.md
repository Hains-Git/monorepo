# monorepo

- Zum Starten der Umgebung muss hains_docker gestartet sein (dadurch ist die Datenbank erreichbar).
- Es braucht eine ./my_workspace/.env.
  - Diese enthält die Datenbank-Verbindung:
    DATABASE_URL=postgresql://USER:PW@postgres:5432/DB_NAME?schema=public
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
  `npx nx g @nx/workspace:remove ui --dry-run`[^1]
- Next.js Page erstellen:
  `npx nx g @nx/next:page apps/hains/pages/my-new-page`
- Next.js Komponente erstellen:
  `npx nx g @nx/next:component apps/hains/components/my-new-component`
- Test mit NX aufrufen, Beispielaufruf Tests der prisma_cruds-Library:
  `npx nx test prisma_cruds (teams.spec.ts) (--coverage)`

### Create new app.

- `npx nx g @nx/nest:app --dry-run`
  -> Which directory do you want to create the application in? · apps/apiv2
  > Important here is, to specify the apiv2, that is the new folder which would be created.

[^1]: Beispiel für die UI Bibliothek.
[^2]: Beispiel für die Prisma Bibliothek

# Prisma

### Mastering Prisma Migrations from start

- https://www.youtube.com/watch?v=_-YCDwm9M7M

Bei einer bestehenden Datenbank muss folgendes ausgefuehrt werden damit die migrations durchgehen.

1.  `npx prisma db pull`
    > pulled das schema der Datenbank und fuegt es in die prisma.schema ein.
    > Wichtig dabei ist es, das diese Datei vorhanden ist mit folgendem content:

```prisma
generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
}
```

2. Es muss eine Migration angelegt werden, die jedoch nicht ausgefuehrt wird, damit die history der migrations passt.
   > Wichtig keine Änderungen an dem schema durchführen!

- `mkdir -p prisma/migrations/0_init`
- `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql`
- `npx prisma migrate resolve --applied 0_init`
- `npx prisma db push`

3. BigInt zu Int ändern.

> [!IMPORTANT]
> byte_size, einsatznummer -> Bleibt bei BigInt

4. Danach sollten Aenderungen am schema moeglich sein.

- Schema anpassen
- Tasks ausfuehren -> format, validate und generate.
- Migration erstellen: -> `npm run migration:create`
  Es wird eine Migration unter prisma/migrations/datum_name/migration.sql
  sql kann ueberprueft werden und dnach ausgefuehrt werden.
  In der SQL können die SERIAL durch INTEGER verändert werden.
- Migration ausfuehren: -> `npm run migrate`

`npx prisma format` -> Formatiert die Datei
`npx prisma validate` -> Validiert die Datei auf moegliche Fehler.
`npx prisma generate` -> Generient den client, damit man die Modelle in typesript vorhanden sind.

Production:
Falls bei `npm run migrate:prod` folgender Fehler auftritt:

> [!WARNING]
> The database schema is not empty. Read more about how to baseline an existing production database: https://pris.ly/d/migrate-baseline

Dann erst `npx prisma migrate resolve --applied 0_init` ausführen und anschließend `npm run migrate:prod`

> [!WARNING]
> Wenn der Datentyp SERIAL erzeugt wird, kann dieser falls es eine existente Tabelle ist ggf. einfach zu INTEGER geändert werden.
> Dazu kann in der Datenbank unter sequences überprüft werden ob die passende SEQUENCE schon existiert.
> Ansonsten sollte folgender Code genutzt werden:

```SQL
CREATE SEQUENCE "abwesentheitenueberblick_counters_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "abwesentheitenueberblick_counters" DROP CONSTRAINT "abwesentheitenueberblick_counters_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER, -- SERIAL -> INTEGER
...
ADD CONSTRAINT "abwesentheitenueberblick_counters_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE "abwesentheitenueberblick_counters_id_sq" OWNED BY "abwesentheitenueberblick_counters"."id";
```

### Initialization Prisma for existing Migrations

Für die erste Initialisierung wird wie folgt vorgegangen:

- `npx prisma migrate resolve --applied 0_init`
- Ggf. Datenbank Duplikate entfernen:
  - mitarbeiter_id 33 in AccountInfos -> 147 kann gelöscht werden
  - account_info_id 731 in Users -> user: 654 account_info_id zu 643 ändern
  - user_id 171 in AccountInfos -> Accountinfo löschen
  - user_id 195 in AccountInfos -> user 195 existiert nicht, user_id entfernen
- Falls `npm run migrate:prod` in entry.sh vorhanden
  - docker restart hains_monorepo
- ansonsten:
  - `npm run migrate:prod`

### Wichtige Hinweise zu Dates:

- Bei Raw-Queries ist es wichtig zu beachten, dass Dates auf den Datentyp Date gecastet werden.

```SQL
WHERE de.tag >= ${start}::Date AND de.tag <= ${ende}::Date
```
