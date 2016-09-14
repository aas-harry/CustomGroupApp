var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        this.bandCount = 6;
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
        this.onBandCountChange = function () {
            var tmpClasses = _this.groupingHelper.calculateClassesSize(_this.studentCount, _this.bandCount);
            $("#classes-settings-container").html("<table id='band-definition-table'></table>");
            var table = document.getElementById("band-definition-table");
            var header = table.createTHead();
            var cnt = 0;
            var colNo = 0;
            var bandRow = header.insertRow();
            for (var i = 1; i <= _this.bandCount; i++) {
                var cell1 = bandRow.insertCell(colNo);
                cell1.appendChild(_this.createNumberInputField());
                colNo++;
                cnt++;
                if (cnt === 3) {
                    bandRow = header.insertRow();
                    cnt = 0;
                    colNo = 0;
                }
            }
            kendo.init("#class-settings-container");
            //  $("#classes-settings-container").append(table.innerHTML);
        };
        this.createNumberInputField = function () {
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute('style', "width: 80px; margin-right: 15px; margin-left: 10px; margin-bottom: 5px");
            element.setAttribute('data-max', '10');
            element.setAttribute('data-min', '1');
            element.setAttribute('data-format', 'n0');
            element.setAttribute('data-role', 'numerictextbox');
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
        _super.prototype.init.call(this, this);
        this.onBandCountChange();
    }
    return BandClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=BandClassDefinitionViewModel.js.map