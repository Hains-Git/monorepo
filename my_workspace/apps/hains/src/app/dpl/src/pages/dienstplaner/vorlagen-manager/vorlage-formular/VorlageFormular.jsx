import React from 'react';
import DiensteContainer from '../formular-components/dienste-container/DiensteContainer';
import StandardSelectField from '../../../../components/utils/standard-select-field/StandardSelectField';
import FunktionenContainer from '../formular-components/funktionen-container/FunktionenContainer';
import CheckboxContainer from '../formular-components/checkbox-container/CheckboxContainer';
import WeitereDienste from '../formular-components/dienste-container/WeitereDienste';
import styles from '../vorlagen_manager.module.css';

function VorlageFormular({
  user,
  dienstplan,
  name,
  id,
  abbrechen,
  alleDiensteAuswaehlen,
  alleDiensteAbwaehlen,
  alleFunktionenAuswaehlen,
  alleFunktionenAbwaehlen,
  handleChangeName,
  handleSpeichern,
  handleAbbrechen,
  handleTeamWaehlen,
  team,
  startTeam,
  handleAnsichtWaehlen,
  ansicht,
  pfad,
  handlePfadWaehlen,
  isPublic,
  handlePublish,
  handleIsPublic,
  publish,
  isPublishable,
  renderFunktionen,
  renderDiensteContainer,
  renderExtraDienste,
  alleExtraDiensteAbwaehlen,
  alleExtraDiensteAuswaehlen,
  position,
  handlePosition
}) {
  return (
    <div>
      <div className={styles.vorlage_form_name_container}>
        {id > 0 ? <p>{`ID: ${id}`}</p> : <p>Neue Vorlage</p>}
        <input
          className="name-input"
          type="text"
          id="vorlage-name"
          name="vorlage-name"
          placeholder="Wähle einen Namen"
          value={name}
          onChange={handleChangeName}
        />
        <label className={styles.position}>
          Position:{' '}
          <input
            type="number"
            step={1}
            min={0}
            value={position}
            onChange={handlePosition}
          />
        </label>
      </div>

      <div>
        {user.isAdmin && (
          <div className="vorlage-default-container">
            <CheckboxContainer
              containerClass="vorlage-default-vorlage-checkbox-container"
              inputId="vorlage-default-vorlage"
              txt="Öffentliche Vorlage"
              title="Soll die Vorlage für alle Dienstplaner mit entsprechender Team-Berechtigung verfügbar sein?"
              value={isPublic}
              handleChange={handleIsPublic}
            />
            {dienstplan.ansichten.map(({ index, id, title }) => (
              <CheckboxContainer
                key={`vorlage-publishable-ansichten-${index}`}
                containerClass="vorlage-default-publish-ansicht"
                inputId={`vorlage-default-vorlage-ansicht${index}`}
                txt={`${id} veröffentlichen`}
                title={title}
                value={publish}
                callback={() => isPublishable(id)}
                handleChange={() => handlePublish(id)}
              />
            ))}
            <div className="vorlage-dienstplanpfade">
              <StandardSelectField
                name="Veröffentlichungspfad"
                options={dienstplan.dienstplanpfade}
                optionKey="name"
                itemHandler={handlePfadWaehlen}
                start={dienstplan.getStartDienstplanPfad(pfad)}
                readOnly
                title="Unter welchem Pfad sollen Dienstpläne veröffentlicht werden?"
              />
            </div>
            <div>
              <WeitereDienste
                renderDienste={renderExtraDienste}
                handleAllesAbwaehlen={alleExtraDiensteAbwaehlen}
                handleAllesAuswaehlen={alleExtraDiensteAuswaehlen}
                label="Zusatzdienste für die zu veröffentlichende PDF"
              />
            </div>
          </div>
        )}
        <hr />
      </div>

      <div className="vorlage-ansicht-auswahl">
        <StandardSelectField
          name="Dienstplan Startansicht"
          options={dienstplan.ansichten}
          optionKey="id"
          itemHandler={handleAnsichtWaehlen}
          start={ansicht}
          readOnly
          title="Welche Ansicht soll beim Aufruf des Plans angezeigt werden?"
        />
        <hr />
      </div>

      <FunktionenContainer
        handleAllesAuswaehlen={alleFunktionenAuswaehlen}
        handleAllesAbwaehlen={alleFunktionenAbwaehlen}
        renderFunktionen={renderFunktionen}
      />

      <div className="vorlage-team-auswahl">
        <StandardSelectField
          name="Dienste-Team"
          options={dienstplan._teamFilter}
          optionKey="name"
          itemHandler={handleTeamWaehlen}
          start={startTeam}
          readOnly
          title="Welches Team soll geplant werden?"
        />
      </div>

      <DiensteContainer
        renderDienste={renderDiensteContainer}
        abbrechen={abbrechen}
        handleAllesAuswaehlen={alleDiensteAuswaehlen}
        handleAllesAbwaehlen={alleDiensteAbwaehlen}
        handleSpeichern={handleSpeichern}
        handleAbbrechen={handleAbbrechen}
        team={team}
      />
    </div>
  );
}

export default VorlageFormular;
