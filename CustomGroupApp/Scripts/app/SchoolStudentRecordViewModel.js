var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SchoolStudentRecordViewModel = (function (_super) {
    __extends(SchoolStudentRecordViewModel, _super);
    function SchoolStudentRecordViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.reports = [
            new ReportItem("School Student Record", "SchoolStudentRecordView", ReportType.SchoolStudentRecord, this)
        ];
        this.setAdditionalProperties = function (student) {
            _this.set("bornInAus", student.liveInAus);
            _this.set("secondLanguage", student.speak);
            _this.set("studentNote", student.notes);
            _this.setRawScores(student);
            _this.setScaledScores(student);
        };
        this.getReports = function () {
            return _this.reports;
        };
        this.hasNotesChanged = false;
        this.saveNotes = function (e) {
            var self = _this;
            $.ajax({
                url: "..\\home\\SaveStudentNotes",
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({ 'id': self.student.studentId, 'notes': self.studentNote }),
                success: function (e) {
                    self.student.notes = self.studentNote;
                    self.set("hasNotesChanged", false);
                    self.set("message", "Saved");
                }
            });
        };
        this.onNotesChanged = function (e) {
            _this.set("hasNotesChanged", true);
            _this.set("message", "Not Saved");
        };
        this.initReport = function (reportType) {
            _this.initRawScoresGrid();
            _this.initScaledScoresChart();
            _this.isViewReady = true;
        };
        this.initScaledScoresChart = function () {
            _this.scaledScoresChartControl = $("#scaled-score-chart").data("kendoChart");
        };
        this.setScaledScores = function (student) {
            var dataSource = new Array();
            for (var _i = 0, _a = _this.testFile.subjectsTested; _i < _a.length; _i++) {
                var s = _a[_i];
                var score = s.getScore(student);
                dataSource.push({
                    subjectName: s.name,
                    schoolScore: s.summary.stanineAverage,
                    studentScore: _this.testFile.stanineTables
                        .getStanineRangeScore(s.getRawScore(score), s.subject, s.count),
                    schoolStanine: Math.ceil(s.summary.stanineAverage),
                    studentStanine: score.stanine
                });
            }
            if (_this.scaledScoresChartControl) {
                _this.scaledScoresChartControl.dataSource.data(dataSource);
                _this.scaledScoresChartControl.refresh();
                _this.scaledScoresChartControl.redraw();
            }
        };
        this.initRawScoresGrid = function () {
            $("#raw-score-list").kendoGrid({
                dataSource: {
                    pageable: false
                },
                scrollable: false,
                sortable: false,
                selectable: false,
                columns: [
                    {
                        field: "subjectName",
                        title: " ",
                        width: 250
                    },
                    {
                        field: "totalCount",
                        title: "Total",
                        width: 45,
                        attributes: { "style": "text-align: center" }
                    },
                    {
                        field: "attemptedCount",
                        title: "Attempted",
                        width: 50,
                        attributes: { "style": "text-align: center" }
                    },
                    {
                        field: "correctCount",
                        title: "Correct",
                        width: 45,
                        attributes: { "style": "text-align: center" }
                    },
                    {
                        field: "stanine",
                        title: "Stanine",
                        width: 45,
                        attributes: { "style": "text-align: center" }
                    }
                ]
            });
            _this.rawScoreGridControl = $("#raw-score-list").data("kendoGrid");
        };
        this.setRawScores = function (student) {
            _this.studentNote = student.notes;
            var dataSource = new Array();
            for (var _i = 0, _a = _this.testFile.subjectsTested; _i < _a.length; _i++) {
                var s = _a[_i];
                if (s.subject === SubjectType.Verbal || s.subject === SubjectType.NonVerbal) {
                    continue;
                }
                dataSource.push({
                    subjectName: s.name,
                    totalCount: s.count,
                    attemptedCount: s.getScore(student).attemptedQuestions,
                    correctCount: s.getScore(student).correctAnswers,
                    stanine: s.getScore(student).stanine
                });
            }
            if (_this.rawScoreGridControl) {
                _this.rawScoreGridControl.dataSource.data(dataSource);
            }
        };
    }
    return SchoolStudentRecordViewModel;
}(StudentPortfolio));
//# sourceMappingURL=SchoolStudentRecordViewModel.js.map