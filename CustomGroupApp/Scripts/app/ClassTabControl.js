var ClassTableControl = (function () {
    function ClassTableControl(studentCountChangedCallback) {
        var _this = this;
        this.tableElementName = "class-definition-table";
        this.kendoHelper = new KendoHelper();
        this.maxColumns = 4;
        this.studentClassControls = new Array();
        this.updateStudentClassRows = function () {
            while (_this.bodyTable.rows.length > 0) {
                _this.bodyTable.deleteRow(0);
            }
            for (var _i = 0, _a = _this.studentClassControls; _i < _a.length; _i++) {
                var ctrl = _a[_i];
                ctrl.dispose();
            }
            _this.studentClassControls = [];
            var classRow = _this.bodyTable.insertRow();
            var cnt = 0;
            for (var _b = 0, _c = _this.bandSet.bands[0].classes; _b < _c.length; _b++) {
                var classItem = _c[_b];
                if (cnt === _this.maxColumns) {
                    cnt = 0;
                    classRow = _this.bodyTable.insertRow();
                }
                cnt++;
                _this.studentClassControls.push(new StudentClassInputContainer(classRow.insertCell(), classItem, _this.studentCountInClassChangedCallback, true));
            }
        };
        // This function is called when the number of students in class is changed
        this.studentCountInClassChangedCallback = function (classItem, newValue, oldValue, inputControl) {
            var studentCountChangedCallback = _this.studentCountChangedCallback;
            if (studentCountChangedCallback != null) {
                studentCountChangedCallback();
            }
        };
        this.studentCountChangedCallback = studentCountChangedCallback;
    }
    ClassTableControl.prototype.init = function (elementName, bandSet) {
        this.tableContainerElementName = elementName;
        this.bandSet = bandSet;
        // Create the table
        $("#" + this.tableContainerElementName).html("<table id='" + this.tableElementName + "'></table>");
        this.table = document.getElementById(this.tableElementName);
        this.bodyTable = this.table.createTBody();
        this.updateStudentClassRows();
    };
    return ClassTableControl;
}());
//# sourceMappingURL=ClassTabControl.js.map