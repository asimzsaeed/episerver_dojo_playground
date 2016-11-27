(function ($) {

    var minDate = new Date('07/10/2010');
    var maxDate = new Date('10/18/2010');
    var previousRange;
    var dateFormat = 'dd.mm.yy';
    var parent;

    $.widget("ui.daterange", {
        _isVisible: false,
        _previousStartDate: null,
        _previousEndDate: null,

        _popup: null,
        _startViewElement: null,
        _endViewElement: null,
        _delimiterViewElement: null,
        _startDatePicker: null,
        _endDatePicker: null,

        _isDate: function (date) {
            return (date && "object" == typeof date) && date.getMonth;
        },
        _setPosition: function () {
            var top = this.element.offset().top - $(this.options.popupParent).offset().top + $(this.options.popupParent).scrollTop() + this.element.innerHeight() + 1;
            var left = this.element.offset().left - $(this.options.popupParent).offset().left + $(this.options.popupParent).scrollLeft();
            if (this.options.popupAlign == 'right') {
                left += this.element.outerWidth() - this._popup.outerWidth();
            }
            this._popup.css({ 'left': left, 'top': top });
        },
        _updateView: function () {
            this._startViewElement.text($.datepicker.formatDate(this.options.viewDateFormat, this.options.startDate));
            this._endViewElement.text($.datepicker.formatDate(this.options.viewDateFormat, this.options.endDate));
        },
        _setDate: function (startDate, endDate) {
            this.options.startDate = (this._isDate(startDate)) ? startDate : new Date();
            this._startDatePicker.datepicker('setDate', this.options.startDate).datepicker('show');

            this.options.endDate = (this._isDate(endDate)) ? endDate : new Date();
            this._endDatePicker.datepicker('setDate', this.options.endDate);
        },
        _init: function () {
            var _this = this;

            //create view
            this.element.addClass('ui-daterange');
            this._startViewElement = $('<span></span>').appendTo(this.element).addClass('ui-daterange-startDate');
            this._delimiterViewElement = $('<span></span>').appendTo(this.element).addClass('ui-daterange-delimiter').text(this.options.delimiter);
            this._endViewElement = $('<span></span>').appendTo(this.element).addClass('ui-daterange-endDate');
            this._startViewElement.bind('click', function () {
                _this.show();
            });
            this._endViewElement.bind('click', function () {
                _this.show();
            });

            //create popup
            this._popup = $('<div></div>').addClass('ui-daterange-popup').css({ 'position': 'absolute', 'z-index': 5000 }).hide();
            this._popup.appendTo(this.options.popupParent);

            //create datepickers area
            var dpArea = $('<div></div>').appendTo(this._popup).addClass('ui-daterange-datepickersArea');
            this._startDatePicker = $('<div></div>').appendTo(dpArea).addClass('ui-daterange-startDatepicker').datepicker({
                minDate: this.options.minDate,
                maxDate: this.options.maxDate
            });
            this._endDatePicker = $('<div></div>').appendTo(dpArea).addClass('ui-daterange-endDatepicker').datepicker({
                minDate: this.options.minDate,
                maxDate: this.options.maxDate
            });
            this._startDatePicker.datepicker('option', $.extend({ showMonthAfterYear: false }, $.datepicker.regional[this.options.lang]));
            this._endDatePicker.datepicker('option', $.extend({ showMonthAfterYear: false }, $.datepicker.regional[this.options.lang]));

            this._setDate(this.options.startDate, this.options.endDate);
            this._updateView();

            //create buttons area
            var btnArea = $('<div></div>').appendTo(this._popup).addClass('ui-daterange-buttonsArea');
            $('<button type="button">' + this.options.selectText + '</button>').appendTo(btnArea).addClass('ui-daterange-button').bind('click', function (e) {
                e.preventDefault();
                _this.select();
            });
            $('<button type="button">' + this.options.cancelText + '</button>').appendTo(btnArea).addClass('ui-daterange-button').bind('click', function (e) {
                e.preventDefault();
                _this.cancel();
            });

            //translate datepickers onSelect events to widget
            this._startDatePicker.datepicker('option', 'onSelect', function () {
                _this._selecting();
            });
            this._endDatePicker.datepicker('option', 'onSelect', function () {
                _this._selecting();
            });
        },

        //events listeners
        _selecting: function () {
            this.options.startDate = this._startDatePicker.datepicker('getDate');
            this.options.endDate = this._endDatePicker.datepicker('getDate');
            this._updateView();
            if (typeof this.options.onSelecting == 'function') {
                this.options.onSelecting.call(this.element);
            }
        },

        //public methods
        show: function () {
            if (!this._isVisible) {
                this._isVisible = true;

                this._previousStartDate = this.options.startDate;
                this._previousEndDate = this.options.endDate;
                this._setDate(this.options.startDate, this.options.endDate);

                this._setPosition();
                this._popup.show();
                if (typeof this.options.onShow == 'function') {
                    if (typeof this.options.onShow == 'function') {
                        this.options.onShow.call(this.element);
                    }
                }
            }
        },
        hide: function () {
            if (this._isVisible) {
                this._isVisible = false;
                this._popup.hide();
                if (typeof this.options.onHide == 'function') {
                    if (typeof this.options.onHide == 'function') {
                        this.options.onHide.call(this.element);
                    }
                }
            }
        },
        select: function () {
            if (this.options.startDate <= this.options.endDate) {
                this.hide();
                if (typeof this.options.onSelect == 'function') {
                    this.options.onSelect.call(this.element, { widget: this });
                }
            } else {
                alert(this.options.wrongRangeMessage);
            }
        },
        cancel: function () {
            this._setDate(this._previousStartDate, this._previousEndDate);
            this._updateView();

            this.hide();
            if (typeof this.options.onCancel == 'function') {
                this.options.onCancel.call(this.element);
            }
        },
        destroy: function () {
            $.widget.prototype.destroy.apply(this, arguments);
        }
    });
    $.extend($.ui.daterange, {
        defaults:
        {
            viewDateFormat: 'dd/mm/yy',
            queryDateFormat: 'yy.mm.dd',
            queryStartDateKey: '',
            queryEndDateKey: '',
            minDate: null,
            maxDate: null,
            startDate: new Date(),
            endDate: new Date(),
            popupAlign: 'right',
            popupParent: 'body',
            delimiter: '—',
            lang: '',
            wrongRangeMessage: '',

            onSelecting: null,
            onSelect: null,
            onCancel: null,
            onShow: null,
            onHide: null,

            cancelText: "Cancel",
            selectText: "Select"
        }

    });
})(epiJQuery);
