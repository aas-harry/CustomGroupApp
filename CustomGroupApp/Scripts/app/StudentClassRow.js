var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentClassRow = (function (_super) {
    __extends(StudentClassRow, _super);
    function StudentClassRow(student) {
        var _this = this;
        _super.call(this, null);
        this.hasLanguagePrefs = false;
        this.convert = function (student) {
            _this.id = student.id;
            _this.name = student.name;
            _this.gender = student.gender;
            _this.score = student.score;
            _this.class = student.classNo;
            _this.langPref1 = student.langPref1;
            _this.langPref2 = student.langPref2;
            _this.langPref3 = student.langPref3;
            if (_this.langPref1 !== "" || _this.langPref2 !== "" || _this.langPref3 !== "") {
                _this.hasLanguagePrefs = true;
            }
        };
        this.convert(student);
    }
    return StudentClassRow;
}(kendo.data.ObservableObject));
