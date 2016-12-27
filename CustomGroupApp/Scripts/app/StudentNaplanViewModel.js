var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NaplanChartData = (function () {
    function NaplanChartData(s, score) {
        this.score = score;
        this.testType = s.source;
        this.testYear = s.testYear;
        this.testDate = s.testDate;
        this.grade = "Year " + s.grade;
        this.testNumber = s.testNumber;
    }
    Object.defineProperty(NaplanChartData.prototype, "color", {
        get: function () {
            return this.testType === TestType.Naplan ? "#EEAD40" : "#1250D3";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NaplanChartData.prototype, "tooltipText", {
        get: function () {
            if (this.testType === TestType.Naplan) {
                return "<div style='margin: 5px; text-align: left'>" +
                    "<div>Student Score: " + this.score + "<div>" +
                    "<div>School Mean: " + this.school.toFixed(2) + "<div>" +
                    "<div>State Mean: " + (this.state ? this.state.toFixed(2) : "NA") + "<div>" +
                    "<div>National Mean: " + (this.national ? this.national.toFixed(2) : "NA") + "<div>" +
                    "</div>";
            }
            else {
                return "<div style='margin: 5px; text-align: left'>" +
                    "<div>Test: " + this.testNumber + "<div>" +
                    "<div>Tested: " + (this.testDate ? kendo.toString(this.testDate, 'dd/MM/yyyy') : "NA") + "<div>" +
                    "<div>Student Score: " + this.score + "<div>" +
                    "<div>School Mean: " + this.school.toFixed(2) + "<div>" +
                    "</div>";
            }
        },
        enumerable: true,
        configurable: true
    });
    return NaplanChartData;
}());
var StudentNaplanViewModel = (function (_super) {
    __extends(StudentNaplanViewModel, _super);
    function StudentNaplanViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.numeracyDatasource = new Array();
        this.readingDatasource = new Array();
        this.writingDatasource = new Array();
        this.reports = [
            new ReportItem("National Progress Index", "StudentNaplanView", ReportType.NationalProgressIndex, this)
        ];
        this.setAdditionalProperties = function (student) {
            _this.numeracyDatasource = [];
            _this.readingDatasource = [];
            _this.writingDatasource = [];
            for (var _i = 0, _a = student.naplanResults; _i < _a.length; _i++) {
                var s = _a[_i];
                _this.numeracyDatasource.push(new NaplanChartData(s, s.numeracy));
                _this.writingDatasource.push(new NaplanChartData(s, s.writing));
                _this.readingDatasource.push(new NaplanChartData(s, s.reading));
            }
            var meanScores = Enumerable.From(_this.testFile.meanScores);
            var _loop_1 = function(s) {
                var school = void 0;
                if (s.testType === TestType.Naplan) {
                    school = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.School && x.source === s.testType && x.year === s.testYear; });
                }
                else {
                    school = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.School && x.source === s.testType && x.testNumber === s.testNumber; });
                }
                var state = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.State && x.year === s.testYear; });
                var national = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.National && x.year === s.testYear; });
                s.school = school.numeracy;
                s.state = state ? state.numeracy : undefined;
                s.national = national ? national.numeracy : undefined;
            };
            for (var _b = 0, _c = _this.numeracyDatasource; _b < _c.length; _b++) {
                var s = _c[_b];
                _loop_1(s);
            }
            var _loop_2 = function(s) {
                var school = void 0;
                if (s.testType === TestType.Naplan) {
                    school = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.School && x.source === s.testType && x.year === s.testYear; });
                }
                else {
                    school = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.School && x.source === s.testType && x.testNumber === s.testNumber; });
                }
                var state = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.State && x.year === s.testYear; });
                var national = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.National && x.year === s.testYear; });
                s.school = school.writing;
                s.state = state ? state.writing : undefined;
                s.national = national ? national.writing : undefined;
            };
            for (var _d = 0, _e = _this.writingDatasource; _d < _e.length; _d++) {
                var s = _e[_d];
                _loop_2(s);
            }
            var _loop_3 = function(s) {
                var school = void 0;
                if (s.testType === TestType.Naplan) {
                    school = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.School && x.source === s.testType && x.year === s.testYear; });
                }
                else {
                    school = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.School && x.source === s.testType && x.testNumber === s.testNumber; });
                }
                var state = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.State && x.year === s.testYear; });
                var national = meanScores.FirstOrDefault(null, function (x) { return x.type === MeanType.National && x.year === s.testYear; });
                s.school = school.reading;
                s.state = state ? state.reading : undefined;
                s.national = national ? national.reading : undefined;
            };
            for (var _f = 0, _g = _this.readingDatasource; _f < _g.length; _f++) {
                var s = _g[_f];
                _loop_3(s);
            }
            $("#numeracy-chart").height((_this.numeracyDatasource.length * 25) + 30);
            $("#reading-chart").height((_this.readingDatasource.length * 25) + 30);
            $("#writing-chart").height((_this.writingDatasource.length * 25) + 30);
            _this.numeracyChartControl.dataSource.data(_this.numeracyDatasource);
            _this.readingChartControl.dataSource.data(_this.readingDatasource);
            _this.writingChartControl.dataSource.data(_this.writingDatasource);
            _this.numeracyChartControl.redraw();
            _this.readingChartControl.redraw();
            _this.writingChartControl.redraw();
        };
        this.getReports = function () {
            return _this.reports;
        };
        this.initReport = function (reportType) {
            _this.getData();
            _this.initCharts();
            _this.isViewReady = true;
        };
        this.initDatasource = function () {
            return [];
        };
        this.initCharts = function () {
            _this.numeracyChartControl = $("#numeracy-chart").data("kendoChart");
            _this.readingChartControl = $("#reading-chart").data("kendoChart");
            _this.writingChartControl = $("#writing-chart").data("kendoChart");
        };
        this.getData = function () {
            var self = _this;
            $.ajax({
                type: "POST",
                url: "Home\\GetNaplanData",
                data: JSON.stringify({ 'testnum': self.testFile.fileNumber }),
                contentType: "application/json",
                success: function (data) {
                    self.testFile.setNaplanResults(data);
                },
                error: function (e) {
                }
            });
        };
    }
    return StudentNaplanViewModel;
}(StudentPortfolio));
//# sourceMappingURL=StudentNaplanViewModel.js.map