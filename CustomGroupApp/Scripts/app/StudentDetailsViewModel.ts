class StudentDetailsViewModel extends StudentPortfolio
implements  IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);

    }

    private reports = [
        new ReportItem("Student Details", "StudentDetailsView", ReportType.StudentDetails, this)
    ];

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }


    setAdditionalProperties = (student: Student) => {
        this.initAbilityTable(student);
        this.initAchievementTable(student);
    }

    
    private initAbilityTable = (student: Student) => {
        const table = document.getElementById("ability-container") as HTMLTableElement;

        const body = (table.tBodies.length > 0 ? table.tBodies[0] : table.createTBody()) as HTMLTableSectionElement;
        while (body.rows.length > 0) {
            body.deleteRow(0);
        }

        for (let s of this.testFile.allSubjects) {
            if (s.isAbility && s.subject.isTested) {
                const row = body.insertRow();
                row.insertCell().textContent = s.subject.name;
                row.insertCell().textContent = s.subject.count.toFixed(0);
                row.insertCell().textContent = s.subject.getScore(student).range.range();
                row.insertCell().textContent = s.subject.getScore(student).stanine.toFixed(0);
            }
        }

    }
    private initAchievementTable = (student: Student) => {
        const table = document.getElementById("achievement-container") as HTMLTableElement;

        const body = (table.tBodies.length > 0 ? table.tBodies[0] : table.createTBody()) as HTMLTableSectionElement;
        while (body.rows.length > 0) {
            body.deleteRow(0);
        }

        for (let s of this.testFile.allSubjects) {
            if (s.isAchievement && s.subject.isTested) {
                const row = body.insertRow();
                row.insertCell().textContent = s.subject.name;
                row.insertCell().textContent = s.subject.count.toFixed(0);
                row.insertCell().textContent = s.subject.getScore(student).raw.toFixed(0);
                row.insertCell().textContent = s.subject.getScore(student).stanine.toFixed(0);
            }
        }

    }
}