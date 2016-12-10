var ExportCustomGroupDialog = (function () {
    function ExportCustomGroupDialog() {
        var _this = this;
        this.includeResultsElement = "include-results-option";
        this.includeLanguagesElement = "include-language-option";
        this.includeStudentIdElement = "include-student-id";
        this.openDialog = function (element, includeResults, includeLanguagePrefs, includeStudentId, callback) {
            var commonUtils = new CommonUtils();
            var kendoHelper = new KendoHelper();
            // create window content
            var window = document.createElement("div");
            window.setAttribute("style", "margin: 10px 0 10px 0; overflow: none");
            window.id = commonUtils.createUid();
            if (element.childElementCount > 0) {
                while (element.hasChildNodes()) {
                    element.removeChild(element.lastChild);
                }
            }
            element.appendChild(window);
            var popupWindow = $("#" + window.id)
                .kendoWindow({
                width: "400px",
                height: "150px",
                modal: true,
                scrollable: true,
                actions: ["Close"],
                resizable: false,
                title: "Export Selected Custom Groupss"
            })
                .data("kendoWindow");
            // Add options
            window.setAttribute("style", "padding: 20px");
            window.appendChild(_this.addOptions("Include Student Results", _this.includeResultsElement, includeResults));
            window.appendChild(_this.addOptions("Include Student Language Preferences", _this.includeLanguagesElement, includeLanguagePrefs));
            window.appendChild(_this.addOptions("Include Student Ids", _this.includeStudentIdElement, includeStudentId));
            // Add export and cancel buttons
            var buttonContainer = document.createElement("div");
            buttonContainer.setAttribute("style", "margin-top: 10px");
            var saveButtonElement = document.createElement("button");
            saveButtonElement.id = "export-button";
            saveButtonElement.textContent = "Export";
            saveButtonElement.setAttribute("style", "margin-left: 2.5px; margin-right: 2.5px");
            var cancelButtonElement = document.createElement("button");
            cancelButtonElement.id = "cancel-button";
            cancelButtonElement.textContent = "Cancel";
            buttonContainer.appendChild(saveButtonElement);
            buttonContainer.appendChild(cancelButtonElement);
            window.appendChild(buttonContainer);
            kendoHelper.createKendoButton("export-button", function (e) {
                callback(true, _this.includeResults, _this.includeLanguages, _this.includeStudentId);
                popupWindow.close().destroy();
            });
            kendoHelper.createKendoButton("cancel-button", function (e) {
                popupWindow.close().destroy();
                callback(false, false, false, false);
            });
            $("#" + window.id).parent().addClass("h-window-caption");
            popupWindow.center().open();
        };
        this.addOptions = function (optionName, optionId, initialVal) {
            var optionContainer = document.createElement("div");
            var optionLabel = document.createElement("label");
            optionLabel.setAttribute("style", "font-weight: normal");
            optionLabel.textContent = optionName;
            var optionCheckBox = document.createElement("input");
            optionCheckBox.type = "checkbox";
            optionCheckBox.id = optionId;
            if (initialVal) {
                optionCheckBox.setAttribute("checked", "checked");
            }
            optionContainer.appendChild(optionCheckBox);
            optionContainer.appendChild(optionLabel);
            return optionContainer;
        };
    }
    Object.defineProperty(ExportCustomGroupDialog.prototype, "includeResults", {
        get: function () {
            var checkBox = document.getElementById(this.includeResultsElement);
            return checkBox ? checkBox.checked : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExportCustomGroupDialog.prototype, "includeLanguages", {
        get: function () {
            var checkBox = document.getElementById(this.includeLanguagesElement);
            return checkBox ? checkBox.checked : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExportCustomGroupDialog.prototype, "includeStudentId", {
        get: function () {
            var checkBox = document.getElementById(this.includeStudentIdElement);
            return checkBox ? checkBox.checked : false;
        },
        enumerable: true,
        configurable: true
    });
    return ExportCustomGroupDialog;
}());
//# sourceMappingURL=ExportCustomGroupDialog.js.map