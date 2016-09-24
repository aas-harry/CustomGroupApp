var ClassTableControl = (function () {
    function ClassTableControl() {
        this.tableElementName = "class-definition-table";
        this.kendoHelper = new KendoHelper();
        this.maxColumns = 4;
        // This function is called when the number of students in class is changed
        this.studentCountInClassChangedCallback = function (classItem, newValue, oldValue, inputControl) {
            console.log("Class " + classItem.index, newValue, classItem.count);
        };
    }
    ClassTableControl.prototype.init = function (elementName, bandSet) {
        this.tableContainerElementName = elementName;
        this.bandSet = bandSet;
        // Create the table
        $("#" + this.tableContainerElementName).html("<table id='" + this.tableElementName + "'></table>");
        this.table = document.getElementById(this.tableElementName);
        this.bodyTable = this.table.createTBody();
        var classRow = this.bodyTable.insertRow();
        var cnt = 0;
        for (var _i = 0, _a = bandSet.bands[0].classes; _i < _a.length; _i++) {
            var classItem = _a[_i];
            if (cnt === this.maxColumns) {
                cnt = 0;
                classRow = this.bodyTable.insertRow();
            }
            cnt++;
            var ctrl = new StudentClassInputContainer(classRow.insertCell(), classItem, this.studentCountInClassChangedCallback, true);
        }
    };
    return ClassTableControl;
}());
//# sourceMappingURL=ClassTabControl.js.map