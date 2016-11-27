var _browser;
var _resizePlaceHolders;
var _image;
var _containerRect;
var _controls; //pointer to _controls
var _imageEditorEnabled = true;
var _bSelectionSwitch = false, _bResizeSwitch = false, _bMoveSwitch = false;
var actualWidth;
var actualHeight;

var commandQueue = new CommandQueue();

function Initialize(isEnabled, currentProjectId) {
    if (isEnabled == false) {
        _imageEditorEnabled = false;
    }

    _browser = new clsBrowser();
    _controls = _browser.Controls;
    _image = new clsImageAttributes();

    _browser.DOMObject("WorkAreaContainer", "WorkAreaContainer");
    _browser.DOMObject("WorkArea", "WorkArea");
    _browser.DOMObject("selectionArea", "Selection");
    _browser.DOMObject("imageContainer", "RealImageContainer");

    CreateImageElements();

    MakeWorkAreaUnselectable();

    if (_imageEditorEnabled) {
        _browser.DOMObject("ajaxLoader", "AjaxLoaderImage");

        _browser.DOMObject("txtCropTop", "InputCropTop");
        _browser.DOMObject("txtCropLeft", "InputCropLeft");
        _browser.DOMObject("txtCropWidth", "InputCropWidth");
        _browser.DOMObject("txtCropHeight", "InputCropHeight");

        _browser.DOMObject("Preset", "InputPreset");
        _browser.DOMObject("txtResizeWidth", "InputResizeWidth");
        _browser.DOMObject("txtResizeHeight", "InputResizeHeight");

        _browser.DOMObject("CheckboxGrayscale", "CheckboxGrayscale");

        _resizePlaceHolders = new clsResizePlaceHolders();
        _resizePlaceHolders.p1 = _browser.DOMObject("p1");
        _resizePlaceHolders.p2 = _browser.DOMObject("p2");
        _resizePlaceHolders.p3 = _browser.DOMObject("p3");
        _resizePlaceHolders.p4 = _browser.DOMObject("p4");
        _resizePlaceHolders.p5 = _browser.DOMObject("p5");
        _resizePlaceHolders.p6 = _browser.DOMObject("p6");
        _resizePlaceHolders.p7 = _browser.DOMObject("p7");
        _resizePlaceHolders.p8 = _browser.DOMObject("p8");

        _browser.DOMObject("GeneralPane", "GeneralPane");
        _browser.DOMObject("CropPane", "CropPane");
        _browser.DOMObject("ResizePane", "ResizePane");
        _browser.DOMObject("TransformPane", "TransformPane");

        _browser.DOMObject(sZoomTaskId, "ZoomTask");

        _controls.ZoomTask.applyChanges = false;
        _controls.ZoomTask.value = 100;
        _controls.ZoomTask.applyChanges = true;
    }

    // Get Dialog arguments
    if (EPi.GetDialog()) {
        var dialogArguments = EPi.GetDialog().dialogArguments;

        if (dialogArguments.src != null) {
            LoadImages(dialogArguments.src, dialogArguments.contentLink);
        }

        if (isHtmlAttributesEnabled) {
            InitializeImageProperties(dialogArguments);
        } else {
            UpdateFileNameDisplay(dialogArguments.src);
        }
    }

    EPi.PageLeaveCheck.AddToChecklist(PageLeaveChangeHandler);

    var sizeSetting = JSON.parse(this.dialogSizeSetting);

    // Resize dialog follow setting in episerver.config
    this.frameElement.parentNode.style.width = sizeSetting.width;
    this.frameElement.parentNode.style.height = sizeSetting.height;

    // Resize iframe follow setting in episerver.config
    this.frameElement.style.width = sizeSetting.width;
    this.frameElement.style.height = sizeSetting.height;

    OnWindowResize();
    window.onresize = OnWindowResize;
}

// Most commonly called function that calls the server for adjustments to the image.
// The function is also called for execution of not adjustment commands like Save and saveAs.
function ApplyChanges() {
    LoadImages(_image.source, _image.contentLink);

    ClearAllSelection();
    _resizePlaceHolders.Check();

    UpdateTasks();

    EPi.PageLeaveCheck.SetPageChanged(false);
}


// Creates two image elements needed for changing image (resize, crop, transform).
// Called from Init
function CreateImageElements() {
    var image = document.createElement("img");

    image.id = "selectionImage";
    image.style.display = "none";
    image.ondblclick = Crop;
    image.unselectable = "on";
    image.className = "selectionimage";

    _controls.Selection.appendChild(image);
    _browser.DOMObject("selectionImage", "SelectionImg");

    image = document.createElement("img");
    image.id = "realImage";
    image.onload = ImageReady;
    image.onerror = ImageLoadError;
    image.style.display = "none";
    image.unselectable = "on";
    image.style.MozUserSelect = "none";

    _controls.RealImageContainer.appendChild(image);
    _browser.DOMObject("realImage", "RealImage");
}

// Loads new images and updates globally used _image object.
function LoadImages(imagePath, contentLink) {

    if (_imageEditorEnabled) {
        _controls.AjaxLoaderImage.style.visibility = "visible";
    }

    var selectionImage = _controls.SelectionImg;
    var realImage = _controls.RealImage;

    selectionImage.style.display = "";
    realImage.style.display = "";

    // If the Image  Editor is not enabled there's no reason to use the rendering functionality. Just set the source.
    if (_imageEditorEnabled) {

        var date = new Date();
        var ticks = date.getTime();
        var uniqueImagePath = encodeURIComponent(imagePath + "&timestamp=" + ticks);
        var url = getImageRendererUrl(_image.zoom, sQuality.value, uniqueImagePath, commandQueue.Serialize(), contentLink);

        selectionImage.src = url;
        realImage.src = url;
    } else {
        realImage.src = imagePath;
    }

    // Global reference used by ImageEditor resize, zoom, crop...
    _image.source = imagePath;
    _image.contentLink = contentLink;
    _image.extension = _image.source.substring(_image.source.lastIndexOf("."));
}

function getImageRendererUrl(zoom, quality, uniqueImagePath, commandQueue, contentLink) {

    var url = "RenderImage.ashx?epieditmode=True";

    // if there is any current project available then append it to the url so the core can fetch the projected version of the image.
    // REMARK: The RenderImage works with permanent links and therefore we need to append the epiprojects
    // to render the correct image inside project mode
    if (currentProjectId && currentProjectId != "") {
        url += "&epiprojects=" + currentProjectId;
    }

    url += "&zoom=" + zoom + "&quality=" + quality + "&img=" + uniqueImagePath;
    url += "&commands=" + commandQueue;

    if (contentLink) {
        url += "&contentLink=" + contentLink;
    }

    return url;
}

// ImageReady is called when image is loaded
// Updates size of image element and status
function ImageReady() {
    if (_controls == null) {
        return;
    }
    if (_controls.RealImage.readyState != "complete" && _controls.RealImage.readyState != null) {
        setTimeout(ImageReady, 100);
        return;
    }

    _controls.RealImage.style.width = "";
    _controls.RealImage.style.height = "";
    _containerRect = _browser.GetWindowPos(_controls.RealImageContainer);

    _image.width = _controls.RealImage.offsetWidth;
    _image.height = _controls.RealImage.offsetHeight;

    UpdateStatus();
}

function UpdateFileNameDisplay(filePath) {
    imagePath = document.getElementById("imagePath");
    imagePath.value = filePath;

    var fileName = document.getElementById("filename");
    if (fileName) {
        fileName.innerHTML = imageFileName || decodeURIComponent(filePath.substr(filePath.lastIndexOf("/") + 1));
    }
}

function ImageLoadError(e) {
    if (confirm("There was an error when loading image. The image format is not supported by your browser or the image could not be reached. Close Image editor?")) {
        EPi.GetDialog().Close();
    }
}

// ***********************************************************************************************
// Mouse related action
// ***********************************************************************************************

// OnMouseDown - Handler for all mouse down events on the RealImage,SelectionImage and their containers.
// Based on the position of the mouseclick it identifies the action that is to be prepared for.
// Possible actions could be
//      - Moving/Dragging of the selection area
//      - Resizing an existing selection area
//      - Initiating a selection process - [ current only possible for crop ]

function OnMouseDown(evt) {
    if (!_imageEditorEnabled) {
        return;
    }

    if (_controls.WorkAreaContainer.setCapture) {
        _controls.WorkAreaContainer.setCapture();
        EPi.AddEventListener(_controls.WorkAreaContainer, "mouseup", OnMouseUp);
    } else {
        EPi.AddEventListener(window, "mouseup", OnMouseUp);
    }

    //line added as mouse based functionality is only supported while the Crop or Resize Panes are visible
    if (_controls.CropPane.style.display == "none" &&  _controls.ResizePane.style.display != "block") {
        return;
    }
    var objSrcElement = _browser.evt.SrcElement(evt);
    if ((objSrcElement.id  == "p5" || objSrcElement  == _controls.SelectionImg || objSrcElement  == _controls.Selection) || _controls.Selection.style.cursor != "default") {
        BeginMoveSelection(evt);
        return;
    }

    if (evt.button != parseInt(_browser.LeftButton)) {
        _bSelectionSwitch = false;
        return false;
    }

    if (_controls.CropPane.style.display != "none") {
        _bSelectionSwitch = true;
        PositionSelectionBox((evt.clientX + _controls.WorkAreaContainer.scrollLeft - _containerRect[0]), (evt.clientY + _controls.WorkAreaContainer.scrollTop - _containerRect[1]), 0, 0);
        PositionSelectionImage();

        MakeReadyForSelection();
    }
}

function OnMouseUp(evt) {
    if (_controls.WorkAreaContainer.setCapture) {
        EPi.RemoveEventListener(_controls.WorkAreaContainer, "mouseup", OnMouseUp);
        _controls.WorkAreaContainer.releaseCapture();
    } else {
        EPi.RemoveEventListener(window, "mouseup", OnMouseUp);
    }
    CompleteSelection();
}

// Prepares the image for selection in the CropMode
function MakeReadyForSelection() {
    _resizePlaceHolders.Display(true);
    _controls.SelectionImg.style.visibility = "visible";
    _controls.Selection.style.visibility = 'visible';
    _controls.RealImage.className = "imageOpacity";
}

// OnMouseMove - Handler for all mouse move events on the RealImage,SelectionImage and their containers.
// Based on the area that is being dragged the the function decides the following.
//  - Start moving an existing selection around [ used currently only for the crop mode ]
//  - Resize a selection
//  - If not in drag mode then just display the appropriate cursor based on the relative position of the mouse.
function OnMouseMove(evt) {
    if (!_imageEditorEnabled) {
        return;
    }

    if (evt.clientX < 0 ||
        evt.clientY < 0 ||
        evt.clientX > (_controls.WorkAreaContainer.clientWidth + _controls.WorkAreaContainer.offsetLeft) ||
        evt.clientY > (_controls.WorkAreaContainer.clientHeight + _controls.WorkAreaContainer.offsetTop)) {
        //Outside of image area.
        return;
    }

    try {
        if (_controls.CropPane.style.display != "block" && _controls.ResizePane.style.display != "block") {
            return false;
        }
        if (_bMoveSwitch) {
            MoveSelection(evt);
        }
        if (_bResizeSwitch) {
            ResizeSelection(evt);
        }
        if (!_bMoveSwitch && !_bSelectionSwitch && !_bResizeSwitch) {
            CheckCursorDisplay(evt);
        }
        if (_bSelectionSwitch) {
            var imageRight = _containerRect[0] + _containerRect[2];
            var imageBottom = _containerRect[1] + _containerRect[3];
            _controls.Selection.style.width = Math.max(0, (Math.min(imageRight, evt.clientX) + _controls.WorkAreaContainer.scrollLeft - _containerRect[0] - _controls.Selection.offsetLeft)) + 'px';
            _controls.Selection.style.height = Math.max(0, (Math.min(imageBottom, evt.clientY) + _controls.WorkAreaContainer.scrollTop - _containerRect[1] - _controls.Selection.offsetTop)) + 'px';
            _resizePlaceHolders.Check();
        }
    }
    catch (e) {}

    return false;
}

function RefreshTextBoxesValues() {
    if (_controls.Selection.style.visibility == "hidden") {
        if (_controls.CropPane.style.display == "block") {
            _controls.InputCropTop.value = 0;
            _controls.InputCropLeft.value = 0;
            _controls.InputCropWidth.value = 0;
            _controls.InputCropHeight.value = 0;

            if (_controls.SelectCropPreset) {
                _controls.SelectCropPreset.value = 0;
            }
        } else if (_controls.ResizePane.style.display == "block") {
            _controls.InputPreset.value = 0;
            _controls.InputResizeWidth.value = Math.round((_image.width / _image.zoom) * 100);
            _controls.InputResizeHeight.value = Math.round((_image.height / _image.zoom) * 100);

            if (_controls.SelectResizePreset) {
                _controls.SelectResizePreset.value = 0;
            }
        }
    } else {
        if (_controls.CropPane && _controls.CropPane.style.display == "block") {
            _controls.InputCropTop.value = Math.round((_controls.Selection.offsetTop / _image.zoom) * 100);
            _controls.InputCropLeft.value = Math.round((_controls.Selection.offsetLeft / _image.zoom) * 100);
            _controls.InputCropWidth.value = Math.round((_controls.Selection.clientWidth / _image.zoom) * 100);
            _controls.InputCropHeight.value = Math.round((_controls.Selection.clientHeight / _image.zoom) * 100);

            if (_controls.SelectCropPreset) {
                _controls.SelectCropPreset.value = 0;
            }
        } else if (_controls.ResizePane && _controls.ResizePane.style.display == "block") {
            _controls.InputPreset.value = 0;
            _controls.InputResizeWidth.value = Math.round(((_controls.Selection.clientWidth)  / _image.zoom) * 100);
            _controls.InputResizeHeight.value = Math.round(((_controls.Selection.clientHeight) / _image.zoom) * 100);

            if (_controls.SelectResizePreset) {
                _controls.SelectResizePreset.value = 0;
            }
        }
    }
}

// Called at the end of all the selection process. Common mouseup handler to finish of the process and reset defaults if any.
function CompleteSelection() {
    if (!_imageEditorEnabled) {
        return;
    }

    _bSelectionSwitch = false;
    _bMoveSwitch = false;
    _bResizeSwitch = false;
    _controls.RealImage.style.cursor = "default";

    var bSelectionMode = true;
    _controls.Selection.style.visibility = "visible";

    if (_controls.Selection.offsetWidth <= 10 || _controls.Selection.offsetHeight <= 10) {
        ClearAllSelection();
        if (_controls.ResizePane.style.display == "block") {
            PositionSelectionBox(0, 0, _controls.RealImage.offsetWidth, _controls.RealImage.offsetHeight);
            _controls.Selection.style.visibility = 'visible';
            _resizePlaceHolders.Display(true, "Resize");
        }

        PositionSelectionImage();
        _controls.RealImage.className = "";
        bSelectionMode = false;
    }

    _controls.Selection.widthState = _controls.Selection.offsetWidth;
    _controls.Selection.heightState = _controls.Selection.offsetHeight;

    _controls.Selection.leftState = _controls.Selection.offsetLeft;
    _controls.Selection.topState = _controls.Selection.offsetTop;

    RefreshTextBoxesValues();
}


function BeginMoveSelection(evt) {
    if (evt.button != parseInt(_browser.LeftButton)) {
        _bMoveSwitch = false;
        _bResizeSwitch = false;
        return false;
    }
    if (_controls.Selection.style.cursor == "move") {
        _bMoveSwitch = true;
    } else {
        _bResizeSwitch = true;
    }
    _controls.Selection.lastX = evt.clientX;
    _controls.Selection.lastY = evt.clientY;
    _controls.Selection.lastHeight = parseInt(_controls.Selection.style.height);
    _controls.Selection.lastWidth = parseInt(_controls.Selection.style.width);
}

function ResizeSelection(evt) {
    var iXChange = evt.clientX - _controls.Selection.lastX;
    var iYChange = evt.clientY - _controls.Selection.lastY;

    _controls.RealImage.style.cursor = _controls.Selection.style.cursor;
    var bConstrainProportionsMode = (_browser.DOMObject("checkProportions").checked && _controls.ResizePane.style.display == "block");
    var bResizeMode = (_controls.ResizePane.style.display == "block");
    var iTop, iLeft, iWidth, iHeight;

    switch (_controls.Selection.style.cursor)
    {
        case "n-resize":
            iTop = (_controls.Selection.offsetTop + iYChange);
            iHeight = (_controls.Selection.lastHeight - iYChange);
            break;
        case "s-resize":
            iHeight = (_controls.Selection.lastHeight + iYChange) ;
            break;
        case "e-resize":
            iLeft = (_controls.Selection.offsetLeft + iXChange);
            iWidth = (_controls.Selection.lastWidth - iXChange);
            break;
        case "w-resize":
            iWidth = (_controls.Selection.lastWidth + iXChange) ;
            break;
        case "se-resize":
            if (bConstrainProportionsMode) {
                var iChangedPercent = (_controls.Selection.widthState - (_controls.Selection.lastWidth + iXChange)) / (_controls.Selection.widthState / 100);
                iYChange = _controls.Selection.heightState * (iChangedPercent / 100);
                iWidth  = (_controls.Selection.lastWidth + iXChange)  ;
                iHeight =  _controls.Selection.heightState - iYChange ;
            } else {
                iWidth  = (_controls.Selection.lastWidth + iXChange)  ;
                iHeight = (_controls.Selection.lastHeight + iYChange);
            }
            break;
        case "sw-resize":
            iLeft   = (_controls.Selection.offsetLeft + iXChange) ;
            iWidth  = (_controls.Selection.lastWidth - iXChange) ;
            iHeight = (_controls.Selection.lastHeight + iYChange);
            break;
        case "ne-resize":
            iTop    = (_controls.Selection.offsetTop + iYChange) ;
            iHeight = (_controls.Selection.lastHeight - iYChange) ;
            iWidth  = (_controls.Selection.lastWidth + iXChange) ;
            break;
        case "nw-resize":
            iTop    = (_controls.Selection.offsetTop + iYChange) ;
            iHeight = (_controls.Selection.lastHeight - iYChange) ;
            iLeft   = (_controls.Selection.offsetLeft + iXChange) ;
            iWidth  = (_controls.Selection.lastWidth - iXChange) ;
            break;
    }

    if (!bResizeMode) {
        // If in cropmode prevent selection outside original image boundaries.
        var imageWidth = _controls.RealImage.offsetWidth;
        var imageHeight = _controls.RealImage.offsetHeight;

        iTop = iTop == null ? _controls.Selection.offsetTop : iTop;
        iLeft = iLeft == null ? _controls.Selection.offsetLeft : iLeft;

        if (iTop < 0) {
            iHeight = iHeight + iTop;
            iTop = 0;
        }
        if (iLeft < 0) {
            iWidth = iWidth + iLeft;
            iLeft = 0;
        }
        if (iHeight + iTop >= imageHeight) {
            iHeight = imageHeight - iTop;
        }
        if (iWidth + iLeft >= imageWidth) {
            iWidth = imageWidth - iLeft;
        }
    }

    PositionSelectionBox(iLeft, iTop, iWidth, iHeight);
    PositionSelectionImage();

    if (bResizeMode) {
        PositionRealImage(iWidth, iHeight);
    }
    _controls.Selection.lastX = evt.clientX ;
    _controls.Selection.lastY = evt.clientY ;
    _controls.Selection.lastHeight = parseInt(_controls.Selection.style.height);
    _controls.Selection.lastWidth = parseInt(_controls.Selection.style.width);
}

function CheckCursorDisplay(evt) {
    try {
        var objSrcElement = _browser.evt.SrcElement(evt);
        if (_controls.Selection == objSrcElement || _controls.SelectionImg == objSrcElement || objSrcElement.className == "resizePlaceHolders") {
            var constBorderCaptureWidth = 5;
            var bTopMost    = (((evt.clientY + _controls.WorkAreaContainer.scrollTop) - _containerRect[1]) - _controls.Selection.offsetTop <= constBorderCaptureWidth);
            var bLeftMost   = (((evt.clientX + _controls.WorkAreaContainer.scrollLeft) - _containerRect[0]) - _controls.Selection.offsetLeft <= constBorderCaptureWidth);
            var bRightMost  = ((((evt.clientX + _controls.WorkAreaContainer.scrollLeft) - _containerRect[0]) - (_controls.Selection.offsetLeft + _controls.Selection.offsetWidth)) >= -constBorderCaptureWidth);
            var bBottomMost = ((((evt.clientY + _controls.WorkAreaContainer.scrollTop) - _containerRect[1]) - (_controls.Selection.offsetTop + _controls.Selection.offsetHeight)) >= -constBorderCaptureWidth);
            var bCropMode = _controls.CropPane.style.display == "none" ? false : true;
            var bConstrainProportionsMode = (_browser.DOMObject("checkProportions").checked && _controls.ResizePane.style.display == "block");

            if (bTopMost && bLeftMost) {
                if (bCropMode) {
                    _controls.Selection.style.cursor = "nw-resize";
                }
            } else if (bTopMost && bRightMost) {
                if (bCropMode) {
                    _controls.Selection.style.cursor = "ne-resize";
                }
            } else if (bBottomMost && bLeftMost) {
                if (bCropMode) {
                    _controls.Selection.style.cursor = "sw-resize";
                }
            } else if (bBottomMost && bRightMost) {
                _controls.Selection.style.cursor = "se-resize";
            } else if (bTopMost) {
                if (bCropMode) {
                    _controls.Selection.style.cursor = "n-resize";
                }
            } else if (bLeftMost) {
                if (bCropMode) {
                    _controls.Selection.style.cursor = "e-resize";
                }
            } else if (bRightMost) {
                if (!bConstrainProportionsMode) {
                    _controls.Selection.style.cursor = "w-resize";
                }
            } else if (bBottomMost) {
                if (!bConstrainProportionsMode) {
                    _controls.Selection.style.cursor = "s-resize";
                }
            } else {
                if (bCropMode) {
                    _controls.Selection.style.cursor = "move";
                    _bResizeSwitch = false;
                } else {
                    _controls.Selection.style.cursor  = "default";
                }
            }
        } else {
            _controls.Selection.style.cursor  = "default";
            _bResizeSwitch = false;
        }
    }
    catch (e) {}
}

function MoveSelection(evt) {
    _controls.Selection.style.left = (_controls.Selection.offsetLeft + (evt.clientX - _controls.Selection.lastX))  + 'px';

    if (_controls.Selection.offsetLeft <= 0 && (evt.clientX - _controls.Selection.lastX) < 0) {
        _controls.Selection.style.left = "0px";
    } else if ((_controls.Selection.offsetLeft + _controls.Selection.clientWidth) >= _controls.RealImageContainer.offsetWidth && (evt.clientX - _controls.Selection.lastX) > 0) {
        _controls.Selection.style.left = (_controls.RealImageContainer.offsetWidth - _controls.Selection.clientWidth) + "px";
    }
    _controls.Selection.style.top = (_controls.Selection.offsetTop + (evt.clientY - _controls.Selection.lastY)) +  'px';
    if (_controls.Selection.offsetTop <= 0 && (evt.clientY - _controls.Selection.lastY) < 0) {
        _controls.Selection.style.top = "0px";
    } else if ((_controls.Selection.offsetTop + _controls.Selection.clientHeight) >= _controls.RealImageContainer.offsetHeight && (evt.clientY - _controls.Selection.lastY) > 0) {
        _controls.Selection.style.top = (_controls.RealImageContainer.offsetHeight - _controls.Selection.clientHeight) + "px";
    }

    PositionSelectionImage();

    _controls.Selection.lastX = evt.clientX;
    _controls.Selection.lastY = evt.clientY;

    RefreshTextBoxesValues();
}

function clsImageAttributes() {
    this.width          = 0;
    this.height         = 0;
    this.grayscale      = false;
    this.zoom           = 100;
    this.source         = "";
    this.contentLink    = "";
}

function UpdateStatus() {

    //Removed filesize since it is misinterpreted by users and not showing correct value when zoom is not 100%
    /*
    var fileSize = _browser.GetCookie("ImageEditorFileSize");
    if (fileSize == null)
    {
        fileSize = Math.round(_controls.RealImage.fileSize / 1024);
    }
    document.getElementById("filesize").innerHTML = fileSize;

    */

    if (_imageEditorEnabled) {
        _controls.AjaxLoaderImage.style.visibility = "hidden";
    }

    var zoomFactor = _image.zoom / 100;
    actualWidth = Math.round(_image.width / zoomFactor);
    actualHeight = Math.round(_image.height / zoomFactor);

    // Update width and height for the information box
    document.getElementById("widthDisplay").innerHTML = actualWidth;
    document.getElementById("heightDisplay").innerHTML = actualHeight;

    //Make sure that the values for resize/crop matches the image size when (re)loading the image. For instance to handle undo/redo.
    RefreshTextBoxesValues();

    // Update Html size data (only available when editing html attributes)
    if (isHtmlAttributesEnabled) {
        UpdateImageHtmlSizeData(actualWidth, actualHeight);
    }
}

// Called when Constrain Proportions is clicked by user.
function HandleProportion() {
    _resizePlaceHolders.Display(true, "Resize");
}

function ShowPanel(objPanelToShow) {
    _controls.GeneralPane.style.display = "none";
    _controls.CropPane.style.display = "none";
    _controls.ResizePane.style.display = "none";
    _controls.TransformPane.style.display = "none";

    _controls.RealImage.style.width = _controls.SelectionImg.offsetWidth + "px";
    _controls.RealImage.style.height = _controls.SelectionImg.offsetHeight + "px";

    if (objPanelToShow != null) {
        objPanelToShow.style.display = "block";
    } else {
        ClearAllSelection();
    }
}

function UpdateTasks() {
    EPi.ToolButton.SetEnabled(sRedoTaskId, commandQueue.CanRedo());
    EPi.ToolButton.SetEnabled(sUndoTaskId, commandQueue.CanUndo());
    EPi.ToolButton.SetEnabled(sRevertTaskId, commandQueue.CanUndo());
}


// *****************************************************************************************
// Functions on tool clicks
// *****************************************************************************************
// all functions here are ToolButton Click handlers and starting points
// of execution for supported commands in the image editor
function FlipX() {
    commandQueue.Add(new ImageOperation("FlipX"));
    ApplyChanges();
}


function FlipY() {
    commandQueue.Add(new ImageOperation("FlipY"));
    ApplyChanges();
}

function Rotate(angle) {
    var imageOperation = new ImageOperation("Rotate");
    imageOperation.angle = angle;
    commandQueue.Add(imageOperation);
    ApplyChanges();
}

function Grayscale(node) {
    if (node.checked && !_image.grayscale) {
        commandQueue.Add(new ImageOperation("Grayscale"));
        ApplyChanges();
        _image.grayscale = true;
    } else if (!node.checked && _image.grayscale) {
        commandQueue.RemoveByName("Grayscale");
        commandQueue.Add(new ImageOperation("Grayscale"));
        Undo();
        _image.grayscale = false;
    }
}

function SetGrayscaleTool(bool) {
    _image.grayscale = bool;
    _controls.CheckboxGrayscale.checked = bool;
}

function SwitchTool(tool) {
    if (tool == null) {
        tool = _controls.GeneralPane;
    }
    ShowPanel(tool);
    _controls.Selection.style.width = "0px";
    CompleteSelection();

    EPi.PageLeaveCheck.SetPageChanged(false);
}

// Functions called by Crop, Resize and Transformbuttons.
function Crop() {
    if (_controls.InputCropHeight.value == 0 || _controls.InputCropWidth.value == 0) {
        return;
    }
    var imageOperation = new ImageOperation("Crop", _controls.InputCropWidth.value, _controls.InputCropHeight.value, _controls.InputCropTop.value, _controls.InputCropLeft.value);
    commandQueue.Add(imageOperation);
    ApplyChanges();
    CompleteSelection();
}

function Resize() {
    if (actualWidth == _controls.InputResizeWidth.value && actualHeight == _controls.InputResizeHeight.value) {
        return;
    }
    var imageOperation = new ImageOperation("Resize", parseInt(_controls.InputResizeWidth.value), parseInt(_controls.InputResizeHeight.value));
    commandQueue.Add(imageOperation);
    ApplyChanges();
}


function Undo() {
    commandQueue.Undo();
    ApplyChanges();
}

function Redo() {
    commandQueue.Redo();
    ApplyChanges();
}

function Revert() {
    commandQueue.Revert();
    SetGrayscaleTool(false);
    ApplyChanges();
}


function Zoom(evt) {
    if (_controls.ZoomTask.applyChanges == false) {
        return
    }
    _image.zoom = _controls.ZoomTask.value;
    ApplyChanges();
}

function Compress(value) {
    ApplyChanges();
}

function PageLeaveChangeHandler() {
    return !commandQueue.IsEmpty();
}

function OnImageSaveAsCompleted(imageSource) {
    if (imageSource != null) {
        if (!isOpenedFromFileManager) {
            // When opened from editor
            UpdateFileNameDisplay(imageSource);
            OkClick();
        } else {
            // When opened from file manager
            commandQueue.Revert();
            EPi.PageLeaveCheck.SetPageChanged(false);
            var lastSlashPos = imageSource.lastIndexOf("/") + 1;
            var fileName = encodeURIComponent(imageSource.substring(lastSlashPos));
            var folderPath = imageSource.substring(0, lastSlashPos);

            LoadImages(folderPath + fileName);
            //Hide any open panel and selection image
            ShowPanel(_controls.GeneralPane);
            UpdateFileNameDisplay(imageSource);
        }
    }
}


// *****************************************************************************************
// ResizePane related Functions
// *****************************************************************************************
// Changes the resize selection based on the values provided in the input.
// All values first get the current zoom factor applied so that a correct preview is generated.
function ChangeResizeSelection(element) {
    var sourceElement = element;

    var imageHeight = parseInt(_controls.InputResizeHeight.value);
    var imageWidth = parseInt(_controls.InputResizeWidth.value);

    if (_browser.DOMObject("checkProportions").checked) {
        if (sourceElement == _controls.InputResizeHeight) {
            imageWidth = Math.round((_image.width / _image.height) * imageHeight);
            _controls.InputResizeWidth.value = imageWidth;
        } else {
            imageHeight = Math.round((_image.height / _image.width) * imageWidth);
            _controls.InputResizeHeight.value = imageHeight;
        }

        imageWidth = Math.round(imageWidth * (_image.zoom / 100));
        imageHeight = Math.round(imageHeight * (_image.zoom / 100));
    }

    PositionSelectionBox(null, null, imageWidth, imageHeight);
    PositionRealImage(imageWidth, imageHeight);

    if (_controls.InputResizeWidth.value == 0 || _controls.InputResizeHeight.value == 0) {
        EPi.ToolButton.SetEnabled(sResizeOKButtonId, false);
    } else {
        EPi.ToolButton.SetEnabled(sResizeOKButtonId, true);
    }
}

function ValidateResize(evt, element) {
    if (evt.keyCode == 13) {
        ChangeResizeSelection(element);
    }
    if (!ValidateNumeric(evt)) {
        return;
    }
}

// Set Crop or Resize sizing using presets
function SetPresetValues(sPresetValue, Action) {
    if (sPresetValue == 0) {
        _controls.InputCropWidth.value = 0;
        _controls.InputCropHeight.value = 0;
        ClearAllSelection();
        return;
    }

    var zoomFactor = _image.zoom / 100;
    var widthAndHeight = sPresetValue.split("*");
    var sWidth  = widthAndHeight[0];
    var sHeight = widthAndHeight[1];

    if (Action == "Crop") {
        _controls.InputCropWidth.value = sWidth;
        _controls.InputCropHeight.value = sHeight;
        var iflag = ChangeCropSelection();
        if (iflag == false) {
            return;
        }
        PositionSelectionBox(null, null, Math.round(sWidth * zoomFactor), Math.round(sHeight * zoomFactor));
    } else if (Action == "Resize") {
        var imageWidth = _image.width;
        var imageHeight = _image.height;
        if (sPreset.value != 0) {
            var iZoomFactor = 100;
            if (_browser.DOMObject("checkProportions").checked) {
                iZoomFactor = CalculateImageSizeWithinPreset(sWidth, sHeight);
                iZoomFactor = iZoomFactor / 100;
                sWidth = Math.round(parseInt(imageWidth) * iZoomFactor);
                sHeight = Math.round(parseInt(imageHeight) * iZoomFactor);
            }

            _controls.InputResizeWidth.value = sWidth;
            _controls.InputResizeHeight.value = sHeight;

            imageWidth = (sWidth / 100) * _image.zoom;
            imageHeight = (sHeight / 100) * _image.zoom;
        } else {
            _controls.InputResizeWidth.value = imageWidth;
            _controls.InputResizeHeight.value = imageHeight;
            EPi.ToolButton.SetEnabled(sResizeOKButtonId, false);
        }

        PositionSelectionBox(null, null, imageWidth, imageHeight);
        PositionRealImage(imageWidth, imageHeight);
    }
}

// Used when resizing using a preset
function CalculateImageSizeWithinPreset(maxWidth, maxHeight) {
    var calculatedZoomValue = 0;
    var imageWidth = _image.width;
    var imageHeight = _image.height;

    //Get the difference of the actual image dimensions from the max dimensions
    var widthDifference = imageWidth - maxWidth;
    var heightDifference = imageHeight - maxHeight;

    widthDifference = widthDifference / (imageWidth / 100);
    heightDifference = heightDifference / (imageHeight / 100);

    calculatedZoomValue = heightDifference;
    if (widthDifference > heightDifference) {
        calculatedZoomValue = widthDifference;
    }
    if (calculatedZoomValue < 0) {
        calculatedZoomValue = 100 + Math.abs(calculatedZoomValue);
    } else {
        calculatedZoomValue = 100 - calculatedZoomValue;
    }
    //return Math.round(calculatedZoomValue);
    return calculatedZoomValue;

}

// *****************************************************************************************
// CropPane related Functions
// *****************************************************************************************
function ValidateCrop(evt) {
    if (evt.keyCode == 13) {
        ChangeCropSelection();
    }
    if (!ValidateNumeric(evt)) {
        return;
    }
}

function ChangeCropSelection() {
    var iLeft = (_controls.InputCropLeft.value / 100) * _image.zoom;
    var iTop = (_controls.InputCropTop.value / 100) * _image.zoom;
    var iWidth = (_controls.InputCropWidth.value / 100) * _image.zoom;
    var iHeight = (_controls.InputCropHeight.value / 100) * _image.zoom;
    if (iLeft + iWidth > _image.width || iTop + iHeight > _image.height) {
        alert(sManualDimensionOverflow);
        RefreshTextBoxesValues();

        return false;
    }
    PositionSelectionBox(iLeft, iTop, iWidth, iHeight);
    PositionSelectionImage();
    _resizePlaceHolders.Check();
    MakeReadyForSelection();

}

//******************************************************************************************
// Common Helper Functions
//******************************************************************************************

function ClearAllSelection() {
    _controls.SelectionImg.style.visibility = "hidden";
    _resizePlaceHolders.Display(false);
    _controls.Selection.style.visibility = "hidden";
    _controls.Selection.style.height = "0px";
    _controls.Selection.style.width = "0px";
    _controls.RealImage.className = "";
}

function PositionSelectionBox(iLeft, iTop, iWidth, iHeight) {
    if (iLeft != null) {
        _controls.Selection.style.left = iLeft + "px";
    }
    if (iTop != null) {
        _controls.Selection.style.top = iTop + "px";
    }
    if (iWidth != null) {
        _controls.Selection.style.width = iWidth + "px";
    }
    if (iHeight != null) {
        _controls.Selection.style.height = iHeight + "px";
    }

    _resizePlaceHolders.Check();
}

//Positions the selection image with relation to its containing selection box
function PositionSelectionImage() {
    _controls.SelectionImg.style.top = "-" + (_controls.Selection.offsetTop + 1) + "px";
    _controls.SelectionImg.style.left = "-" + (_controls.Selection.offsetLeft + 1) + "px";
    _resizePlaceHolders.Check();
}

function PositionRealImage(width, height) {
    if (width == null) {
        width = _controls.RealImage.offsetWidth;
    }

    if (height == null) {
        height = _controls.RealImage.offsetHeight;
    }

    _controls.RealImage.style.height = height + "px";
    _controls.RealImage.style.width =  width + "px";
}



// Validation functions to validate numeric input into the resize and crop related input boxes.
function ValidateNumeric(evt) {
    var iKeyCode = evt.charCode || evt.keyCode;
    var charCode = evt.charCode;

    // In firefox keycombinations like ctrl+c, ctrl+z and tab raises keypress event
    // and these key combinations are allowed. IE ver <=7 does not have evt.charCode.
    if (evt.ctrlKey || charCode == 0) {
        return true;
    }
    var sInput = String.fromCharCode(iKeyCode);
    var re = /[\d]/g;
    if (sInput.replace(re, "").length > 0) {
        _browser.evt.ReturnValue(evt, false);
        return false;
    }
    return true;
}

function MakeWorkAreaUnselectable() {
    // Make things harder to select.
    // In IE
    _controls.WorkAreaContainer.unselectable = "on";
    _controls.WorkArea.unselectable = "on";
    document.getElementById("selectionArea").unselectable = "on";
    document.getElementById("imageContainer").unselectable = "on";
    // In Firefox
    _controls.WorkAreaContainer.style.MozUserSelect = "none";
    _controls.WorkArea.style.MozUserSelect = "none";
    document.getElementById("selectionArea").style.MozUserSelect = "on";
    document.getElementById("imageContainer").style.MozUserSelect = "on";
}

function OnWindowResize() {
    if (!_imageEditorEnabled) {
        // If image editor isn't enabled there is no toolbar to resize
        // but we want the settings area to be on left side instead.
        var rightArea = document.getElementById("rightArea");
        if ($) {
            $("#leftArea").width(0).height(0);
            $("#rightArea").css("float", "none");

            //Hide Cancel button
            $('input.[type="button"][id$="cancelButton"]').parent().hide();
        }

        return;
    }


    //Resize the tool area to the same size as the highest tool fieldset.
    var toolbarPanel = document.getElementById("GeneralPane").parentNode;
    toolbarPanel.style.visibility = "hidden";
    var toolsHeight = 0;
    for (var i = 0; i < toolbarPanel.childNodes.length; i++) {

        var childNode = toolbarPanel.childNodes[i];
        if (childNode && childNode.nodeType == 1) { //NodeType 1 is Element Nodes.
            var display = childNode.style.display;
            childNode.style.display = "block";
            toolsHeight = Math.max(toolsHeight, childNode.offsetHeight);
            childNode.style.display = display;
        }
    }
    toolbarPanel.style.visibility = "";
    toolbarPanel.style.height = (toolsHeight) + "px";

    var newHeight = (document.documentElement.clientHeight - document.getElementById("WorkAreaContainer").offsetTop - 10);
    document.getElementById("WorkAreaContainer").style.height = Math.max(250, newHeight) + "px";

    var newWidth = (document.getElementById("leftArea").parentNode.offsetWidth - document.getElementById("rightArea").offsetWidth);
    document.getElementById("leftArea").style.width = Math.max(250, (newWidth - 10)) + "px";
}

function ManageScroll() {
    if (_controls.SelectionImg.style.visibility != "visible") {
        return;
    }
    PositionSelectionImage();
}

//Checks whether the user has unapplied changes in the currently opened tool
function hasUnappliedChanges() {
    if (_controls.CropPane && _controls.CropPane.style.display === "block") {
        return _controls.InputCropHeight.value != 0 && _controls.InputCropWidth.value != 0;
    } else if (_controls.ResizePane && _controls.ResizePane.style.display === "block") {
        return actualWidth != _controls.InputResizeWidth.value || actualHeight != _controls.InputResizeHeight.value;
    }
    return false;
}
