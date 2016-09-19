class StepDefinition {
    constructor(public stepNo: number, public isCommon = true, public viewName: string) {
        
    }
    views : Array<ViewDefinition> = [];
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
        this.steps.push(step2);

        this.steps.push(new StepDefinition(3, true, "StudentGroupingOptionsStep"));
        this.steps.push(new StepDefinition(4, true, "SaveCustomGroupStep"));

        this.stepCount = this.steps.length;
        this.lastStep = this.steps[this.stepCount - 1];
        this.firstStep = this.steps[0];
    }

    stepCount: number;
    lastStep: StepDefinition;
    firstStep: StepDefinition;

    steps: Array<StepDefinition> = [];

    getStepView = (groupType: any, stepNo: number): string => {
        console.log("GetStep: ", stepNo, groupType);
        if (typeof groupType === "string") {
            groupType = parseInt(groupType);
        }
        if (stepNo > this.steps.length || stepNo < 1) {
            
        }
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


class CustomGroupViewModel extends kendo.data.ObservableObject {

    constructor(studentCount: number) {
        super();

        this.classDefinitionViewModel = new ClassDefinitionViewModel(studentCount);
        this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(studentCount);
        this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(studentCount);
    }


    private stepCollection = new StepCollection();

    // Html elements

    groupingOptions = new kendo.data.ObservableArray([
        { caption: "Mixed Ability", value: GroupingMethod.MixedAbility, id: "mixed-ability" },
        { caption: "Streaming", value: GroupingMethod.Streaming, id: "streaming" },
        { caption: "Banding", value: GroupingMethod.Banding, id: "banding" },
        { caption: "Top, Mixed Middle, Lowest", value: GroupingMethod.TopMiddleLowest, id: "top-middle-lowest" },
        { caption: "Language", value: GroupingMethod.Language, id: "languages" }
    ]);


    streamingOptions = new kendo.data.ObservableArray([
        { caption: "Overall Ability", value: StreamType.OverallAbilty, id: "overall-ability" },
        { caption: "English", value: StreamType.English, id: "english" },
        { caption: "Maths Achievement", value: StreamType.MathsAchievement, id: "maths-Achievement" }
    ]);

    topMiddleLowestGroupingOptions = [
        { caption: "Streaming", value: BandStreamType.Streaming, id: "streaming-tml" },
        { caption: "Parallel", value: BandStreamType.Parallel, id: "parallel-tml" }
    ];


    selectedGroupingOption : any = 1;
    selectedStreamingOption = 0;
    selectedTopClassGroupingOption = 0;
    selectedLowestClassGroupingOption = 0;
    selectedGenderOption = 1;
    currentGroupStep = 1;
    isLastStep = false;
    isFirstStep = true;
    isCoedSchool = true;
    studentCount = 200;
    classCount = 1;
    selectedClassDefinitionViewModel: IBandClassSettings;

    private testInfo = new TestFile();
    private customBandSet: BandSet;
    private topMiddleLowestBandSet: TopMiddleLowestBandSet;
    private languageBandSet: BandSet;
    private bandSet: BandSet;
    private classesDefn: ClassesDefinition;

    private classDefinitionViewModel: ClassDefinitionViewModel;
    private bandClassDefinitionViewModel: BandClassDefinitionViewModel;
    private topMiddleLowestBandClassDefinitionViewModel: TopMiddleLowestBandClassDefinitionViewModel;
    private languageBandClassDefinitionViewModel: LanguageBandClassDefinitionViewModel;

    loadGroupingViewModel() {
        switch (parseInt(this.selectedGroupingOption)) {
            case GroupingMethod.Banding: 
                this.set("selectedClassDefinitionViewModel", this.bandClassDefinitionViewModel);
                this.selectedClassDefinitionViewModel.loadOptions(this.customBandSet);
                break;

            case GroupingMethod.TopMiddleLowest:
                this.set("selectedClassDefinitionViewModel", this.topMiddleLowestBandClassDefinitionViewModel);
                this.selectedClassDefinitionViewModel.loadOptions(this.topMiddleLowestBandSet);
                break;

            case GroupingMethod.Language:
                this.set("selectedClassDefinitionViewModel", this.languageBandClassDefinitionViewModel);
                this.selectedClassDefinitionViewModel.loadOptions(this.languageBandSet);
                break;

            default:
                this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
                this.selectedClassDefinitionViewModel.loadOptions(this.bandSet);
                break;
        }
    }

    setDatasource = (test, results) => {
        var testInfo = new TestFile();
        testInfo.set(test, results);
        const studentCount = testInfo.studentCount;
        this.classesDefn = new ClassesDefinition(testInfo);

        this.bandSet = this.classesDefn.createBandSet("class", studentCount);
        this.bandSet.bands[0].setClassCount(3);
        this.classDefinitionViewModel = new ClassDefinitionViewModel(studentCount);

        this.customBandSet = this.classesDefn.createBandSet("Band",studentCount, 2);
        this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(studentCount);

        this.languageBandSet = this.classesDefn.createBandSet("Band", studentCount, 2);
        this.languageBandClassDefinitionViewModel = new LanguageBandClassDefinitionViewModel(studentCount);

        this.topMiddleLowestBandSet = this.classesDefn.createTopMiddleBottomBandSet("class", studentCount);
        this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(studentCount);

        this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
    };

    
    nextStep = () => {
        super.set("currentGroupStep", this.currentGroupStep + 1);
        this.callGetViewStep(this.currentGroupStep);
    };
    previousStep = () => {
        super.set("currentGroupStep", this.currentGroupStep - 1);
        this.callGetViewStep(this.currentGroupStep);
    };
    cancelStep = () => {
        console.log("cancelStep");
    };

    private callGetViewStep(stepNo: number) {
        super.set("isFirstStep", this.stepCollection.isFirstStep(stepNo));
        super.set("isLastStep", this.stepCollection.isLastStep(stepNo));

        var viewName = this.stepCollection.getStepView(this.selectedGroupingOption, stepNo);
        console.log("View: ", viewName);

       
        if (!viewName) {
            return;
        }
        $.ajax({
            type: "POST",
            url: "Customgroup\\" + viewName,
            dataType: "html",
            success(data) {
                $("#custom-group-content").html(data);
            }
        });
    }

    private showStep = (data) => {

      
    }
}
