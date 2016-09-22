class CustomGroupViewModel extends kendo.data.ObservableObject {

    constructor(studentCount: number) {
        super();

        this.studentCount = studentCount;
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
    studentCount = 0;
    classCount = 1;
    groupName: string;
    selectedClassDefinitionViewModel: IBandClassSettings;
    joinedStudents: Array<StudentSet> = [];
    separatedStudents: Array<StudentSet> = [];

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
    private generateCustomGroupViewModel: GenerateCustomGroupViewModel;

    generateClasses() {
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();

        bandSet.prepare(this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents );
    };

    loadGroupingViewModel() {
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
    }

    loadGenerateCustomGroupViewModel() {
        debugger;
        const bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        bandSet.streamType = this.selectedStreamingOption;
        bandSet.prepare(this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);

        this.set("selectedClassDefinitionViewModel", this.generateCustomGroupViewModel);
        this.selectedClassDefinitionViewModel.loadOptions(bandSet);
    }

    setDatasource = (test, results, languages) => {
        var testInfo = new TestFile();
        testInfo.set(test, results, languages);
        this.studentCount = testInfo.studentCount;
        this.classesDefn = new ClassesDefinition(testInfo);

        this.bandSet = this.classesDefn.createBandSet("class", this.studentCount);
        this.bandSet.bands[0].setClassCount(3);
        this.classDefinitionViewModel = new ClassDefinitionViewModel(this.studentCount);

        this.customBandSet = this.classesDefn.createBandSet("Band", this.studentCount, 2);
        this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(this.studentCount);

        this.languageBandClassDefinitionViewModel = new LanguageBandClassDefinitionViewModel(this.studentCount);
        this.languageBandClassDefinitionViewModel.students = this.classesDefn.students;
        this.languageBandSet = this.languageBandClassDefinitionViewModel.bandSet;

        this.topMiddleLowestBandSet = this.classesDefn.createTopMiddleBottomBandSet("class", this.studentCount);
        this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(this.studentCount);

        this.generateCustomGroupViewModel = new GenerateCustomGroupViewModel();

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
