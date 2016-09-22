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
        this.stepCollection = new StepCollection();
        // Html elements
        this.groupingOptions = new kendo.data.ObservableArray([
            { caption: "Mixed Ability", value: GroupingMethod.MixedAbility, id: "mixed-ability" },
            { caption: "Streaming", value: GroupingMethod.Streaming, id: "streaming" },
            { caption: "Banding", value: GroupingMethod.Banding, id: "banding" },
            { caption: "Top, Mixed Middle, Lowest", value: GroupingMethod.TopMiddleLowest, id: "top-middle-lowest" },
            { caption: "Language", value: GroupingMethod.Language, id: "languages" }
        ]);
        this.streamingOptions = new kendo.data.ObservableArray([
            { caption: "Overall Ability", value: StreamType.OverallAbilty, id: "overall-ability" },
            { caption: "English", value: StreamType.English, id: "english" },
            { caption: "Maths Achievement", value: StreamType.MathsAchievement, id: "maths-Achievement" }
        ]);
        this.topMiddleLowestGroupingOptions = [
            { caption: "Streaming", value: BandStreamType.Streaming, id: "streaming-tml" },
            { caption: "Parallel", value: BandStreamType.Parallel, id: "parallel-tml" }
        ];
        this.selectedGroupingOption = 1;
        this.selectedStreamingOption = 0;
        this.selectedTopClassGroupingOption = 0;
        this.selectedLowestClassGroupingOption = 0;
        this.selectedGenderOption = 1;
        this.currentGroupStep = 1;
        this.isLastStep = false;
        this.isFirstStep = true;
        this.isCoedSchool = true;
        this.studentCount = 0;
        this.classCount = 1;
        this.joinedStudents = [];
        this.separatedStudents = [];
        this.testInfo = new TestFile();
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
        this.studentCount = studentCount;
        this.classDefinitionViewModel = new ClassDefinitionViewModel(studentCount);
        this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(studentCount);
        this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(studentCount);
    }
    CustomGroupViewModel.prototype.generateClasses = function () {
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        bandSet.prepare(this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
    };
    ;
    CustomGroupViewModel.prototype.loadGroupingViewModel = function () {
        switch (parseInt(this.selectedGroupingOption)) {
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
    CustomGroupViewModel.prototype.loadGenerateCustomGroupViewModel = function () {
        debugger;
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        bandSet.streamType = this.selectedStreamingOption;
        bandSet.prepare(this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
        this.set("selectedClassDefinitionViewModel", this.generateCustomGroupViewModel);
        this.selectedClassDefinitionViewModel.loadOptions(bandSet);
    };
    CustomGroupViewModel.prototype.callGetViewStep = function (stepNo) {
        _super.prototype.set.call(this, "isFirstStep", this.stepCollection.isFirstStep(stepNo));
        _super.prototype.set.call(this, "isLastStep", this.stepCollection.isLastStep(stepNo));
        var viewName = this.stepCollection.getStepView(this.selectedGroupingOption, stepNo);
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
    return CustomGroupViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=CustomGroupViewModel.js.map