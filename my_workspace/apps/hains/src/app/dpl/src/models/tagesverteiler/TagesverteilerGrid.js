import { returnError } from '../../tools/hains';
import Basic from '../basic';

class TagesverteilerGrid extends Basic {
  constructor(parent, appModel = false) {
    super(appModel);
    this._setObject("parent", parent);
  }

  get desktop() {
    return this.getLayout("desktop");
  }

  get tablet() {
    return this.getLayout("tablet");
  }

  get mobile() {
    return this.getLayout("mobile");
  }

  /**
   * Liefert das Layout aus der Vorlage zurück.
   * @param {String} device 
   * @returns Object | false
   */
  getLayout(device) {
    const layout = this?.parent?.data?.layout?.[device] || false;
    return layout;
  }

  /**
   * 
   * @param {Object} gridDesktop 
   * @param {Object} gridTablet 
   * @param {Object} gridMobile 
   * @param {Object} setLoading 
   * @returns 
   */
  updateLayout(setLoading){
    const params = {
      layout: {},
      vorlage_id: this?._vorlageId || 0
    };
    const updateLoading = () => setLoading?.(() => false);

    const checkChanged = (_grid) => {
      if (_grid?.didLayoutChange?.(_grid)) {
        const copy = _grid?._me;
        if(copy) params.layout[_grid.device] = copy;
      }
    };
    
    checkChanged(this.desktop);
    checkChanged(this.tablet);
    checkChanged(this.mobile);

    if (this?._hains?.api && Object.keys(params.layout).length) {
      this._hains.api('update_tagesverteiler_layout', 'post', params).then(
        (data) => {
          this?.parent?.data?.updateLayout?.(data);
          this.setCssProperties();
          updateLoading();
        },
        (err) => {
          updateLoading();
          returnError(err);
        }
      );
    } else {
      updateLoading();
    }
  };

  reset() {
    this.desktop?.reset?.();
    this.tablet?.reset?.();
    this.mobile?.reset?.();
    this.parent?.vorlagen?.updateUi?.();
    this.setCssProperties();
  }

  setCssProperties() {
    this.desktop?.setCssProperties?.();
    this.tablet?.setCssProperties?.();
    this.mobile?.setCssProperties?.();
  }
}
export default TagesverteilerGrid;
