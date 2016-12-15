class StudentPortfolioPrintViewModel extends kendo.data.ObservableObject {
    constructor(public testFile: TestFile) {
        super();
    }

    studentSelector = new StudentSelector();
    studentListInitialised = false;
    reportSelectorOption = true;
    studentSelectorOption = true;
    schoolStudentRecordOption = true;
    naplanProgressIndexOption = true;
    mathsSkillsProfileListOption = true;
    mathsSkillsProfileTableOption = true;
    readingSkillsProfileListOption = true;
    readingSkillsProfileTableOption = true;
    writingCriteriaOption = true;
    markedWritingCriteriaOption = true;
    careerProfileOption = true;

    selectAllReports = () => {
     this.setAllReports(true);   
    }

    clearAllReports = () => {
        this.setAllReports(false);
    }

    showReports = () => {
        this.set("reportSelectorOption", true);
        this.set("studentSelectorOption", false);
    }

    showStudents = () => {
        this.set("studentSelectorOption", true);
        this.set("reportSelectorOption", false);

        if (this.studentListInitialised) {
            return;
        }

        const container = document.getElementById("student-list");
        this.studentSelector.createTable(container, Enumerable.From(this.testFile.students).Select(s => new StudentClass(s)).ToArray(), []);

        this.studentListInitialised = true;
    }

    printReports = () => {

    }

    setAllReports = (val: boolean) => {
        this.set("schoolStudentRecordOption", val);
        this.set("naplanProgressIndexOption", val);
        this.set("mathsSkillsProfileListOption", val);
        this.set("mathsSkillsProfileTableOption", val);
        this.set("readingSkillsProfileListOption", val);
        this.set("readingSkillsProfileTableOption", val);
        this.set("writingCriteriaOption", val);
        this.set("markedWritingCriteriaOption", val);
    }
}
