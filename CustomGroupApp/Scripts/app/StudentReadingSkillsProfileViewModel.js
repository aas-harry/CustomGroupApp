var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentReadingSkillsProfileViewModel = (function (_super) {
    __extends(StudentReadingSkillsProfileViewModel, _super);
    function StudentReadingSkillsProfileViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.kendoHelper = new KendoHelper();
        this.studentAnswersListElementName = "student-answers-list";
        this.studentAnswersTableElementName = "student-answers-table";
        this.showStudentAnswersList = true;
        this.reports = [
            new ReportItem("Reading Skills Profile", "StudentReadingProfileView", ReportType.StudentReadingSkillsProfile, this)
        ];
        this.getReports = function () {
            return _this.reports;
        };
        this.initReport = function (reportType, width, height) {
            _this.initStudentAnswersList(width, height);
            _this.isViewReady = true;
        };
        this.initStudentAnswersList = function (width, height) {
            $("#student-answers-list-container").width(Math.max(650, width - 30));
            $("#" + _this.studentAnswersListElementName)
                .kendoGrid({
                columns: [
                    {
                        field: "seq",
                        title: "No.",
                        width: "40px",
                        attributes: { "class": "text-nowrap" },
                        headerAttributes: { "style": "text-align: left" }
                    },
                    {
                        field: "answer",
                        title: "Answer",
                        width: "50px",
                        attributes: { 'class': "text-nowrap" },
                        template: function (dataItem) { return _this.studentAnswer(dataItem.answer); }
                    },
                    {
                        field: "strand",
                        title: "Strand",
                        width: "110px",
                        attributes: { 'class': "text-nowrap" },
                        headerAttributes: { style: "text-align: left" }
                    },
                    {
                        field: "difficulty",
                        title: "Difficulty",
                        width: "70px",
                        attributes: { 'class': "text-nowrap" },
                        headerAttributes: { "style": "text-align: left" }
                    },
                    {
                        field: "description",
                        title: "Description",
                        width: "250px",
                        headerAttributes: { "style": "text-align: left" }
                    }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: []
            });
            _this.studentAnswersGridControl = $("#" + _this.studentAnswersListElementName).data("kendoGrid");
        };
        this.studentAnswer = function (answer) {
            if (answer == 2)
                return "<div class='incorrectAnswer'></div>";
            else if (answer == 0)
                return "<div class='notAttempted'></div>";
            return "<div class='correctAnswer'></div>";
        };
        this.setAdditionalData = function (callback) {
            if (_this.testFile.hasReadingQuestions) {
                var tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(true);
                }
                return;
            }
            var self = _this;
            $.ajax({
                type: "POST",
                url: "GetReadingQuestions",
                data: JSON.stringify({ 'id': self.testFile.readingQuestionSetId }),
                contentType: "application/json",
                success: function (data) {
                    self.testFile.setReadingQuestions(data);
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
            _this.scoreProfile = student.reading.scoreProfile;
            _this.studentAnswers = _this.scoreProfile.getStudentAnswers(_this.testFile.readingQuestions);
            _this.strandSummary = _this.scoreProfile.getStrandSummary(_this.studentAnswers);
            _this.strandLevels = Enumerable.From(_this.testFile.readingQuestions)
                .GroupBy(function (q) { return q.difficulty; })
                .Select(function (s) { return s.Key(); })
                .ToArray();
            _this.updateReports();
        };
        this.formatOptionChanged = function (e) {
            _this.updateReports();
        };
        this.updateReports = function () {
            if (_this.showStudentAnswersList) {
                _this.updateStudentListReport();
                _this.updateStudentStrandSummary();
            }
            else {
                _this.updateStudentTableReport();
            }
        };
        this.updateStudentTableReport = function () {
            var table = document.getElementById(_this.studentAnswersTableElementName);
            var tbody = table.tBodies[0];
            while (tbody.rows.length > 0) {
                tbody.deleteRow(0);
            }
            // create header
            var headerRow = tbody.insertRow();
            _this.kendoHelper.addCell(headerRow, "Level").setAttribute("class", "strandTh");
            for (var _i = 0, _a = _this.strandSummary; _i < _a.length; _i++) {
                var s = _a[_i];
                var strandDiv = document.createElement("div");
                strandDiv.textContent = s.strand;
                strandDiv.setAttribute("class", "strandSummary");
                strandDiv.setAttribute("style", "font-weight: bold; vertical-align: top");
                var cell = _this.kendoHelper.addElementCell(headerRow, strandDiv);
                cell.setAttribute("class", "strandTh");
                var summaryDiv = document.createElement("div");
                summaryDiv.setAttribute("class", "strandSummary");
                summaryDiv.textContent = "Attempted: " + s.attemptedQuestions + " Correct: " + s.correctAnswers + " Total: " + s.count;
                cell.appendChild(summaryDiv);
            }
            var _loop_1 = function(level) {
                var row = tbody.insertRow();
                var cell = _this.kendoHelper.addCell(row, level);
                cell.setAttribute("style", "width: 4%");
                cell.setAttribute("class", "strandTd3");
                var _loop_2 = function(item) {
                    var container = document.createElement("div");
                    for (var _b = 0, _c = Enumerable.From(_this.studentAnswers)
                        .Where(function (s) { return s.difficulty === level && s.strand === item.strand; })
                        .ToArray(); _b < _c.length; _b++) {
                        var q = _c[_b];
                        var question = document.createElement("div");
                        question.textContent = ("  " + q.seq).slice(-2) + "." + q.description;
                        if (q.answer === AnswerType.Correct) {
                            question.setAttribute("class", "questionTableStyle correctAnswerStyle");
                        }
                        if (q.answer === AnswerType.Incorrect) {
                            question.setAttribute("class", "questionTableStyle incorrectAnswerStyle");
                        }
                        if (q.answer === AnswerType.NotAttempted) {
                            question.setAttribute("class", "questionTableStyle notAttemptedStyle");
                        }
                        container.appendChild(question);
                    }
                    _this.kendoHelper.addElementCell(row, container).setAttribute("class", "strandTd2");
                };
                for (var _d = 0, _e = _this.strandSummary; _d < _e.length; _d++) {
                    var item = _e[_d];
                    _loop_2(item);
                }
            };
            for (var _f = 0, _g = _this.strandLevels; _f < _g.length; _f++) {
                var level = _g[_f];
                _loop_1(level);
            }
        };
        this.updateStudentListReport = function () {
            if (_this.studentAnswersGridControl) {
                _this.studentAnswersGridControl.dataSource.data(_this.studentAnswers);
                _this.studentAnswersGridControl.refresh();
            }
        };
        this.updateStudentStrandSummary = function () {
            var table = document.getElementById("student-answers-summary");
            var tbody = table.tBodies[0];
            while (tbody.rows.length > 0) {
                tbody.deleteRow(0);
            }
            var tfooter = table.tFoot;
            while (tfooter.rows.length > 0) {
                tfooter.deleteRow(0);
            }
            for (var _i = 0, _a = Enumerable.From(_this.strandSummary).OrderBy(function (x) { return x.index; }).ToArray(); _i < _a.length; _i++) {
                var s = _a[_i];
                var row = tbody.insertRow();
                _this.kendoHelper.addCell(row, s.strand);
                _this.kendoHelper.addNumberCell(row, s.count);
                _this.kendoHelper.addNumberCell(row, s.attemptedQuestions);
                _this.kendoHelper.addNumberCell(row, s.correctAnswers);
                _this.kendoHelper.addNumberCell(row, s.incorrectAnswers);
            }
            var footerRow = tfooter.insertRow();
            _this.kendoHelper.addCell(footerRow, "Total");
            _this.kendoHelper.addNumberCell(footerRow, _this.scoreProfile.count);
            _this.kendoHelper.addNumberCell(footerRow, _this.scoreProfile.attemptedQuestions);
            _this.kendoHelper.addNumberCell(footerRow, _this.scoreProfile.correctAnswers);
            _this.kendoHelper.addNumberCell(footerRow, _this.scoreProfile.incorrectAnswers);
        };
        this.resizeOtherContent = function (width, height) {
            if (_this.studentAnswersGridControl) {
                var headerHeight = $("#student-portfolio-header").height();
                var studentSummaryHeight = $("#student-answers-summary-container").height();
                var containerWidth = Math.min(800, Math.max(650, width - 30));
                var containerHeight = height - headerHeight - studentSummaryHeight - 80; // subtract the margin and padding;
                console.log("Width: ", containerWidth);
                console.log("Height: ", containerHeight, height, headerHeight, studentSummaryHeight);
                $("#student-answers-list-container").height(containerHeight);
                $("#student-answers-list-container").width(containerWidth);
                _this.studentAnswersGridControl.resize();
            }
        };
    }
    return StudentReadingSkillsProfileViewModel;
}(StudentPortfolio));
//# sourceMappingURL=StudentReadingSkillsProfileViewModel.js.map