function clsResizePlaceHolders() {
    var me = this
    this.Check = function (sMode) {
        var iWidth = _controls.Selection.offsetWidth;
        var iTop = _controls.Selection.offsetTop;
        var iLeft = _controls.Selection.offsetLeft;
        var iHeight = _controls.Selection.offsetHeight;

        me.p1.style.top = (iTop - 3) + "px";
        me.p1.style.left = (iLeft - 3) + "px";

        me.p2.style.top = (iTop - 3) + "px";
        me.p2.style.left = Math.round((iLeft + ((iWidth - 2) / 2) - 3)) + "px";

        me.p3.style.top = (iTop - 3) + "px";
        me.p3.style.left = (iLeft + iWidth - 5) + "px";

        me.p4.style.top = Math.round((iTop + ((iHeight - 2) / 2) - 3)) + "px";
        me.p4.style.left = (iLeft + iWidth - 5) + "px";

        me.p5.style.top = (iTop + iHeight - 5) + "px";
        me.p5.style.left = (iLeft + iWidth - 5) + "px";

        me.p6.style.top = (iTop + iHeight - 5) + "px";
        me.p6.style.left = Math.round((iLeft + ((iWidth - 2) / 2) - 3)) + "px";

        me.p7.style.top = (iTop + iHeight - 5) + "px";
        me.p7.style.left = (iLeft - 3) + "px" ;

        me.p8.style.top = Math.round((iTop + ((iHeight - 2) / 2) - 3)) + "px";
        me.p8.style.left = (iLeft - 3) + "px";

    }
    this.Display = function (bDisplay, sMode) {
        var sCompleteVisbility = "visible";
        if (bDisplay == false)
            sCompleteVisbility = "hidden";

        var sReizeVisbility = sCompleteVisbility  ;
        var sConstrainProportionsVisibility = sCompleteVisbility ;
        if (sMode == "Resize") {
            sReizeVisbility = "hidden";
        }

        if (sMode == "Resize" && _browser.DOMObject("checkProportions").checked) {
            sConstrainProportionsVisibility = "hidden";
        }
        me.p1.style.visibility = sReizeVisbility;
        me.p2.style.visibility = sReizeVisbility;
        me.p3.style.visibility = sReizeVisbility;
        me.p4.style.visibility = sConstrainProportionsVisibility;
        me.p5.style.visibility = sCompleteVisbility;
        me.p6.style.visibility = sConstrainProportionsVisibility;
        me.p7.style.visibility = sReizeVisbility;
        me.p8.style.visibility = sReizeVisbility;

        me.p1.unselectable = "on";
        me.p2.unselectable = "on";
        me.p3.unselectable = "on";
        me.p4.unselectable = "on";
        me.p5.unselectable = "on";
        me.p6.unselectable = "on";
        me.p7.unselectable = "on";
        me.p8.unselectable = "on";
    }
}
