class StudentReadingSkillsProfileViewModel extends StudentPortfolio
    implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private kendoHelper = new KendoHelper();
    studentAnswersGridControl: kendo.ui.Grid;
    studentAnswersListElementName = "student-answers-list";
    studentAnswersTableElementName = "student-answers-table";
    showStudentAnswersList = true;
    scoreProfile: ScoreProfile;
    studentAnswers: Array<StudentAnswer>;
    strandSummary: Array<StrandSummary>;
    strandLevels: Array<string>;

    private reports = [
        new ReportItem("Reading Skills Profile", "StudentReadingProfileView", ReportType.StudentReadingSkillsProfile, this)
    ];

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }

    initReport = (reportType: ReportType, width: number, height: number) => {
        this.initStudentAnswersList(width, height);
        this.isViewReady = true;
    }


    initStudentAnswersList = (width: number, height: number) => {
        $("#student-answers-list-container").width(Math.max(650, width - 30));

        $(`#${this.studentAnswersListElementName}`)
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
                        template: dataItem => this.studentAnswer(dataItem.answer)
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

        this.studentAnswersGridControl = $(`#${this.studentAnswersListElementName}`).data("kendoGrid");
    }

    studentAnswer = (answer: number): string => {
        if (answer == 2)
            return "<div class='incorrectAnswer'></div>";
        else if (answer == 0)
            return "<div class='notAttempted'></div>";
        return "<div class='correctAnswer'></div>";
    }

    setAdditionalData = (callback: (status) => any) => {
        if (this.testFile.hasReadingQuestions) {
            const tmpCallback = callback;
            if (tmpCallback) {
                tmpCallback(true);
            }
            return;
        }

        const self = this;
        $.ajax({
            type: "POST",
            url: "GetReadingQuestions",
            data: JSON.stringify({ 'id': self.testFile.readingQuestionSetId }),
            contentType: "application/json",
            success(data) {
                self.testFile.setReadingQuestions(data);

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
        this.scoreProfile = student.reading.scoreProfile;
        this.studentAnswers = this.scoreProfile.getStudentAnswers(this.testFile.readingQuestions);
        this.strandSummary = this.scoreProfile.getStrandSummary(this.studentAnswers);
        this.strandLevels = Enumerable.From(this.testFile.readingQuestions)
            .GroupBy(q => q.difficulty)
            .Select(s => s.Key())
            .ToArray();

        this.updateReports();
    }

    formatOptionChanged = (e) => {
        this.updateReports();
    }

    updateReports = () => {
        if (this.showStudentAnswersList) {
            this.updateStudentListReport();
            this.updateStudentStrandSummary();
        } else {
            this.updateStudentTableReport();
        }
    }

    updateStudentTableReport = () => {
        const table = document.getElementById(this.studentAnswersTableElementName) as HTMLTableElement;
        const tbody = table.tBodies[0] as HTMLTableSectionElement;
        while (tbody.rows.length > 0) {
            tbody.deleteRow(0);
        }

        // create header
        const headerRow = tbody.insertRow();
        this.kendoHelper.addCell(headerRow, "Level").setAttribute("class", "strandTh");
        for (let s of this.strandSummary) {
            const strandDiv = document.createElement("div") as HTMLElement;
            strandDiv.textContent = s.strand;
            strandDiv.setAttribute("class", "strandSummary");
            strandDiv.setAttribute("style", "font-weight: bold; vertical-align: top");
            const cell = this.kendoHelper.addElementCell(headerRow, strandDiv);
            cell.setAttribute("class", "strandTh");
            const summaryDiv = document.createElement("div") as HTMLElement;
            summaryDiv.setAttribute("class", "strandSummary");
            summaryDiv.textContent = `Attempted: ${s.attemptedQuestions} Correct: ${s.correctAnswers} Total: ${s.count}`;
            cell.appendChild(summaryDiv);
        }
        for (let level of this.strandLevels) {
            const row = tbody.insertRow();
            const cell = this.kendoHelper.addCell(row, level);
            cell.setAttribute("style", "width: 4%");
            cell.setAttribute("class", "strandTd3");

            for (let item of this.strandSummary) {
                const container = document.createElement("div") as HTMLElement;
                for (let q of Enumerable.From(this.studentAnswers)
                    .Where(s => s.difficulty === level && s.strand === item.strand)
                    .ToArray()) {

                    const question = document.createElement("div") as HTMLElement;
                    question.textContent = `${("  " + q.seq).slice(-2)}.${q.description}`;
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
                this.kendoHelper.addElementCell(row, container).setAttribute("class", "strandTd2");
            }
        }
    }

    updateStudentListReport = () => {
        if (this.studentAnswersGridControl) {
            this.studentAnswersGridControl.dataSource.data(this.studentAnswers);
            this.studentAnswersGridControl.refresh();
        }
    }

    updateStudentStrandSummary = () => {
        const table = document.getElementById("student-answers-summary") as HTMLTableElement;
        const tbody = table.tBodies[0] as HTMLTableSectionElement;
        while (tbody.rows.length > 0) {
            tbody.deleteRow(0);
        }

        const tfooter = table.tFoot as HTMLTableSectionElement;
        while (tfooter.rows.length > 0) {
            tfooter.deleteRow(0);
        }

        for (let s of Enumerable.From(this.strandSummary).OrderBy(x => x.index).ToArray()) {
            const row = tbody.insertRow();
            this.kendoHelper.addCell(row, s.strand);
            this.kendoHelper.addNumberCell(row, s.count);
            this.kendoHelper.addNumberCell(row, s.attemptedQuestions);
            this.kendoHelper.addNumberCell(row, s.correctAnswers);
            this.kendoHelper.addNumberCell(row, s.incorrectAnswers);
        }

        const footerRow = tfooter.insertRow();
        this.kendoHelper.addCell(footerRow, "Total");
        this.kendoHelper.addNumberCell(footerRow, this.scoreProfile.count);
        this.kendoHelper.addNumberCell(footerRow, this.scoreProfile.attemptedQuestions);
        this.kendoHelper.addNumberCell(footerRow, this.scoreProfile.correctAnswers);
        this.kendoHelper.addNumberCell(footerRow, this.scoreProfile.incorrectAnswers);
    }

    resizeOtherContent = (width: number, height: number): void => {
        if (this.studentAnswersGridControl) {
            const headerHeight = $("#student-portfolio-header").height();
            const studentSummaryHeight = $("#student-answers-summary-container").height();

            const containerWidth = Math.min(800, Math.max(650, width - 30));
            const containerHeight = height - headerHeight - studentSummaryHeight - 80; // subtract the margin and padding;
            console.log("Width: ", containerWidth);
            console.log("Height: ", containerHeight, height, headerHeight, studentSummaryHeight);
            $("#student-answers-list-container").height(containerHeight);
            $("#student-answers-list-container").width(containerWidth);
            this.studentAnswersGridControl.resize();
        }
    }
}
