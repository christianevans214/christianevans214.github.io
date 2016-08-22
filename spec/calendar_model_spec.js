import CalendarModel from '../src/scripts/calendar/calendar_model';

describe('CalendarModel', function() {
  let calendar;
  let month;
  let year;
  let day;

  beforeEach(() => {
    calendar = new CalendarModel();
    month = null;
    year = null;
    day = null;
  });

  it('should be able to set state', () => {
    month = 1;
    year = 2016;
    calendar.setMonth(month);
    calendar.setYear(year);

    expect(calendar.getMonth()).toEqual(month);
    expect(calendar.getYear()).toEqual(year);
  });

  it('should reject setting falsy state values', () => {
    month = 13;
    year = 285616;
    expect(calendar.setMonth(month)).toBeFalsy();
    expect(calendar.getMonth()).toBeFalsy();

    expect(calendar.setYear(year)).toBeFalsy();
    expect(calendar.getYear()).toBeFalsy();
  });

  describe('testing if day is in month', () => {
    it('should accurately gauge whether a day N is in a given month and year', () => {
      month = 1;
      year = 2015;
      day = 15;
      calendar.setMonth(month);
      calendar.setYear(year);
      expect(calendar.dayInMonthAndYear(day)).toBeTruthy();
      day = 35;
      expect(calendar.dayInMonthAndYear(day)).toBeFalsy();
    });

    it('should take leap years into account', () => {
      month = 1;
      year = 2015;
      day = 29;
      calendar.setMonth(month);
      calendar.setYear(year);

      expect(calendar.dayInMonthAndYear(day)).toBeFalsy();

      year = 2016;
      calendar.setYear(year);

      expect(calendar.dayInMonthAndYear(day)).toBeTruthy();
    });
  });

  describe('calendar array generation', () => {
    let months = [];
    beforeEach(() => {
      //generate an array of random month/year combos.
      months = Array.apply(null, Array(5)).map(() => {
        return {
          month: Math.round(Math.random() * 11),  //any month
          year: Math.round(Math.random() * 2020), //any year from 0 AD to 2020 AD
        };
      });
    });

    it('should have the first day of the month start on the right weekday', () => {
      months.forEach((monthYear) => {
        calendar.setMonth(monthYear.month);
        calendar.setYear(monthYear.year);
        const generatedCalendar = calendar.generateCalendar();
        const firstDay = new Date(monthYear.year, monthYear.month, 1).getDay();
        const generatedFirstWeekday = generatedCalendar[0].indexOf(1);
        expect(generatedFirstWeekday).toEqual(firstDay);
      });
    });

    it('should have all weeks be the same length', () => {
      months.forEach(monthYear => {
        calendar.setMonth(monthYear.month);
        calendar.setYear(monthYear.year);
        const generatedCalendar = calendar.generateCalendar();
        const allWeeks7Days = generatedCalendar.every((week) => {
          return week.length === 7;
        });
        expect(allWeeks7Days).toBeTruthy();
      });
    });
  });
  describe('incrementing and decrementing months', () => {
    it('should accurately increase the month without changing year', () => {
      month = 1;
      year = 2015;
      calendar.setMonth(month);
      calendar.setYear(year);
      calendar.addToMonth(1)
      expect(calendar.getMonth()).toEqual(month + 1);
      expect(calendar.getYear()).toEqual(year);
    });
    it('should increase the month and change the year if needed', () => {
      month = 0;
      year = 2015;
      calendar.setMonth(month);
      calendar.setYear(year);
      calendar.addToMonth(25);
      expect(calendar.getMonth()).toEqual(1);
      expect(calendar.getYear()).toEqual(year + 2);
    });
    it('should accurately decrease the month', () => {
      month = 1;
      year = 2015;
      calendar.setMonth(month);
      calendar.setYear(year);
      calendar.addToMonth(-1);
      expect(calendar.getMonth()).toEqual(month - 1);
    });
    it('should decrease the month and change the year if needed', () => {
      month = 0;
      year = 2015;
      calendar.setMonth(month);
      calendar.setYear(year);
      calendar.addToMonth(-13);
      expect(calendar.getMonth()).toEqual(11);
      expect(calendar.getYear()).toEqual(2013);
    })
  });
});
