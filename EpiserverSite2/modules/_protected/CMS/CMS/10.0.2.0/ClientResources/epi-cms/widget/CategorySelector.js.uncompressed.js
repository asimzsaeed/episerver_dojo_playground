require({cache:{
'url:epi-cms/widget/templates/CategorySelector.html':"﻿<div class=\"dijitReset dijitInputField dijitInputContainer dijitInline epi-resourceInputContainer epi-categorySelector\" id=\"widget_${id}\">\r\n    <div data-dojo-attach-point=\"categoriesGroupContainer\" class=\"dijit dijitReset dijitInline dijitInlineTable dijitLeft dijitTextBox displayNode epi-categoriesGroup\">\r\n    </div> \r\n    <div data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick: _onButtonClick\" data-dojo-attach-point=\"button\" class=\"epi-categoriesSelectorButton\" data-dojo-props=\"label:'+'\"></div>\r\n</div>"}});
﻿define("epi-cms/widget/CategorySelector", [
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/promise/all",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/query",

    "dijit/_TemplatedMixin",
    "dijit/_Widget",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/Button",
    "dijit/Tooltip",

    "epi-cms/widget/_HasChildDialogMixin",
    "epi-cms/widget/CategorySelectorDialog",
    "epi/shell/widget/_ValueRequiredMixin",
    "epi/dependency",
    "epi/epi",
    "epi/shell/widget/dialog/Dialog",

    "dojo/text!./templates/CategorySelector.html",
    "epi/i18n!epi/cms/nls/episerver.cms.widget.CategorySelector"
],

function (
    array,
    declare,
    lang,
    all,
    domAttr,
    domClass,
    domConstruct,
    domStyle,
    query,

    _TemplatedMixin,
    _Widget,
    _WidgetsInTemplateMixin,
    Button,
    Tooltip,

    _HasChildDialogMixin,
    CategorySelectorDialog,
    _ValueRequiredMixin,
    dependency,
    epi,
    Dialog,

    template,
res) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _HasChildDialogMixin, _ValueRequiredMixin], {
        // tags:
        //      internal

        templateString: template,

        localization: res,
        //this widget wants a value that is an array
        multiple: true,

        value: null,

        store: null,
        _categories: null,
        _categoriesParentsName: {},

        onChange: function (value) {
            // summary:
            //    Fired when value is changed.
            //
            // value:
            //    The value
            // tags:
            //    public, callback
        },

        postMixInProperties: function () {
            // summary:
            //      Initialize properties
            // tags:
            //      protected

            this.inherited(arguments);

            if (!this.store) {
                var registry = dependency.resolve("epi.storeregistry");
                this.store = registry.get("epi.cms.category");
            }
        },

        destroy: function () {
            this.inherited(arguments);

            if (this._updateDisplayPromise) {
                this._updateDisplayPromise.cancel();
                this._updateDisplayPromise = null;
            }
        },

        destroyDescendants: function () {
            if (this._tooltip) {
                this._tooltip.destroy();
                delete this._tooltip;
            }
            this.inherited(arguments);
        },

        _setValueAttr: function (value) {
            //summary:
            //    Value's setter.
            //
            // value: array of categories.
            //    Value to be set.
            //
            // tags:
            //    protected

            if (!lang.isArray(value)) {
                value = [value];
            }
            var filteredValue = array.filter(value, function (v) {
                return !!v;
            });
            this._setValueAndFireOnChange(filteredValue);

            if (filteredValue.length > 0) {
                this._set("value", filteredValue);
            } else {
                this._set("value", null);
            }

            this._started && this.validate();
        },

        _setValueAndFireOnChange: function (value) {
            // Compare arrays
            if (epi.areEqual(this._categories, value)) {
                return;
            }

            this._categories = value;
            this.onChange(this._categories);
            this._updateDisplayNode();
        },

        _getValueAttr: function () {
            //summary:
            //    Value's getter
            // tags:
            //    protected

            return this._categories;
        },

        _setReadOnlyAttr: function (value) {
            this._set("readOnly", value);


            domStyle.set(this.button.domNode, "display", value ? "none" : "");
            domClass.toggle(this.domNode, "dijitReadOnly", value);
        },

        focus: function () {
            this.button.focus();
        },

        _createCategoryButton: function (category) {
            //summary:
            //    create category button.
            //
            // categoryId: category id.

            // categoryName: category name.
            //
            // tags:
            //    private


            //
            // TODO: create a widget for item with a template instead of creating dom nodes
            //

            //don't add a button if it's already added.
            if (query("div[data-epi-category-id=" + category.id + "]", this.categoriesGroupContainer).length !== 0) {
                return;
            }

            var containerDiv = domConstruct.create("div", { "class": "dijitReset dijitLeft dijitInputField dijitInputContainer epi-categoryButton" });
            var buttonWrapperDiv = domConstruct.create("div", { "class": "dijitInline epi-resourceName" });
            var categoryNameDiv = domConstruct.create("div", { "class": "dojoxEllipsis", innerHTML: category.description });
            domConstruct.place(categoryNameDiv, buttonWrapperDiv);

            domConstruct.place(buttonWrapperDiv, containerDiv);
            // create tooltip for the div
            this._tooltip = new Tooltip({
                connectId: categoryNameDiv,
                label: this._getCategoryPath(category)
            });


            var removeButtonDiv = domConstruct.create("div", { "class": "epi-removeButton", innerHTML: "&nbsp;" });
            domAttr.set(removeButtonDiv, "data-epi-category-id", category.id);
            var eventName = removeButtonDiv.onClick ? "onClick" : "onclick";

            if (!this.readOnly) {
                this.connect(removeButtonDiv, eventName, lang.hitch(this, this._onRemoveClick));
                domConstruct.place(removeButtonDiv, buttonWrapperDiv);
            } else {
                domConstruct.place(domConstruct.create("span", { innerHTML: "&nbsp;" }), buttonWrapperDiv);
            }

            domConstruct.place(containerDiv, this.categoriesGroupContainer);
        },

        _getCategoryPath: function (category) {
            // summary:
            //    Return the path to a category excluding root.
            // category:
            //    the category
            // tags:
            //    private

            if (!category.parentsNameCollection || category.parentsNameCollection.length === 1) {
                return "";
            }

            // The parentsNameCollection contains categories on the path to a category including the root category
            // and that category node itself (e.g.: [Root,BlogRoot,Javascript]). On the UI, the Root is not shown,
            // so the path to a category starts from 2nd level of the tree (e.g.: BlogRoot/Javascript).
            var path = category.parentsNameCollection[1];
            for (var i = 2; i < category.parentsNameCollection.length; i++) {
                path = path + "/" + category.parentsNameCollection[i];
            }

            return path;
        },

        _createNoCategoriesChosenSpan: function () {
            //summary:
            //    create no categories chosen span.
            //tag:
            //      private

            //domConstruct.empty(this.categoriesGroupContainer);
            domConstruct.create("div", {
                innerHTML: this.localization.nocategorieschosen,
                "class": "epi-categoriesGroup__message"
            }, this.categoriesGroupContainer, "only");
        },

        _updateDisplayNode: function () {
            //summary:
            //    update category group.
            //
            // tags:
            //    private

            this.categoriesGroupContainer.innerHTML = "";

            if (!this._categories || this._categories.length === 0) {
                this._createNoCategoriesChosenSpan();
                return;
            }

            this._categoriesParentsName = {};

            var dfdList = [];
            this._categories.forEach(function (categoryId) {
                dfdList.push(this.store.refresh(categoryId));
            }, this);


            this._updateDisplayPromise = all(dfdList).then(lang.hitch(this, function (categories) {

                // Clear the pointer to the promise since it is resolved.
                this._updateDisplayPromise = null;

                categories.forEach(function (category) {
                    if (category && category.visible) {
                        this._categoriesParentsName[category.id] = category.parentsNameCollection;
                        this._createCategoryButton(category);
                    } else {
                        var categoryIndex = this._categories.indexOf(category.id);
                        if (categoryIndex !== -1) {
                            this._categories.splice(categoryIndex, 1);
                        }
                    }

                    // Create no categories chosen span if haven't any category in list.
                    if (this._categories.length === 0) {
                        this._createNoCategoriesChosenSpan();
                    }
                }, this);

            }));
        },

        _onRemoveClick: function (arg) {
            //summary:
            //    handles remove click event.
            //
            // arg: event argument .
            //
            // tags:
            //    private

            if (!this._categories) {
                return;
            }

            var categoryId = parseInt(domAttr.get(arg.target, "data-epi-category-id"), 10);
            var categoryIndex = this._categories.indexOf(categoryId);
            if (categoryIndex === -1) {
                return;
            }

            var remainingCategories = lang.clone(this._categories);
            remainingCategories.splice(categoryIndex, 1);
            this.set("value", remainingCategories);
        },

        _getCategoriesParentsNameClone: function () {
            //summary:
            //    get a clone of categoriesPath.
            // tags:
            //    private

            var categoriesParentsNameClone = {};
            array.forEach(this._categories, lang.hitch(this, function (categoryId) {
                categoriesParentsNameClone[categoryId] = this._categoriesParentsName[categoryId];
            }));

            return categoriesParentsNameClone;
        },

        _onShow: function () {
            //summary:
            //    Handle onShow dialog event.
            // tags:
            //    private

            // the original categories need to keep to support cancel case, so a clone of categories need to pass to category selector dialog.
            this.categorySelectorDialog.set("value", lang.clone(this._categories));
            this.categorySelectorDialog.set("selectedCategoriesData", this._getCategoriesParentsNameClone());

            this.isShowingChildDialog = true;
            this.categorySelectorDialog.onShow();
        },

        _onExecute: function () {
            //summary:
            //    Handle dialog close
            // tags:
            //    private

            var categoriesSelected = this.categorySelectorDialog.get("value");

            this.set("value", categoriesSelected);
        },

        _isEmptyArray: function (array) {
            // summary:
            //      Validate empty of array
            // tags:
            //      private
            return !array || array.length === 0;
        },

        _onDialogHide: function () {
            //summary:
            //    Handle dialog close
            // tags:
            //    private
            this.focus();
            this.isShowingChildDialog = false;
        },

        _createDialog: function () {
            // summary:
            //		Create page tree dialog
            // tags:
            //    protected

            this.categorySelectorDialog = new CategorySelectorDialog({
                rootCategory: this.root
            });

            this.dialog = new Dialog({
                title: this.localization.popuptitle,
                content: this.categorySelectorDialog,
                destroyOnHide: false,
                dialogClass: "epi-dialog-portrait"
            });
            this.own(this.dialog);
            this.connect(this.dialog, "onExecute", "_onExecute");
            this.connect(this.dialog, "onShow", "_onShow");
            this.connect(this.dialog, "onHide", "_onDialogHide");

            this.dialog.startup();
        },

        _onButtonClick: function () {
            //summary:
            //    Handle add category button click
            // tags:
            //    private

            if (!this.dialog) {
                this._createDialog();
            }

            this.dialog.show(true);
        }
    });
});
