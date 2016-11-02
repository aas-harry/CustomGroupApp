var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SchoolStudentRecordViewModel = (function (_super) {
    __extends(SchoolStudentRecordViewModel, _super);
    function SchoolStudentRecordViewModel(elementName) {
        var _this = this;
        _super.call(this);
        // ReSharper restore InconsistentNaming
        this.setDatasource = function (testFile) {
            _this.testFile = testFile;
        };
        this.updateStudentPersonalDetails = function () {
        };
        this.elementName = elementName;
    }
    SchoolStudentRecordViewModel.prototype.setStudent = function (student) {
        if (!student) {
            return;
        }
        if (this.student && student.studentId === this.student.studentId) {
            return;
        }
        this.student = student;
        this.set("name", student.name);
        this.set("dob", student.dobString);
        this.set("age", student.ca);
        this.set("bornInAus", student.liveInAus);
        this.set("secondLanguage", student.speak);
        this.set("hasSchoolStudentId", student.hasSchoolStudentId);
        this.set("yearLevel", this.testFile.yearLevel);
        this.set("schoolName", this.testFile.school.name);
    };
    return SchoolStudentRecordViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=SchoolStudentRecordViewModel.js.map