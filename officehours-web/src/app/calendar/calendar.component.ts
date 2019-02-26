import { Component, OnInit, ViewChild, TemplateRef, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Class {
  name: string;
  id: number;
  icon: string;
}

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})


export class CalendarComponent implements OnInit, AfterViewChecked {

  constructor(private modal: NgbModal, private http: HttpClient) {
    this.filteredClasses = this.classCtrl.valueChanges
      .pipe(
        startWith(''),
        map(classItem => classItem ? this._filterClasses(classItem) : this.classes.slice())
      );
  }

  public classCtrl = new FormControl();
  public filteredClasses: Observable<Class[]>;

  private _filterClasses(value: string): Class[] {
    const filterValue = value.toLowerCase();

    return this.classes.filter(classItem => classItem.name.toLowerCase().includes(filterValue));
  }

  SelectedClass: String = "CS 407";
  ShowCalendar: boolean = false;
  ShowClassChooser: boolean = false;
  ShowClassDropdown: boolean = false;
  SelectedDate: Date;
  ClassName: string = "CS403: Programming Languages";
  ProfessorName: string = "Dr. John Lusth";
  AvailableTimeSlots: string[] = [
    '12:00 pm',
    '12:30 pm',
    '1:00 pm'
  ]
  SelectedTimeSlot: string;
  classes: Class[] = [
    {
      name: ' CS 407',
      id: 0,
      icon: 'https://cdn4.iconfinder.com/data/icons/scientific-study-1/48/20-Scientific_Study-512.png'
    },
    {
      name: ' GEO 101',
      id: 1,
      icon: 'https://cdn3.iconfinder.com/data/icons/education-1/256/Geography-512.png'
    },
    {
      name: ' BIO 101',
      id: 2,
      icon: 'https://cdn3.iconfinder.com/data/icons/education-209/64/tube-lab-science-school-512.png'
    }
  ];
  classForm: FormGroup = new FormGroup({
    class: this.classCtrl
  });

  tempSelectedClass: String;

  @ViewChild('classChooserTrigger', { read: MatAutocompleteTrigger })
  public classChooserTrigger: MatAutocompleteTrigger;

  @ViewChild("classChooserTrigger") classField: ElementRef; 

  classSelected: Function = function() {
    this.SelectedClass = this.classForm.get('class').value;
    this.ShowClassChooser = false;
  }

  pickClass: Function = function (evt) {
    this.ShowClassChooser = !this.ShowClassChooser;
    this.ShowClassDropdown = true;
    evt.stopPropagation();
    this.classChooserTrigger.openPanel();
  }

  ngAfterViewChecked() {
    if (this.ShowClassDropdown) {
      this.classField.nativeElement.focus();
      this.ShowClassDropdown = false;
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.ShowClassChooser) {
    }
  }

  // Calendar stuff

  modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
}