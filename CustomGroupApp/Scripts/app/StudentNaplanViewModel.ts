class NaplanChartData {
    testType: TestType;
    testYear: number;
    testNumber: number;
    grade: string;
    testDate: Date;
    school: number;
    state: number;
    national: number;
    get color(): string {
        return this.testType === TestType.Naplan ? "#EEAD40" : "#1250D3";
    }
    get tooltipText(): string {
        if (this.testType === TestType.Naplan) {
            return "<div style='margin: 5px; text-align: left'>" +
                "<div>Student Score: " + this.score + "<div>" +
                "<div>School Mean: " + this.school.toFixed(2) + "<div>" +
                "<div>State Mean: " + (this.state ? this.state.toFixed(2) : "NA") + "<div>" +
                "<div>National Mean: " + (this.national ? this.national.toFixed(2) : "NA") + "<div>" +
                "</div>";
        } else {
            return "<div style='margin: 5px; text-align: left'>" +
                "<div>Test: " + this.testNumber + "<div>" +
                "<div>Tested: " + (this.testDate ? kendo.toString(this.testDate, 'dd/MM/yyyy')  : "NA") + "<div>" +
                "<div>Student Score: " + this.score + "<div>" +
                "<div>School Mean: " + this.school.toFixed(2) + "<div>" +
                "</div>";
        }
    }

    constructor(s: NaplanScore, public score: number) {
        this.testType = s.source;
        this.testYear = s.testYear;
        this.testDate = s.testDate;
        this.grade = `Year ${s.grade}`;
        this.testNumber = s.testNumber;
    }
}


class StudentNaplanViewModel extends StudentPortfolio
    implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
        
    }
    
    private writingChartControl: kendo.dataviz.ui.Chart;
    private numeracyChartControl: kendo.dataviz.ui.Chart;
    private readingChartControl: kendo.dataviz.ui.Chart;
    private numeracyDatasource = new Array<NaplanChartData>();
    private readingDatasource = new Array<NaplanChartData>();
    private writingDatasource = new  Array <NaplanChartData>();

    private reports = [
        new ReportItem("National Progress Index", "StudentNaplanView", ReportType.NationalProgressIndex, this)
    ];

    
    setAdditionalProperties = (student: Student) => {
        this.numeracyDatasource = [];
        this.readingDatasource = [];
        this.writingDatasource = [];
        

        for (let s of student.naplanResults) {
            this.numeracyDatasource.push(new NaplanChartData(s, s.numeracy));
            this.writingDatasource.push(new NaplanChartData(s, s.writing));
            this.readingDatasource.push(new NaplanChartData(s, s.reading));
        }

        var meanScores = Enumerable.From(this.testFile.meanScores);
        for (let s of this.numeracyDatasource) {
            let school: NaplanMeanScore;

            if (s.testType === TestType.Naplan) {
                school = meanScores.FirstOrDefault(null, x => x.type === MeanType.School && x.source === s.testType && x.year === s.testYear);
            }
            else {
                school = meanScores.FirstOrDefault(null, x => x.type === MeanType.School && x.source === s.testType && x.testNumber === s.testNumber);
            }

            const state = meanScores.FirstOrDefault(null, x => x.type === MeanType.State && x.year === s.testYear);
            const national = meanScores.FirstOrDefault(null, x => x.type === MeanType.National && x.year === s.testYear);

            s.school = school.numeracy;
            s.state = state ? state.numeracy : undefined;
            s.national = national ? national.numeracy : undefined;
        }

        for (let s of this.writingDatasource) {
            let school: NaplanMeanScore;

            if (s.testType === TestType.Naplan) {
                school = meanScores.FirstOrDefault(null, x => x.type === MeanType.School && x.source === s.testType && x.year === s.testYear);
            }
            else {
                school = meanScores.FirstOrDefault(null, x => x.type === MeanType.School && x.source === s.testType && x.testNumber === s.testNumber);
            }

            const state = meanScores.FirstOrDefault(null, x => x.type === MeanType.State && x.year === s.testYear);
            const national = meanScores.FirstOrDefault(null, x => x.type === MeanType.National && x.year === s.testYear);

            s.school = school.writing;
            s.state = state ? state.writing : undefined;
            s.national = national ? national.writing : undefined;
        }

        for (let s of this.readingDatasource) {
            let school: NaplanMeanScore;

            if (s.testType === TestType.Naplan) {
                school = meanScores.FirstOrDefault(null, x => x.type === MeanType.School && x.source === s.testType && x.year === s.testYear);
            }
            else {
                school = meanScores.FirstOrDefault(null, x => x.type === MeanType.School && x.source === s.testType && x.testNumber === s.testNumber);
            }

            const state = meanScores.FirstOrDefault(null, x => x.type === MeanType.State && x.year === s.testYear);
            const national = meanScores.FirstOrDefault(null, x => x.type === MeanType.National && x.year === s.testYear);

            s.school = school.reading;
            s.state = state ? state.reading : undefined;
            s.national = national ? national.reading : undefined;
        }

        $("#numeracy-chart").height((this.numeracyDatasource.length * 25) + 30);
        $("#reading-chart").height((this.readingDatasource.length * 25) + 30);
        $("#writing-chart").height((this.writingDatasource.length * 25) + 30);

      

        this.numeracyChartControl.dataSource.data(this.numeracyDatasource);
        this.readingChartControl.dataSource.data(this.readingDatasource);
        this.writingChartControl.dataSource.data(this.writingDatasource);

        this.numeracyChartControl.redraw();
        this.readingChartControl.redraw();
        this.writingChartControl.redraw();
    }


    
    getReports = (): Array<ReportItem> => {
        return this.reports;
    }

 
    initReport = (reportType: ReportType) => {
        this.initCharts();
        this.isViewReady = true;
    }

    private initDatasource = (): Array<{
        testYear: number,
        testDate: Date,
        fromStudent: number,
        toStudent: number,
        fromSchool: number,
        toSchool: number,
        fromState: number,
        toState: number,
        fromNational: number,
        toNational: number }>  => {
        return [];
    }

    private initCharts = () => {
        this.numeracyChartControl = $("#numeracy-chart").data("kendoChart");
        this.readingChartControl = $("#reading-chart").data("kendoChart");
        this.writingChartControl = $("#writing-chart").data("kendoChart");
    }

    setAdditionalData = (callback: (status) => any) => {
        if (this.testFile.hasNaplanResults) {
            const tmpCallback = callback;
            if (tmpCallback) {
                tmpCallback(true);
            }
            return;
        }

        const self = this;
        $.ajax({
            type: "POST",
            url: "Home\\GetNaplanData",
            data: JSON.stringify({ 'testnum': self.testFile.fileNumber }),
            contentType: "application/json",
            success(data) {
                self.testFile.setNaplanResults(data);

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
}

