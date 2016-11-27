/// <reference path="../../jquery-1.3.2-vsdoc.js" />
(function ($, epi) {
    epi.search = function () {
        /// <summary>
        ///     Provides AJAX based search functionality.
        /// </summary>
        var pub = {};

        var _searchProviders;
        var _queriesInProgress = 0;
        var _tooltips = [];

        var _createTooltipRow = function (heading, content) {

            // Search results are returned html-encoded
            return $("<tr>")
                .append($("<th>").html(heading))
                .append($("<td>").html(content));
        };

        var _createToolTip = function (searchResult) {
            /// <summary>
            ///    Creates a tool tip for the search result
            /// </summary>
            /// <param name="data">
            ///     The search results retreived from server.
            /// </param>
            ///
            if (searchResult) {
                var table = $("<table>");

                for (var toolTipIndex in searchResult.ToolTipElements) {
                    var toolTipElement = searchResult.ToolTipElements[toolTipIndex];
                    table.append(_createTooltipRow(toolTipElement.Label, toolTipElement.Value + "&nbsp;"));
                }

                //If they have supplied a preview text, add it to the tooltip
                if (typeof (searchResult.PreviewText) === "string" && searchResult.PreviewText.length > 0) {
                    var heading = epi.shell.resource.get("episerver.shell.ui.views.search.resources", "previewtext");
                    table.append(_createTooltipRow(heading, searchResult.PreviewText));
                }

                //If they have supplied a language, add it to the tooltip
                if (typeof (searchResult.Language) === "string" && searchResult.Language !== "") {
                    var heading = epi.shell.resource.get("episerver.shell.ui.views.search.resources", "language");
                    table.append(_createTooltipRow(heading, searchResult.Language));
                }

                //Check if we got any things in the tooltip, if we only have the <dl> and </dl> consider it as empty
                if ($("tr", table).length) {
                    return $("<div>").addClass("epi-toolTip").append(table);
                }
            }
            return "";
        };

        pub.performSearch = function (e) {
            /// <summary>
            ///     Sends the search form with AJAX to server.
            /// </summary>
            /// <param name="e" type="Event" />
            e.preventDefault();

            // Reset tooltips
            $.each(_tooltips, function (index, tooltipsByProvider) {
                tooltipsByProvider.remove();
            });
            _tooltips = [];

            $("#epiSearchResultContainer").show();

            // Hide the no result message if visible
            $("#epiSearchNoResultMessage").hide();

            var jqForm = $(this);
            var action = jqForm.attr("action");
            var formValues = jqForm.serializeArray();

            // Don't query unless we have some data to post
            if (!_hasFormDataValues(formValues)) {
                return;
            }

            // Clone the formValues array
            var encodedData = formValues.slice();
            encodedData[0].value = $.trim($("<div/>").text(encodedData[0].value).html());

            for (var i = 0; i < _searchProviders.length; i++) {
                _setAjaxLoaderVisibility(true);
                var providerId = _searchProviders[i].id;
                // Empty previous results and hide them
                $("#epiProviderResult" + providerId).hide();

                var postData = encodedData.slice();
                // Append the search provider argument
                postData.push({ name: "id", value: providerId });
                postData.push({ name: "parameters", value: '{"global": true}' }); // String constant as JSON.stringify is not available in IE quirks mode

                $.ajax({
                    url: action,
                    type: "post",
                    dataType: "json",
                    cache: false,
                    data: postData,
                    error: _showErrorReport,
                    success: _populateResult
                });
            }
        };

        var _populateResult = function (data) {
            /// <summary>
            ///     Populates the result pane with the result from one search provider
            /// </summary>
            /// <param name="data">
            ///     The search results retreived from server.
            /// </param>
            if (typeof (data) === "object" && typeof (data.providerId) === "string") {
                var providerId = data.providerId;
                var resultContainer = $("#epiProviderResult" + providerId + ">div>ol");

                var results = data.searchResult;
                if (results.length > 0) {
                    resultContainer.empty();
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i];

                        // Search result content arrive html encoded.
                        var anchor = $("<a>")
                            .attr("href", result.Url)
                            .addClass(result.IconCssClass)
                            .html(result.Title);

                        var previewText = result.PreviewText;
                        if (typeof (previewText) === "string" && previewText.length > 0) {
                            anchor.append(" - ");
                            anchor.append($("<span>").html(previewText));
                        }

                        var toolTip = _createToolTip(results[i]);

                        var  li = $("<li>").append(anchor).append(toolTip);

                        li.appendTo(resultContainer);
                        li.find("a:first")
                            .click(_onSearchResultClick)
                            .data("resultData", { area: data.area, result: results[i] })
                            .closest("li").keydown(_resultKeyDown);
                    }

                    // Get all tooltips from all providers.
                    _tooltips.push($("#epiProviderResult" + providerId).find(".epi-toolTip").epiToolTip());
                    // Show the result panes once population is complete
                    $("#epiProviderResult" + providerId).slideDown("normal");
                }

                //Set the border
                $("#epiSearch").addClass("epi-searchBorder");
            } else {
                //Removes the border if there arn't any hits
                $("#epiSearch").removeClass("epi-searchBorder");
            }

            if (_setAjaxLoaderVisibility(false) === 0) {
                // No queries left running. Check if we have any results, otherwise show a no result message
                if ($(".epi-searchProviderResult:visible").length === 0) {
                    $("#epiSearchNoResultMessage").slideDown("normal");
                }
            }
        };

        var _resultKeyDown = function (e) {
            /// <summary>
            ///     Set keyboard focus to the next or previus result in the result set
            /// </summary>
            /// <param name="e" type="KeyEventArgs">
            ///     Key event args.
            /// </param>
            switch (e.which) {
                case epi.shell.keyCode.arrowDown:
                    $(this).next().children("a:first").focus();
                    break;
                case epi.shell.keyCode.arrowUp:
                    $(this).prev().children("a:first").focus();
                    break;
            }
        };

        var _setAjaxLoaderVisibility = function (visible) {
            /// <summary>
            ///     Set visibility of the AJAX loader icon.
            ///     A counter is increased for each show call and decreased for hide call.
            ///     The loader is not hidden until the counter gets back to 0.
            /// </summary>
            /// <param name="visible" type="Boolean">
            ///     True to show the loader icon; False to hide it.
            /// </param>
            var searchField = $("#epiSearchForm>#epiSearchQuery");
            if (visible) {
                // A pending query (of several) wants to show the loader
                _queriesInProgress++;
                searchField.addClass("epi-searchInputLoading");
            } else {
                // A request is complete; decrement the count of running queries
                _queriesInProgress--;
                if (_queriesInProgress === 0) {
                    // No queries running. Hide the loader
                    searchField.removeClass("epi-searchInputLoading");
                }
            }
            return _queriesInProgress;
        };

        var _hasFormDataValues = function (formData) {
            /// <summary>
            ///     Check if a serialize jQuery form array has any values
            /// </summary>
            /// <param name="formData" type="Array">
            ///     An array created with $().searializeArray()
            /// </param>
            var i = 0;
            for (; i < formData.length; i++) {
                if ($.trim(formData[i].value).length > 0) {
                    return true;
                }
            }
            return false;
        };

        var _showErrorReport = function (xmlHttpRequest, status, errorThrown) {
            /// <summary>
            ///     Displays an error for the current provider
            /// </summary>
            /// <param name="data">
            ///     The search results retreived from server.
            /// </param>
            var data = epi.shell.serializeQueryStringAsArray(this.data);

            //Get the provider Id
            var providerId = data["id"];

            //Get the result container and add the error
            var resultContainer = $("#epiProviderResult" + providerId + ">div>ol");
            resultContainer.empty();

            var html = [];
            html.push("<li>");
            html.push(epi.shell.resource.get("episerver.shell.ui.views.search.resources", "searchprovidererrortext"));
            html.push("</li>");
            html.push("<li>");
            html.push(xmlHttpRequest.statusText);
            html.push("</li>");

            $(html.join("")).appendTo(resultContainer);

            $("#epiProviderResult" + providerId).show();

            _setAjaxLoaderVisibility(false);
        };

        var _onSearchResultClick = function (e) {
            /// <summary>
            ///     Fires the "episearchresultnavigate" event.
            ///     The custom properties an the search area are added as custom data to the event.
            /// </summary>
            /// <param name="e" type="Event" />
            var searchEvent = jQuery.Event("episearchresultnavigate");
            var data = $(this).data("resultData");

            pub.closeSearchDialog();

            $("#epiSearch").trigger(searchEvent, data);

            if (searchEvent.isDefaultPrevented()) {
                e.preventDefault();
            }
            if (searchEvent.isPropagationStopped()) {
                e.stopPropagation();
            }
        };

        var _onFrameClicked = function (e) {
            /// <summary>
            ///     Closes the search dialog assuming the click isn't within the
            ///     search dialog itself.
            /// </summary>
            /// <param name="e" type="Event" />
            var target = e.target;
            if ($(target).closest("#epi-searchContainer").length > 0 || $(target).closest("a").is(".epi-navigation-global_search")) {
                return;
            }
            pub.closeSearchDialog();
        };

        pub.openSearchDialog = function (e) {
            /// <summary>
            ///     Opens the search dialog
            /// </summary>
            if ($("#epi-searchContainer:visible").length > 0) {
                return;
            }

            var searchContainer = $("#epi-searchContainer");
            if (searchContainer.length > 0) {
                // re-use existing search interface if possible
                searchContainer.show();
                $("#epiSearchQuery").focus();
            } else {
                var parentDiv = $(e.target).closest(".epi-navigation-container-root");
                // load search interface first time used
                var path = epi.routes.getActionPath({
                    moduleArea: "shell",
                    controller: "Search",
                    action: "Index",
                    searchArea: epi.routes.defaultModuleArea
                });
                $.get(path, {}, function (data) {
                    searchContainer = $("<div id='epi-searchContainer'></div>").appendTo(parentDiv).html(data);
                    $("#epiSearchQuery").focus();
                });

                $("#epiSearchQuery").live("keydown", function (e) {
                    if (e.which === epi.shell.keyCode.escape) {
                        pub.closeSearchDialog();
                    }
                });
            }
            $(".epi-navigation-global_search").parent("li").addClass("epi-navigation-toggled");

            // We don't want _onFrameClicked to be called when the same click that registered the event is propagated to the frame.
            // We need to use setTimeout instead of stopPropagate() since we want future clicks to propagate.
            setTimeout(function () {
                epi.shell.events.bindFrameClickHandler(_onFrameClicked)
            }, 0);
        };

        pub.closeSearchDialog = function () {
            /// <summary>
            ///     Closes the search dialog
            /// </summary>
            $(".epi-over", "#epi-searchContainer").removeClass("epi-over");
            $("#epi-searchContainer").hide();

            $(".epi-navigation-global_search").parent("li").removeClass("epi-navigation-toggled");

            //Remove the click event listener
            epi.shell.events.unbindFrameClickHandler(_onFrameClicked);
        };

        pub.initialize = function (providers) {
            /// <summary>
            ///     Initializes the search functionality.
            /// </summary>
            /// <param name="providers" type="Array">
            ///     An array of search provider identifiers.
            /// </param>
            _searchProviders = providers;
        };

        // register events to open/close the search dialog
        epi.shell.registerInitFunction(function () {
            $(".epi-navigation-global_search").click(function (e) {
                e.preventDefault();
                if ($("#epi-searchContainer:visible").length > 0) {
                    pub.closeSearchDialog();
                } else {
                    pub.openSearchDialog(e);
                }
            });
        });

        return pub;
    } ();
} (epiJQuery, epi));
