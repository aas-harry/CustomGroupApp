// Input container to enter number of classes in a band
var ClassBandInputContainer = (function () {
    function ClassBandInputContainer(cell, bandItem, callback, addLabel) {
        var _this = this;
        if (addLabel === void 0) { addLabel = false; }
        this.kendoHelper = new KendoHelper();
        this.init = function () {
            if (_this.addLabel) {
                var label = document.createElement("span");
                label.textContent = "# Classes " + _this.bandItem.bandNo;
                label.setAttribute("style", "margin-right: 5px");
                _this.cell.appendChild(label);
            }
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px");
            element.id = "classband-" + _this.bandItem.uid;
            _this.cell.appendChild(element);
            _this.kendoHelper.createClassCountInputControl(element.id, _this.bandItem.classCount, _this.onClassCountChanged);
        };
        this.onClassCountChanged = function (count, inputControl) {
            var oldValue = _this.bandItem.classCount;
            var newValue = count;
            _this.bandItem.classCount = count;
            if (_this.callbackAction != null) {
                _this.callbackAction(_this.bandItem, newValue, oldValue, inputControl);
            }
        };
        this.cell = cell;
        this.bandItem = bandItem;
        this.callbackAction = callback;
        this.addLabel = addLabel;
        this.init();
    }
    return ClassBandInputContainer;
}());
