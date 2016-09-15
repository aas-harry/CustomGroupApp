var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ClassDefinitionViewModel = (function (_super) {
    __extends(ClassDefinitionViewModel, _super);
    function ClassDefinitionViewModel(studentCount) {
        var _this = this;
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
        this.classes = new kendo.data.ObservableArray([
            { classNo: 1, studentCount: 1 }
        ]);
        this.classCount = 1;
        this.getClasses = function () {
            var classes = new Array();
            _this.classes.forEach(function (val) {
                var classCnt = $("#class" + val.classNo).data("kendoNumericTextBox");
                classes.push(classCnt.value());
            });
            return classes;
        };
        this.groupingHelper = new GroupingHelper();
        this.onStudentCountChanged = function () {
        };
        this.onClassCountChange = function () {
            var tmpClasses = _this.groupingHelper.calculateClassesSize(_this.studentCount, _this.classCount);
            _this.classes.splice(0, _this.classes.length);
            $("#classes-settings-container").html("");
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
                $("#class" + i)
                    .kendoNumericTextBox({
                    options: {},
                    change: _this.onStudentCountChanged,
                    spin: _this.onStudentCountChanged
                });
                var spinnerInputField = $("#class" + i).data("kendoNumericTextBox");
                spinnerInputField.options.format = "n0";
                spinnerInputField.value(tmpClasses[i - 1]);
                spinnerInputField.max(250);
                spinnerInputField.min(1);
                spinnerInputField.options.decimals = 0;
            }
        };
        _super.prototype.init.call(this, this);
        this.classCount = 1;
    }
    return ClassDefinitionViewModel;
}(kendo.data.ObservableObject));
