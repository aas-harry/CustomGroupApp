var KendoHelper = (function () {
    function KendoHelper() {
        var _this = this;
        this.integerFormat = "n0";
        this.createBandInputContainer = function (cell, bandNo) {
            var label = document.createElement("span");
            label.textContent = "Band " + bandNo;
            label.setAttribute("style", "margin-right: 5px");
            cell.appendChild(label);
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px");
            element.id = "Band" + bandNo;
            cell.appendChild(element);
            _this.createBandInputField(element.id, null);
        };
        this.createClassInputField = function (element, callbackChangeEvent) {
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, 1, 1, 30, _this.integerFormat, callbackChangeEvent);
        };
        this.createBandInputField = function (element, callbackChangeEvent) {
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, 1, 1, 5, _this.integerFormat, callbackChangeEvent);
        };
        this.createNumericTextBox = function (element, defaultValue, min, max, format, callbackChangeEvent) {
            if (defaultValue === void 0) { defaultValue = 0; }
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 10; }
            if (format === void 0) { format = _this.integerFormat; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            $("#" + element)
                .kendoNumericTextBox({
                options: {},
                change: callbackChangeEvent,
                spin: callbackChangeEvent
            });
            var numericTextBox = $("#" + element).data("kendoNumericTextBox");
            numericTextBox.options.format = format;
            numericTextBox.value(defaultValue);
            numericTextBox.max(max);
            numericTextBox.min(min);
        };
    }
    return KendoHelper;
}());
//# sourceMappingURL=kendoHelper.js.map