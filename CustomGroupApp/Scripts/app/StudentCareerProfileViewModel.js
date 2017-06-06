var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentCareerProfileViewModel = (function (_super) {
    __extends(StudentCareerProfileViewModel, _super);
    function StudentCareerProfileViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.kendoHelper = new KendoHelper();
        this.reports = [
            new ReportItem("Career Profile", "StudentCareerProfileView", ReportType.StudentCareerProfile, this)
        ];
        this.setAdditionalProperties = function (student) {
            _this.set("careerAwareness", _this.student.careers.careerAwareness);
            _this.updateCareerOnterestChart();
            _this.updateStudentCareerPreferences();
            _this.updateStudentWorkCharacteristics();
        };
        this.getReports = function () {
            return _this.reports;
        };
        this.initReport = function (reportType) {
            _this.careerInterestChart = $("#career-interests-chart").data("kendoChart");
            _this.isViewReady = true;
        };
        this.setAdditionalData = function (callback) {
            if (_this.testFile.hasCareerDetails) {
                var tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(true);
                }
                return;
            }
            var self = _this;
            $.ajax({
                type: "POST",
                url: "GetCareerProfiles",
                data: JSON.stringify({ 'testnum': self.testFile.fileNumber }),
                contentType: "application/json",
                success: function (data) {
                    self.testFile.setCareerDetails(data.StudentCareers);
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(true);
                    }
                },
                error: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(false);
                    }
                }
            });
        };
        this.updateStudentCareerPreferences = function () {
            var table = document.getElementById("career-preferences-table");
            var tbody = table.tBodies[0];
            while (tbody.rows.length > 0) {
                tbody.deleteRow(0);
            }
            for (var _i = 0, _a = _this.student.careers.getCareerPrefs(); _i < _a.length; _i++) {
                var s = _a[_i];
                var row = tbody.insertRow();
                var descriptionCell = document.createElement("div");
                descriptionCell.setAttribute("style", "font-weight: bold; width: 150px; text-align: left");
                descriptionCell.textContent = s.description;
                _this.kendoHelper.addElementCell(row, descriptionCell);
                _this.kendoHelper.addCell(row, ": " + s.notes);
            }
        };
        this.updateStudentWorkCharacteristics = function () {
            var table = document.getElementById("work-characteristics-table");
            var tbody = table.tBodies[0];
            while (tbody.rows.length > 0) {
                tbody.deleteRow(0);
            }
            for (var _i = 0, _a = _this.student.workCharacteristics; _i < _a.length; _i++) {
                var s = _a[_i];
                var row = tbody.insertRow();
                var descriptionCell = document.createElement("div");
                descriptionCell.setAttribute("style", "font-weight: bold; width: 150px; text-align: left");
                descriptionCell.textContent = s.description;
                _this.kendoHelper.addElementCell(row, descriptionCell);
                _this.kendoHelper.addCell(row, "- " + s.value);
            }
        };
        this.updateCareerOnterestChart = function () {
            $("#career-interests-chart").height(300);
            _this.careerInterestChart.dataSource.data(_this.student.careers.careers);
            _this.careerInterestChart.redraw();
        };
    }
    return StudentCareerProfileViewModel;
}(StudentPortfolio));
//# sourceMappingURL=StudentCareerProfileViewModel.js.map