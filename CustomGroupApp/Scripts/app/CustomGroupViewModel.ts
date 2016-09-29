class CustomGroupViewModel extends kendo.data.ObservableObject {
    constructor(studentCount: number, rootSite: string) {
        super();

        this.rootSite = rootSite;
        this.studentCount = studentCount;
        //this.classDefinitionViewModel = new ClassDefinitionViewModel(studentCount, this.onStudentCountChanged);
        //this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(studentCount);
        //this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(studentCount);
    }
    selectedGroupingOption = "MixedAbility";
    selectedStreamingOption = "OverallAbilty";
    selectedTopClassGroupingOption = "Streaming";
    selectedLowestClassGroupingOption = "Streaming";

    private _genderOption = "All";
    get selectedGenderOption(): string {
        return this._genderOption;
    };
    set selectedGenderOption(value: string) {
        this._genderOption = value;
        console.log("Gender: " + value);
    };

    mixGirlsBoysOption = false;
    currentGroupStep = 1;
    isLastStep = false;
    isFirstStep = true;
    isCoedSchool = true;
    studentCount = 0;
    studentCountInAllClasses = 0;
    classCount = 1;
    groupName: string;
    selectedClassDefinitionViewModel: IBandClassSettings;
    joinedStudents: Array<StudentSet> = [];
    separatedStudents: Array<StudentSet> = [];
    errorMessage: string;
    hasErrors = false;
    rootSite: string;
    get testNumber(): number {
        return this.testInfo ? this.testInfo.fileNumber : 0;
    }

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
    // ReSharper disable InconsistentNaming
    private _classDefinitionViewModel: ClassDefinitionViewModel;
    private _bandClassDefinitionViewModel: BandClassDefinitionViewModel;
    private _topMiddleLowestBandClassDefinitionViewModel: TopMiddleLowestBandClassDefinitionViewModel;
    private _languageBandClassDefinitionViewModel: LanguageBandClassDefinitionViewModel;
    private _generateCustomGroupViewModel: GenerateCustomGroupViewModel;
    // ReSharper restore InconsistentNaming

    get classDefinitionViewModel(): ClassDefinitionViewModel {
        if (this._classDefinitionViewModel === undefined) {
            this._classDefinitionViewModel = new
                ClassDefinitionViewModel(this.studentCount, this.onStudentCountChanged);
        }
        return this._classDefinitionViewModel;
    }
    get topMiddleLowestBandClassDefinitionViewModel(): TopMiddleLowestBandClassDefinitionViewModel {
        if (this._topMiddleLowestBandClassDefinitionViewModel === undefined) {
            this._topMiddleLowestBandClassDefinitionViewModel = new
                TopMiddleLowestBandClassDefinitionViewModel(this.studentCount, this.onStudentCountChanged);
        }
        return this._topMiddleLowestBandClassDefinitionViewModel;
    }
    get bandClassDefinitionViewModel(): BandClassDefinitionViewModel {
        if (this._bandClassDefinitionViewModel === undefined) {
            this._bandClassDefinitionViewModel = new
                BandClassDefinitionViewModel(this.studentCount, this.onStudentCountChanged);
        }
        return this._bandClassDefinitionViewModel;
    }
    get languageBandClassDefinitionViewModel(): LanguageBandClassDefinitionViewModel {
        if (this._languageBandClassDefinitionViewModel === undefined) {
            this._languageBandClassDefinitionViewModel = new
                LanguageBandClassDefinitionViewModel(this.studentCount, this.onStudentCountChanged);
        }
        return this._languageBandClassDefinitionViewModel;
    }
    get generateCustomGroupViewModel(): GenerateCustomGroupViewModel {
        if (this._generateCustomGroupViewModel === undefined) {
            this._generateCustomGroupViewModel = new
                GenerateCustomGroupViewModel(this.studentCount, this.onStudentCountChanged);
        }
        return this._generateCustomGroupViewModel;
    }

    private groupingHelper = new GroupingHelper();
    private studentSetListControls = new StudentSetListControls();

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
                if (!this.languageBandClassDefinitionViewModel.students ||
                    this.languageBandClassDefinitionViewModel.students.length === 0) {
                    this.languageBandClassDefinitionViewModel.students = this.classesDefn.students;
                }
                this.languageBandClassDefinitionViewModel.loadOptions(this.languageBandSet);

                this.set("selectedClassDefinitionViewModel", this.languageBandClassDefinitionViewModel);
                break;

            default:
                this.classDefinitionViewModel.loadOptions(this.bandSet);
                this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
                break;
        }
    }

    showStudentGroupingOption = (
        joinedStudentsCell: HTMLTableCellElement,
        separatedStudentsCell: HTMLTableCellElement) => {
        
        var studentSet1 = new StudentSet();
        studentSet1.students.push(this.classesDefn.students[0]);
        studentSet1.students.push(this.classesDefn.students[1]);
        studentSet1.students.push(this.classesDefn.students[2]);
        studentSet1.students.push(this.classesDefn.students[3]);
        var studentSet2 = new StudentSet();
        studentSet2.students.push(this.classesDefn.students[4]);
        studentSet2.students.push(this.classesDefn.students[5]);
        studentSet2.students.push(this.classesDefn.students[6]);

        this.joinedStudents.push(studentSet1);
        this.joinedStudents.push(studentSet2);
        this.separatedStudents.push(studentSet1);
        this.separatedStudents.push(studentSet2);

        
        this.studentSetListControls.createStudentSetContainer("Paired", joinedStudentsCell, this.joinedStudents, 
            this.classesDefn.testFile.isUnisex);
        this.studentSetListControls.createStudentSetContainer("Separated", separatedStudentsCell, this.separatedStudents,
            this.classesDefn.testFile.isUnisex);
    }

    generateClasses()  {
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        switch (this.groupingOption) {
            case GroupingMethod.Banding:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.streamType = this.streamType;
                for (let band of bandSet.bands) {
                    band.bandType = BandType.Custom;
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
                bandSet.bands[1].groupType = GroupingMethod.MixedAbility; // Middle class always using mixed ability
                bandSet.bands[2].groupType = this.lowestClassGroupingOption;
                for (let band of bandSet.bands) {
                    band.streamType = this.streamType;
                    band.mixBoysGirls = this.mixGirlsBoysOption;
                }
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName,
                    this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;

            case GroupingMethod.Language:
                for (let band of bandSet.bands) {
                    band.groupType = GroupingMethod.MixedAbility;
                    band.bandType = BandType.Language;
                    band.streamType = this.streamType;
                    band.mixBoysGirls = this.mixGirlsBoysOption;
                    band.prepare(band.bandName, band.students, this.joinedStudents, this.separatedStudents);
                }
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

    //
    setDatasource = (test, results, languages) => {
        var testInfo = new TestFile();
        testInfo.set(test, results, languages);
        this.isCoedSchool = testInfo.isUnisex;
        this.studentCount = testInfo.studentCount;
        this.studentCountInAllClasses = testInfo.studentCount;
        this.classesDefn = new ClassesDefinition(testInfo);

        this.bandSet = this.classesDefn.createBandSet("class", this.studentCount);
        this.bandSet.bands[0].setClassCount(3);

        this.customBandSet = this.classesDefn.createBandSet("Band", this.studentCount, 2);

        this.languageBandSet = this.classesDefn.createBandSet("Band", this.studentCount, 1);

        this.topMiddleLowestBandSet = this.classesDefn.createTopMiddleBottomBandSet("class", this.studentCount);


        this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
    };

    onStudentCountChanged = (count: number) => {
        // set the total number students in all classes
        this.set("studentCountInAllClasses", count);
        if (this.studentCount !== this.studentCountInAllClasses) {
            this.set("hasErrors", true);
            this.set("errorMessage",
                "The total number students in all classes doesn't match with number of students in test file");
        } else {
            this.set("hasErrors", false);
            this.set("errorMessage", "");
        }

    }
}
