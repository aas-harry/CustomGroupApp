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
    function BandNumericTextBox(parent, inputControl, bandNo, classNo, usage) {
        var _this = this;
        this.parent = parent;
        this.inputControl = inputControl;
        this.bandNo = bandNo;
        this.classNo = classNo;
        this.usage = usage;
        this.oldValue = null;
        this.setValue = function (newValue) {
            _this.inputControl.value(newValue);
        };
        this.oldValue = inputControl.value();
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
        this.items = [];
        this.add = function (parent, inputControl, bandNo, classNo, usage) {
            _this.items.push(new BandNumericTextBox(parent, inputControl, bandNo, classNo, usage));
        };
        this.clear = function () {
            _this.items.splice(0, _this.items.length);
        };
        this.updateClassSizes = function () {
            var _loop_1 = function(bandItem) {
                var studentItem = Enumerable.From(_this.items)
                    .First(function (x) { return x.usage === BandNUmericTextBoxUsage.StudentSize && x.bandNo === bandItem.bandNo; });
                tmpClases = _this.groupingHelper.calculateClassesSize(studentItem.value, bandItem.value);
                for (var _i = 0, _a = Enumerable.From(_this.items)
                    .Where(function (x) { return x.usage === BandNUmericTextBoxUsage.ClassSize && x.bandNo === bandItem.bandNo; })
                    .Select(function (x) { return x; })
                    .ToArray(); _i < _a.length; _i++) {
                    var classItem = _a[_i];
                    classItem.setValue(tmpClases[classItem.classNo - 1]);
                }
            };
            var tmpClases;
            for (var _b = 0, _c = Enumerable.From(_this.items)
                .Where(function (x) { return x.usage === BandNUmericTextBoxUsage.BandSize && x.oldValue !== x.value; })
                .Select(function (x) { return x; }).ToArray(); _b < _c.length; _b++) {
                var bandItem = _c[_b];
                _loop_1(bandItem);
            }
        };
    }
    return BandNumericTextBoxCollection;
}());
var BandClassDefinitionViewModel = (function (_super) {
    __extends(BandClassDefinitionViewModel, _super);
    function BandClassDefinitionViewModel(studentCount) {
        var _this = this;
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
        this.classes = new kendo.data.ObservableArray([
            { classNo: 1, studentCount: 1 }
        ]);
        this.bandCount = 3;
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
            _this.bandNumerixTextBoxes.clear();
            _this.bandSet.createBands("custom", _this.studentCount, _this.bandCount);
            $("#classes-settings-container").html("<table id='band-definition-table'></table>");
            _this.table = document.getElementById("band-definition-table");
            _this.header = _this.table.createTHead();
            _this.classRows.splice(0, _this.classRows.length);
            _this.columnHeaderRow = _this.header.insertRow();
            _this.studentsRow = _this.header.insertRow();
            _this.bandRow = _this.header.insertRow();
            _this.classRows.push(_this.header.insertRow());
            _this.kendoHelper.createLabel(_this.columnHeaderRow.insertCell(), "");
            _this.kendoHelper.createLabel(_this.studentsRow.insertCell(), "# Students");
            _this.kendoHelper.createLabel(_this.bandRow.insertCell(), "# Classes");
            _this.kendoHelper.createLabel(_this.classRows[0].insertCell(), "Class 1");
            for (var bandNo = 1; bandNo <= _this.bandCount; bandNo++) {
                var studentCount = _this.bandSet.bands[bandNo - 1].studentCount;
                _this.kendoHelper.createLabel(_this.columnHeaderRow.insertCell(), "Band " + bandNo);
                var studentCell = _this.studentsRow.insertCell();
                _this.bandNumerixTextBoxes.add(studentCell, _this.kendoHelper.createStudentsInputContainer(studentCell, studentCount, 1, bandNo), bandNo, 1, BandNUmericTextBoxUsage.StudentSize);
                var bandCell = _this.bandRow.insertCell();
                _this.bandNumerixTextBoxes.add(bandCell, _this.kendoHelper.createBandInputContainer(bandCell, bandNo, _this.onBandSettingsChange), bandNo, 1, BandNUmericTextBoxUsage.BandSize);
                var classCell = _this.classRows[0].insertCell();
                _this.bandNumerixTextBoxes.add(classCell, _this.kendoHelper.createClassInputContainer(classCell, _this.bandSet.bands[bandNo - 1].studentCount, 1, bandNo), bandNo, 1, BandNUmericTextBoxUsage.ClassSize);
            }
        };
        this.createNumberInputField = function (elementId) {
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px");
            element.id = elementId;
            return element;
        };
        this.onBandSettingsChange = function () {
            _this.bandNumerixTextBoxes.updateClassSizes();
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
        this.onBandCountChange();
    }
    return BandClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=BandClassDefinitionViewModel.js.map