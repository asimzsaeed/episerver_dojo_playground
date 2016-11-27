(function ($) {
    var setDataSwitch = {
        dragStart: "start.draggable",
        drag: "drag.draggable",
        dragStop: "stop.draggable",
        maxHeight: "maxHeight.resizable",
        minHeight: "minHeight.resizable",
        maxWidth: "maxWidth.resizable",
        minWidth: "minWidth.resizable",
        resizeStart: "start.resizable",
        resize: "drag.resizable",
        resizeStop: "stop.resizable"
    };

    $.widget("ui.epiDialog", $.extend({}, $.ui.dialog.prototype, {
        /// <summary>
        ///     epiDialog widget.
        ///     Depends: ui.core.js
        /// </summary>
        _init: function () {
            /// <summary>
            ///     epiDialog widget initialization
            /// </summary>
            this.originalTitle = this.element.attr('title');

            var self = this;

            var options = this.options;

            this._nonContentHeight = 0;

            var title = options.title || this.originalTitle || '&nbsp;';

            var titleId = $.ui.dialog.getTitleId(this.element);

            var uiDialog = (this.uiDialog = $('<div/>'))
            .appendTo(document.body)
            .hide()
            .addClass(options.dialogClass)
            .css({
                position: 'absolute',
                overflow: 'hidden',
                zIndex: options.zIndex
            })
            // setting tabIndex makes the div focusable
            // setting outline to 0 prevents a border on focus in Mozilla
            .attr('tabIndex', -1).css('outline', 0).keydown(function (event) {
                (options.closeOnEscape && event.keyCode
                && event.keyCode == $.ui.keyCode.ESCAPE && self.close(event));
            })
            .attr({
                role: 'dialog',
                'aria-labelledby': titleId
            })
            .mousedown(function (event) {
                self.moveToTop(false, event);
            });

            var uiContentArea = (this.uiContentArea = $('<div/>'))
            .addClass('epi-dialog-contentArea')
            .appendTo(uiDialog);

            var uiDialogContent = this.element
            .show()
            .removeAttr('title')
            .addClass('epi-dialog-content')
            .appendTo(uiContentArea);

            var uiDialogTitlebar = (this.uiDialogTitlebar = $('<div/>'))
            .addClass('epi-dialog-titleBar')
            .prependTo(uiDialog);

            var uiDialogTitlebarClose = $('<a href="#"/>')
            .addClass(
                'epi-dialog-closeLink '
            )
            .attr('role', 'button')
            .hover(
                function () {
                    uiDialogTitlebarCloseText.addClass('epi-dialog-closeIcon-hover')

                },
                function () {
                    uiDialogTitlebarCloseText.removeClass('epi-dialog-closeIcon-hover')
                }
            )
            .focus(function () {
                uiDialogTitlebarClose.addClass('epi-dialog-closeIcon-focus');
            })
            .blur(function () {
                uiDialogTitlebarClose.removeClass('epi-dialog-closeIcon-focus');
            })
            .mousedown(function (e) {
                e.stopPropagation();
            })
            .click(function (e) {
                self.close(e);
                return false;
            })
            .appendTo(uiDialogTitlebar);

            var uiDialogTitlebarCloseText = (this.uiDialogTitlebarCloseText = $('<span/>'))
            .addClass(
                'epi-dialog-closeIcon'
            )
            .text(options.closeText)
            .appendTo(uiDialogTitlebarClose);

            var uiDialogTitle = $('<h1/>')
            .attr('id', titleId)
            .html(title)
            .prependTo(uiDialogTitlebar);

            uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();

            (options.draggable && $.fn.draggable && this._makeDraggable());
            (options.resizable && $.fn.resizable && this._makeResizable());

            this._createButtons(options.buttons);
            this._isOpen = false;

            (options.bgiframe && $.fn.bgiframe && uiDialog.bgiframe());
            (options.autoOpen && this.open());

            // Add a content cover to make mouse move events work whe
            this.contentCover = $("<div />")
             .addClass("epi-dialog-contentCover")
             .appendTo(uiContentArea);
        },

        _createButtons: function (buttons) {
            /// <summary>
            ///     Creates the buttons that should be displayed in the dialog
            /// </summary>
            var self = this;
            var hasButtons = false;

            var uiDialogButtonPane = $('<div/>')
                .addClass('epi-dialog-buttonBar');

            // if we already have a button pane, remove it
            this.uiDialog.find('.epi-dialog-buttonBar').remove();

            (typeof buttons == 'object' && buttons !== null &&
            $.each(buttons, function () {
    return !(hasButtons = true);
}));
            if (hasButtons) {
                $.each(buttons, function (name, fn) {
                    $('<input type="submit" class="epi-button-child-item" />')
                    .attr("value", name)
                    .click(function () {
    fn.apply(self.element[0], arguments);
})
                   .wrap('<span class="epi-button-child" />').parent()
                   .wrap('<span class="epi-button" />').parent()
                    .appendTo(uiDialogButtonPane);
                });
                uiDialogButtonPane.appendTo(this.uiContentArea);
            }
        },

        open: function () {
            /// <summary>
            ///     opens the dialog
            /// </summary>
            if (this._isOpen) {
                return;
            }

            var options = this.options;
            var uiDialog = this.uiDialog;

            this.overlay = options.modal ? new $.ui.dialog.overlay(this) : null;
            (uiDialog.next().length && uiDialog.appendTo('body'));
            this._size();
            this._position(options.position);
            uiDialog.show(options.show);
            this.moveToTop(true);

            // prevent tabbing out of modal dialogs
            (options.modal && uiDialog.bind('keydown.ui-dialog', function (event) {
                if (event.keyCode != $.ui.keyCode.TAB) {
                    return;
                }

                var tabbables = $(':tabbable', this);
                var first = tabbables.filter(':first')[0];
                var last = tabbables.filter(':last')[0];

                if (event.target == last && !event.shiftKey) {
                    setTimeout(function () {
                        first.focus();
                    }, 1);
                } else if (event.target == first && event.shiftKey) {
                    setTimeout(function () {
                        last.focus();
                    }, 1);
                }
            }));

            // set focus to the first tabbable element in the content area or the first button
            // if there are no tabbable elements, set focus on the dialog itself
            $([])
            .add(uiDialog.find('.epi-dialog-content :tabbable:first'))
            .add(uiDialog.find('.epi-dialog-buttonBar :tabbable:first'))
            .add(uiDialog)
            .filter(':first')
            .focus();

            this._trigger('open');
            this._isOpen = true;
        },

        _setData: function (key, value) {
            (setDataSwitch[key] && this.uiDialog.data(setDataSwitch[key], value));
            switch (key) {
                case "buttons":
                    this._createButtons(value);
                    break;
                case "closeText":
                    this.uiDialogTitlebarCloseText.text(value);
                    break;
                case "dialogClass":
                    this.uiDialog
                        .removeClass(this.options.dialogClass)
                        .addClass(value);
                    break;
                case "draggable":
                    (value
                        ? this._makeDraggable()
                        : this.uiDialog.draggable('destroy'));
                    break;
                case "height":
                    this.uiDialog.height(value);
                    this.element.height(Math.max(value - this._nonContentHeight, 0));
                    break;
                case "position":
                    this._position(value);
                    break;
                case "resizable":
                    var uiDialog = this.uiDialog,
                        isResizable = this.uiDialog.is(':data(resizable)');

                    // currently resizable, becoming non-resizable
                    (isResizable && !value && uiDialog.resizable('destroy'));

                    // currently resizable, changing handles
                    (isResizable && typeof value == 'string' &&
                        uiDialog.resizable('option', 'handles', value));

                    // currently non-resizable, becoming resizable
                    (isResizable || this._makeResizable(value));
                    break;
                case "title":
                    $("h1", this.uiDialogTitlebar).html(value || '&nbsp;');
                    break;
                case "width":
                    this.uiDialog.width(value);
                    break;
            }

            $.widget.prototype._setData.apply(this, arguments);
        },

        _size: function () {
            /* If the user has resized the dialog, the .epi-dialog and .epi-dialog-content
            * divs will both have width and height set, so we need to reset them
            */
            var options = this.options;

            // reset content sizing
            this.element.css({
                height: 0,
                minHeight: 0,
                width: 'auto'
            })
             .hide(); // To get correct size when dialog is opened in quirks mode work.

            // reset wrapper sizing
            // determine the height of all the non-content elements
            var nonContentHeight = this._nonContentHeight = this.uiDialog.css({
                height: 'auto',
                width: options.width
            })
             .height();

            this.element.css({
                minHeight: Math.max(options.minHeight - nonContentHeight, 0),
                height: options.height == 'auto'
                    ? 'auto'
                    : Math.max(options.height - nonContentHeight, 0)
            })
             .show();
        },

        _makeDraggable: function () {
            /// <summary>
            ///     Functionality for making the dialog draggable
            /// </summary>
            var self = this,
            options = this.options,
            heightBeforeDrag;

            this.uiDialog.draggable({
                cancel: '.epi-dialog-contentArea',
                handle: '.epi-dialog-titleBar',
                containment: 'document',
                start: function () {
                    heightBeforeDrag = $(this).height(); // Override default to get dialog in quirks mode work.
                    $(this).addClass("ui-dialog-dragging");
                    self.contentCover.css({ display: "block" }); // Display content cover to avoid iframe glitch.
                    (options.dragStart && options.dragStart.apply(self.element[0], arguments));
                },
                drag: function () {
                    (options.drag && options.drag.apply(self.element[0], arguments));
                },
                stop: function () {
                    self.contentCover.css({ display: "none" }); // Hide content cover.
                    $(this).removeClass("ui-dialog-dragging");
                    (options.dragStop && options.dragStop.apply(self.element[0], arguments));
                    $.ui.dialog.overlay.resize();
                }
            });
        },

        _makeResizable: function (handles) {
            /// <summary>
            ///     Functionality for making the dialog resizable
            /// </summary>
            handles = (handles === undefined ? this.options.resizable : handles);
            var self = this,
                options = this.options,
                resizeHandles = typeof handles == 'string'
                    ? handles
                    : 'n,e,s,w,se,sw,ne,nw';

            this.uiDialog.resizable({
                cancel: '.epi-dialog-content',
                alsoResize: this.element,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight,
                minWidth: options.minWidth,
                minHeight: options.minHeight,
                start: function () {
                    $(this).addClass("ui-dialog-resizing");
                    (options.resizeStart && options.resizeStart.apply(self.element[0], arguments));
                    self.contentCover.css({ display: "block" }); // Display content cover to avoid iframe glitch.
                },
                resize: function () {
                    (options.resize && options.resize.apply(self.element[0], arguments));
                },
                handles: resizeHandles,
                stop: function () {
                    $(this).removeClass("ui-dialog-resizing");
                    options.height = $(this).height();
                    options.width = $(this).width();
                    (options.resizeStop && options.resizeStop.apply(self.element[0], arguments));
                    $.ui.dialog.overlay.resize();

                    // When in quirks mode we need some special handling to resize content element as well.
                    self.element.hide();
                    //                    var nonContentHeight = self.uiDialog.css({ height: 'auto' }).height();
                    self.element.css({
                        minHeight: Math.max(options.minHeight - self._nonContentHeight, 0),
                        height: options.height == 'auto' ? 'auto' : Math.max(options.height - self._nonContentHeight, 0),
                        width: "auto"
                    })
                        .show();
                    $(this).height(options.height);

                    self.contentCover.css({ display: "none" }); // Hide content cover.
                }
            }).find('.ui-resizable-se').addClass('ui-icon ui-icon-grip-diagonal-se');
        }

    }));

    $.extend($.ui.epiDialog, {
        version: "1.7.1",
        defaults: {
            autoOpen: true,
            bgiframe: false,
            buttons: {},
            closeOnEscape: true,
            closeText: 'Close',
            dialogClass: 'epi-dialog',
            draggable: true,
            hide: null,
            height: 'auto',
            maxHeight: false,
            maxWidth: false,
            minHeight: 150,
            minWidth: 150,
            modal: true,
            position: 'center',
            resizable: true,
            show: null,
            stack: true,
            title: '',
            width: 300,
            zIndex: 1000
        },

        getter: 'isOpen',

        uuid: 0,
        maxZ: 0,

        getTitleId: function ($el) {
            return 'ui-dialog-title-' + ($el.attr('id') || ++this.uuid);
        },

        overlay: function (dialog) {
            this.$el = $.ui.dialog.overlay.create(dialog);
        }
    });

    $.extend($.ui.dialog.overlay, {
        create: function (dialog) {
            if (this.instances.length === 0) {
                // prevent use of anchors and inputs
                // we use a setTimeout in case the overlay is created from an
                // event that we're going to be cancelling (see #2804)
                setTimeout(function () {
                    $(document).bind($.ui.dialog.overlay.events, function (event) {
                        var dialogZ = $(event.target).parents('.epi-dialog').css('zIndex') || 0;
                        return (dialogZ > $.ui.dialog.overlay.maxZ);
                    });
                }, 1);

                // allow closing by pressing the escape key
                $(document).bind('keydown.dialog-overlay', function (event) {
                    (dialog.options.closeOnEscape && event.keyCode
                        && event.keyCode == $.ui.keyCode.ESCAPE && dialog.close(event));
                });

                // handle window resize
                $(window).bind('resize.dialog-overlay', $.ui.dialog.overlay.resize);
            }

            var $el = $('<div></div>').appendTo(document.body)
            .addClass('ui-widget-overlay').css({
                width: this.width(),
                height: this.height()
            });

            (dialog.options.bgiframe && $.fn.bgiframe && $el.bgiframe());

            this.instances.push($el);
            return $el;
        }
    });

})(epiJQuery);
