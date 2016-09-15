var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StepDefinition = (function () {
    function StepDefinition(stepNo, isCommon, viewName) {
        if (isCommon === void 0) { isCommon = true; }
        this.stepNo = stepNo;
        this.isCommon = isCommon;
        this.viewName = viewName;
        this.views = [];
    }
    return StepDefinition;
}());
var ViewDefinition = (function () {
    function ViewDefinition(groupType, name) {
        this.groupType = groupType;
        this.name = name;
    }
    return ViewDefinition;
}());
var StepCollection = (function () {
    function StepCollection() {
        var _this = this;
        this.steps = [];
        this.getStepView = function (groupType, stepNo) {
            if (typeof groupType === "string") {
                groupType = parseInt(groupType);
            }
            if (stepNo > _this.steps.length || stepNo < 1) {
            }
            var stepView = _this.steps[stepNo - 1];
            if (stepView.isCommon) {
                return stepView.viewName;
            }
            var viewName = stepView.viewName;
            for (var _i = 0, _a = stepView.views; _i < _a.length; _i++) {
                var view = _a[_i];
                if (view.groupType === groupType) {
                    return view.name;
                }
            }
            return viewName;
        };
        this.isLastStep = function (stepNo) {
            return _this.lastStep.stepNo === stepNo;
        };
        this.isFirstStep = function (stepNo) {
            return _this.firstStep.stepNo === stepNo;
        };
        this.steps.push(new StepDefinition(1, true, "SelectGroupingTypeStep"));
        var step2 = new StepDefinition(2, false, "ClassConfigurationStep");
        step2.views.push(new ViewDefinition(GroupingMethod.Banding, "BandClassConfigurationStep"));
        step2.views.push(new ViewDefinition(GroupingMethod.TopMiddleLowest, "TopMiddleLowestClassConfigurationStep"));
        this.steps.push(step2);
        this.steps.push(new StepDefinition(3, true, "StudentGroupingOptionsStep"));
        this.steps.push(new StepDefinition(4, true, "SaveCustomGroupStep"));
        this.stepCount = this.steps.length;
        this.lastStep = this.steps[this.stepCount - 1];
        this.firstStep = this.steps[0];
    }
    return StepCollection;
}());
var CustomGroupViewModel = (function (_super) {
    __extends(CustomGroupViewModel, _super);
    function CustomGroupViewModel() {
        var _this = this;
        _super.call(this);
        this.stepCollection = new StepCollection();
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
        this.studentCount = 200;
        this.classCount = 1;
        this.onClassCountChanged = function () {
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
            $("#custom-group-content").html(data);
            kendo.unbind("#custom-group-container");
            kendo.bind($("#custom-group-container"), _this);
        };
    }
    CustomGroupViewModel.prototype.callGetViewStep = function (stepNo) {
        var _this = this;
        _super.prototype.set.call(this, "isFirstStep", this.stepCollection.isFirstStep(stepNo));
        _super.prototype.set.call(this, "isLastStep", this.stepCollection.isLastStep(stepNo));
        var viewName = this.stepCollection.getStepView(this.selectedGroupingOption, stepNo);
        if (!viewName) {
            return;
        }
        $.ajax({
            type: "POST",
            url: viewName,
            dataType: "html",
            success: function (data) {
                _this.showStep(data);
            }
        });
    };
    return CustomGroupViewModel;
}(kendo.data.ObservableObject));
