// Input container to enter number of students in a band
var StudentClassInputContainer = (function () {
    function StudentClassInputContainer(cell, classItem, callback, addLabel) {
        var _this = this;
        if (addLabel === void 0) { addLabel = false; }
        this.classItem = classItem;
        this.kendoHelper = new KendoHelper();
        this.dispose = function () {
            _this.kendoHelper = null;
            _this.callbackAction = null;
            _this.inputControl.destroy();
            _this.inputControl = null;
        };
        this.init = function () {
            if (_this.addLabel) {
                var container_1 = document.createElement("div");
                container_1.setAttribute("style", "margin: 5px 5px 0 0");
                var label = document.createElement("span");
                label.textContent = "Class " + _this.classItem.index;
                container_1.appendChild(label);
                _this.cellContainer.appendChild(container_1);
            }
            if (_this.classItem.parent.parent.bandType === BandType.PreallocatedClass) {
                var container_2 = document.createElement("div");
                container_2.setAttribute("style", "margin: 5px 5px 0 0");
                var label = document.createElement("span");
                label.textContent = "Pre-alloc: " + _this.classItem.preallocatedStudentCount;
                container_2.appendChild(label);
                _this.cellContainer.appendChild(container_2);
            }
            var container = document.createElement("div");
            container.setAttribute("style", "margin: 5px 5px 0 0");
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px; margin-right: 5px 5px 5px 20px");
            var elementId = _this.classItem ? _this.classItem.uid : createUuid();
            element.id = "studentclass-" + elementId;
            container.appendChild(element);
            _this.cellContainer.appendChild(container);
            var studentCount = _this.classItem ? _this.classItem.count : 0;
            _this.inputControl = _this.kendoHelper.createStudentCountInputControl(element.id, studentCount, _this.onStudentCountChanged);
            if (_this.classItem.notUsed) {
                _this.hideInput();
            }
        };
        this.onStudentCountChanged = function (count, inputControl) {
            var oldValue = _this.classItem.count;
            var newValue = count;
            _this.classItem.count = count;
            if (_this.callbackAction != null) {
                _this.callbackAction(_this.classItem, newValue, oldValue, inputControl);
            }
        };
        this.hideInput = function () {
            _this.classItem.notUsed = true;
            _this.inputControl.value(_this.inputControl.min());
            _this.inputControl.enable(false);
        };
        this.showInput = function (count) {
            _this.classItem.notUsed = false;
            _this.inputControl.value(count);
            _this.inputControl.enable(true);
        };
        this.cell = cell;
        this.cellContainer = document.createElement("div");
        this.cellContainer.setAttribute("style", "margin: 5px 5px 0 0");
        this.cell.appendChild(this.cellContainer);
        this.classItem = classItem;
        this.callbackAction = callback;
        this.addLabel = addLabel;
        this.init();
    }
    return StudentClassInputContainer;
}());
//# sourceMappingURL=StudentClassInputContainer.js.map