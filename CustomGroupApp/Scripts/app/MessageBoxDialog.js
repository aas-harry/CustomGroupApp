var MessageBoxDialog = (function () {
    function MessageBoxDialog() {
        var _this = this;
        this.commonUtils = new CommonUtils();
        this.kendoHelper = new KendoHelper();
        this.showInfoDialog = function (element, message, title, height, width, callback) {
            if (height === void 0) { height = 120; }
            if (width === void 0) { width = 400; }
            if (callback === void 0) { callback = null; }
            _this.initWindowContainer(element, message, title, width, height, callback);
        };
        this.showWarningDialog = function (element, message, title, height, width, callback) {
            if (height === void 0) { height = 120; }
            if (width === void 0) { width = 400; }
            if (callback === void 0) { callback = null; }
            _this.initWindowContainer(element, message, title, width, height, callback);
        };
        this.showErrorDialog = function (element, message, title, height, width, callback) {
            if (height === void 0) { height = 120; }
            if (width === void 0) { width = 400; }
            _this.initWindowContainer(element, message, title, width, height, callback);
        };
        this.showSuccessDialog = function (element, message, title, height, width, callback) {
            if (height === void 0) { height = 120; }
            if (width === void 0) { width = 400; }
            if (callback === void 0) { callback = null; }
            _this.initWindowContainer(element, message, title, width, height, callback);
        };
        this.showYesNoDialog = function (element, message, title, height, width, callback, yesButton, noButton) {
            if (height === void 0) { height = 120; }
            if (width === void 0) { width = 400; }
            if (yesButton === void 0) { yesButton = "Yes"; }
            if (noButton === void 0) { noButton = "No"; }
            _this.initWindowContainer(element, message, title, width, height, callback, yesButton, noButton);
        };
        this.showYesNoCancelDialog = function (element, message, title, callback, height, width, yesButton, noButton, cancelButton) {
            if (height === void 0) { height = 120; }
            if (width === void 0) { width = 400; }
            if (yesButton === void 0) { yesButton = "Yes"; }
            if (noButton === void 0) { noButton = "No"; }
            if (cancelButton === void 0) { cancelButton = "Cancel"; }
            _this.initWindowContainer(element, message, title, width, height, callback, yesButton, noButton, cancelButton);
        };
        this.createButton = function (container, caption, id, popupWindow, callback, dialogResult) {
            var button = document.createElement("button");
            button.id = id;
            button.textContent = caption;
            button.setAttribute("style", "margin-left: 2.5px; margin-right: 2.5px");
            container.appendChild(button);
            _this.kendoHelper.createKendoButton(id, function () {
                popupWindow.close().destroy();
                if (callback) {
                    callback(dialogResult);
                }
            });
            return button;
        };
        this.initWindowContainer = function (element, message, title, width, height, callback, yesButton, noButton, cancelButton) {
            var elementContainer = document.getElementById(element);
            if (elementContainer.childElementCount > 0) {
                while (elementContainer.hasChildNodes()) {
                    elementContainer.removeChild(elementContainer.lastChild);
                }
            }
            // create window content
            var window = document.createElement("div");
            window.setAttribute("style", "margin: 10px 0 10px 0; overflow: none");
            window.id = _this.commonUtils.createUid();
            window.setAttribute("style", "padding: 20px");
            elementContainer.appendChild(window);
            var messageElement = document.createElement("p");
            messageElement.innerHTML = message;
            messageElement.setAttribute("style", "margin-top: 10px");
            window.appendChild(messageElement);
            var buttonContainer = document.createElement("div");
            buttonContainer.setAttribute("style", "margin-top: 30px");
            window.appendChild(buttonContainer);
            var popupWindow = _this.showDialog(window, title, width, height);
            if (!yesButton && !noButton && !cancelButton) {
                _this.createButton(buttonContainer, "OK", "ok-button", popupWindow, callback, DialogResult.Ok);
            }
            if (yesButton) {
                _this.createButton(buttonContainer, yesButton, "yes-button", popupWindow, callback, DialogResult.Yes);
            }
            if (noButton) {
                _this.createButton(buttonContainer, noButton, "no-button", popupWindow, callback, DialogResult.No);
            }
            if (cancelButton) {
                _this.createButton(buttonContainer, cancelButton, "cancel-button", popupWindow, callback, DialogResult.Cancel);
            }
            return window;
        };
        this.showDialog = function (window, title, width, height) {
            var popupWindow = $("#" + window.id)
                .kendoWindow({
                width: width + "px",
                height: height + "px",
                modal: true,
                scrollable: true,
                actions: ["Close"],
                resizable: false,
                title: title
            })
                .data("kendoWindow");
            $("#" + window.id).parent().addClass("h-window-caption");
            popupWindow.center().open();
            return popupWindow;
        };
    }
    return MessageBoxDialog;
}());
var DialogResult;
(function (DialogResult) {
    DialogResult[DialogResult["Yes"] = 1] = "Yes";
    DialogResult[DialogResult["No"] = 2] = "No";
    DialogResult[DialogResult["Cancel"] = 3] = "Cancel";
    DialogResult[DialogResult["Ok"] = 4] = "Ok";
})(DialogResult || (DialogResult = {}));
//# sourceMappingURL=MessageBoxDialog.js.map