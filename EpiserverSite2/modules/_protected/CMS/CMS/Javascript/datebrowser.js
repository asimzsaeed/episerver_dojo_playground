/*
 * datebrowser.js	- JavaScript support routines for EPiServer
  * Copyright (c) 2007 EPiServer AB
*/


/*
    Global "classes"
*/
function CDateAtom(fActive,sName,nDate,nDayOfWeek,sColor,sBackground,fSelected) {
    this.fActive		= fActive;
    this.sName			= sName;
    this.nDate			= nDate;
    this.nDayOfWeek		= nDayOfWeek;
    this.sColor			= sColor;
    this.sBackground	= sBackground;
    this.fSelected		= fSelected;
}

function CDateConstants(Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday) {
    this.Monday			= Monday;
    this.Tuesday		= Tuesday;
    this.Wednesday		= Wednesday;
    this.Thursday		= Thursday;
    this.Friday			= Friday;
    this.Saturday		= Saturday;
    this.Sunday			= Sunday;
}

function CCalendarDate(nCurrentYear,nCurrentMonth,nSelectedYear,nSelectedMonth,nSelectedDate,nSelectedHour,nSelectedMinute) {
    this.nCurrentYear	= nCurrentYear;
    this.nCurrentMonth	= nCurrentMonth;
    this.nSelectedYear	= nSelectedYear;
    this.nSelectedMonth = nSelectedMonth;
    this.nSelectedDate	= nSelectedDate;
    this.nSelectedHour	= nSelectedHour;
    this.nSelectedMinute = nSelectedMinute;
}
/*
    RenderView()

    Load aMonth with data corresponding to oCalendar and render it
*/
function RenderView() {
    var nYear = oCalendar.nCurrentYear;
    var nMonth = oCalendar.nCurrentMonth;

    var nFirstDayOfMonth = getDayOfWeek(nYear, nMonth, 1);
    var nDaysInMonth = getDaysInMonth(nYear, nMonth);
    var nDate = 1;
    var nDayOfWeek = 1;

    document.getElementById('MonthNavigator').innerHTML = '<a class="Link" href="javascript:void(0);" OnClick="RenderMonthMenu(event);return false;">' + aMonthName[nMonth - 1] + '</a>, <a Class="Link" href="javascript:void(0);" OnClick="RenderYearMenu(event);return false;">' + nYear + '</a>';

    for (var i = 0; i <= 41; i++) {
        if ((i + 1) >= (nFirstDayOfMonth) && nDate <= nDaysInMonth) {
            if (nDayOfWeek == CALENDAR.Sunday)
            aMonth[i] = new CDateAtom(true,"date" + i,nDate,nDayOfWeek,"red","white",false);
            else
            aMonth[i] = new CDateAtom(true,"date" + i,nDate,nDayOfWeek,"black","white",false);

            if (oCalendar.nCurrentMonth == oCalendar.nSelectedMonth && oCalendar.nCurrentYear == oCalendar.nSelectedYear && oCalendar.nSelectedDate == nDate) {
                nSelectedIndex		= i;
                aMonth[i].fSelected	= true;
            }

            nDate++;
        } else
        aMonth[i] = new CDateAtom(false,"date" + i,"&nbsp;",null,"white","white",false);

        nDayOfWeek++;
        if (nDayOfWeek > 7) nDayOfWeek = 1;

        RenderDateAtom(i);
    }
}

/*
    GoTo(sYear,sMonth)

    Goto year and month in calendar from userinput
*/
function GoTo(sYear,sMonth) {
    var nYear	= parseFloat(sYear);
    var nMonth	= parseFloat(sMonth);

    if (nYear > 1900 && nYear < 2100)
        oCalendar.nCurrentYear = nYear;

    if (nMonth > 0 && nMonth < 13)
    oCalendar.nCurrentMonth = nMonth;

    RenderView();

}

/*
    LoadTimeSelector()

    Fill the timeselector with options
*/
function LoadTimeSelector() {
    var oOption;
    var oOptionHalf;
    var nSelOption;

    var oSelect = document.getElementById('f_time');

    for (var i = 0; i < 24; i++) {
        oOption		= document.createElement("OPTION");
        oOptionHalf = document.createElement("OPTION");

        oOption.text		= TwoChar(i) + ":00";
        oOptionHalf.text	= TwoChar(i) + ":30";

        oOption.value		= oOption.text;
        oOptionHalf.value	= oOptionHalf.text;

        if (i == oCalendar.nSelectedHour && oCalendar.nSelectedMinute < 30)
                nSelOption = 2 * i;
        if (i == oCalendar.nSelectedHour && oCalendar.nSelectedMinute >= 30)
        nSelOption = 2 * i + 1;

        oSelect.options.add(oOption);
        oSelect.options.add(oOptionHalf);
    }

    // Note. Cannot set selected in loop in IE4
    if (nSelOption == null)
    oSelect.selectedIndex = 0;
    else
    oSelect.selectedIndex = nSelOption;
}

/*
    StepMonth(nJump)

    Step x months
*/
function StepMonth(nJump) {
    oCalendar.nCurrentMonth += nJump;

    if (oCalendar.nCurrentMonth > 12) {
        oCalendar.nCurrentMonth = 1;
        oCalendar.nCurrentYear++;
    }
    if (oCalendar.nCurrentMonth < 1) {
        oCalendar.nCurrentMonth = 12;
        oCalendar.nCurrentYear--;
    }

    RenderView();

}

/*
    OnDateChanged(oDate)

    Called when a user selects a date
*/
function OnDateChanged(oDate) {
    var idx = oDate.index;

    if (aMonth[idx].fActive) {
        if (nSelectedIndex != null) {
            aMonth[nSelectedIndex].fSelected = false;
            RenderDateAtom(nSelectedIndex);
        }

        oCalendar.nSelectedYear		= oCalendar.nCurrentYear;
        oCalendar.nSelectedMonth	= oCalendar.nCurrentMonth;
        oCalendar.nSelectedDate		= aMonth[idx].nDate;

        aMonth[idx].fSelected		= true;

        RenderDateAtom(idx);

        nSelectedIndex = idx;
    }
}
/*
    RenderDateAtom(nIndex)

    Renders the individual dates in a calendar
*/
function RenderDateAtom(nIndex) {
    var oItem;

    oItem = aMonth[nIndex];

    if (oItem.fSelected) {
        document.getElementById(oItem.sName).style.color      = "white";
        document.getElementById(oItem.sName).style.background = "#000077";
    } else {
        document.getElementById(oItem.sName).style.color      = oItem.sColor;
        document.getElementById(oItem.sName).style.background = oItem.sBackground;
    }
    if (oToday.nSelectedYear == oCalendar.nCurrentYear && oToday.nSelectedMonth == oCalendar.nCurrentMonth && oToday.nSelectedDate == oItem.nDate) {
        document.getElementById(oItem.sName).style.borderColor = "red";
        document.getElementById(oItem.sName).style.borderWidth = "1px";
        document.getElementById(oItem.sName).style.borderStyle = "solid";
    } else
    document.getElementById(oItem.sName).style.borderWidth = "0px";

    document.getElementById(oItem.sName).index     = nIndex;
    document.getElementById(oItem.sName).innerHTML = oItem.nDate;

}

/*
    Some date and calendar helpers
*/
function TwoChar(n) {
    if (n < 10)
    return "0" + String(n);
    else
    return String(n);
}

function Julian(yr, mt, dy) {
    if (mt < 3) {
        mt = mt + 12;
        yr = yr - 1;
    }

    var years = Math.floor((4712 + yr) * 365.25);
    var leaps = Math.floor(yr / 100) - Math.floor(yr / 400);
    var mnths = Math.floor(((mt - 1) * 30.6) + 0.2);
    return years - leaps + mnths + dy;
}

function getDayOfWeek(yr, mt, dy) {
    return Julian(yr + 400, mt, dy) % 7 + 1;
}

function isLeapYear(y) {

    var fLeapYear = false;

    if (y % 4 == 0) {
        if (y % 100 == 0) {
            if (y % 400 == 0) fLeapYear = true;
        } else fLeapYear = true;
    }

    return fLeapYear;
}

function getDaysInMonth(y, m) {
    var days = 31;

    switch (m)
        {
        case 2:
            if (isLeapYear(y))
            days = 29;
            else
            days = 28;

            break;

        case 4:
        case 6:
        case 9:
        case 11:
            days = 30;
            break;
    }


    return days;
}

function FormatDateTime() {
    if (oCalendar.nSelectedYear != null && oCalendar.nSelectedMonth != null && oCalendar.nSelectedDate != null) {
        var sDate = String(oCalendar.nSelectedYear) + '-' + TwoChar(oCalendar.nSelectedMonth) + '-' + TwoChar(oCalendar.nSelectedDate);
        if ((document.getElementById('f_time') != null) && (!fNoTimeRow))
        sDate = sDate + ' ' + document.getElementById('f_time')[document.getElementById('f_time').selectedIndex].value;
        return sDate;
    } else
    return '';

}

/*
    Button helpers
*/

function onOK() {
    var sDate = FormatDateTime();
    EPi.GetDialog().Close(sDate);
}

function onCancel() {
    EPi.GetDialog().Close();
}

function onClear() {
    oCalendar.nSelectedYear		= null;
    oCalendar.nSelectedMonth	= null;
    oCalendar.nSelectedDay		= null;
    oCalendar.nCurrentYear		= oToday.nSelectedYear;
    oCalendar.nCurrentMonth		= oToday.nSelectedMonth;
    document.getElementById('f_time').selectedIndex = 0;

    RenderView();
}

/*
    Menu functions
*/
function RenderMonthMenu(event) {
    var s = '';

    OnClickHandler();

    if (document.getElementById('MonthMenu').menuContentSet != 1) {
        for (var i = 0; i < 12; i++) {
            s += '&nbsp;<a href="javascript:void(0);" class="Menu" OnClick="GoTo(null,' + (i + 1) + ');return false;">' + aMonthName[i] + '</a><br>';
        }

        document.getElementById('MonthMenu').innerHTML = s;
        document.getElementById('MonthMenu').menuContentSet = 1;
    }

    document.getElementById('MonthMenu').style.left = event.clientX + "px";
    document.getElementById('MonthMenu').style.top = event.clientY + "px";

    document.getElementById('MonthMenu').style.display = '';

    event.cancelBubble = true;

}

function RenderYearMenu(event) {
    var s = '';

    OnClickHandler();

    for (var i = -5; i < 6; i++) {
        s += '&nbsp;<a href="javascript:void(0);" class="Menu" OnClick="GoTo(' + (oCalendar.nCurrentYear + i) + ',null);return false;">' + (oCalendar.nCurrentYear + i) + '</a><br>';
    }

    document.getElementById('YearMenu').innerHTML = s;
    document.getElementById('YearMenu').style.left = event.clientX + "px";
    document.getElementById('YearMenu').style.top = event.clientY + "px";

    document.getElementById('YearMenu').style.display = '';

    event.cancelBubble = true;

}

function OnClickHandler() {

    if (document.getElementById('YearMenu'))
        document.getElementById('MonthMenu').style.display = 'none';

    if (document.getElementById('YearMenu'))
        document.getElementById('YearMenu').style.display = 'none';
}
