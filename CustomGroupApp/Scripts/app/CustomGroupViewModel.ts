class CustomGroupViewModel extends kendo.data.ObservableObject {
    constructor(studentCount: number) {
        super();

        this.studentCount = studentCount;
        this.classDefinitionViewModel = new ClassDefinitionViewModel(studentCount);
        this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(studentCount);
        this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(studentCount);
    }
    selectedGroupingOption: any = 1;
    selectedStreamingOption: any = 1;
    selectedTopClassGroupingOption: any = 0;
    selectedLowestClassGroupingOption: any = 0;
    selectedGenderOption: any = 0;
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

    // Radio button value is string type and they need to be converted to number
    get topClassGroupingOption(): number {
        var selectedTopClassGroupingOption = this.selectedTopClassGroupingOption;   
        return typeof selectedTopClassGroupingOption === "number"
            ? selectedTopClassGroupingOption
            : parseInt(selectedTopClassGroupingOption);
    }
    get lowestClassGroupingOption(): number {
        var selectedLowestClassGroupingOption = this.selectedLowestClassGroupingOption;
        return typeof selectedLowestClassGroupingOption === "number"
            ? selectedLowestClassGroupingOption
            : parseInt(selectedLowestClassGroupingOption);
    }
    get groupingOption(): number {
        var selectedGroupingOption = this.selectedGroupingOption;
        return typeof selectedGroupingOption === "number"
            ? selectedGroupingOption
            : parseInt(selectedGroupingOption);
    }
    get streamType(): number {
        return typeof this.selectedStreamingOption === "number"
            ? this.selectedStreamingOption
            : parseInt(this.selectedStreamingOption);
    }
    get genderOption(): number  {
        return typeof this.selectedGenderOption === "number"
            ? this.selectedGenderOption
            : parseInt(this.selectedGenderOption);
    }

    private stepCollection = new StepCollection();
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
    
    private nextStep = () => {
        super.set("currentGroupStep", this.currentGroupStep + 1);
        this.callGetViewStep(this.currentGroupStep);
    };
    private previousStep = () => {
        super.set("currentGroupStep", this.currentGroupStep - 1);
        this.callGetViewStep(this.currentGroupStep);
    };
    private cancelStep = () => {
        console.log("cancelStep");
    };
    private callGetViewStep(stepNo: number) {
        super.set("isFirstStep", this.stepCollection.isFirstStep(stepNo));
        super.set("isLastStep", this.stepCollection.isLastStep(stepNo));

        var viewName = this.stepCollection.getStepView(this.groupingOption, stepNo);
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

    loadGroupingViewModel() {
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
    }

    generateClasses() {

        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        switch (this.groupingOption) {
            case GroupingMethod.Banding:
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;

            case GroupingMethod.TopMiddleLowest:
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;

            case GroupingMethod.Language:
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;

            default:
                bandSet.bands[0].groupType = this.groupingOption;
                bandSet.bands[0].streamType = this.streamType;
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;
        }

        this.set("selectedClassDefinitionViewModel", this.generateCustomGroupViewModel);
        this.selectedClassDefinitionViewModel.loadOptions(bandSet);
    };

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
}
