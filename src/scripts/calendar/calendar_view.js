import CalendarModel from './calendar_model';
import {d, toggleClass} from '../utilities/utils';

const weekdays = [
  {short: 'S', long: 'Sunday'},
  {short: 'M', long: 'Monday'},
  {short: 'T', long: 'Tuesday'},
  {short: 'W', long: 'Wednesday'},
  {short: 'T', long: 'Thursday'},
  {short: 'F', long: 'Friday'},
  {short: 'S', long: 'Saturday'},
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default class Calendar {
  /**
   * Constructs an instance of a Calendar View.
   */
  constructor(parent) {
    const today = new Date();
    this.parent = parent;
    this.calendar = new CalendarModel();
    this.calendar.setMonth(today.getMonth());
    this.calendar.setYear(today.getFullYear());
    this.selected = {
      day: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear(),
    };
    this.init();
    this.registerKeyUpEvents();
  }

  /**
   * Registers left arrow and right arrow key events for changing month.
   */
  registerKeyUpEvents() {
    document.addEventListener('keyup', (evt) => {
      const key = evt.keyCode ? evt.keyCode : evt.which;
      if (key === 37) this.onClickToggleMonth(-1);
      if (key === 39) this.onClickToggleMonth(1);
    });
  }

  /**
   * On click, toggles month.
   * @param {number} int Number of months (-/+) to add to calendar months.
   */
  onClickToggleMonth(int) {
    this.calendar.addToMonth(int);
    const month = months[this.calendar.getMonth()];
    const year = this.calendar.getYear();
    const monthDisplay = this.parent.getElementsByClassName('month-display')[0];
    monthDisplay.textContent = `${month} ${year}`;
    const oldDatepicker = this.parent.getElementsByClassName('datepicker')[0];
    const parentNode = oldDatepicker.parentNode;
    parentNode.removeChild(oldDatepicker);
    parentNode.appendChild(this.constructCalendar());
  }

  /**
   * On click, changes day.
   * @param {number} day Day to switch to.
   */
  onClickChangesDay(evt) {
    this.selected = {
      day: +evt.currentTarget.textContent,
      month: this.calendar.getMonth(),
      year: this.calendar.getYear(),
    };
    this.updateCalendarDay(evt.currentTarget);
    this.updateCalendarDisplay();
  }

  /**
   * Updates active calendar day to match state.
   * @param {Object} newElem New DOM element for day to be active.
   */
  updateCalendarDay(newElem) {
    const oldDay = this.parent.getElementsByClassName('active-day')[0];
    if (oldDay) toggleClass(oldDay, 'active-day');
    toggleClass(newElem, 'active-day');
  }

  /**
   * Updates calendar display to match state.
   */
  updateCalendarDisplay() {
    const {day, month, year} = this.selected;
    const selectedDay = new Date(year, month, day);
    const displayHeader = this.parent.querySelector('.display-weekday > span');
    const displayDay = this.parent.querySelector('.display-day > h1');
    if (displayHeader)
      displayHeader.textContent = `${weekdays[selectedDay.getDay()].long}`;
    if (displayDay)
      displayDay.textContent = `${selectedDay.getDate()}`;
  }

  /**
   * Checks if a current day in calendar view is selected day.
   * @param {number} day Day to check.
   * @return {boolean} Whether day is current selected day.
   */
  dayIsSelectedDay(day) {
    return (
      day === this.selected.day &&
      this.calendar.getMonth() === this.selected.month &&
      this.calendar.getYear() === this.selected.year
    );
  }

  /**
   * Formats class name for a specific calendar day element.
   * @param {number} day Calendar day.
   * @return {string} Class string.
   */
  _formatDayClass(day) {
    return [
      this.dayIsSelectedDay(day) ? 'active-day' : '',
      day === null ? '' : 'day',
    ].join(' ');
  }

  /**
   * Constructs initial month toggler.
   * @return {Object} DOM element.
   */
  constructMonthToggler() {
    const month = months[this.calendar.getMonth()];
    const year = this.calendar.getYear();
    const decrement = this.onClickToggleMonth.bind(this, -1);
    const increment = this.onClickToggleMonth.bind(this, 1);
    return (
      d('div', {class: 'month-toggle'}, [
        d('span', {
          class: 'toggle-down toggle',
          eventListener: {type: 'click', fn: decrement},
        }, '<'),
        d('div', {class: 'toggle-display'}, [
          d('span', {class: 'month-display'}, `${month} ${year}`),
        ]),
        d('span', {
          class: 'toggle-up toggle',
          eventListener: {type: 'click', fn: increment},
        }, '>'),
      ])
    );
  }

  /**
   * Constructs initial calendar grid.
   * @return {Object} DOM element.
   */
  constructCalendar() {
    const calendar = this.calendar.generateCalendar();
    const dayClick = this.onClickChangesDay.bind(this);
    return (
      d('div', {class: 'datepicker'}, [
        d('div', {class: 'datepicker-header'},
          weekdays.map(weekday => d('span', {}, weekday.short))
        ),
        d('div', {class: 'datepicker-body'}, calendar.map((week, i) => {
          return d('div', {class: 'datepicker-week'},
            week.map((day, j) => d('span', {
              class: this._formatDayClass(day),
              eventListener: day === null ? null : {type: 'click', fn: dayClick}
            }, day ? `${day}` : ''))
          )
        }))
      ])
    );
  }

  /**
   * Renders calendar component based on state.
   * @return {Object} DOM element.
   */
  initialRender() {
    const {day, month, year} = this.selected;
    const selectedDay = new Date(year, month, day);
    return (
      d('div', {class: 'calendar-container'}, [
        d('div', {class: 'calendar-display-container'}, [
          d('div', {class: 'display-weekday'}, [
            d('span', {}, `${weekdays[selectedDay.getDay()].long}`),
          ]),
          d('div', {class: 'display-day'}, [
            d('h1', {}, `${selectedDay.getDate()}`),
          ]),
        ]),
        d('div', {class: 'datepicker-container'}, [
          this.constructMonthToggler(),
          this.constructCalendar(),
        ])
      ])
    );
  }

  /**
   * Initializes calendar component to DOM.
   */
  init() {
    const component = this.initialRender();
    this.parent.appendChild(component);
  }
}
