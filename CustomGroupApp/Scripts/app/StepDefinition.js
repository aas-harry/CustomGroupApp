var StepDefinition = (function () {
    function StepDefinition(stepNo, isCommon, viewName, isLastStep) {
        if (isCommon === void 0) { isCommon = true; }
        if (isLastStep === void 0) { isLastStep = false; }
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
            console.log("GetStep: ", stepNo, groupType);
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
        step2.views.push(new ViewDefinition(GroupingMethod.Language, "LanguageClassConfigurationStep"));
        step2.views.push(new ViewDefinition(GroupingMethod.Preallocated, "PreallocatedClassConfigurationStep"));
        step2.views.push(new ViewDefinition(GroupingMethod.SchoolGroup, "SchoolGroupClassConfigurationStep"));
        this.steps.push(step2);
        this.steps.push(new StepDefinition(3, true, "StudentGroupingOptionsStep"));
        this.steps.push(new StepDefinition(4, true, "EnterCustomGroupNameStep"));
        this.steps.push(new StepDefinition(5, true, "GenerateCustomGroupStep"));
        this.steps.push(new StepDefinition(6, true, "SaveCustomGroupStep", true));
        this.stepCount = this.steps.length;
        this.lastStep = this.steps[this.stepCount - 1];
        this.firstStep = this.steps[0];
    }
    return StepCollection;
}());
//# sourceMappingURL=StepDefinition.js.map