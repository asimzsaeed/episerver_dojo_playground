function clsBrowser() {
    var me = this;

    this.LeftButton = new Object();
    this.ClientHeight = new Object();
    this.ClientWidth = new Object();
    me.ClientHeight.toString = _getWindowHeight;
    me.ClientWidth.toString = _getWindowWidth;
    me.LeftButton.toString = _getLeftButton;
    me.Controls = new Object();
    this.evt = new clsEvt();

    function _getWindowHeight() {

        if (window.innerHeight) {
            return window.innerHeight;
        } else {
            return document.body.parentNode.clientHeight;
        }
    }

    function _getWindowWidth() {

        if (window.innerWidth) {
            return window.innerWidth;
        } else {
            return document.body.parentNode.clientWidth;
        }
    }

    function clsEvt() {
        this.SrcElement = function (evt) {
            if (evt.target == null) {
                return evt.srcElement;
            } else {
                return evt.target;
            }
        }

        this.ReturnValue = function (evt, bValue) {
            if (evt.preventDefault) {
                if (bValue == false) {
                    evt.preventDefault();
                }
            } else {
                evt.returnValue = bValue;
            }

        }
    }

    function _getLeftButton() {
        //IE9 added some W3C compartibility supports, including value of the event object's button property.
        //And addEventListener as well.
        //So, we use addEventListener to detect if the browse handle button in standard way or not.
        if (window.addEventListener) {
            return 0;
        } else {
            return 1;
        }
    }

    this.DOMObject = function (sObjectId,sAccessibleName) {
        if (document.getElementById) {

            var objUnKnown = document.getElementById(sObjectId);
            if (!objUnKnown) {
                throw "Object " + sObjectId + "could not be found";
            }
            if (sAccessibleName != null) {

                eval("me.Controls." + sAccessibleName + " = objUnKnown");
            }
            return objUnKnown;
        }
    }


    this.GetWindowPos = function (objElement) {
        var rect = new Array();
        rect[0] = 0;
        rect[1] = 0;
        rect[2] = objElement.offsetWidth;
        rect[3] = objElement.offsetHeight;
        if (objElement.tagName != "BODY" && objElement.tagName != "HTML") {
            var ParentRect = _browser.GetWindowPos(objElement.offsetParent);
            rect[0] = objElement.offsetLeft + ParentRect[0] ;
            rect[1] = objElement.offsetTop + ParentRect[1] ;
        }
        return rect;
    }

    this.GetCookie = function (sCookieName) {
        var dc = document.cookie;
        var prefix = sCookieName + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        } else {
            begin += 2;
        }
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }

        temp = dc.substring(begin + prefix.length, end) ;
        temp = temp.replace(/\+/g, " ") ;

        return unescape(temp.replace(prefix, ""));
    }

}
