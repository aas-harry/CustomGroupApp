// Input container to enter number of students in a band
var StudentBandInputContainer = (function () {
    function StudentBandInputContainer(cell, bandItem, callback, addLabel) {
        var _this = this;
        if (addLabel === void 0) { addLabel = false; }
        this.kendoHelper = new KendoHelper();
        this.init = function () {
            if (_this.addLabel) {
                var label = document.createElement("span");
                label.textContent = "# Students " + _this.bandItem.bandNo;
                label.setAttribute("style", "margin-right: 5px");
                _this.cell.appendChild(label);
            }
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px");
            element.id = "studentband-" + _this.bandItem.uid;
            _this.cell.appendChild(element);
            _this.kendoHelper.createStudentCountInputControl(element.id, _this.bandItem.studentCount, _this.onStudentCountChanged);
        };
        this.onStudentCountChanged = function (count, inputControl) {
            var oldValue = _this.bandItem.studentCount;
            var newValue = count;
            _this.bandItem.studentCount = count;
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
    return StudentBandInputContainer;
}());
//# sourceMappingURL=StudentBandInputContainer.js.map