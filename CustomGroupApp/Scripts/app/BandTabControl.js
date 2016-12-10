var BandTableControl = (function () {
    function BandTableControl(studentCountChangedCallback) {
        var _this = this;
        this.tableElementName = "band-definition-table";
        this.classRows = [];
        this.kendoHelper = new KendoHelper();
        this.studentBandControls = [];
        this.classBandControls = [];
        this.studentClassControls = [];
        this.updateStudentClassRows = function () {
            while (_this.bodyTable.rows.length > 1) {
                _this.bodyTable.deleteRow(1);
            }
            for (var _i = 0, _a = _this.studentClassControls; _i < _a.length; _i++) {
                var ctrl = _a[_i];
                ctrl.dispose();
            }
            _this.studentClassControls = [];
            var maxClassNo = Enumerable.From(_this.bandSet.bands).Max(function (x) { return x.classCount; });
            _this.classRows.splice(0, _this.classRows.length);
            for (var classNo = 1; classNo <= maxClassNo; classNo++) {
                _this.addStudentClassRow(classNo, _this.bandSet.bands, true);
            }
        };
        this.addSplitCommonBand = function (hasCommonBand, band) {
            if (!hasCommonBand || _this.bandSet.bands.length <= 1) {
                return;
            }
            if (band.commonBand) {
                _this.kendoHelper.createButtonWithId(_this.commonHeaderRow.insertCell(), "Add to others", band.uid, _this.addBandToOthers, 75, "left", 5, 0, 5, 0);
            }
            else {
                _this.kendoHelper.createLabel(_this.commonHeaderRow.insertCell(), "");
            }
        };
        this.addBandToOthers = function (uid) {
            var notCommonBands = Enumerable.From(_this.bandSet.bands).Where(function (x) { return !x.commonBand; }).ToArray();
            var band = Enumerable.From(_this.bandSet.bands).FirstOrDefault(null, function (x) { return x.uid === uid; });
            if (!band) {
                return;
            }
            band.setClassCount(notCommonBands.length);
            band.prepare("", band.students, [], []);
            var cnt = 0;
            for (var _i = 0, notCommonBands_1 = notCommonBands; _i < notCommonBands_1.length; _i++) {
                var otherBand = notCommonBands_1[_i];
                for (var _a = 0, _b = band.classes[cnt].students; _a < _b.length; _a++) {
                    var s = _b[_a];
                    otherBand.students.push(s);
                    otherBand.classes[0].count += 1;
                }
                otherBand.studentCount = otherBand.students.length;
                cnt++;
            }
            band.students = [];
            band.studentCount = 0;
            _this.bandSet.bands = Enumerable.From(_this.bandSet.bands).Where(function (x) { return x.uid !== uid; }).ToArray();
            // fix the band no
            for (var _c = 0, _d = _this.bandSet.bands; _c < _d.length; _c++) {
                var bandItem = _d[_c];
                bandItem.bandNo -= 1;
            }
            _this.init(_this.tableContainerElementName, _this.bandSet);
        };
        // Create band count cell
        this.addClassBandCell = function (band, bandNo, classCount, hasCommonBand) {
            if (hasCommonBand === void 0) { hasCommonBand = false; }
            var bandCell = _this.bandRow.insertCell();
            _this.classBandControls.push(new ClassBandInputContainer(bandCell, band, _this.classCountInBandChangedCallback, false));
        };
        // Create student count cell for a class in a band
        this.addStudentClassRow = function (classNo, bands, showClass) {
            if (showClass === void 0) { showClass = false; }
            var classRow = _this.bodyTable.insertRow();
            _this.classRows.push(classRow);
            _this.kendoHelper.createLabel(classRow.insertCell(), "Class " + classNo, 150, "left", 5, 5, 0, 0);
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
            _this.updateStudentClassRows();
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
        var hasCommonBand = Enumerable.From(bands).Any(function (x) { return x.commonBand; });
        // Create the table
        $("#" + this.tableContainerElementName).html("<table id='" + this.tableElementName + "'></table>");
        this.table = document.getElementById(this.tableElementName);
        this.headerTable = this.table.createTHead();
        this.bodyTable = this.table.createTBody();
        this.columnHeaderRow = this.headerTable.insertRow();
        if (hasCommonBand && bands.length > 1) {
            this.commonHeaderRow = this.headerTable.insertRow();
        }
        this.bandRow = this.bodyTable.insertRow();
        this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), "");
        if (hasCommonBand && bands.length > 1) {
            this.kendoHelper.createLabel(this.commonHeaderRow.insertCell(), "");
        }
        this.kendoHelper.createLabel(this.bandRow.insertCell(), "# Classes");
        this.bandCount = bandSet.bands.length;
        for (var _i = 0, _a = bandSet.bands; _i < _a.length; _i++) {
            var band = _a[_i];
            this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), band.bandName === null || band.bandName === "" ? "Band " + band.bandNo : band.bandName);
            this.addSplitCommonBand(hasCommonBand, band);
            this.addClassBandCell(band, band.bandNo, band.classCount, hasCommonBand);
        }
        this.updateStudentClassRows();
    };
    return BandTableControl;
}());
//# sourceMappingURL=BandTabControl.js.map