class StudentPortfolioPrintViewModel extends kendo.data.ObservableObject {
    constructor(public testFile: TestFile) {
        super();
    }

    popupWindow: kendo.ui.Window;
    studentSelector = new StudentSelector();
    reportSelectorOption = false;
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

    selectedReports = 1;
    selectedStudents = 1;

    showReports = () => {
        this.set("reportSelectorOption", true);
        this.set("studentSelectorOption", false);
    }

    showStudents = () => {
        this.set("studentSelectorOption", true);
        this.set("reportSelectorOption", false);
    }

    initStudentList = () => {
        const container = document.getElementById("student-list");
        this.studentSelector.maxRows = 16;
        this.studentSelector.createTable(container, Enumerable.From(this.testFile.students).Select(s => new StudentClass(s)).ToArray(), []);
    }

    downloadReports = () => {
        var dialog = $("#popup-window-container").data("kendoWindow");
        if (dialog) {
            dialog.close();
        }
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
