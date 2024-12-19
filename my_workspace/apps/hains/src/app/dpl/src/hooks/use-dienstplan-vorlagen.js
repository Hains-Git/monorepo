import React, { useState } from 'react';
import AuswahlFeld from '../pages/dienstplaner/vorlagen-manager/formular-components/auswahl-feld/AuswahlFeld';
import VorlageFormular from '../pages/dienstplaner/vorlagen-manager/vorlage-formular/VorlageFormular';
import VorlagenVorschau from '../pages/dienstplaner/vorlagen-manager/vorlagen-vorschau/VorlagenVorschau';
import { returnError } from '../tools/hains';
import {
  hainsOAuth,
  numericLocaleCompare,
  setPageWarning
} from '../tools/helper';
import { UseMounted } from './use-mounted';
import { showConsole } from '../tools/flags';
import { UseRegister } from './use-register';

/**
 * Dieser Hook ermöglicht die Bearbeitung der Dienstplan-Vorlagen und stellt
 * die Funktionen zur Kommunikation mit der API zur Verfügung
 * @param {Object} dienstplan
 * @param {Object} user
 * @returns getVorschau, showFormular, getVorlageFormular
 */
export const UseDienstplanVorlagen = (dienstplan, user) => {
  const [name, setName] = useState('');
  const [auswahl, setAuswahl] = useState([]);
  const [extraDienste, setExtraDienste] = useState([]);
  const [funktionen, setFunktionen] = useState([]);
  const [showFormular, setShowFormular] = useState(false);
  const [id, setId] = useState(0);
  const [team, setTeam] = useState('');
  const [ansicht, setAnsicht] = useState(0);
  const [startTeam, setStartTeam] = useState(0);
  const [pfad, setPfad] = useState(0);
  const [isPublic, setIsPublic] = useState(false);
  const [publish, setPublish] = useState([]);
  const [position, setPosition] = useState(0);
  const mounted = UseMounted();
  UseRegister(user?._push, user?._pull, user);

  const defaultStates = {
    id: 0,
    name: '',
    dienste: [],
    funktionen_ids: [],
    standard: false,
    team_id: '',
    ansicht_id: 0,
    publish: [],
    is_public: false,
    path_id: 0,
    pdf_zusatz_dienste: [],
    position: 0
  };

  // Hiermit kann der Status der zu erstellenden/berarbeitenden Vorlage erstellt werden
  const setVorlageStates = ({
    id,
    name,
    dienste,
    team_id,
    funktionen_ids,
    ansicht_id,
    publish,
    is_public,
    path_id,
    pdf_zusatz_dienste,
    position
  }) => {
    setId(() => id);
    setName(() => name);
    setAuswahl(() => dienste);
    setTeam(() => team_id);
    setStartTeam(() => dienstplan?.getTeamIndex?.(team_id));
    setFunktionen(() => funktionen_ids);
    setAnsicht(() => ansicht_id);
    setPfad(() => path_id);
    setIsPublic(() => is_public);
    setPublish(() => publish);
    setExtraDienste(() => pdf_zusatz_dienste);
    setPosition(() => position);
  };

  // Kommunikation mit der API
  const update = (path, data, callback) => {
    if (user) {
      hainsOAuth.api(path, 'post', data).then((response) => {
        if (user) {
          if (showConsole) console.log('Request Vorlagen', data, response);
          if (response) {
            const { vorlagen, referencing_felder, destroyed, info, settings } =
              response;
            if (vorlagen || settings) {
              if (settings) {
                user.updateStandardVorlage(settings?.standard_vorlage_id || 0);
              } else {
                user.setVorlagen(vorlagen);
                if (vorlagen.length && mounted) setShowFormular(() => false);
                dienstplan?.setVorlage?.(dienstplan.vorlage, false);
                if (mounted) setVorlageStates(defaultStates);
              }
            } else {
              setPageWarning(dienstplan, info);
            }

            if (destroyed && referencing_felder) {
              user.removeFelder(referencing_felder, response.id);
            }
          } else {
            setPageWarning(
              dienstplan,
              'Vorlage kann nicht erstellt/geändert werden!'
            );
          }
        }
        callback?.();
      }, returnError);
    } else if (showConsole)
      console.log('update nicht möglich, da user nicht existiert', user);
  };

  // Speichern der neuen/beabeiteten Vorlage
  const handleSpeichern = (evt, setLoading) => {
    if (user) {
      const thisName = name.trim();
      const isNameNotEmpty = thisName !== '';
      const isAuswahlNotEmpty = auswahl.length > 0;
      const hasMitarbeiter = funktionen.length > 0;
      const isNameVergeben = dienstplan.checkVorlagenNamen(thisName, id);
      // Speichert die Vorlage in der Api, update der Vorlagen
      if (
        isNameNotEmpty &&
        isAuswahlNotEmpty &&
        !isNameVergeben &&
        hasMitarbeiter
      ) {
        const newVorlage = {
          name: thisName,
          dienste: auswahl,
          funktionen_ids: funktionen,
          id,
          team_id: team,
          ansicht_id: ansicht,
          is_public: isPublic,
          publish,
          path_id: pfad,
          pdf_zusatz_dienste: extraDienste,
          position
        };
        // Update der Api
        // Sende aktuelle Vorlage an die Api -> falls id = 0 -> neue Vorlage anlegen,
        // ansonsten Vorlage updaten
        update('update_vorlagen', newVorlage, () => setLoading?.(() => false));
      } else {
        // Vorlagenname darf nicht leer sein, es müssen Dienste ausgewählt sein
        // Der Name darf nicht bereits vergeben sein
        let errorMessage = '';
        if (!isNameNotEmpty) errorMessage += 'Name darf nicht leer sein!\n';
        if (!isAuswahlNotEmpty)
          errorMessage += 'Es muss mindestens ein Dienst ausgewählt sein!\n';
        if (!hasMitarbeiter)
          errorMessage += 'Es muss mindestens eine Funktion ausgewählt sein!\n';
        if (isNameVergeben) {
          errorMessage += 'Name existiert bereits!\n';
          errorMessage += `Folgende Namen sind unabhängig der Groß- und Kleinschreibung nicht zulässig!\n${dienstplan?.defaultVorlagenNamen || ''}`;
        }
        setPageWarning(dienstplan, errorMessage);
        setLoading?.(() => false);
      }
    } else setPageWarning(dienstplan, 'Bitte erst anmelden!');
  };

  // Bricht die Erstellung/Bearbeiung einer Vorlage ab
  const handleAbbrechen = (evt, setLoading) => {
    setVorlageStates(defaultStates);
    setShowFormular(() => false);
    setLoading?.(() => false);
  };

  // Erstellen einer neuen Vorlage
  const handleNeueVorlage = (evt, setLoading) => {
    setVorlageStates(defaultStates);
    setShowFormular(() => true);
    setLoading?.(() => false);
  };

  // Auswahl leeren
  const alleDiensteAbwaehlen = (isTeam) => {
    dienstplan.eachTeamDienst(team, isTeam, (dienst) => {
      const i = auswahl.indexOf(dienst.id);
      if (i >= 0) auswahl.splice(i, 1);
    });

    setAuswahl(() => [...auswahl]);
  };

  // Auswahl mit allen Diensten füllen
  const alleDiensteAuswaehlen = (isTeam) => {
    const dienste = [...auswahl];
    dienstplan.eachTeamDienst(team, isTeam, (dienst) => {
      if (!dienste.includes(dienst.id)) dienste.push(dienst.id);
    });

    setAuswahl(() => dienste);
  };

  // Auswahl Funktionen leeren
  const alleFunktionenAbwaehlen = () => {
    setFunktionen(() => []);
  };

  // Auswahl mit allen Funktionen füllen
  const alleFunktionenAuswaehlen = () => {
    const funktionen_ids = [...funktionen];
    dienstplan.eachFunktion((f) => {
      if (!funktionen_ids.includes(f.id)) funktionen_ids.push(f.id);
    });

    setFunktionen(() => funktionen_ids);
  };

  // Auswahl ExtraDienste leeren
  const alleExtraDiensteAbwaehlen = () => {
    setExtraDienste(() => []);
  };

  // Auswahl mit allen ExtraDienste füllen
  const alleExtraDiensteAuswaehlen = () => {
    const dienste = [...extraDienste];
    dienstplan.eachDienst((d) => {
      if (!dienste.includes(d.id)) dienste.push(d.id);
    });

    setExtraDienste(() => dienste);
  };

  // Auswahl des Team für die Vorlage
  const handleTeamWaehlen = (item) => {
    setStartTeam(() => item.index);
    setTeam(() => item.id);
  };

  // Auswahl des Team für die Vorlage
  const handleAnsichtWaehlen = (item) => {
    setAnsicht(() => item.index);
  };

  // Auswahl des Pfads für die Veröffentlichung
  const handlePfadWaehlen = (item) => {
    setPfad(() => item.id);
  };

  // Name der Vorlage ändern
  const handleChangeName = (evt) => {
    setName(() => evt.target.value);
  };

  // Löschen einer Vorlage
  const handleLoeschen = ({ vorlageName, vorlageId }) => {
    const confirmed = window.confirm(
      `Soll die Vorlage ${vorlageName} (ID: ${vorlageId}) gelöscht werden?`
    );
    if (confirmed) update('delete_vorlagen', { id: vorlageId });
  };

  // Bearbeiten einer Vorlage
  const handleBearbeiten = (vorlage) => {
    setVorlageStates(vorlage);
    // Öffnet VorlageFormular mit den diensten als Checked
    setShowFormular(() => true);
  };

  // Anpassen des Standard-Formulars
  const handleStandardChange = (evt, vorlage) => {
    const thisChecked = evt.target.checked;
    if (thisChecked) {
      update('update_standard', vorlage._me);
    }
  };

  const handlePositionChange = (position, vorlage) => {
    update('update_position', { id: vorlage.id, position });
  };

  const isPublishable = (vorlageName) => publish.includes(vorlageName);

  const handlePublish = (vorlageName) => {
    const publishable = isPublishable(vorlageName);
    if (!publishable) {
      setPublish(() => [...publish, vorlageName]);
    } else if (publishable) {
      const i = publish.indexOf(vorlageName);
      if (i >= 0) {
        publish.splice(i, 1);
        setPublish(() => [...publish]);
      }
    }
  };

  const handleIsPublic = () => {
    setIsPublic((current) => !current);
  };

  const handlePosition = (evt) => {
    setPosition(() => evt.target.value);
  };

  const renderExtraDienste = () => {
    const arr = [];
    dienstplan.eachDienst((dienst) =>
      arr.push(
        <AuswahlFeld
          key={`pdf_zusatz_dienst_${dienst.id}`}
          el={dienst}
          nameKey="planname"
          auswahl={extraDienste}
          setAuswahl={setExtraDienste}
        />
      )
    );
    return arr.sort((a, b) =>
      numericLocaleCompare(a.props.el.planname, b.props.el.planname)
    );
  };

  const renderDiensteContainer = (isTeam) => {
    const arr = [];
    dienstplan.eachTeamDienst(team, isTeam, (dienst) =>
      arr.push(
        <AuswahlFeld
          key={`${team}_${isTeam ? 'team' : 'rest'}_${dienst.id}`}
          el={dienst}
          nameKey="planname"
          auswahl={auswahl}
          setAuswahl={setAuswahl}
        />
      )
    );
    return arr.sort((a, b) =>
      numericLocaleCompare(a.props.el.planname, b.props.el.planname)
    );
  };

  const renderFunktionen = () => {
    const arr = [];
    dienstplan.eachFunktion((funktion) =>
      arr.push(
        <AuswahlFeld
          key={funktion.id}
          el={funktion}
          nameKey="planname"
          title={funktion.name}
          auswahl={funktionen}
          setAuswahl={setFunktionen}
        />
      )
    );

    return arr;
  };

  // Liefert die Formular-Komponente
  const getVorlageFormular = (abbrechen) => (
    <VorlageFormular
      user={user}
      dienstplan={dienstplan}
      handleSpeichern={handleSpeichern}
      handleAbbrechen={handleAbbrechen}
      name={name}
      id={id}
      renderFunktionen={renderFunktionen}
      abbrechen={abbrechen}
      alleDiensteAuswaehlen={alleDiensteAuswaehlen}
      alleDiensteAbwaehlen={alleDiensteAbwaehlen}
      alleFunktionenAuswaehlen={alleFunktionenAuswaehlen}
      alleFunktionenAbwaehlen={alleFunktionenAbwaehlen}
      handleChangeName={handleChangeName}
      handleTeamWaehlen={handleTeamWaehlen}
      handleAnsichtWaehlen={handleAnsichtWaehlen}
      ansicht={ansicht}
      team={team}
      startTeam={startTeam}
      pfad={pfad}
      handlePfadWaehlen={handlePfadWaehlen}
      handlePublish={handlePublish}
      handleIsPublic={handleIsPublic}
      isPublic={isPublic}
      publish={publish}
      position={position}
      handlePosition={handlePosition}
      isPublishable={isPublishable}
      renderDiensteContainer={renderDiensteContainer}
      renderExtraDienste={renderExtraDienste}
      alleExtraDiensteAbwaehlen={alleExtraDiensteAbwaehlen}
      alleExtraDiensteAuswaehlen={alleExtraDiensteAuswaehlen}
    />
  );

  // Liefert die Übersicht über die vorhandenen Vorlagen
  const getVorschau = () => (
    <VorlagenVorschau
      handleNeueVorlage={handleNeueVorlage}
      handleBearbeiten={handleBearbeiten}
      handleLoeschen={handleLoeschen}
      vorlagen={user.allDienstplanVorlagen}
      handleStandardChange={handleStandardChange}
      handlePositionChange={handlePositionChange}
    />
  );

  return [getVorschau, showFormular, getVorlageFormular];
};
