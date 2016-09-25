var BandTableControl = (function () {
    function BandTableControl(studentCountChangedCallback) {
        var _this = this;
        this.tableElementName = "band-definition-table";
        this.classRows = [];
        this.kendoHelper = new KendoHelper();
        this.studentBandControls = [];
        this.classBandControls = [];
        this.studentClassControls = [];
        // Create band count cell
        this.addClassBandCell = function (band, bandNo, classCount) {
            var bandCell = _this.bandRow.insertCell();
            _this.classBandControls.push(new ClassBandInputContainer(bandCell, band, _this.classCountInBandChangedCallback, false));
        };
        // Create student count cell for a class in a band
        this.addStudentClassRow = function (classNo, bands, showClass) {
            if (showClass === void 0) { showClass = false; }
            var classRow = _this.bodyTable.insertRow();
            _this.classRows.push(classRow);
            _this.kendoHelper.createLabel(classRow.insertCell(), "Class " + classNo);
            // Create student in class count cell for all the classes in a band
            for (var _i = 0, bands_1 = bands; _i < bands_1.length; _i++) {
                var band = bands_1[_i];
                var classCell = classRow.insertCell();
                var classItem = classNo <= band.classes.length ? band.classes[classNo - 1] : new ClassDefinition(band, classNo, 0, true);
                _this.studentClassControls.push(new StudentClassInputContainer(classCell, classItem, _this.studentCountInClassChangedCallback, false));
            }
        };
        // This function is called when the number of students in a band is changed
        this.studentCountInBandChangedCallback = function (bandItem, newValue, oldValue, inputControl) {
            bandItem.studentCount = Enumerable.From(bandItem.classes).Sum(function (b) { return b.count; });
            var studentCountChangedCallback = _this.studentCountChangedCallback;
            if (studentCountChangedCallback != null) {
                studentCountChangedCallback();
            }
        };
        // This function is called when the number of students in a band is changed
        this.classCountInBandChangedCallback = function (bandItem, newValue, oldValue, inputControl) {
            console.log("#Classes Band " + bandItem.bandNo, newValue, bandItem.classCount);
            bandItem.setClassCount(newValue);
            _this.init(_this.tableContainerElementName, _this.bandSet);
            var studentCountChangedCallback = _this.studentCountChangedCallback;
            if (studentCountChangedCallback != null) {
                studentCountChangedCallback();
            }
        };
        // This function is called when the number of students in class is changed
        this.studentCountInClassChangedCallback = function (classItem, newValue, oldValue, inputControl) {
            console.log("Class " + classItem.index, newValue, classItem.count);
            var studentCountChangedCallback = _this.studentCountChangedCallback;
            if (studentCountChangedCallback != null) {
                studentCountChangedCallback();
            }
        };
        this.studentCountChangedCallback = studentCountChangedCallback;
    }
    BandTableControl.prototype.init = function (elementName, bandSet) {
        this.tableContainerElementName = elementName;
        this.bandSet = bandSet;
        var bands = this.bandSet.bands;
        // Create the table
        $("#" + this.tableContainerElementName).html("<table id='" + this.tableElementName + "'></table>");
        this.table = document.getElementById(this.tableElementName);
        this.headerTable = this.table.createTHead();
        this.bodyTable = this.table.createTBody();
        this.columnHeaderRow = this.headerTable.insertRow();
        this.bandRow = this.bodyTable.insertRow();
        this.classRows.splice(0, this.classRows.length);
        this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), "");
        this.kendoHelper.createLabel(this.bandRow.insertCell(), "# Classes");
        this.bandCount = bandSet.bands.length;
        for (var _i = 0, _a = bandSet.bands; _i < _a.length; _i++) {
            var band = _a[_i];
            this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), band.bandName === null || band.bandName === "" ? "Band " + band.bandNo : band.bandName);
            this.addClassBandCell(band, band.bandNo, band.classCount);
        }
        var maxClassNo = Enumerable.From(bands).Max(function (x) { return x.classCount; });
        for (var classNo = 1; classNo <= maxClassNo; classNo++) {
            this.addStudentClassRow(classNo, bands, true);
        }
    };
    return BandTableControl;
}());
//# sourceMappingURL=BandTabControl.js.map