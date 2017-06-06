class WritingCriteriaChartData {
    constructor(public criteria: string, public score: number, public school: number) { }

    get tooltipText(): string {
        return "<div style='margin: 5px; text-align: left'>" +
            "<div>Student Score: " + this.score + "<div>" +
            "<div>School Mean: " + this.school.toFixed(2) + "<div>" +
            "</div>";
    }
}

class WritingStanineChartData {
    constructor(public score: number, public stanine: number, public school: number){}

    get tooltipText(): string {
        return "<div style='margin: 5px; text-align: left'>" +
            "<div>Student Raw Score: " + this.score + "<div>" +
            "<div>Student Stanine: " + this.stanine + "<div>" +
            "<div>School Mean: " + this.school.toFixed(2) + "<div>" +
            "</div>";
    }

    stanineUpperRawScore: number;
    writingStanineTable: Array<Stanine>;
}

class StudentWritingCriteriaViewModel extends StudentPortfolio
implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private markedWritingScriptServerFolder = "https://reporting.academicassessment.com.au/WritingMarked/";
    private writingCriteriaChartControl: kendo.dataviz.ui.Chart;
    private writingScoreChartControl: kendo.dataviz.ui.Chart;
    private schoolStanine: number;
    private writingStanineTable: Array<Stanine>;

    showStudentWritingCriteria = true;
    hasMarkedWritingScript = false;
    hasWritingCriteria = false;

    reportOptionChanged = (e) => {
        this.updateReports();
    }

    initReport = (reportType: ReportType) => {
        this.writingCriteriaChartControl = $("#marking-criteria-chart").data("kendoChart");
        this.writingScoreChartControl = $("#writing-stanine-chart").data("kendoChart");
        this.writingStanineTable = this.testFile.stanineTables.getStanines(SubjectType.Writing);

        const writingStanineTable = Enumerable.From(this.writingStanineTable).ToDictionary(x => x.midScore, x => x);
        this.writingScoreChartControl.options.valueAxis[1].labels.template = e => {
            if (writingStanineTable.Contains(e.value)) {
                return writingStanineTable.Get(e.value).stanine;
            }
            return "";
        };

        // Get School writing average score
        const writing = Enumerable.From(this.testFile.allSubjects)
            .FirstOrDefault(null, x => x.subject && x.subject.subject === SubjectType.Writing);
        this.schoolStanine = writing ? writing.subject.summary.rawScoreAverage : undefined;

        this.isViewReady = true;
    }
    setAdditionalData = (callback: (status) => any) => {
        if (this.testFile.hasWritingCriteria) {
            const tmpCallback = callback;
            if (tmpCallback) {
                tmpCallback(true);
            }
            return;
        }

        const self = this;
        $.ajax({
            type: "POST",
            url: "GetWritingCriterias",
            data: JSON.stringify({ 'testnum': self.testFile.fileNumber }),
            contentType: "application/json",
            success(data) {
                self.testFile.setWritingCriterias(
                    data.WritingTask,
                    data.WritingScores, data.WritingQuestions, data.SchoolScoreDistributions);

                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(true);
                }
            },
            error(e) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(false);
                }
            }
        });
    }

    setAdditionalProperties = (student: Student) => {
        if (!this.student.writingCriteria){
            this.set("hasMarkedWritingScript", false);
            this.set("hasWritingCriteria", false);
            return;
        }

        this.set("hasWritingCriteria", true);
        this.updateReports();
    }
    private updateReports = () => {
        if (this.showStudentWritingCriteria) {
            this.updateStudentStanineChart();
            this.updateStudentWritingCriteriaChart();
        } else {
            this.updateStudentMarkedWritingCriteria();
        }
    }

    private updateStudentWritingCriteriaChart = () => {
        const writingDatasource = new Array<WritingCriteriaChartData>();

        let i = 0;
        for (let q of this.testFile.writingCriteria.questions) {
            writingDatasource.push(new WritingCriteriaChartData(q.title, this.student.writingCriteria.scores[i], q.schoolAverage));
            i++;
        }

        this.writingCriteriaChartControl.dataSource.data(writingDatasource);
        this.writingCriteriaChartControl.redraw();
    }

    private updateStudentStanineChart = () => {
        const writingStanineDatasource = [];

        var data = new WritingStanineChartData(this.student.writing.raw,
            this.student.writing.stanine,
            this.schoolStanine);
        data.writingStanineTable = this.writingStanineTable;

        for (let t of this.writingStanineTable) {
            if (t.stanine === this.student.writing.stanine) {
                data.stanineUpperRawScore = t.score;
                break;
            }
        }

        writingStanineDatasource.push(data);
        

        this.writingScoreChartControl.dataSource.data(writingStanineDatasource);
        this.writingScoreChartControl.redraw();
    }


    private updateStudentMarkedWritingCriteria = () => {
        if ( !this.student.writingCriteria.hasMarkedWritingScript) {
            this.set("hasMarkedWritingScript", false);
            return;
        }
        this.set("hasMarkedWritingScript", true);
        const pdfFile = this.markedWritingScriptServerFolder + this.testFile.fileNumber + this.student.writingCriteria.markedWritingScriptFile;
        $("#marked-writing-script-frame").attr("src", pdfFile);
    }

    private reports = [
        new ReportItem("Writing Criteria", "StudentWritingCriteriaView", ReportType.WritingCriteria, this)
    ];

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }
}