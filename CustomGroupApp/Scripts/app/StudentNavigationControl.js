var StudentNavigationControl = (function () {
    function StudentNavigationControl(elementName) {
        var _this = this;
        this.elementName = elementName;
        this.studentRows = [];
        this.commonUtils = new CommonUtils();
        this.kendoHelper = new KendoHelper();
        this.create = function (name, studentSelectedCallback) {
            if (name === void 0) { name = "students"; }
            _this.studentSelectedCallback = studentSelectedCallback;
            var self = _this;
            if (_this.hostElement.childElementCount > 0) {
                while (_this.hostElement.hasChildNodes()) {
                    _this.hostElement.removeChild(_this.hostElement.lastChild);
                }
            }
            // Create HTML element for hosting the grid control
            var container = document.createElement("div");
            container.setAttribute("style", "margin: 5px 0 0 0;");
            container.id = name + "-" + _this.commonUtils.createUid() + "-container";
            var comboBoxElement = document.createElement("div");
            comboBoxElement.setAttribute("style", "width: 300px;");
            comboBoxElement.id = name + "-" + _this.commonUtils.createUid() + "-list";
            var prevButton = _this.kendoHelper.createButton("Previous");
            var nextButton = _this.kendoHelper.createButton("Next");
            _this.prevButton = _this.kendoHelper.createKendoButton(prevButton.id, _this.showPreviousStudent);
            _this.nextButton = _this.kendoHelper.createKendoButton(nextButton.id, _this.showNextStudent);
            //    container.appendChild(comboBoxElement);
            _this.hostElement.appendChild(prevButton);
            _this.hostElement.appendChild(comboBoxElement);
            _this.hostElement.appendChild(nextButton);
            $("#" + comboBoxElement.id)
                .kendoComboBox({
                options: {},
                suggest: true,
                placeholder: "select a student...",
                filter: "contains",
                dataTextField: "name",
                dataValueField: "id",
                index: 0,
                change: function (e) {
                    var inputControl = e.sender;
                    _this.onStudentChanged(inputControl.dataItem());
                }
            });
            _this.comboBoxControl = $("#" + comboBoxElement.id).data("kendoComboBox");
            return self;
        };
        this.showPreviousStudent = function () {
            var index = _this.comboBoxControl.select();
            index--;
            _this.comboBoxControl.select(index);
            _this.comboBoxControl.trigger("change");
            _this.prevButton.enable(index > 0);
            _this.nextButton.enable(index < _this.studentRows.length);
        };
        this.showNextStudent = function () {
            var index = _this.comboBoxControl.select();
            index++;
            _this.comboBoxControl.select(index);
            _this.comboBoxControl.trigger("change");
            _this.prevButton.enable(index > 0);
            _this.nextButton.enable(index + 1 < _this.studentRows.length);
        };
        this.onStudentChanged = function (studentRow) {
            if (!studentRow) {
                return;
            }
            var student = Enumerable.From(_this.students).FirstOrDefault(null, function (x) { return x.studentId === studentRow.id; });
            var tmpCallback = _this.studentSelectedCallback;
            if (tmpCallback != null && student != null) {
                tmpCallback(student);
            }
        };
        this.setDatasource = function (students) {
            var self = _this;
            // Populate the grid
            _this.students = students;
            _this.studentRows = [];
            Enumerable.From(students).ForEach(function (x) { return _this.studentRows.push(new StudentRow(x)); });
            _this.comboBoxControl.dataSource.data(_this.studentRows);
            _this.comboBoxControl.refresh();
            return self;
        };
        this.hostElement = document.getElementById(elementName);
    }
    return StudentNavigationControl;
}());
//# sourceMappingURL=StudentNavigationControl.js.map