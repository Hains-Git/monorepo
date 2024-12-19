import Basic from '../basic';

class ColumnYear extends Basic {

	constructor(year, columnWidth, index, zoomVal, months, previosYearMonths = 0, rangeWidth = 0, appModel = false){
    super(appModel);
    this.year = year;
    this.key = year;
    this.index = index;
    this.zoomVal = zoomVal;
    this.scrollPos = 0;
    this.yearWidth = columnWidth * months.length;
    this.left = this.yearWidth * index;
    this.columnWidth = columnWidth;
    this.initialWidth = columnWidth;
    this.rangeWidth = rangeWidth;
    this.previosYearMonths = previosYearMonths;
    this.months = this.getMonths(months);

  }

  getMonth(monthNum, monthIndex){
    const date = new Date(this.year, monthNum, 1);
    const monthName = date.toLocaleString('de-De', { month: 'long' });
    const monthNameKey = date.toLocaleString('en-EN', { month: 'long' });
    const dayInMonth = new Date(this.year, monthNum+1, 0).getDate();
    
    const days = {};
    const columnWidth = parseFloat(this.columnWidth / dayInMonth).toFixed(2);

    for (let i = 1; i <= dayInMonth; i++){
      const daydate = new Date(this.year, monthNum, i);
      const dayName = daydate.toLocaleString('de-De', { weekday: 'long' });
      days[i] = {
        dayNum: i,
        dayName,
        key:`${this.year}-${monthNum}-${i}`,
        columnKey: `${this.year}-${monthNum}-${i}`,
        columnIndex: parseInt(`${i}`, 10),
        columnWidth
      }
    }
    
    const columnIndex = (monthIndex + this.previosYearMonths);
    const left = this.columnWidth * columnIndex;

    const month = {
      visible: true,
      displayMonth:monthName,
      left,
      date,
      key:`${this.year}-${monthNameKey.toLowerCase()}`,
      columnKey:`${this.year}-${monthNum}`,
      columnIndex:parseInt(`${columnIndex}`, 10),
      columnWidth:this.columnWidth,
      displayDays:{
        days,
        visible:this.columnWidth === this.rangeWidth[1]
      }
    };

    return month;
  }

  getMonths(monthsNums){
    const months = {}
    
    monthsNums.forEach((monthNum, monthIndex) => {
      const date = new Date(this.year, monthNum, 1);
      const monthNameKey = date.toLocaleString('en-us', { month: 'long' }).toLowerCase();
      const month = this.getMonth(monthNum, monthIndex);
      months[monthNameKey] = month;
    });
    return months;
  }

  widerColumn(month, columnIndex, cctScroll){
    const monthIndex = month.columnIndex;

    if(monthIndex < columnIndex){
      const scrollLeft = ((columnIndex * this.zoomVal) + (this.zoomVal / 2)) / columnIndex;
      cctScroll.scrollLeft += scrollLeft;
    }

    month.columnWidth += this.zoomVal;

  }

  smallerColumn(month, columnIndex, cctScroll){
    const monthIndex = month.columnIndex;

    if(monthIndex < columnIndex){
      const scrollLeft = ((columnIndex * this.zoomVal) + (this.zoomVal / 2)) / columnIndex;
      cctScroll.scrollLeft -= scrollLeft;
    }

    month.columnWidth -= this.zoomVal;

  }

  calculateNewDayWidth(month){
    const monthNum = parseInt(month.columnKey.split("-")[1], 10);
    const dayInMonth = new Date(this.year, monthNum+1, 0).getDate();
    const columnWidth = parseFloat(month.columnWidth / dayInMonth).toFixed(2);

    Object.values(month.displayDays.days).forEach(day => {
      day.columnWidth = columnWidth;
    });

    return parseFloat(columnWidth);
  }

  calculateMonthProps(columnIndex, zoomInOrOut, cctScroll){
    let yearWidth = 0;
    this.scrollPos = 0;
    this.scrollCount = 0;

    Object.values(this.months).forEach(month => {


      if(zoomInOrOut === "zoom-in" && month.columnWidth < this.rangeWidth[1]){
        this.widerColumn(month, columnIndex, cctScroll);
      }
      if(zoomInOrOut === "zoom-out" && month.columnWidth > this.rangeWidth[0]) {
        this.smallerColumn(month, columnIndex, cctScroll);
      }

      if(month.columnWidth === this.rangeWidth[1]){
        month.displayDays.visible = true;
        this.calculateNewDayWidth(month);
      }
      else {
        month.displayDays.visible = false;
      }

      yearWidth += month.columnWidth;

      month.left = month.columnWidth * month.columnIndex;
      this.columnWidth = month.columnWidth;

    });

    this.yearWidth = yearWidth;

  }

}

export default ColumnYear;
