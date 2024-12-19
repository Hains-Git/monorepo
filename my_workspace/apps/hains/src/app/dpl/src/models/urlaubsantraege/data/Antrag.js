import Antrag from '../../apimodels/antrag';

class MyAntrag extends Antrag {
  constructor(obj) {
    super(obj, false, false);
  }
}

export default MyAntrag;
