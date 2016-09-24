var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomGroupViewModel = (function (_super) {
    __extends(CustomGroupViewModel, _super);
    function CustomGroupViewModel(studentCount) {
        var _this = this;
        _super.call(this);
        this.selectedGroupingOption = 1;
        this.selectedStreamingOption = 1;
        this.selectedTopClassGroupingOption = 0;
        this.selectedLowestClassGroupingOption = 0;
        this.selectedGenderOption = 0;
        this.currentGroupStep = 1;
        this.isLastStep = false;
        this.isFirstStep = true;
        this.isCoedSchool = true;
        this.studentCount = 0;
        this.classCount = 1;
        this.joinedStudents = [];
        this.separatedStudents = [];
        this.stepCollection = new StepCollection();
        this.testInfo = new TestFile();
        this.nextStep = function () {
            _super.prototype.set.call(_this, "currentGroupStep", _this.currentGroupStep + 1);
            _this.callGetViewStep(_this.currentGroupStep);
        };
        this.previousStep = function () {
            _super.prototype.set.call(_this, "currentGroupStep", _this.currentGroupStep - 1);
            _this.callGetViewStep(_this.currentGroupStep);
        };
        this.cancelStep = function () {
            console.log("cancelStep");
        };
        this.showStep = function (data) {
        };
        this.setDatasource = function (test, results, languages) {
            var testInfo = new TestFile();
            testInfo.set(test, results, languages);
            _this.studentCount = testInfo.studentCount;
            _this.classesDefn = new ClassesDefinition(testInfo);
            _this.bandSet = _this.classesDefn.createBandSet("class", _this.studentCount);
            _this.bandSet.bands[0].setClassCount(3);
            _this.classDefinitionViewModel = new ClassDefinitionViewModel(_this.studentCount);
            _this.customBandSet = _this.classesDefn.createBandSet("Band", _this.studentCount, 2);
            _this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(_this.studentCount);
            _this.languageBandClassDefinitionViewModel = new LanguageBandClassDefinitionViewModel(_this.studentCount);
            _this.languageBandClassDefinitionViewModel.students = _this.classesDefn.students;
            _this.languageBandSet = _this.languageBandClassDefinitionViewModel.bandSet;
            _this.topMiddleLowestBandSet = _this.classesDefn.createTopMiddleBottomBandSet("class", _this.studentCount);
            _this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(_this.studentCount);
            _this.generateCustomGroupViewModel = new GenerateCustomGroupViewModel();
            _this.set("selectedClassDefinitionViewModel", _this.classDefinitionViewModel);
        };
        this.studentCount = studentCount;
        this.classDefinitionViewModel = new ClassDefinitionViewModel(studentCount);
        this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(studentCount);
        this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(studentCount);
    }
    Object.defineProperty(CustomGroupViewModel.prototype, "topClassGroupingOption", {
        // Radio button value is string type and they need to be converted to number
        get: function () {
            var selectedTopClassGroupingOption = this.selectedTopClassGroupingOption;
            return typeof selectedTopClassGroupingOption === "number"
                ? selectedTopClassGroupingOption
                : parseInt(selectedTopClassGroupingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "lowestClassGroupingOption", {
        get: function () {
            var selectedLowestClassGroupingOption = this.selectedLowestClassGroupingOption;
            return typeof selectedLowestClassGroupingOption === "number"
                ? selectedLowestClassGroupingOption
                : parseInt(selectedLowestClassGroupingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "groupingOption", {
        get: function () {
            var selectedGroupingOption = this.selectedGroupingOption;
            return typeof selectedGroupingOption === "number"
                ? selectedGroupingOption
                : parseInt(selectedGroupingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "streamType", {
        get: function () {
            return typeof this.selectedStreamingOption === "number"
                ? this.selectedStreamingOption
                : parseInt(this.selectedStreamingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "genderOption", {
        get: function () {
            return typeof this.selectedGenderOption === "number"
                ? this.selectedGenderOption
                : parseInt(this.selectedGenderOption);
        },
        enumerable: true,
        configurable: true
    });
    CustomGroupViewModel.prototype.callGetViewStep = function (stepNo) {
        _super.prototype.set.call(this, "isFirstStep", this.stepCollection.isFirstStep(stepNo));
        _super.prototype.set.call(this, "isLastStep", this.stepCollection.isLastStep(stepNo));
        var viewName = this.stepCollection.getStepView(this.groupingOption, stepNo);
        console.log("View: ", viewName);
        if (!viewName) {
            return;
        }
        $.ajax({
            type: "POST",
            url: "Customgroup\\" + viewName,
            dataType: "html",
            success: function (data) {
                $("#custom-group-content").html(data);
            }
        });
    };
    CustomGroupViewModel.prototype.loadGroupingViewModel = function () {
        switch (this.groupingOption) {
            case GroupingMethod.Banding:
                this.bandClassDefinitionViewModel.loadOptions(this.customBandSet);
                this.set("selectedClassDefinitionViewModel", this.bandClassDefinitionViewModel);
                break;
            case GroupingMethod.TopMiddleLowest:
                this.topMiddleLowestBandClassDefinitionViewModel.loadOptions(this.topMiddleLowestBandSet);
                this.set("selectedClassDefinitionViewModel", this.topMiddleLowestBandClassDefinitionViewModel);
                break;
            case GroupingMethod.Language:
                this.languageBandClassDefinitionViewModel.loadOptions(this.languageBandSet);
                this.set("selectedClassDefinitionViewModel", this.languageBandClassDefinitionViewModel);
                break;
            default:
                this.classDefinitionViewModel.loadOptions(this.bandSet);
                this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
                break;
        }
    };
    CustomGroupViewModel.prototype.generateClasses = function () {
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        switch (this.groupingOption) {
            case GroupingMethod.Banding:
            case GroupingMethod.Language:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.streamType = this.streamType;
                for (var _i = 0, _a = bandSet.bands; _i < _a.length; _i++) {
                    var band = _a[_i];
                    band.groupType = GroupingMethod.MixedAbility;
                    band.streamType = this.streamType;
                }
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;
            case GroupingMethod.TopMiddleLowest:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.bands[0].groupType = this.topClassGroupingOption;
                bandSet.bands[2].groupType = this.lowestClassGroupingOption;
                for (var _b = 0, _c = bandSet.bands; _b < _c.length; _b++) {
                    var band = _c[_b];
                    band.streamType = this.streamType;
                }
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;
            default:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.bands[0].groupType = this.groupingOption;
                bandSet.bands[0].streamType = this.streamType;
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;
        }
        this.set("selectedClassDefinitionViewModel", this.generateCustomGroupViewModel);
        this.selectedClassDefinitionViewModel.loadOptions(bandSet);
    };
    ;
    return CustomGroupViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=CustomGroupViewModel.js.map