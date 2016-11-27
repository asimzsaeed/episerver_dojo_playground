dojo.require("epi-cms.ErrorDialog");

(function () {
    return {
        uiCreated: function (namingContainer) {
            var categorySelectorWidget = dijit.byId(namingContainer + 'SelectedCategory');

            var updateMaxNumberOfPages = function (newCategoryId) {
                // Fetch the count of pages using the category, and update the constraints of the input as well as the display.
                dojo.xhrPost({
                    url: '../../CMS/VisitedCategories/GetNumberOfPagesUsingCategory',
                    content: {
                        categoryId: newCategoryId
                    },
                    handleAs: 'json',
                    error: epi.cms.ErrorDialog.showXmlHttpError,
                    load: function (data, ioArgs) {
                        var numberOfPagesUsingCategory = data.numberOfPagesUsingCategory;

                        var numberOfPagesWidget = dijit.byId(namingContainer + 'NumberOfPageViews');
                        var numberOfPagesUsingCategoryDislayElement = dojo.byId(namingContainer + 'numberOfPagesUsingCategoryDislay');

                        numberOfPagesWidget.constraints.max = numberOfPagesUsingCategory;
                        numberOfPagesUsingCategoryDislayElement.innerHTML = numberOfPagesUsingCategory;
                    }
                });
            };

            dojo.connect(categorySelectorWidget, 'onChange', null, updateMaxNumberOfPages);

            // Trigger the updateConstraints once on first load.
            updateMaxNumberOfPages(categorySelectorWidget.value);
        }
    };
})();
