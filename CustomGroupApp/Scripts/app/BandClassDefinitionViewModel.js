var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BandNUmericTextBoxUsage;
(function (BandNUmericTextBoxUsage) {
    BandNUmericTextBoxUsage[BandNUmericTextBoxUsage["BandSize"] = 0] = "BandSize";
    BandNUmericTextBoxUsage[BandNUmericTextBoxUsage["ClassSize"] = 1] = "ClassSize";
    BandNUmericTextBoxUsage[BandNUmericTextBoxUsage["StudentSize"] = 2] = "StudentSize";
})(BandNUmericTextBoxUsage || (BandNUmericTextBoxUsage = {}));
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
            //this.inputControl.element.hide();
        };
        this.showInput = function () {
            _this.hidden = false;
            //this.inputControl.element.show();
        };
        this.oldValue = inputControl.value();
        if (hidden) {
            this.hideInput();
        }
        else {
            this.showInput();
        }
        if (usage === BandNUmericTextBoxUsage.ClassSize)
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
var BandNumericTextBoxCollection = (function () {
    function BandNumericTextBoxCollection() {
        var _this = this;
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.me = this;
        this.items = [];
        this.classRows = [];
        this.add = function (parent, studentCount, inputControl, bandNo, classNo, usage, hidden) {
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
                .First(function (x) { return x.usage === BandNUmericTextBoxUsage.BandSize &&
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
                    .FirstOrDefault(null, function (x) { return x.usage === BandNUmericTextBoxUsage.ClassSize && x.bandNo === bandNo
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
            var _loop_2 = function(i) {
                var classNo = i;
                var classCell = Enumerable.From(_this.items)
                    .FirstOrDefault(null, function (x) { return x.usage === BandNUmericTextBoxUsage.ClassSize && x.bandNo === bandNo
                    && x.classNo === classNo; });
                if (classCell != null) {
                    classCell.hideInput();
                }
            };
            for (var i = classCount + 1; i <= _this.classRows.length; i++) {
                _loop_2(i);
            }
        };
        this.createBandColumnInTable = function (bandNo, studentCount) {
            _this.kendoHelper.createLabel(_this.columnHeaderRow.insertCell(), "Band " + bandNo);
            _this.createStudentCountInBandCell(bandNo, studentCount);
            _this.createBandCountCell(bandNo, studentCount);
        };
        // Create student count cell for a band
        this.createStudentCountInBandCell = function (bandNo, studentCount) {
            var studentCell = _this.studentsRow.insertCell();
            _this.add(studentCell, studentCount, _this.kendoHelper.createStudentsInputContainer(studentCell, studentCount, 1, bandNo, _this.oStudentSettingsChange), bandNo, 1, BandNUmericTextBoxUsage.StudentSize);
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
                _this.add(classCell, band.studentCount, _this.kendoHelper.createClassInputContainer(classCell, band.studentCount, classNo, bandNo, _this.onClassSettingsChange()), bandNo, classNo, BandNUmericTextBoxUsage.ClassSize, !showClass);
            }
        };
        // Create band count cell
        this.createBandCountCell = function (bandNo, studentCount) {
            var bandCell = _this.bandRow.insertCell();
            _this.add(bandCell, studentCount, _this.kendoHelper.createBandInputContainer(bandCell, bandNo, _this.onBandSettingsChange), bandNo, 1, BandNUmericTextBoxUsage.BandSize);
        };
        // This function is called when the number of students in a band is changed
        this.oStudentSettingsChange = function () {
            for (var _i = 0, _a = Enumerable.From(_this.items)
                .Where(function (x) { return x.usage === BandNUmericTextBoxUsage.StudentSize && x.oldValue !== x.value; })
                .Select(function (x) { return x; }).ToArray(); _i < _a.length; _i++) {
                var studentItem = _a[_i];
                _this.updateStudentSize(studentItem);
            }
        };
        // This function is called when the number of classes in a band is changed
        this.onBandSettingsChange = function () {
            var _loop_3 = function(bandItem) {
                var studentItem = Enumerable.From(_this.items)
                    .FirstOrDefault(null, function (x) { return x.usage === BandNUmericTextBoxUsage.StudentSize &&
                    x.bandNo === bandItem.bandNo; });
                _this.updateClassSizeInBand(bandItem, studentItem.studentCount);
            };
            for (var _i = 0, _a = Enumerable.From(_this.items)
                .Where(function (x) { return x.usage === BandNUmericTextBoxUsage.BandSize && x.oldValue !== x.value; })
                .Select(function (x) { return x; }).ToArray(); _i < _a.length; _i++) {
                var bandItem = _a[_i];
                _loop_3(bandItem);
            }
        };
        // This function is called when the number of students in a class is changed
        this.onClassSettingsChange = function () {
            for (var _i = 0, _a = Enumerable.From(_this.items)
                .Where(function (x) { return x.usage === BandNUmericTextBoxUsage.ClassSize && x.oldValue !== x.value; })
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
            this.createBandColumnInTable(band.bandNo, band.studentCount);
        }
        this.createStudentCountInClassRow(1, bands, true);
    };
    return BandNumericTextBoxCollection;
}());
var TopMiddleLowest = (function (_super) {
    __extends(TopMiddleLowest, _super);
    function TopMiddleLowest(studentCount) {
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this, studentCount, 3);
        this.studentCount = studentCount;
    }
    return TopMiddleLowest;
}(BandClassDefinitionViewModel));
var BandClassDefinitionViewModel = (function (_super) {
    __extends(BandClassDefinitionViewModel, _super);
    function BandClassDefinitionViewModel(studentCount, bandCount) {
        var _this = this;
        if (studentCount === void 0) { studentCount = 0; }
        if (bandCount === void 0) { bandCount = 1; }
        _super.call(this);
        this.studentCount = studentCount;
        this.classes = new kendo.data.ObservableArray([
            { classNo: 1, studentCount: 1 }
        ]);
        this.bandCount = 1;
        this.classCount = 1;
        this.getClasses = function () {
            var classes = new Array();
            _this.classes.forEach(function (val) {
                var classCnt = $("#class" + val.classNo).data("kendoNumericTextBox");
                classes.push(classCnt.value());
            });
            return classes;
        };
        this.bandSet = new BandSet(null, "Custom", this.studentCount, 1);
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.bandNumerixTextBoxes = new BandNumericTextBoxCollection();
        this.classRows = [];
        this.onStudentCountChanged = function () {
        };
        this.onBandCountChange = function () {
            _this.bandSet.createBands("custom", _this.studentCount, _this.bandCount);
            _this.bandNumerixTextBoxes.initTable("#classes-settings-container", _this.bandSet.bands);
        };
        this.createNumberInputField = function (elementId) {
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px");
            element.id = elementId;
            return element;
        };
        this.onClassCountChange = function () {
            var tmpClasses = _this.groupingHelper.calculateClassesSize(_this.studentCount, _this.classCount);
            _this.classes.splice(0, _this.classes.length);
            var cnt = 0;
            for (var i = 1; i <= _this.classCount; i++) {
                _this.classes.push({ classNo: i, studentCount: tmpClasses[i - 1] });
                cnt++;
                $("#classes-settings-container")
                    .append("<span style='width: 100px;text-align: right'>Class " +
                    i +
                    "</span><input id='class" +
                    i +
                    "' style='width: 100px; margin-right: 10px; margin-left: 10px; margin-bottom: 5px'" +
                    "></input");
                if (cnt === 3) {
                    $("#classes-settings-container")
                        .append("<div></div>");
                    cnt = 0;
                }
            }
        };
        this.bandCount = 1;
        this.onBandCountChange();
    }
    return BandClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=BandClassDefinitionViewModel.js.map