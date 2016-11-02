var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentPortfolio = (function (_super) {
    __extends(StudentPortfolio, _super);
    function StudentPortfolio(elementName) {
        var _this = this;
        _super.call(this);
        this.elementName = elementName;
        this.reset = function () {
            _this.testFile = null;
            _this.student = null;
            _this.isTestFileSet = false;
        };
        this.setDatasource = function (testFile) {
            _this.reset();
            _this.testFile = testFile;
            _this.isTestFileSet = true;
        };
        // Use this function to set other properties in the subclasses
        this.setAdditionalProperties = function (student) {
        };
        this.elementName = elementName;
    }
    StudentPortfolio.prototype.setStudent = function (student) {
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
        this.set("schoolStudentId", student.schoolStudentId);
        this.set("hasSchoolStudentId", student.hasSchoolStudentId);
        this.set("yearLevel", this.testFile.yearLevel);
        this.set("schoolName", this.testFile.school.name);
        this.setAdditionalProperties(student);
    };
    return StudentPortfolio;
}(kendo.data.ObservableObject));
//# sourceMappingURL=IStudentPortfolio.js.map