<%@ Page Language="C#" EnableTheming="false" Inherits="System.Web.Mvc.ViewPage<VisitorGroup>" MasterPageFile="../Shared/VisitorGroup.Master"  %>
<%@ Assembly Name="EPiServer.CMS.Shell.UI" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Framework.Web.Mvc.Html"%>
<%@ Import Namespace="EPiServer.Shell.Web.Mvc.Html" %>
<%@ Import Namespace="EPiServer.Personalization.VisitorGroups" %>

<%@ Register TagPrefix="EPiServerUI" Namespace="EPiServer.UI.WebControls" Assembly="EPiServer.UI" %>

<asp:Content ContentPlaceHolderID="HeaderContentRegion" ID="HeaderRegion" runat="server">
<%= Html.CssLink(EPiServer.Shell.Paths.ToClientResource("Cms", "ClientResources/Criteria/Criteria.css"))%>
<script type="text/javascript">
var pluginMethods = {}; //cache of criterion UI's controller (js)
(function() {
    dojo.require('dojo.dnd.Source');
    dojo.require('dojo.dnd.Manager');
    var ErrorDialog = dojo.require("epi-cms.ErrorDialog");
    dojo.require('dijit.layout.AccordionContainer');
    dojo.require('dijit.layout.ContentPane');
    dojo.require("dijit.form.HorizontalSlider");
    dojo.require("dijit.form.HorizontalRuleLabels");
    dojo.require("dijit.Tooltip");
    dojo.require("dijit._TemplatedMixin");
    var ValidationError = dojo.require("epi-cms.form.ValidationError");
  
    var uiMarkups = {}; //cache of generated UI
    var modelDefinitions = {}; //cache of criterion's model defintions
    
    var namingContainerIndex = 0;

    var thresholdSlider;
    var aContainer;
    var aTarget;
    var pointIsOn = false;    
    var saveAndCancelActionFired  = false;
    var serverUtcOffset = 0;
    
    function Setting(){
        this.Name="";
        this.Desscription="";
        this.SecurityRole = false;
        this.Statistics = false;
        this.CriteriaOperator = 0;
        this.ThresholdValue = 0;
        this.Criteria = [];
    }
    
    var currentSetting = new Setting();
    var loadedSetting = new Setting();
    
    function getCurrentSetting()
    {
        var tempsetting = new Setting();
        tempsetting.Name = dojo.byId('Name').value;
        tempsetting.Desscription=  dojo.byId('Notes').value;
        tempsetting.SecurityRole = dojo.byId('issecurityrole').checked;
        tempsetting.Statistics = dojo.byId('enablestatistics').checked;
        tempsetting.CriteriaOperator =  dojo.byId('CriteriaOperator').value;
        tempsetting.ThresholdValue  = Math.round(thresholdSlider.value);
        dojo.forEach(aTarget.getAllNodes(), function(domNode) {
            if (domNode.id == 'placeHolder') {
                return;
            }
            var node = aTarget.getItem(domNode.id);
            var points = parseInt(dojo.query('.epi-criteriaPointInput', domNode)[0].value);
            var plugin = pluginMethods[node.data.typeName];
            if (plugin) {
                var index = tempsetting.Criteria.length;
                tempsetting.Criteria[index] = {
                    name: node.data.name,
                    typeName: node.data.typeName,
                    required: dojo.query('.epi-CriteriaPointCheck', domNode)[0].checked,
                    points: isNaN(points) ? 0 : points,
                    settings: plugin.getSettings(node.data.namingContainer)
                };
                if (node.data.id) {
                   tempsetting.Criteria[index].id = node.data.id;
                }
            }
        });
        return tempsetting;  
    }
    
    window.onbeforeunload = function(e) {
        if (!saveAndCancelActionFired  && isPageChanged()){
            e = e || window.event;
            e.returnValue =EPi.Translate('/system/editutil/leavepagewarning');
            return EPi.Translate('/system/editutil/leavepagewarning');
        }
    };


    // Check if someting is changed between the loaded criteria and current, name, notes and etc.
    function isPageChanged()
    {
        currentSetting = getCurrentSetting();
         
        if (loadedSetting.ThresholdValue != currentSetting.ThresholdValue || loadedSetting.CriteriaOperator != currentSetting.CriteriaOperator || loadedSetting.Name != currentSetting.Name || loadedSetting.Desscription != currentSetting.Desscription || loadedSetting.SecurityRole != currentSetting.SecurityRole)
        {
            return true;
        }
          
        return !criteriaEquality(currentSetting.Criteria, loadedSetting.Criteria) || !criteriaEquality(loadedSetting.Criteria, currentSetting.Criteria);
    }
    
    //return true if criteria1 is equal with criteria2
    function criteriaEquality(criteria1, criteria2)
    {
        for(var i in criteria1)
        {  
            if(!IsMemberOfCriteria(criteria2, criteria1[i]))
            { 
                return false;
            }
        }
        return true;
    }

    
    //return true if criterion is member of criteria
    function IsMemberOfCriteria(criteria, criterion)
    {
        for(var j in criteria)
        {
            if(criterionEquality(criteria[j], criterion))
            { 
                return true;
            }
        }
       return false;
    }

    //return true if criterion1 is equal with criterion1
    function criterionEquality(criterion1, criterion2)
    {
        if (criterion1.id != criterion2.id)
            return false;
        if (criterion1.points != criterion2.points)
            return false;
        if (criterion1.required != criterion2.required)
            return false;
        
        return objectEquality(criterion1.settings,criterion2.settings);
    }
  
    //return true if object1 is equal with object2
    function objectEquality(object1, object2)
    {
        var type = typeof(object1);

        if ( !(object1 instanceof Object) || (type === 'String'))
        {
            return object1 == object2;
        }

        for(var i in object1)
        {
            for(var j in object2)
            {
                if (i === j)
                {
                    if (!objectEquality(object1[i], object2[j])) 
                    { 
                        return false;
                    }
                }
            }
        }
        return true;
    } 


    // all things should take place after the DOM is ready
    dojo.addOnLoad(function() {
        aContainer = new dijit.layout.AccordionContainer({}, 'criteriaCategoryContainer');
        
		// Populate the error dialog with localized resources
        dojo.xhrPost({
            url: '<%= Url.Action("Translate", "VisitorGroups") %>',
            content: { keys: epi.cms.ErrorDialog.getTextResourceKeys().join(",") },
            handleAs: 'json',
            load: epi.cms.ErrorDialog.setTextResources
            // Fail in silence. The error dialog has hard coded backup resources.
        });

        // highlight valid drop targets when a drag operation starts;
        dojo.subscribe('/dnd/start', null, highlightTargets);
        dojo.subscribe('/dnd/cancel', null, unhighlightTargets);
        dojo.subscribe('/dnd/drop', function() {
            unhighlightTargets(dojo.dnd.Manager().target);
        });
        
        // All xhr requests will raise the /dojo/io/done message. We use that to check if the user has been logged out.
        // If so we want to reload the full page to show the login screen.
        dojo.subscribe('/dojo/io/done', function(dfd, response){
            var xhr
            if (dfd && dfd.ioArgs){
                xhr = dfd.ioArgs.xhr;
            }
            
            if (xhr && typeof xhr.getResponseHeader !== "unknown"){
                var isLoginScreen = xhr.getResponseHeader("X-EPiLoginScreen");
                
                if (isLoginScreen) {
                    // Set saveAndCancelActionFired to true to disable page leave check
                    saveAndCancelActionFired = true;
                    window.location.reload();
                }
            }
        });



        aTarget = new dojo.dnd.Target('visitorGroupCriteria', { creator: criterionEditorNodeCreator, skipForm: true });
        //Always drop the criterion right after the placeholder
        aTarget.insertNodes = function(addSelected, data, before, anchor){
            anchor = dojo.byId('placeHolder');
            before = false;
            dojo.dnd.Selector.prototype.insertNodes.call(this, addSelected, data, before, anchor);
        };
        
        //Setup warning when people trying to change visitor group's name
        var checkbox = dojo.byId('issecurityrole');
        var checkboxStatistics = dojo.byId('enablestatistics');
        var textbox = dojo.byId('Name');
        var startName = textbox.value;
        var startIsSecurityRole = checkbox.checked;
        var startEnableStatistics = checkboxStatistics.checked;

        loadedSetting.Name = startName;
        loadedSetting.SecurityRole = startIsSecurityRole;
        loadedSetting.Statistics = startEnableStatistics;
        loadedSetting.Desscription = dojo.byId('Notes').value;
        loadedSetting.CriteriaOperator =  dojo.byId('CriteriaOperator').value;
        loadedSetting.ThresholdValue =  dojo.byId('thresholdValue').innerHTML;
        
        var onKeyDownTextbox, onChangeTextBox;
        var changeNameCheck = function() {
            var resetNameHandle, acceptNameHandle;

            //show warning
            if (startName && textbox.value != startName) {
                dijit.showTooltip(
                    '<span class="episize240"><%= Html.TranslateForScript("/shell/cms/visitorgroups/edit/cantchangename")%></span>' + 
                    '<div class="epi-visitorGroupNameWarningUndoDiv">' + 
                        '<a class="epi-visitorGroupNameWarningUndoText" href="#" id="acceptName"><%= Html.Translate("/shell/cms/visitorgroups/edit/acceptrenaming")%></a>&nbsp;' + 
                        '<a class="epi-visitorGroupNameWarningUndoText" href="#" id="resetName"><%= Html.Translate("/shell/cms/visitorgroups/edit/undorenaming")%></a>' +
                    '</div>', 
                    textbox,
                    ['after', 'above']);
                    
                // When the dialog is visible, the save button should be disabled                    
                dojo.byId('saveButton').disabled = true;
                
                resetNameHandle = dojo.connect(dojo.byId('resetName'), 'onclick', function() {
                    textbox.value = startName;
                    dijit.hideTooltip(textbox);
                    dojo.byId('saveButton').disabled = false;
                    dojo.disconnect(resetNameHandle);
                    dojo.disconnect(acceptNameHandle);
                });

                acceptNameHandle = dojo.connect(dojo.byId('acceptName'), 'onclick', function() {
                    dijit.hideTooltip(textbox);       
                    dojo.byId('saveButton').disabled = false;             
                    dojo.disconnect(resetNameHandle);
                    dojo.disconnect(acceptNameHandle);
                    dojo.disconnect(onKeyDownTextbox);
                    dojo.disconnect(onChangeTextBox);
                });
            }
            else {
                dijit.hideTooltip(textbox);
                dojo.byId('saveButton').disabled = false;
            }
        }
        if (startIsSecurityRole) {
            onKeyDownTextbox= dojo.connect(dojo.byId('Name'), 'onkeydown', changeNameCheck);
            onChangeTextBox= dojo.connect(dojo.byId('Name'), 'onchange', changeNameCheck);
        }

        //Replace Dojo's default dragging avatar
        dojo.declare("episerver.dnd.Avatar", dojo.dnd.Avatar, {
                constructor: function(manager){
                        this.manager = manager;
                        this.construct();
                },

                construct: function(){
                    var source = this.manager.source;
                    var width = this.manager.nodes[0].offsetWidth;
                    var a = dojo.create('div', {
                        'class': 'dojoDndAvatar',
                        style: {
                              position: 'absolute',
                              width: width,
                              zIndex: '1999',
                              margin: '0px'
                        }
                    });
                    if(source.creator){
                        // create an avatar representation of the node
                        var node = source._normalizedCreator(source.getItem(this.manager.nodes[0].id).data, "avatar").node;
                        a.appendChild(node);
                    }
                    this.node = a;
                },
                destroy: function(){
                        dojo.destroy(this.node);
                        this.node = false;
                },
                update: function(){
                }
        });
        dojo.dnd.Manager().makeAvatar = function() {
            return new episerver.dnd.Avatar(dojo.dnd.Manager());
        }      
        dojo.dnd.Manager().OFFSET_X = 1;
        dojo.dnd.Manager().OFFSET_Y = -10;

        document.getElementById('saveButton').onclick = function(evt) {
            saveAndCancelActionFired = false;
            var self = this;
            self.disabled = true;
            var criteria = new Array();            
            var validationErrors = new ValidationError();
            
            // give all the criteria a chance to validate themselves
            var validationOk = true;
            clearValidationErrors();
            dojo.forEach(aTarget.getAllNodes(), function(domNode) {
                if (domNode.id == 'placeHolder') {
                    return;
                }
                var node = aTarget.getItem(domNode.id);
                var plugin = pluginMethods[node.data.typeName];
                if (plugin && plugin.validate) {
                     var pluginErrors = plugin.validate(node.data.namingContainer, dojo.query('.epi-criterionEditor', domNode)[0]);
                     
                     if(pluginErrors instanceof ValidationError) {
                        var validationMessages = pluginErrors.GetValidationMessages();
                        if(validationMessages.length > 0) {
                            validationOk = false;
                            
                            for (var i = 0; i < validationMessages.length; i++) {
                                validationErrors.Add(validationMessages[i], pluginErrors.GetValidationInput(i));
                            }
                        }
                     }
                }
            });

            // process saving
            if (validationOk) {
                dojo.forEach(aTarget.getAllNodes(), function(domNode) {
                    if (domNode.id == 'placeHolder') {
                        return;
                    }
                    var node = aTarget.getItem(domNode.id);
                    var points = parseInt(dojo.query('.epi-criteriaPointInput', domNode)[0].value);
                    var plugin = pluginMethods[node.data.typeName];
                    if (plugin) {
                        var index = criteria.length;
                        criteria[index] = { 
                            name: node.data.name, 
                            typeName: node.data.typeName, 
                            required: dojo.query('.epi-CriteriaPointCheck', domNode)[0].checked,
                            points: isNaN(points) ? 0 : points,
                            settings: plugin.getSettings(node.data.namingContainer),
                            namingContainer: node.data.namingContainer
                        };
                        if (node.data.id) {
                            criteria[index].id = node.data.id;
                        }
                    }
                });

                dojo.xhrPost({
                    url: '<%= Url.Action("SaveVisitorGroup", "VisitorGroups") %>',
                    handleAs: 'json',
                    preventCache: true, // We need fresh data. Turning on this flag to avoid IE cache on XHR requests
                    content: { visitorGroup: getVisitorGroupAsJson(criteria), __RequestVerificationToken: dojo.query("[name^='__RequestVerificationToken']")[0].value },
                    error: function(error, ioArgs) { 
                         self.disabled = false;
                         if (ioArgs.xhr && typeof ioArgs.xhr.getResponseHeader !== "unknown")
                         {
                            // check if the problem is elated to login session
                            var isLoginScreen = ioArgs.xhr.getResponseHeader("EPiServerLoginScreen");
                            if (isLoginScreen) {
                                // Set saveAndCancelActionFired to true to disable page leave check
                                saveAndCancelActionFired = true;
                                window.location.reload();
                                return;
                            }
                          }
                          alert(error);
                        },
                    load: function(data) {
                        if(data.success) {
                            saveAndCancelActionFired = true;
                            document.location = '<%= Url.Action("Index", "VisitorGroups") %>'; 
                        }
                        else {
                            if (data.generalErrors) {
                                for (var i = 0; i < data.generalErrors.length; i++) {
                                    validationErrors.Add(data.generalErrors[i], null);
                                }
                            }
                            if (data.validationProperties && data.validationErrors) {
                                for (var i = 0; i < data.validationProperties.length; i++) {
                                    validationErrors.Add(data.validationErrors[i], data.validationProperties[i]);
                                }                            
                            }
                        
                            writeValidationErrors(validationErrors);
                            self.disabled = false;
                        }
                    }
                });
            }
            else {
                writeValidationErrors(validationErrors);
                self.disabled = false;
            }
            
            return false;
        };
    
    
      document.getElementById('cancelButton').onclick = function(evt) {
         saveAndCancelActionFired = true;
         document.location = '<%= Url.Action("Index", "VisitorGroups") %>'; 
    };   
        // setup the accordion
        // these things rarely change, so we don't need turn preventCache on
        dojo.xhrGet({
            url: '<%= Url.Action("GetCriteriaByCategory", "VisitorGroups") %>',
            handleAs: 'json',
            preventCache: true,
            error: ErrorDialog.showXmlHttpError,
            load: function(data, ioArgs) {
                dojo.forEach(data, function(category) {
                    var contentPane = new dijit.layout.ContentPane({
                        title: category.category
                    });
                    aContainer.addChild(contentPane);
                    var criteriaSource = new dojo.dnd.Source(contentPane.id, { copyOnly: true, selfAccept: false, creator: criterionNodeCreator });
                    criteriaSource.insertNodes(false, category.criteria);                    
                });
                aContainer.startup();
            }
        });
        
        //setup the threshhold slider
        thresholdSlider = new dijit.form.HorizontalSlider({
            name: "threshold",
            value: 0,
            minimum: 0,
            maximum: 0.01, // Set maximum to 0 will cause an IE error
            discreteValues: 1,
            intermediateChanges: true,
            showButtons: false,
            onChange: function() {
                dojo.byId('thresholdValue').innerHTML = Math.round(thresholdSlider.value) + '/' + Math.round(thresholdSlider.maximum);
            }
        },
        "threshold");
        
        // Toggle points on/off
        dojo.byId('CriteriaOperator').onchange = function() { 
            toggleAddPoints(dojo.byId('CriteriaOperator').value == '<%= CriteriaOperator.Points.ToString() %>');
        };
        
        //load criteria
        if (<%= String.IsNullOrEmpty(Model.Name) ? "false" : "true" %>) {
            dojo.xhrGet({
                url: '<%= Url.Action("GetVisitorGroup", "VisitorGroups", new { visitorGroupId = Model.Id }) %>',
                handleAs: 'json',
                preventCache: true,     // We need fresh data. Turning on this flag to avoid IE cache on XHR requests
                error: ErrorDialog.showXmlHttpError,
                load: function(data, ioArgs) {
                    //set operator mode
                    if (data.operatorType == '<%= CriteriaOperator.Points.ToString() %>') {
                        pointIsOn = true;
                    }
                    else {
                        pointIsOn = false;
                        //set the match combobox
                        dojo.forEach(dojo.query('option','CriteriaOperator'), function(opt) {
                            if (opt.value == data.operatorType) {
                                opt.setAttribute('selected', true);
                            }
                            else {
                                opt.removeAttribute('selected');
                            }
                        });
                    }
                    toggleAddPoints(pointIsOn);

                    //set criteria
                    dojo.forEach(data.criteria, function(criterion) {
                        aTarget.insertNodes(false, Array(criterion));
                    });
                    
                    //update threshold
                    thresholdSlider.value = data.pointsThreshold;
                    loadedSetting.ThresholdValue  = Math.round(thresholdSlider.value);
                    recalculateThreshold();    
                    
                    // Store the server offset for later use.
                    serverUtcOffset = data.serverUtcOffset;                
                }
            });
        }        
    }); //end onload

    // define client side validation util, which is passed to criteria's UI when validating
    var validationUtil = {
        highlightValidationError: function(node) {
            // add a red star next to the validating node
            var marker = document.createElement('span');
            marker.innerHTML = ' * ';
            dojo.style(marker, 'color', '#F00');
            dojo.addClass(marker, 'validationmarker');
            dojo.place(marker, node, 'after');
        },
        unhighlightValidationError: function(node) {
            // remove the validation markers which are the validating node's siblings
            dojo.forEach(dojo.query('.validationmarker', node.parentNode), function(marker) {
                dojo.destroy(marker);
            });
        },
        isHighlightedValidationError: function(node) {
            dojo.require("dojo.NodeList-traverse");
            var nl = new dojo.NodeList();
            nl.push(node);
            return nl.next('.validationmarker').length > 0;
        },
        removeAllHighlightedValidationError: function(container) {
            // remove the validation markers which are the validating node's siblings
            dojo.forEach(dojo.query('.validationmarker', container), function(marker) {
                dojo.destroy(marker);
            });
        }
    };

    //inner functions
    function removeCriterion(e) {
        var n = this;

        while ((n != null) && (!dojo.hasClass(n, 'dojoDndItem'))) {
            n = n.parentNode;
        }

        if (n && n.parentNode) {
            n.parentNode.removeChild(n);
            aTarget.sync();
            
            //synchronize threshhold values
            recalculateThreshold();
        }
    }

    // create the DOM representation for the given criterion editor
    function criterionEditorNodeCreator(item, hint) {   
        // build template 
        var template = new dijit._TemplatedMixin();
        var templateStr =  '<div class="epi-criterion"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
                              '<td class="epi-criterionTitle"><span><div class="epi-criterionTitleText" title="${description}">${criterionName}</div><img src="<%= EPiServer.Web.PageExtensions.ThemeUtility.GetImageThemeUrl(this, "General/arrow.png") %>" /></span></td>' +
                              '<td class="epi-criterionEditor"></td>' +  // plugin's ui comes here
                              '<td class="epi-criterionActions">' +
                                  '<div class="epi-criteriaPointPanel">' +
                                      '<div style="padding: 2px; height:1.6em;"><input type="text" id="${namingContainerIndex}_point" class="epi-criteriaPointInput" >' +
                                      '<span> p</span></div>' +
                                      '<div style="padding: 2px; height:1.6em;"><input type="checkbox" id="${namingContainerIndex}_required" class="epi-CriteriaPointCheck" />' +
                                      '<span><%= Html.Translate("/shell/cms/visitorgroups/edit/points/required")%></span></div>' +
                                  '</div>' +
                            '</td>' +
                            '<td class="epi-criterionActionRemove"><a href="#"><img alt="" src="<%= EPiServer.Web.PageExtensions.ThemeUtility.GetImageThemeUrl(this, "General/deleteIcon.png") %>" /></a></td>' +
                          '</tr></table></div>';
            
        template.templateString = templateStr;            
        template.criterionName = item.name;
        template.icon = item.icon;
        template.description = item.description ? item.description : item.name;
        template.namingContainerIndex = namingContainerIndex++;
        template.buildRendering();
        
        // setup point settings panel
        var requiredCheck = dojo.query('.epi-CriteriaPointCheck', template.domNode)[0];
        requiredCheck.checked = item.required;
        requiredCheck.onclick = onRequiredCheckChange;
        
        var pointInput = dojo.query('.epi-criteriaPointInput', template.domNode)[0];
        pointInput.value = item.required ? '' : (item.points != undefined ? item.points : 0);
        if (item.required) {
            pointInput.setAttribute('disabled', true);
        }
        pointInput.onchange = onPointInputChange;
        
        var removeAction = dojo.query('.epi-criterionActionRemove', template.domNode)[0]; 
        removeAction.onclick = removeCriterion;
        
        var pointSettings = dojo.query('.epi-criteriaPointPanel', template.domNode)[0];
        dojo.style(pointSettings, 'visibility', pointIsOn ? 'visible' : 'hidden');
        
        // attach criterion's ui
        var editorDiv = dojo.query('.epi-criterionEditor', template.domNode)[0];                         
        var namingContainer = 'criterion' + (namingContainerIndex++) + '_';
        
        if (item.isTypeNotFound == true) {
            // Display message if the type couldn't be found.
            dojo.place('<div>' + item.missingTypeNameText + '</div>', editorDiv);
        } else {
            var controller = pluginMethods[item.typeName];
            
            //plugins should call this callback function once it finishes creating UI
            var uiReadyCallback = function(namingContainerPrefix, container, settings) {
                var domNode = container.parentNode.parentNode.parentNode.parentNode;
                var node = aTarget.getItem(domNode.id);
                var points = parseInt(dojo.query('.epi-criteriaPointInput', domNode)[0].value);
                if (!node.data.isTemplate){
                    loadedSetting.Criteria.push({ 
                        name: node.data.name, 
                        typeName: node.data.typeName, 
                        required: dojo.query('.epi-CriteriaPointCheck', domNode)[0].checked,
                        points: isNaN(points) ? 0 : points,
                        settings: controller.getSettings(node.data.namingContainer),
                        id: node.data.id
                    });
                }
                //raise created event
                if (controller.uiCreated) {
                    controller.uiCreated(namingContainerPrefix, settings);
                }
                dojo.forEach(dijit.findWidgets(container), function(widget) {
                    //disable default validation on all the newly created widgets
                    if (widget.displayMessage) {
                        widget.displayMessage = function() {}; //do nothing
                    }
                    
                    if (widget._setStateClass) {
                        var oldFnc = widget._setStateClass;
                        widget._setStateClass = function() {
                            if ((!this.isValid) || (this.isValid && this.isValid())) {
                                oldFnc.apply(this, arguments);                                        
                            }
                        }
                    }
                });
            };
            
            if (controller && controller.createUI) {
                // Need to call this later when the callee have placed the editorDiv in the DOM.
                setTimeout(function() { controller.createUI(namingContainer, editorDiv, item.settings, uiReadyCallback); }, 1);
            }
            else {
                controller = new DefaultUIScript(item.typeName);
                controller.rootUrl = '<%=Url.Content("~/") %>';
                controller.visitorGroupId = '<%= Model.Id %>';
                controller.serverUtcOffset = serverUtcOffset;
                if (item.uiscript) {
                    dojo.xhrGet({
                        url: item.uiscript,
                        handleAs: 'text',
                        load: function(data, ioArgs) {
                            controller = CreateInheritance(eval(data), controller);
                            controller.createUI(namingContainer, editorDiv, item.settings, uiReadyCallback);
                            
                            pluginMethods[item.typeName] = controller;
                        }
                    });
                }
                else {
                    //get view                    
                    controller.createUI(namingContainer, editorDiv, item.settings, uiReadyCallback);
                    pluginMethods[item.typeName] = controller;
                }
            }
        }
        item = dojo.clone(item);
        item.namingContainer = namingContainer;

        return { node: template.domNode, data: item };
    }

    // create the DOM representation for the given criterion in the tool box
    function criterionNodeCreator(item, hint) {
        var containerDiv = document.createElement('div');
        
        dojo.addClass(containerDiv, 'epi-criterion epi-criterionToolbox');
        dojo.attr(containerDiv, 'title', item.description ? item.description : item.name);
        
        var handleNode = document.createElement('img');
        handleNode.src = '<%= EPiServer.Web.PageExtensions.ThemeUtility.GetImageThemeUrl(this, "General/dragHandle.png") %>';
        dojo.style(handleNode, 'padding', '6px');
        containerDiv.appendChild(handleNode);
        
        var labelNode = document.createElement('a');
        dojo.addClass(labelNode, 'label');
        
        labelNode.href = '#';
        dojo.connect(labelNode, 'onkeypress', item, addToTargetIfEnter);
        
        labelNode.appendChild(document.createTextNode(item.name));
        containerDiv.appendChild(labelNode);        
                
        if (hint == 'avatar') {
            // get the computed width from the toolbox item and set to the avatar item
            dojo.style(containerDiv, 'width', dojo.style(dojo.byId('criterion_' + item.clientId), 'width') + 'px');
        }
        else {
            // assign an id for toolbox items to be able to retrieved later
            containerDiv.id = 'criterion_' + item.clientId;
        }

        return { node: containerDiv, data: item };
    };
    
    // Adds the item to the drop target if the user hit the enter key.
    function addToTargetIfEnter(e){
        switch(e.charOrCode){
            case dojo.keys.ENTER:
                e.preventDefault();
                aTarget.insertNodes(false, new Array(this));
        }
    }
    
    // event handler for required checkboxes
    function onRequiredCheckChange() {
        var q = dojo.query('input[type="text"]', this.parentNode.parentNode);
        if (q.length == 0) {
            return;
        }
        var pointInput = q[0];
        if (this.checked) {
            pointInput.setAttribute('disabled', true);
            pointInput.value = '';
        }
        else {
            pointInput.removeAttribute('disabled');
            pointInput.value = 0;
        }
        recalculateThreshold();
    }
    
    // event handler for point input
    function onPointInputChange() {        
        if (isNaN(parseInt(this.value))) {
            this.value = 0;
        }
        
        if (parseInt(this.value) > 10000) {
            this.value = 10000; //maximum point
        }
        
        if (parseInt(this.value) < 0) {
            this.value = 0; // minimum point
        }
        
        recalculateThreshold();
    }
    
    // synchronize threshold value on the slider
    function recalculateThreshold() {
        var sum = 0;
        dojo.forEach(dojo.query('.epi-criteriaPointInput', dojo.byId('visitorGroupCriteria')), function(e) {
            if (!isNaN(parseInt(e.value))) {
                sum += parseInt(e.value);
            }
        });
        
        thresholdSlider.set('maximum', sum == 0 ? 0.01 : sum); // Set maximum to 0 will cause an IE error
        if (thresholdSlider.value > sum) {
            thresholdSlider.value = sum;
        }
        
        thresholdSlider.set('value',thresholdSlider.value);
        
        dojo.byId('thresholdValue').innerHTML = Math.round(thresholdSlider.value) + '/' + Math.round(thresholdSlider.maximum);
    }
        
    // toggle Add points panels on/off
    function toggleAddPoints(on) {
        pointIsOn = on;
        if (on) {
            //show point settings                    
            dojo.forEach(dojo.query('.epi-criteriaPointPanel', dojo.byId('visitorGroupCriteria')), function(e) {
                dojo.style(e, 'visibility', 'visible');
            });

            //show threshold settings
            dojo.removeClass(dojo.byId('thresholdSettings'), 'hidden');            
        }
        else {
            //hide point settings
            dojo.forEach(dojo.query('.epi-criteriaPointPanel', dojo.byId('visitorGroupCriteria')), function(e) {
                dojo.style(e, 'visibility', 'hidden');
            });
            
            //hide threshold settings
            dojo.addClass(dojo.byId('thresholdSettings'), 'hidden');
        }
    }

    function highlightTargets() {
        dojo.addClass("visitorGroupCriteria", "epi-criteriaTargetHighlighted");
    }

    function unhighlightTargets() {
        dojo.removeClass("visitorGroupCriteria", "epi-criteriaTargetHighlighted");
    }

    function getVisitorGroupAsJson(criteria) {
        return dojo.toJson({ 
            id: '<%= Model.Id %>', 
            name: dojo.byId('Name').value, 
            notes: dojo.byId('Notes').value, 
            pointsThreshold: Math.round(thresholdSlider.value),
            issecurityrole: dojo.byId('issecurityrole').checked,
            enablestatistics: dojo.byId('enablestatistics').checked,
            criteria: criteria, 
            criteriaOperator: pointIsOn ? '<%= CriteriaOperator.Points.ToString() %>' : dojo.byId('CriteriaOperator').value,
            isNew: '<%= Model.IsNew %>'
        });
    }

    // Clear all validation messages
    function clearValidationErrors() {
        var validationSummary = dojo.byId('validationSummary');
        dojo.empty(validationSummary);
        dojo.style(validationSummary, 'display', 'none');
        validationUtil.removeAllHighlightedValidationError(dojo.byId('visitorGroupCriteria'));
        validationUtil.removeAllHighlightedValidationError(dojo.byId('visitorGroupInput'));
    }
    
    // Writes validation errors
    function writeValidationErrors(validationErrors) {
        // display validation errors
        var validationMessages = validationErrors.GetValidationMessages();
        if(validationMessages.length > 0) {
            var validationSummary = dojo.byId('validationSummary');
            dojo.style(validationSummary, 'display', 'block');
            dojo.forEach(validationMessages, function(msg) {                                                      
                dojo.place('<li>' + msg + '</li>', validationSummary);
            });
        }
                
        var validationInputs = validationErrors.GetValidationInputs(); 
        // ValidationInputs contains elements which is a dijit widget, a dom node, or an id, we need to convert all of them into dom nodes
        var errorProperties = new Array();
        for(var i in validationInputs) {
            if (validationInputs[i]) {
                if (validationInputs[i].domNode) {                          // a widget
                    errorProperties.push(validationInputs[i].domNode);
                }
                else if (validationInputs[i].innerHTML !== undefined) {     // a DOM Node
                    errorProperties.push(validationInputs[i]);
                }
                else {                                                      // an id
                    var target = null;
                    if (target = dijit.byId(validationInputs[i])) {        // try to get the widget from id, OBS: = not ==
                        errorProperties.push(target.domNode);
                    }
                    else if (target = dojo.byId(validationInputs[i])) {    // try to get dom node from id
                        errorProperties.push(target);
                    }
                }
            }
        }
        dojo.forEach(errorProperties, function(node) {
            if (!validationUtil.isHighlightedValidationError(node)) {
                validationUtil.highlightValidationError(node);
            }
        });
    }

    // Simulate inheritance by setting the prototype to base and adding overrides to this.
    var CreateInheritance = function(overrides, base){
        var custom = function() {};
        custom.prototype = base;
        for(var key in base){
            custom[key] = base[key];
        }
        for(var key in overrides){
            custom[key] = overrides[key];
        }
        return custom;
    };
    
    /* generic ui script */
    var DefaultUIScript = function(typeName) {
        this.typeName = typeName;
    };
    
    // Fetch all translation needed
    // callback: the callback function called after the translation loaded
    DefaultUIScript.prototype.getTranslation = function(callback) {
        //get translated resources
        var self = this;
           
        var translateKeys = '/shell/cms/visitorgroups/criteria/required'       
        if(self.languageKeys instanceof Array) {
            translateKeys = translateKeys + "," + self.languageKeys.join(',');
        }
        else if(self.languageKeys) {
            translateKeys = translateKeys + "," + self.languageKeys;
        }
        
        dojo.xhrPost({
            url: '<%= Url.Action("Translate", "VisitorGroups") %>',
            content: {
                keys: translateKeys
            },
            handleAs: 'json',
            load: function(data) {
                self.translatedText = {};
                for (var i = 0; i < data.length; i++) {
                    self.translatedText[data[i].key] = data[i].text;
                }
                
                if (callback) {
                    callback();
                }
            }
        });
    };
        
    // Create default UI
    // namingContainerPrefix: prefix provided by container
    // container: the container
    // settings: criterion's settings
    DefaultUIScript.prototype.createUI = function(namingContainerPrefix, container, settings, callback) {
        var controller = this.controller;
        var self = this;
        
        self.getTranslation(function() {
            self._loadUI(namingContainerPrefix, container, function(){
                //raise loaded event
                if (self.uiLoaded) {
                    self.uiLoaded(namingContainerPrefix);
                }                        

                self._loadModelDefinition(function() {                      
                    // build up html elements as dijits
                    require(dojo.map(self.definition, function(p) { return p.DojoType.replace(/\./g, "/"); }), function() {
                        for (var i in self.definition) {
                            var p = self.definition[i];
                            var value = (p.DefaultValue !== '' ? p.DefaultValue : null); //cast to correct type
                            if (settings && settings[p.Name] !== undefined && settings[p.Name] !== null) {
                                value = settings[p.Name];
                            }

                            if (!dojo.byId(namingContainerPrefix + p.Name)) {
                                continue;
                            }

                            if (p.Ignore) {
                                // try to set value
                                dojo.byId(namingContainerPrefix + p.Name).value = value;
                                continue;
                            }

                            var widgetClass = dojo.require(p.DojoType);
                                var options = { };
                                if (p.AdditionalOptions) {
                                    try {
                                        options = eval('(' + p.AdditionalOptions + ')');
                                    } catch(err) {
                                        options = { };
                                    }
                                }
                                var cssClass = dojo.attr(dojo.byId(namingContainerPrefix + p.Name), 'class');
                                var styles = dojo.attr(dojo.byId(namingContainerPrefix + p.Name), 'style');
                                var widget;
                                if (value !== undefined && value !== null) {
                                    if (value.match && value.match(/\/Date\((-?\d+)\)\//gi)) {
                                        value = eval(value.replace(/\/Date\((-?\d+)\)\//gi, "new Date($1)"));

                                        // Since we want to display the stored value in the database
                                        // we need to remove the client and server time zone offset.
                                        var clientSideOffset = -(new Date().getTimezoneOffset() * 60000);
                                        value = new Date(value.getTime() - clientSideOffset + serverUtcOffset);
                                    }

                                    if (typeof(value) === 'boolean') {
                                        options.required = p.IsRequired;
                                        options.checked = value;
                                    } else {
                                        options.required = p.IsRequired;
                                        options.value = value;
                                    }
                                } else {
                                    options.required = p.IsRequired;
                                }

                                widget = new widgetClass(options, namingContainerPrefix + p.Name);
                                if (widget) {
                                    if (cssClass) {
                                        dojo.addClass(widget.domNode, cssClass);
                                    }

                                    var domNodeStyle = dojo.attr(widget.domNode, 'style');
                                    var newStyle = (domNodeStyle ? domNodeStyle.trim() : '') + ';' + (styles ? styles : '');
                                    dojo.attr(widget.domNode, 'style', newStyle);
									widget.startup();
                                }
                        } //end for
                        callback(namingContainerPrefix, container, settings);
                    });
                    //tell the caller that I am done
                    
                }); //end callback of _getModelDefintion
            }); //end callback of _loadUI
        }); //end callback of getTranslation
    }; //end method
    
    // [private] Load UI markup
    // callback: the callback function called after the translation loaded
    DefaultUIScript.prototype._loadUI = function(namingContainerPrefix, container, callback) {
        var self = this;
        var doLoad = function(markup) {
            var replaceId = function(el) {
                if (el.id) {
                    el.id = namingContainerPrefix + el.id;
                }
                
                if (dojo.attr(el, 'for')) {
                    dojo.attr(el, 'for', namingContainerPrefix + dojo.attr(el, 'for'));
                }
            };
            
            dojo.place(dojo.trim(markup), container);

            var children = dojo.query('*', container);
            dojo.forEach(children, replaceId);
            
            if (callback) {
                callback();
            }
        };
        
        if ( uiMarkups[self.typeName]) {
            doLoad(uiMarkups[self.typeName]);
        }
        else {        
            dojo.xhrPost({
                url: '<%= Url.Action("CriteriaUI", "VisitorGroups") %>',
                content: {
                    typeName: self.typeName
                },
                handleAs: 'text',
                error: epi.cms.ErrorDialog.showXmlHttpError,
                load: function(data) {
                    uiMarkups[self.typeName] = data;
                    doLoad(data);
                }
            });
        }
    };
    
    // [private]: Load model definition
    // callback: the callback function called after the translation loaded
    DefaultUIScript.prototype._loadModelDefinition = function(callback) {
        var self = this;
        var doLoad = function(definition) {
            self.definition = definition;
            if (callback) {
                callback();
            }
        };
        
        if (modelDefinitions[self.typeName]) {
            doLoad(modelDefinitions[self.typeName]);
        }
        else {
            //get model definition
            dojo.xhrPost({
                url: '<%= Url.Action("CriteriaModelDefinition", "VisitorGroups") %>',
                content: {
                    typeName: self.typeName
                },
                handleAs: 'json',
                error: epi.cms.ErrorDialog.showXmlHttpError,
                load: function(data) {
                    doLoad(data)
                    modelDefinitions[self.typeName] = data;
                }
            });
        }
    };
    
    // Get settings and return them to the container
    // namingContainerPrefix: prefix provided by container
    DefaultUIScript.prototype.getSettings = function(namingContainerPrefix) {
        if (!this.definition) {
            return null;
        }
        var settings = {};
        for(var i in this.definition){
            var p = this.definition[i];
            var value = null;
            var settingFound = false;
            
            var widget = dijit.byId(namingContainerPrefix + p.Name);
            if (widget && (!widget.isValid || widget.isValid())) {
                value = widget.get('value');
                if (value instanceof Date) {
                    value = dojo.date.locale.format(value, {datePattern: 'yyyy-MM-dd', timePattern: 'HH:mm:ss'});
                }
                else if(widget.checked !== undefined) {
                    value = widget.checked;
                }
                settingFound = true; 
            }
            else {
                //try to get value from html element
                var el = dojo.byId(namingContainerPrefix + p.Name);
                if (el && el.value) {
                    value = el.value;
                    settingFound = true;
                }
            }
            
            if (settingFound && (value != undefined)) {
                settings[p.Name] = value;                
            }
        }
        return settings;
    };
    
    // Validate settings
    // namingContainerPrefix: prefix provided by container
    // util: the validation util
    DefaultUIScript.prototype.validate = function(namingContainerPrefix, container) {
        var validationErrors = new ValidationError();
        var self = this;
        
        dojo.forEach(dijit.findWidgets(container), function(widget) {
            if (widget && widget.isValid) {
                if (!widget.isValid()) {
                    validationErrors.Add(widget.getErrorMessage(), widget);
                }
                else if(widget.required && widget.value === '') {
                    var requiredMessage = self.translatedText['/shell/cms/visitorgroups/criteria/required'];
                    validationErrors.Add(requiredMessage, widget);
                }
            }
        });

        return validationErrors;
    };
    
})();
</script>

</asp:Content>

<asp:Content ContentPlaceHolderID="MainRegion" ID="MainRegion" runat="server">
<div>
    <div class="epi-contentArea epi-contentContainer epi-fullWidth">
        <h1 class="EP-prefix">
            <%= Html.Translate(String.IsNullOrEmpty(Model.Name) ? "/shell/cms/visitorgroups/edit/addtitle" : "/shell/cms/visitorgroups/edit/edittitle")%>
            <EPiServerUI:HelpButton runat="server" NavigateUrl="VisitorGroupsEdit" />
        </h1>
        <p><span class="EP-systemInfo">
            <%= Html.Translate("/shell/cms/visitorgroups/edit/info")%></span></p>
    </div>
    <ul id="validationSummary" class="EP-validationSummary" style="display: none;"></ul>
    <div class="epi-formArea">
        <div class="epi-criteriaEditorAreaWrapper">            
            <div class="epi-criteriaEditorArea epi-formArea">
                <fieldset>
                    <legend>
                        <%= Html.Translate("/shell/cms/visitorgroups/edit/criteria")%>
                    </legend>
                    <div>
                        <div class="epi-criteriaContainer">
                            <div class="floatright">
                                <span style="font-weight: bold;"><%= Html.Translate("/shell/cms/visitorgroups/edit/match")%></span>&nbsp;<%= Html.DropDownList("CriteriaOperator")%>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div id="visitorGroupCriteria" class="epi-criteriaContainer">
                            <div id="placeHolder" class="epi-criterion epi-criterionPlaceHolder dojoDndItem"><%= Html.Translate("/shell/cms/visitorgroups/edit/drophint")%></div>
                        </div>
                        <div id="thresholdSettings" class="epi-criteriaContainer hidden">
                            <div class="epi-criterion">
                                <table width="100%" border="0" cellpadding="0" cellspacing ="0"><tr>
                                    <td class="epi-criterionTitle"><div class="epi-criterionThresholdText"><%= Html.Translate("/shell/cms/visitorgroups/edit/points/threshold")%></div></td>
                                    <td class="epi-criterionEditor">
                                        <span class="episize300 floatright">
                                            <div id="threshold">
                                            </div>
                                        </span>
                                    </td>
                                    <td class="epi-criterionActions">
                                        <div id="thresholdValue" class="epi-criteriaPointPanel epi-thresholdValue"></div>
                                    </td>
                                    <td class="epi-criterionActionRemove"></td>
                                </tr></table>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend><%= Html.Translate("/shell/cms/visitorgroups/edit/generalfields")%></legend>                    
                    <div id="visitorGroupInput" class="epi-size10">                        
                        <div>
                            <label><%= Html.Translate("/shell/cms/visitorgroups/edit/name")%></label><%= Html.TextBox("Name", Model.Name, new { @class = "episize300 required nohtml" })%>                            
                        </div>
                        <div>                            
                            <label><%= Html.Translate("/shell/cms/visitorgroups/edit/notes")%></label><%= Html.TextArea("Notes", Model.Notes, new { @class = "episize300 required nohtml epi-criteriaBorder" })%>
                        </div>
                        <div>
                            <label><%= Html.Translate("/shell/cms/visitorgroups/edit/issecurityrole")%></label><%= Html.CheckBox("issecurityrole", Model.IsSecurityRole, new { @class = "required nohtml" }) %><span><%= Html.Translate("/shell/cms/visitorgroups/edit/issecurityroledescription")%></span>
                        </div>
                        <div>
                            <label><%= Html.Translate("/shell/cms/visitorgroups/edit/statistics")%></label><%= Html.CheckBox("enablestatistics", Model.EnableStatistics, new { @class = "required nohtml" })%><span><%= Html.Translate("/shell/cms/visitorgroups/edit/statisticsdescription")%></span>
                        </div>
                    </div>
                </fieldset>                
                <div class="epi-buttonContainer">
                    <span class="epi-cmsButton">
                        <input type="submit" 
                            id="saveButton"
                            value="<%= Html.Translate("/button/save") %>" 
                            onmouseover="EPi.ToolButton.MouseDownHandler(this)" 
                            onmouseout="EPi.ToolButton.ResetMouseDownHandler(this)"
                            class="epi-cmsButton-text epi-cmsButton-tools epi-cmsButton-Save" />
                    </span>
                    <span class="epi-cmsButton">
                        <input type="button" 
                            id="cancelButton"
                            value="<%= Html.Translate("/button/cancel") %>" 
                            onmouseover="EPi.ToolButton.MouseDownHandler(this)" 
                            onmouseout="EPi.ToolButton.ResetMouseDownHandler(this)" 
                            class="epi-cmsButton-text epi-cmsButton-tools epi-cmsButton-Cancel" />
                    </span>    
                </div>                                
            </div>
        </div>
        <div class="epi-criteriaToolboxArea">
            <div class="epi-criteriaCategoryContainer" id="criteriaCategoryContainer">
            </div>
        </div>
        <div class="clear"></div>        
    </div>
</div>
</asp:Content>
