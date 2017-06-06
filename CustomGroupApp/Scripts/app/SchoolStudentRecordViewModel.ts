class SchoolStudentRecordViewModel extends StudentPortfolio
    implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private container: HTMLElement;
    private reports = [
        new ReportItem("School Student Record", "SchoolStudentRecordView", ReportType.SchoolStudentRecord, this)
    ];

    bornInAus: string;
    secondLanguage: string;
    liveInAus: string;
    rawScoreGridControl: kendo.ui.Grid;
    scaledScoresChartControl: kendo.dataviz.ui.Chart;
   
    setAdditionalProperties = (student: Student) => {
        this.set("bornInAus", student.bornInAus);
        this.set("liveInAus", student.liveInAus);
        this.set("secondLanguage", student.speak);
        this.set("studentNote", student.notes);

        this.setRawScores(student);
        this.setScaledScores(student);
    }

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }

    studentNote: string;
    hasNotesChanged = false;
    message: string;

    saveNotes = (e) => {
        const self = this;

            $.ajax({
                url: "..\\home\\SaveStudentNotes",
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({ 'id': self.student.studentId, 'notes': self.studentNote }),
                success: (e) => {
                    self.student.notes = self.studentNote;
                    self.set("hasNotesChanged", false);
                    self.set("message", "Saved");
                }
            });
        
      
    }

    onNotesChanged = (e) => {
        this.set("hasNotesChanged", true);
        this.set("message", "Not Saved");
    }

    initReport = (reportType: ReportType): void => {

        this.initRawScoresGrid();
        this.initScaledScoresChart();
        this.isViewReady = true;
    }

   
    private initScaledScoresChart = () => {
        this.scaledScoresChartControl = $("#scaled-score-chart").data("kendoChart");
    }
    private setScaledScores = (student: Student) => {
        var dataSource = new Array<{
            subjectName: string,
            schoolScore: number,
            studentScore: number,
            studentStanine: number,
            schoolStanine: number}>();

        for (let s of this.testFile.subjectsTested) {
            const score = s.getScore(student);
            dataSource.push({
                subjectName: s.name,
                schoolScore: s.summary.stanineAverage,
                studentScore: this.testFile.stanineTables
                    .getStanineRangeScore(s.getRawScore(score), s.subject, s.count),
                schoolStanine: Math.ceil(s.summary.stanineAverage),
                studentStanine: score.stanine
            });
        }

        if (this.scaledScoresChartControl) {
            this.scaledScoresChartControl.dataSource.data(dataSource);
            this.scaledScoresChartControl.refresh();
            this.scaledScoresChartControl.redraw();
        }
    }

    private initRawScoresGrid = () => {
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
                    width: 225
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

        this.rawScoreGridControl = $("#raw-score-list").data("kendoGrid");
    }

    private setRawScores = (student: Student) => {
        this.studentNote = student.notes;

        var dataSource = new Array<{
            subjectName: string,
            totalCount: number,
            attemptedCount: number,
            correctCount: number,
            stanine: number,
        }>();

        for (let s of this.testFile.subjectsTested) {
            if (s.subject === SubjectType.Verbal || s.subject === SubjectType.NonVerbal) {
                continue;
            }
            dataSource.push({
                subjectName: s.name,
                totalCount: s.count,
                attemptedCount: s.getScore(student).scoreProfile.attemptedQuestions,
                correctCount: s.getScore(student).scoreProfile.correctAnswers,
                stanine: s.getScore(student).stanine
            });
        }
        if (this.rawScoreGridControl) {
            this.rawScoreGridControl.dataSource.data(dataSource);
        }
    }


}