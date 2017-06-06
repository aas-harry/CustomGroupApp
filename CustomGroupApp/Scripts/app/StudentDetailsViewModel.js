var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentDetailsViewModel = (function (_super) {
    __extends(StudentDetailsViewModel, _super);
    function StudentDetailsViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.reports = [
            new ReportItem("Student Details", "StudentDetailsView", ReportType.StudentDetails, this)
        ];
        this.getReports = function () {
            return _this.reports;
        };
        this.setAdditionalProperties = function (student) {
            _this.initAbilityTable(student);
            _this.initAchievementTable(student);
        };
        this.initAbilityTable = function (student) {
            var table = document.getElementById("ability-container");
            var body = (table.tBodies.length > 0 ? table.tBodies[0] : table.createTBody());
            while (body.rows.length > 0) {
                body.deleteRow(0);
            }
            for (var _i = 0, _a = _this.testFile.allSubjects; _i < _a.length; _i++) {
                var s = _a[_i];
                if (s.isAbility && s.subject.isTested) {
                    var row = body.insertRow();
                    row.insertCell().textContent = s.subject.name;
                    row.insertCell().textContent = s.subject.count.toFixed(0);
                    row.insertCell().textContent = s.subject.getScore(student).range.range();
                    row.insertCell().textContent = s.subject.getScore(student).stanine.toFixed(0);
                }
            }
        };
        this.initAchievementTable = function (student) {
            var table = document.getElementById("achievement-container");
            var body = (table.tBodies.length > 0 ? table.tBodies[0] : table.createTBody());
            while (body.rows.length > 0) {
                body.deleteRow(0);
            }
            for (var _i = 0, _a = _this.testFile.allSubjects; _i < _a.length; _i++) {
                var s = _a[_i];
                if (s.isAchievement && s.subject.isTested) {
                    var row = body.insertRow();
                    row.insertCell().textContent = s.subject.name;
                    row.insertCell().textContent = s.subject.count.toFixed(0);
                    row.insertCell().textContent = s.subject.getScore(student).raw.toFixed(0);
                    row.insertCell().textContent = s.subject.getScore(student).stanine.toFixed(0);
                }
            }
        };
    }
    return StudentDetailsViewModel;
}(StudentPortfolio));
//# sourceMappingURL=StudentDetailsViewModel.js.map