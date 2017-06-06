var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WritingCriteriaChartData = (function () {
    function WritingCriteriaChartData(criteria, score, school) {
        this.criteria = criteria;
        this.score = score;
        this.school = school;
    }
    Object.defineProperty(WritingCriteriaChartData.prototype, "tooltipText", {
        get: function () {
            return "<div style='margin: 5px; text-align: left'>" +
                "<div>Student Score: " + this.score + "<div>" +
                "<div>School Mean: " + this.school.toFixed(2) + "<div>" +
                "</div>";
        },
        enumerable: true,
        configurable: true
    });
    return WritingCriteriaChartData;
}());
var WritingStanineChartData = (function () {
    function WritingStanineChartData(score, stanine, school) {
        this.score = score;
        this.stanine = stanine;
        this.school = school;
    }
    Object.defineProperty(WritingStanineChartData.prototype, "tooltipText", {
        get: function () {
            return "<div style='margin: 5px; text-align: left'>" +
                "<div>Student Raw Score: " + this.score + "<div>" +
                "<div>Student Stanine: " + this.stanine + "<div>" +
                "<div>School Mean: " + this.school.toFixed(2) + "<div>" +
                "</div>";
        },
        enumerable: true,
        configurable: true
    });
    return WritingStanineChartData;
}());
var StudentWritingCriteriaViewModel = (function (_super) {
    __extends(StudentWritingCriteriaViewModel, _super);
    function StudentWritingCriteriaViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.markedWritingScriptServerFolder = "https://reporting.academicassessment.com.au/WritingMarked/";
        this.showStudentWritingCriteria = true;
        this.hasMarkedWritingScript = false;
        this.hasWritingCriteria = false;
        this.reportOptionChanged = function (e) {
            _this.updateReports();
        };
        this.initReport = function (reportType) {
            _this.writingCriteriaChartControl = $("#marking-criteria-chart").data("kendoChart");
            _this.writingScoreChartControl = $("#writing-stanine-chart").data("kendoChart");
            _this.writingStanineTable = _this.testFile.stanineTables.getStanines(SubjectType.Writing);
            var writingStanineTable = Enumerable.From(_this.writingStanineTable).ToDictionary(function (x) { return x.midScore; }, function (x) { return x; });
            _this.writingScoreChartControl.options.valueAxis[1].labels.template = function (e) {
                if (writingStanineTable.Contains(e.value)) {
                    return writingStanineTable.Get(e.value).stanine;
                }
                return "";
            };
            // Get School writing average score
            var writing = Enumerable.From(_this.testFile.allSubjects)
                .FirstOrDefault(null, function (x) { return x.subject && x.subject.subject === SubjectType.Writing; });
            _this.schoolStanine = writing ? writing.subject.summary.rawScoreAverage : undefined;
            _this.isViewReady = true;
        };
        this.setAdditionalData = function (callback) {
            if (_this.testFile.hasWritingCriteria) {
                var tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(true);
                }
                return;
            }
            var self = _this;
            $.ajax({
                type: "POST",
                url: "GetWritingCriterias",
                data: JSON.stringify({ 'testnum': self.testFile.fileNumber }),
                contentType: "application/json",
                success: function (data) {
                    self.testFile.setWritingCriterias(data.WritingTask, data.WritingScores, data.WritingQuestions, data.SchoolScoreDistributions);
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
        this.setAdditionalProperties = function (student) {
            if (!_this.student.writingCriteria) {
                _this.set("hasMarkedWritingScript", false);
                _this.set("hasWritingCriteria", false);
                return;
            }
            _this.set("hasWritingCriteria", true);
            _this.updateReports();
        };
        this.updateReports = function () {
            if (_this.showStudentWritingCriteria) {
                _this.updateStudentStanineChart();
                _this.updateStudentWritingCriteriaChart();
            }
            else {
                _this.updateStudentMarkedWritingCriteria();
            }
        };
        this.updateStudentWritingCriteriaChart = function () {
            var writingDatasource = new Array();
            var i = 0;
            for (var _i = 0, _a = _this.testFile.writingCriteria.questions; _i < _a.length; _i++) {
                var q = _a[_i];
                writingDatasource.push(new WritingCriteriaChartData(q.title, _this.student.writingCriteria.scores[i], q.schoolAverage));
                i++;
            }
            _this.writingCriteriaChartControl.dataSource.data(writingDatasource);
            _this.writingCriteriaChartControl.redraw();
        };
        this.updateStudentStanineChart = function () {
            var writingStanineDatasource = [];
            var data = new WritingStanineChartData(_this.student.writing.raw, _this.student.writing.stanine, _this.schoolStanine);
            data.writingStanineTable = _this.writingStanineTable;
            for (var _i = 0, _a = _this.writingStanineTable; _i < _a.length; _i++) {
                var t = _a[_i];
                if (t.stanine === _this.student.writing.stanine) {
                    data.stanineUpperRawScore = t.score;
                    break;
                }
            }
            writingStanineDatasource.push(data);
            _this.writingScoreChartControl.dataSource.data(writingStanineDatasource);
            _this.writingScoreChartControl.redraw();
        };
        this.updateStudentMarkedWritingCriteria = function () {
            if (!_this.student.writingCriteria.hasMarkedWritingScript) {
                _this.set("hasMarkedWritingScript", false);
                return;
            }
            _this.set("hasMarkedWritingScript", true);
            var pdfFile = _this.markedWritingScriptServerFolder + _this.testFile.fileNumber + _this.student.writingCriteria.markedWritingScriptFile;
            $("#marked-writing-script-frame").attr("src", pdfFile);
        };
        this.reports = [
            new ReportItem("Writing Criteria", "StudentWritingCriteriaView", ReportType.WritingCriteria, this)
        ];
        this.getReports = function () {
            return _this.reports;
        };
    }
    return StudentWritingCriteriaViewModel;
}(StudentPortfolio));
//# sourceMappingURL=StudentWritingCriteriaViewModel.js.map