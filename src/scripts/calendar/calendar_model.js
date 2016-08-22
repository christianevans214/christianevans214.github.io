export default class CalendarModel {
  /**
   * Constructs an instance of class.
   */
  constructor() {
    this.month; //0 through 11 representing January through December.
    this.year;
  }

  //Mutator methods
  /**
   * Adds/subtracts X number of months.
   * @param {number} int positive or negative number of months.
   * @return {boolean} Whether month increment was successful.
   */
  addToMonth(int) {
    if (this.month === undefined && this.year === undefined) return false;
    const totalMonths = int + this.getMonth();
    const numYearsToAdd = Math.floor(totalMonths / 12);
    let newMonth = totalMonths % 12;
    if (totalMonths < 0)
      newMonth = (12 * Math.ceil(-1 * totalMonths / 12)) + totalMonths;
    this.setMonth(newMonth);
    return this.setYear(this.getYear() + numYearsToAdd);
  }

  /**
   * Sets month value of Calendar state.
   * @param {number} month Month of the year.
   * @return {boolean} Boolean whether setting state was successful.
   */
  setMonth(month) {
    const MAX_MONTH_IN_YEAR = 11;
    if (month < 0 || month > MAX_MONTH_IN_YEAR)
      return false;
    this.month = month;
    return true;
  }

  /**
   * Sets year value of Calendar state.
   * @param {number} year Year of Calendar.
   * @return {boolean} Boolean whether setting state was successful.
   */
  setYear(year) {
    const MAX_JS_DATE_YEAR = 285616; //Approx. max year defined by MSDN.
    if (year <= MAX_JS_DATE_YEAR * -1 || year >= MAX_JS_DATE_YEAR)
      return false;
    this.year = year;
    return true;
  }

  //Accessor methods.
  /**
   * Returns month value of Calendar state.
   * @return {number} Calendar month.
   */
  getMonth() {
    return this.month;
  }

  /**
   * Returns year value of Calendar state.
   * @return {number} Calendar year.
   */
  getYear() {
    return this.year;
  }

  //Validation methods.
  /**
   * Checks if day exists given a certain month and year.
   * @return {boolean} Whether day is in month and year.
   */
  dayInMonthAndYear(day) {
    return new Date(this.year, this.month, day).getMonth() === this.getMonth();
  }

  //Output methods.
  /**
   * Generates 2D array representation of calendar month.
   * @return {Array} Array representing calendar month.
   */
  generateCalendar() {
  	const DAYS_IN_WEEK = 7;
    const firstDay = new Date(this.year, this.month, 1).getDay();
    const calendarArr = [];
    const weekArr = Array.apply(null, Array(firstDay)).map(() => null);
    let dayCount = 1;
    while (this.dayInMonthAndYear(dayCount)) {
      if (weekArr.length !== 0 && weekArr.length % DAYS_IN_WEEK === 0) {
        calendarArr.push(weekArr.slice());
        weekArr.length = 0;
      }
      weekArr.push(dayCount);
      dayCount++;
    }
    if (weekArr.length > 0) {
    	calendarArr.push(weekArr.concat(Array.apply(null, Array(DAYS_IN_WEEK - weekArr.length))
    		.map(() => null)));
    }
    return calendarArr;
  }
}
