var BandNumericTextBoxUsage;
(function (BandNumericTextBoxUsage) {
    BandNumericTextBoxUsage[BandNumericTextBoxUsage["BandSize"] = 0] = "BandSize";
    BandNumericTextBoxUsage[BandNumericTextBoxUsage["ClassSize"] = 1] = "ClassSize";
    BandNumericTextBoxUsage[BandNumericTextBoxUsage["StudentSize"] = 2] = "StudentSize";
})(BandNumericTextBoxUsage || (BandNumericTextBoxUsage = {}));
var BandNumericTextBox = (function () {
    function BandNumericTextBox(parent, studentCount, inputControl, bandNo, classNo, usage, hidden) {
        var _this = this;
        if (hidden === void 0) { hidden = false; }
        this.parent = parent;
        this.studentCount = studentCount;
        this.inputControl = inputControl;
        this.bandNo = bandNo;
        this.classNo = classNo;
        this.usage = usage;
        this.hidden = false;
        this.oldValue = null;
        this.setValue = function (newValue) {
            _this.oldValue = _this.value;
            _this.inputControl.value(newValue);
            _this.inputControl.enable(true);
        };
        this.hideInput = function () {
            _this.hidden = true;
            _this.inputControl.value(_this.inputControl.min());
            _this.inputControl.enable(false);
        };
        this.showInput = function () {
            _this.hidden = false;
        };
        this.oldValue = inputControl.value();
        if (hidden) {
            this.hideInput();
        }
        else {
            this.showInput();
        }
        if (usage === BandNumericTextBoxUsage.ClassSize)
            console.log("New ", bandNo, classNo, hidden);
    }
    Object.defineProperty(BandNumericTextBox.prototype, "value", {
        get: function () {
            return this.inputControl.value();
        },
        enumerable: true,
        configurable: true
    });
    return BandNumericTextBox;
}());
var BandTableControl = (function () {
    function BandTableControl() {
        var _this = this;
        this.studentCountInBandControls = function (elementName, bands) {
            _this.bands = bands;
        };
    }
    return BandTableControl;
}());
var BandNumericTextBoxCollection = (function () {
    function BandNumericTextBoxCollection() {
        var _this = this;
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.me = this;
        this.items = [];
        this.classRows = [];
        // the studentCount pass to this paameter can be from two different sources:
        // 1. From band definition class or
        // 2. Zero if the class no is not in the band classes definition. 
        //    In the UI this control will be disabled if studentCount == 0 
        this.add = function (parent, band, studentCount, inputControl, bandNo, classNo, usage, hidden) {
            if (hidden === void 0) { hidden = false; }
            _this.items.push(new BandNumericTextBox(parent, studentCount, inputControl, bandNo, classNo, usage, hidden));
        };
        this.clear = function () {
            _this.items.splice(0, _this.items.length);
        };
        this.updateClassSizes = function (classItem) {
            //classItem.setValue(studentCount);
        };
        this.updateStudentSize = function (studentItem) {
            studentItem.oldValue = studentItem.value;
            studentItem.studentCount = studentItem.value;
            var bandItem = Enumerable.From(_this.items)
                .First(function (x) { return x.usage === BandNumericTextBoxUsage.BandSize &&
                x.bandNo === studentItem.bandNo; });
            _this.updateClassSizeInBand(bandItem, studentItem.value);
        };
        // This event is called when the number of classes in a band is changed
        this.updateClassSizeInBand = function (bandItem, studentCount) {
            var bandNo = bandItem.bandNo;
            bandItem.oldValue = bandItem.value;
            var tmpClases = _this.groupingHelper.calculateClassesSize(studentCount, bandItem.value);
            var classCount = bandItem.value;
            var _loop_1 = function(i) {
                var classNo = i + 1;
                var studentCountInClass = tmpClases[i];
                // Class row has not been created, add it now
                if (classNo > _this.classRows.length) {
                    var tmpBands = new Array();
                    for (var j = 1; j <= _this.bandCount; j++) {
                        tmpBands.push(new BandDefinition(null, j, "band" + j, j === bandNo ? studentCountInClass : 0, classCount));
                    }
                    _this.createStudentCountInClassRow(classNo, tmpBands);
                }
                // check if class cell has been created
                var classCell = Enumerable.From(_this.items)
                    .FirstOrDefault(null, function (x) { return x.usage === BandNumericTextBoxUsage.ClassSize && x.bandNo === bandNo
                    && x.classNo === classNo; });
                if (classCell != null) {
                    classCell.setValue(tmpClases[i]);
                    classCell.showInput();
                }
            };
            for (var i = 0; i < classCount; i++) {
                _loop_1(i);
            }
            // hide unused class in the selected band
            _this.disableUnusedClassCell(classCount, _this.classRows.length, bandNo);
        };
        this.createBandColumnInTable = function (band) {
            _this.kendoHelper.createLabel(_this.columnHeaderRow.insertCell(), band.bandName === null || band.bandName === "" ? "Band " + band.bandNo : band.bandName);
            _this.createStudentCountInBandCell(band);
            _this.createBandCountCell(band, band.bandNo, band.classCount);
        };
        // Create student count cell for a band
        this.createStudentCountInBandCell = function (band) {
            var bandNo = band.bandNo;
            var studentCount = band.studentCount;
            var studentCell = _this.studentsRow.insertCell();
            _this.add(studentCell, band, studentCount, _this.kendoHelper.createStudentsInputContainer(studentCell, studentCount, 1, bandNo, _this.oStudentSettingsChange), bandNo, 1, BandNumericTextBoxUsage.StudentSize);
        };
        // Create student count cell for a class in a band
        this.createStudentCountInClassRow = function (classNo, bands, showClass) {
            if (showClass === void 0) { showClass = false; }
            var classRow = _this.header.insertRow();
            _this.kendoHelper.createLabel(classRow.insertCell(), "Class " + classNo);
            _this.classRows.push(classRow);
            // Create student in class count cell for all the classes in a band
            for (var _i = 0, bands_1 = bands; _i < bands_1.length; _i++) {
                var band = bands_1[_i];
                var bandNo = band.bandNo;
                var classCell = classRow.insertCell();
                var studentCount = classNo <= band.classes.length ? band.classes[classNo - 1].count : 0;
                _this.add(classCell, band, studentCount, _this.kendoHelper.createClassInputContainer(classCell, studentCount, classNo, bandNo, _this.onClassSettingsChange()), bandNo, classNo, BandNumericTextBoxUsage.ClassSize, !showClass);
            }
        };
        // Create band count cell
        this.createBandCountCell = function (band, bandNo, classCount) {
            var bandCell = _this.bandRow.insertCell();
            _this.add(bandCell, classCount, _this.kendoHelper.createBandInputContainer(bandCell, bandNo, classCount, _this.onBandSettingsChange), bandNo, 0, BandNumericTextBoxUsage.BandSize);
        };
        // This function is called when the number of students in a band is changed
        this.oStudentSettingsChange = function () {
            for (var _i = 0, _a = Enumerable.From(_this.items)
                .Where(function (x) { return x.usage === BandNumericTextBoxUsage.StudentSize && x.oldValue !== x.value; })
                .Select(function (x) { return x; }).ToArray(); _i < _a.length; _i++) {
                var studentItem = _a[_i];
                _this.updateStudentSize(studentItem);
            }
        };
        // This function is called when the number of classes in a band is changed
        this.onBandSettingsChange = function () {
            var _loop_2 = function(bandItem) {
                var studentItem = Enumerable.From(_this.items)
                    .FirstOrDefault(null, function (x) { return x.usage === BandNumericTextBoxUsage.StudentSize &&
                    x.bandNo === bandItem.bandNo; });
                _this.updateClassSizeInBand(bandItem, studentItem.studentCount);
            };
            for (var _i = 0, _a = Enumerable.From(_this.items)
                .Where(function (x) { return x.usage === BandNumericTextBoxUsage.BandSize && x.oldValue !== x.value; })
                .Select(function (x) { return x; }).ToArray(); _i < _a.length; _i++) {
                var bandItem = _a[_i];
                _loop_2(bandItem);
            }
        };
        // This function is called when the number of students in a class is changed
        this.onClassSettingsChange = function () {
            for (var _i = 0, _a = Enumerable.From(_this.items)
                .Where(function (x) { return x.usage === BandNumericTextBoxUsage.ClassSize && x.oldValue !== x.value; })
                .Select(function (x) { return x; }).ToArray(); _i < _a.length; _i++) {
                var classItem = _a[_i];
                _this.updateClassSizes(classItem);
            }
        };
        this.convertToBands = function (studentCounts) {
            var classes = new Array();
            for (var i = 0; i < studentCounts.length; i++) {
                var bandNo = i + 1;
                classes.push(new BandDefinition(null, bandNo, "Band " + bandNo, studentCounts[i], 1));
            }
            return classes;
        };
    }
    Object.defineProperty(BandNumericTextBoxCollection.prototype, "classCount", {
        get: function () {
            return this.classRows.length;
        },
        enumerable: true,
        configurable: true
    });
    BandNumericTextBoxCollection.prototype.initTable = function (elementName, bands) {
        this.bands = bands;
        this.clear();
        $("#classes-settings-container").html("<table id='band-definition-table'></table>");
        this.table = document.getElementById("band-definition-table");
        this.header = this.table.createTHead();
        this.classRows.splice(0, this.classRows.length);
        this.columnHeaderRow = this.header.insertRow();
        this.studentsRow = this.header.insertRow();
        this.bandRow = this.header.insertRow();
        this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), "");
        this.kendoHelper.createLabel(this.studentsRow.insertCell(), "# Students");
        this.kendoHelper.createLabel(this.bandRow.insertCell(), "# Classes");
        this.bandCount = bands.length;
        for (var _i = 0, bands_2 = bands; _i < bands_2.length; _i++) {
            var band = bands_2[_i];
            this.createBandColumnInTable(band);
        }
        var maxClassNo = Enumerable.From(bands).Max(function (x) { return x.classCount; });
        for (var classNo = 1; classNo <= maxClassNo; classNo++) {
            this.createStudentCountInClassRow(classNo, bands, true);
        }
        for (var _a = 0, bands_3 = bands; _a < bands_3.length; _a++) {
            var band = bands_3[_a];
            if (band.classes.length < maxClassNo) {
                this.disableUnusedClassCell(band.classes.length, maxClassNo, band.bandNo);
            }
        }
    };
    BandNumericTextBoxCollection.prototype.disableUnusedClassCell = function (fromClassNo, toClassNo, bandNo) {
        var _loop_3 = function(i) {
            var classNo = i;
            var classCell = Enumerable.From(this_1.items)
                .FirstOrDefault(null, function (x) { return x.usage === BandNumericTextBoxUsage.ClassSize && x.bandNo === bandNo
                && x.classNo === classNo; });
            if (classCell != null) {
                classCell.hideInput();
            }
        };
        var this_1 = this;
        for (var i = fromClassNo + 1; i <= toClassNo; i++) {
            _loop_3(i);
        }
    };
    return BandNumericTextBoxCollection;
}());
