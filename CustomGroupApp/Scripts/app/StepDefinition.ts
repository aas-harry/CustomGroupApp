class StepDefinition {
    constructor(public stepNo: number, public isCommon = true, public viewName: string, isLastStep = false) {

    }
    views: Array<ViewDefinition> = [];
}

class ViewDefinition {
    constructor(public groupType: GroupingMethod, public name: string) {
    }
}

class StepCollection {
    constructor() {
        this.steps.push(new StepDefinition(1, true, "SelectGroupingTypeStep"));

        const step2 = new StepDefinition(2, false, "ClassConfigurationStep");
        step2.views.push(new ViewDefinition(GroupingMethod.Banding, "BandClassConfigurationStep"));
        step2.views.push(new ViewDefinition(GroupingMethod.TopMiddleLowest, "TopMiddleLowestClassConfigurationStep"));
        step2.views.push(new ViewDefinition(GroupingMethod.Language, "LanguageClassConfigurationStep"));
        step2.views.push(new ViewDefinition(GroupingMethod.Preallocated, "PreallocatedClassConfigurationStep"));
        this.steps.push(step2);

        this.steps.push(new StepDefinition(3, true, "StudentGroupingOptionsStep"));
        this.steps.push(new StepDefinition(4, true, "EnterCustomGroupNameStep"));
        this.steps.push(new StepDefinition(5, true, "GenerateCustomGroupStep"));
        this.steps.push(new StepDefinition(6, true, "SaveCustomGroupStep", true));

        this.stepCount = this.steps.length;
        this.lastStep = this.steps[this.stepCount - 1];
        this.firstStep = this.steps[0];
    }

    stepCount: number;
    lastStep: StepDefinition;
    firstStep: StepDefinition;

    steps: Array<StepDefinition> = [];

    getStepView = (groupType: GroupingMethod, stepNo: number): string => {
        console.log("GetStep: ", stepNo, groupType);
        var stepView = this.steps[stepNo - 1];
        if (stepView.isCommon) {
            return stepView.viewName;
        }
        var viewName = stepView.viewName;
        for (let view of stepView.views) {
            if (view.groupType === groupType) {
                return view.name;
            }
        }
        return viewName;
    }

    isLastStep = (stepNo: number): boolean => {
        return this.lastStep.stepNo === stepNo;
    }
    isFirstStep = (stepNo: number): boolean => {
        return this.firstStep.stepNo === stepNo;
    }
}
