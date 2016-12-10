class ExportStudentListViewModel extends kendo.data.ObservableObject {
    private popupWindowElementName = "popup-window-container";
    private groupingHelper = new GroupingHelper();

    constructor(public testFile: TestFile) {
        super();


    }

    downloadTemplate = () => {
        this.groupingHelper.downloadTemplateFile("DownloadSchoolClassTemplate", this.testFile.fileNumber);
    }
}
