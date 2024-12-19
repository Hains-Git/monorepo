class Helper {
  constructor(rotations_id, timeline){
    this.timeline = timeline;
    this.rotations_id = [...rotations_id];
    this.tmp = [];
  }

  sortObj(rotationen){
    return this.rotations_id.sort((a, b) => {
      const firstRot = rotationen[a];
      const secondRot = rotationen[b];
      return firstRot.bisZahl - secondRot.bisZahl;
    });
  }

  sortByPrio(rotationen){
    return this.rotations_id
      .sort((a,b) => {
        const firstRot = rotationen[a];
        const secondRot = rotationen[b];
        if(firstRot.prioritaet === secondRot.prioritaet){
          return firstRot.bisZahl - secondRot.bisZahl;
        } 
        if(!firstRot) return 1;
        return firstRot.prioritaet - secondRot.prioritaet;
      });
  }

  createFirstItemInTmp(rotationen){
    const firstRotId = this.rotations_id[0];
    if(firstRotId){
      const firstRot = rotationen[this.rotations_id[0]];
      const rotUi = {
        id: firstRot.id, 
        prioritaet:firstRot.prioritaet,
        vonZahl:firstRot.vonZahl, 
        von:firstRot.vonDateString,
        bisZahl:firstRot.bisZahl,
        bis:firstRot.bisDateString,
        ids:[firstRot.id]
      }
      this.tmp.push(rotUi);
    }
  }

  getUiPositions(rotation){
    const [left, right, top] = this.getPositions(rotation);
    return [left, right, top];
  }
  
  isNewDiffSmaller(newDiff, diff){
    // return false: Bedeutet hier das Rotation die Platz haben zuerst oben ausgefuellt werden
    // wenn die Bedienung entfernt wird, werden Rotation von untenher aufgefüllt.
    if(newDiff === diff) return false;
    const goal = 0;
    const counts = [newDiff, diff];
    const closest = counts.reduce((prev, curr) => {
      return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
    return newDiff === closest;
  }

  checkDiff(diff, newDiff, rot) {
    if(newDiff === 0){
      return {diff: newDiff, rot};
    }
    if(newDiff < 0 && diff < 0){
      if(this.isNewDiffSmaller(newDiff, diff)){
        return {diff: newDiff, rot};
      }
    } else if(newDiff < diff){
      return {diff: newDiff, rot};
    }
    return {diff, rot: false};
  }

  calculateUiTopPos(rotation){
    const uiTopPos = 0;
    if(rotation.id === this.tmp[0].id) {
      return uiTopPos;
    }
    
    const prios = this.timeline.view === "contingent" 
      ? this.tmp 
      : this.tmp.filter(item => item.prioritaet === rotation.prioritaet);
    let targetRot = prios[0];
    let diff = 1;
    if(targetRot) {
      diff = targetRot.bisZahl - rotation.vonZahl;
    }
    const l = prios.length;
    for (let i = 0; i < l; i++){
      const newDiff = prios[i].bisZahl - rotation.vonZahl;
      const obj = this.checkDiff(diff, newDiff, prios[i]);
      diff = obj.diff;
      if(obj.rot) targetRot = obj.rot;
      if(newDiff === 0){
        break;
      }
    }

    if(diff > 0){
      const rotUi = {
        id: rotation.id,
        prioritaet:rotation.prioritaet,
        vonZahl:rotation.vonZahl,
        von:rotation.vonDateString,
        bisZahl:rotation.bisZahl,
        bis:rotation.bisDateString,
        ids:[rotation.id]
      }
      this.tmp.push(rotUi);
    } else {
      targetRot.bisZahl = rotation.bisZahl
      targetRot.ids.push(rotation.id);
    }

    const foundIx = this.tmp.findIndex(item => {
      return item.ids.find(id => parseInt(id, 10) === parseInt(rotation.id, 10));
    });

    return foundIx;
  }

  getHeight(){
    return this.tmp.length;
  }

  roundTo2DecimalNum(num){
    const m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
  }

  getLeftPosition(year, monthName, dayNum, offset=false){
    if(!this.timeline.years[year] || !this.timeline.years[year].months[monthName]){
      return 0;
    }
    const month = this.timeline.years[year].months[monthName];
    const monthLeft = month.left;
    const monthWidth = month.columnWidth;
    const days = month.displayDays.days;
    const daysInMonth = Object.values(days).length;
    const daysWidth = parseFloat(monthWidth / daysInMonth).toFixed(2);
    const daysLeft = daysWidth * dayNum;
    const left = (monthLeft + daysLeft) - (offset ? daysWidth : 0);

    return this.roundTo2DecimalNum(left);
  }

  getRightPosition(dateToStr, monthNameTo){
    let right = 0;
    if(this.timeline.years[dateToStr[0]] && this.timeline.years[dateToStr[0]].months[monthNameTo]) {
      const monthToleft = this.getLeftPosition(dateToStr[0], monthNameTo, parseInt(dateToStr[2], 10), false) + 1;
      const monthRight = this.timeline.fullWidth - monthToleft;
      right = monthRight;
    }
    return this.roundTo2DecimalNum(right);
  }

  getPositions(rotation){

    const dateFromStr = rotation.von.split("-");
    const dateToStr = rotation.bis.split("-");

    const dateFrom = new Date(dateFromStr[0], dateFromStr[1]-1, 1);
    const monthNameFrom = dateFrom.toLocaleString('en-us', { month: 'long' }).toLowerCase();

    const dateTo= new Date(dateToStr[0], dateToStr[1]-1, 1);
    const monthNameTo = dateTo.toLocaleString('en-us', { month: 'long' }).toLowerCase();

    // if rotation von < than first month from left then return
    // if(!this.timeline.years[dateFromStr[0]] || !this.timeline.years[dateFromStr[0]].months[monthNameFrom]) {
    //   return;
    // }
   
    const left = this.getLeftPosition(dateFromStr[0], monthNameFrom, parseInt(dateFromStr[2], 10), true);
    const right = this.getRightPosition(dateToStr, monthNameTo);
    const top = this.calculateUiTopPos(rotation);

    // left = this.roundTo2DecimalNum(left);
    // right = this.roundTo2DecimalNum(right);

    return [left, right, top];

  }
  
}

export default Helper;
