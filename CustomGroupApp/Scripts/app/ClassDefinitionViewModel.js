var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ClassDefinitionViewModel = (function (_super) {
    __extends(ClassDefinitionViewModel, _super);
    function ClassDefinitionViewModel() {
        var _this = this;
        _super.call(this);
        this.classes = new kendo.data.ObservableArray([
            { classNo: 1, studentCount: 11 },
            { classNo: 2, studentCount: 12 },
            { classNo: 3, studentCount: 13 },
            { classNo: 4, studentCount: 14 }
        ]);
        this.classCount = 4;
        this.onStudentCountChanged = function (e) {
        };
        this.onClassCountChange = function () {
            console.log("Class Cnt: ", _this.classCount);
            _this.classes.splice(0, _this.classCount);
            for (var i = 1; i < _this.classCount; i++) {
                _this.classes.push({ classNo: i, studentCount: 11 });
                $("#classes-setting-container2").append("<input id='class" + i + "' style='width: 80px; margin-right: 10px; margin-left: 10px; margin-bottom: 5px'" +
                    "></input");
                var foo = $("#class" + i)
                    .kendoNumericTextBox({
                    options: { format: "n0" },
                    change: _this.onStudentCountChanged,
                    spin: _this.onStudentCountChanged
                });
                var bar = $("#class" + i).data("kendoNumericTextBox");
                bar.value(1);
                bar.max(5);
                bar.min(1);
                bar.options.format = "n0";
                bar.options.decimals = 0;
            }
        };
        _super.prototype.init.call(this, this);
    }
    return ClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=ClassDefinitionViewModel.js.map