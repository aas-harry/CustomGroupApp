var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ClassDefinitionViewModel = (function (_super) {
    __extends(ClassDefinitionViewModel, _super);
    function ClassDefinitionViewModel(studentCount) {
        var _this = this;
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
        this.classCount = 1;
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        // This function is called when the student count in a class is changed
        this.onStudentCountInClassChanged = function (e) {
            var uid = _this.getUid(e.sender.element[0].id);
            var classItem = Enumerable.From(_this.bandSet.bands[0].classes).FirstOrDefault(undefined, function (x) { return x.uid === uid; });
            var inputField = e.sender;
            if (classItem && inputField) {
                classItem.count = inputField.value();
            }
        };
        this.onClassCountChange = function () {
            _this.bandSet.bands[0].setClassCount(_this.classCount);
            _this.createInputTextBox(_this.bandSet.bands[0].classes);
        };
        this.getUid = function (elementName) {
            return elementName.substr(elementName.indexOf("-") + 1);
        };
        this.parseElementClass = function (elementName) {
            var base = elementName.substr(elementName.indexOf("-") + 1);
            var bandNo = base.substr(0, base.indexOf("-"));
            var classNo = base.substr(base.indexOf("-", 1) + 1);
            return { bandNo: parseInt(bandNo), classNo: parseInt(classNo) };
        };
        _super.prototype.init.call(this, this);
    }
    ClassDefinitionViewModel.prototype.createInputTextBox = function (classes) {
        $("#classes-settings-container").html("");
        var element = document.getElementById("classes-settings-container");
        var cnt = 0;
        for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
            var classItem = classes_1[_i];
            var classNo = classItem.index;
            cnt++;
            var label = document.createElement("span");
            label.textContent = "Class " + classNo;
            label.setAttribute("style", "width: 100px;text-align: right");
            element.appendChild(label);
            var inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.setAttribute("style", "width: 100px; margin-right: 10px; margin-left: 10px; margin-bottom: 5px'");
            inputElement.id = "class-" + classItem.uid;
            element.appendChild(inputElement);
            this.kendoHelper.createStudentsInputField(inputElement.id, classItem.count, this.onStudentCountInClassChanged);
            if (cnt === 3) {
                $("#classes-settings-container")
                    .append("<div style='margin-top: 5px></div>");
                cnt = 0;
            }
        }
    };
    ClassDefinitionViewModel.prototype.saveOptions = function (source) {
        return true;
    };
    ClassDefinitionViewModel.prototype.loadOptions = function (source) {
        this.bandSet = source;
        _super.prototype.set.call(this, "classCount", source.bands[0].classes.length);
        this.createInputTextBox(source.bands[0].classes);
        return true;
    };
    ClassDefinitionViewModel.prototype.getBandSet = function () {
        return this.bandSet;
    };
    return ClassDefinitionViewModel;
}(kendo.data.ObservableObject));
