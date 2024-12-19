let getAppModel = () => false;

/**
 * Hierüber wird die Funktion initAppModel an getAppModel übergeben, damit keine
 * circularen dependencies entstehen, wenn useTooltip in einer Componente
 * verwendet wird, welche im Model einegefügt wird.
 *
 * Circular dependecies:
 * Ein Modul importiert ein anderes Modul und wird von diesem wiederum importiert
 * A -> B -> C -> A -> B ....
 * @return appModel
 */
const AppModellGetter = (init) => {
  if (!getAppModel()) getAppModel = init;
};

export {
  AppModellGetter,
  getAppModel
};
