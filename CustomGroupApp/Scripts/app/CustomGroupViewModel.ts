class CustomGroupViewModel extends kendo.data.ObservableObject {
    constructor(studentCount: number) {
        super();

        this.studentCount = studentCount;
        this.classDefinitionViewModel = new ClassDefinitionViewModel(studentCount);
        this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(studentCount);
        this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(studentCount);
    }
    selectedGroupingOption = "MixedAbility";
    selectedStreamingOption = "OverallAbilty";
    selectedTopClassGroupingOption = "Streaming";
    selectedLowestClassGroupingOption = "Streaming";
    selectedGenderOption = "All";
    mixGirlsBoysOption = false;
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

    // Radio button value is string type and they need to be converted to enum
    get topClassGroupingOption(): GroupingMethod {
        const selectedTopClassGroupingOption = this.selectedTopClassGroupingOption;
        return this.groupingHelper.convertGroupingOptionFromString(selectedTopClassGroupingOption);
    }

    get lowestClassGroupingOption(): GroupingMethod {
        const selectedLowestClassGroupingOption = this.selectedLowestClassGroupingOption;
        return this.groupingHelper.convertGroupingOptionFromString(selectedLowestClassGroupingOption);
    }

    get groupingOption(): GroupingMethod {
        const selectedGroupingOption = this.selectedGroupingOption;
        return this.groupingHelper.convertGroupingOptionFromString(selectedGroupingOption);
    }
    get streamType(): StreamType {
        return this.groupingHelper.convertStreamTypeFromString(this.selectedStreamingOption);
    }
    get genderOption(): Gender {
        return this.groupingHelper.convertGenderFromString(this.selectedGenderOption);
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
    private groupingHelper = new GroupingHelper();

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
            case GroupingMethod.Language:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.streamType = this.streamType;
                for (let band of bandSet.bands) {
                    band.groupType = GroupingMethod.MixedAbility;
                    band.streamType = this.streamType;
                    band.mixBoysGirls = this.mixGirlsBoysOption;
                }
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName,
                    this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;

            case GroupingMethod.TopMiddleLowest:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.bands[0].groupType = this.topClassGroupingOption;
                bandSet.bands[2].groupType = this.lowestClassGroupingOption;
                for (let band of bandSet.bands) {
                    band.streamType = this.streamType;
                    band.mixBoysGirls = this.mixGirlsBoysOption;
                }
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName,
                    this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;

            default:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.bands[0].groupType = this.groupingOption;
                bandSet.bands[0].streamType = this.streamType;
                bandSet.bands[0].mixBoysGirls = this.mixGirlsBoysOption;
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName,
                    this.classesDefn.students, this.joinedStudents, this.separatedStudents);
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
