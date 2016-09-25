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
        this.selectedGroupingOption = "MixedAbility";
        this.selectedStreamingOption = "OverallAbilty";
        this.selectedTopClassGroupingOption = "Streaming";
        this.selectedLowestClassGroupingOption = "Streaming";
        this.selectedGenderOption = "All";
        this.mixGirlsBoysOption = false;
        this.currentGroupStep = 1;
        this.isLastStep = false;
        this.isFirstStep = true;
        this.isCoedSchool = true;
        this.studentCount = 0;
        this.studentCountInAllClasses = 0;
        this.classCount = 1;
        this.joinedStudents = [];
        this.separatedStudents = [];
        this.stepCollection = new StepCollection();
        this.testInfo = new TestFile();
        this.groupingHelper = new GroupingHelper();
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
            _this.isCoedSchool = testInfo.isUnisex;
            _this.studentCount = testInfo.studentCount;
            _this.studentCountInAllClasses = testInfo.studentCount;
            _this.classesDefn = new ClassesDefinition(testInfo);
            _this.bandSet = _this.classesDefn.createBandSet("class", _this.studentCount);
            _this.bandSet.bands[0].setClassCount(3);
            _this.classDefinitionViewModel = new ClassDefinitionViewModel(_this.studentCount, _this.onStudentCountChanged);
            _this.customBandSet = _this.classesDefn.createBandSet("Band", _this.studentCount, 2);
            _this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(_this.studentCount, _this.onStudentCountChanged);
            _this.languageBandClassDefinitionViewModel = new LanguageBandClassDefinitionViewModel(_this.studentCount, _this.onStudentCountChanged);
            _this.languageBandClassDefinitionViewModel.students = _this.classesDefn.students;
            _this.languageBandSet = _this.languageBandClassDefinitionViewModel.bandSet;
            _this.topMiddleLowestBandSet = _this.classesDefn.createTopMiddleBottomBandSet("class", _this.studentCount);
            _this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(_this.studentCount, _this.onStudentCountChanged);
            _this.generateCustomGroupViewModel = new GenerateCustomGroupViewModel();
            _this.set("selectedClassDefinitionViewModel", _this.classDefinitionViewModel);
        };
        this.onStudentCountChanged = function (count) {
            // set the total number students in all classes
            _this.set("studentCountInAllClasses", count);
            if (_this.studentCount !== _this.studentCountInAllClasses) {
                _this.set("errorMessage", "The total number students in all classes doesn't match with number of students in test file");
            }
            else {
                _this.set("errorMessage", "");
            }
        };
        this.studentCount = studentCount;
        //this.classDefinitionViewModel = new ClassDefinitionViewModel(studentCount, this.onStudentCountChanged);
        //this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(studentCount);
        //this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(studentCount);
    }
    Object.defineProperty(CustomGroupViewModel.prototype, "topClassGroupingOption", {
        // Radio button value is string type and they need to be converted to enum
        get: function () {
            var selectedTopClassGroupingOption = this.selectedTopClassGroupingOption;
            return this.groupingHelper.convertGroupingOptionFromString(selectedTopClassGroupingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "lowestClassGroupingOption", {
        get: function () {
            var selectedLowestClassGroupingOption = this.selectedLowestClassGroupingOption;
            return this.groupingHelper.convertGroupingOptionFromString(selectedLowestClassGroupingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "groupingOption", {
        get: function () {
            var selectedGroupingOption = this.selectedGroupingOption;
            return this.groupingHelper.convertGroupingOptionFromString(selectedGroupingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "streamType", {
        get: function () {
            return this.groupingHelper.convertStreamTypeFromString(this.selectedStreamingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "genderOption", {
        get: function () {
            return this.groupingHelper.convertGenderFromString(this.selectedGenderOption);
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
                    band.mixBoysGirls = this.mixGirlsBoysOption;
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
                    band.mixBoysGirls = this.mixGirlsBoysOption;
                }
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;
            default:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.bands[0].groupType = this.groupingOption;
                bandSet.bands[0].streamType = this.streamType;
                bandSet.bands[0].mixBoysGirls = this.mixGirlsBoysOption;
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