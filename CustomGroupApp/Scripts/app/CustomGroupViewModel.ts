class CustomGroupViewModel extends kendo.data.ObservableObject {
    constructor(public containerElementName, public studentCount: number, rootSite: string) {
        super();

        this.rootSite = rootSite;
        this.studentCount = studentCount;
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
    private _genderOption = "All";
    // ReSharper restore InconsistentNaming
    get selectedGenderOption(): string {
        return this._genderOption;
    };
    set selectedGenderOption(value: string) {
        this._genderOption = value;
        const gender = this.commonUtils.genderFromString(value);
        this.set("studentCount", this.classesDefn.genderStudentCount(gender));
        this.set("studentCountInAllClasses", this.studentCount);
        this.selectedClassDefinitionViewModel.genderChanged(gender, this.studentCount);
    };

    selectedGroupingOption = "MixedAbility";
    selectedStreamingOption = "OverallAbilty";
    selectedTopClassGroupingOption = "Streaming";
    selectedLowestClassGroupingOption = "Streaming";
    mixGirlsBoysOption = false;
    currentGroupStep = 1;
    isLastStep = false;
    isFirstStep = true;
    isCoedSchool = true;
    studentCountInAllClasses = 0;
    classCount = 1;
    groupName: string;
    selectedClassDefinitionViewModel: IBandClassSettings;
    joinedStudents: Array<StudentSet> = [];
    separatedStudents: Array<StudentSet> = [];
    errorMessage: string;
    hasErrors = false;
    rootSite: string;
    hasHiddenClasses: boolean = false;
    message: string;

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

    private commonUtils = new CommonUtils();
    private groupingHelper = new GroupingHelper();
    private pairedStudentsControl: StudentSetListControl;
    private separatedStudentsControl: StudentSetListControl;

    private nextStep = () => {
        super.set("currentGroupStep", this.currentGroupStep + 1);
        this.callGetViewStep(this.currentGroupStep, this.containerElementName);
    };
    private previousStep = () => {
        super.set("currentGroupStep", this.currentGroupStep - 1);
        this.callGetViewStep(this.currentGroupStep, this.containerElementName);
    };
    private startOver = () => {
        this.reset();

        super.set("currentGroupStep", 1);
        this.callGetViewStep(this.currentGroupStep, this.containerElementName);
    };
    private callGetViewStep(stepNo: number, containerElementName: string) {
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
                $(`#${containerElementName}`).html(data);
            }
        });
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
    
        this.pairedStudentsControl.createStudentSetContainer(joinedStudentsCell, this.classesDefn.testFile.isUnisex);
        this.separatedStudentsControl.createStudentSetContainer(separatedStudentsCell, this.classesDefn.testFile.isUnisex);
    }

    showAllClasses = (e: any) => {
        var vm = this.selectedClassDefinitionViewModel as GenerateCustomGroupViewModel;
        if (vm) {
            vm.showAllClasses();

            this.set("hasHiddenClasses", false);
            kendo.bind($("#custom-group-container"), this);
        }
    }

    hideClass = (e: any) => {
        var vm = this.selectedClassDefinitionViewModel as GenerateCustomGroupViewModel;
        if (vm) {
            vm.hideClass(this.commonUtils.getUid(e.target.id));

            this.set("hasHiddenClasses", true);
            kendo.bind($("#custom-group-container"), this);
        }
    }

    addPairStudent = (e: any) => {
        if (!this.pairedStudentsControl.onAddPairStudent(e.target.id)) {
            this.separatedStudentsControl.onAddPairStudent(e.target.id);
        }
    }

    editPairStudent = (e: any) => {
        if (! this.pairedStudentsControl.onEditPairStudent(e.target.id)) {
            this.separatedStudentsControl.onEditPairStudent(e.target.id);
        }
    }

    deletePairStudent = (e: any) => {
        if (!this.pairedStudentsControl.onDeletePairStudent(e.target.id)) {
            this.separatedStudentsControl.onDeletePairStudent(e.target.id);
        }
    }

    saveClasses() {
        const bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        const groupSet = {
            'TestNumber': this.classesDefn.testFile.fileNumber,
            'Name': this.groupName,
            'Classes': []
        }

        for (let bandItem of bandSet.bands) {
            for (let classItem of bandItem.classes) {
                var classes = Enumerable.From(classItem.students).Select(x => x.id).ToArray();
                groupSet.Classes.push(classes);
            }
        }

     
        $.ajax({
            type: "POST",
            url: "Customgroup\\SaveClasses",
            contentType: "application/json",
            data: JSON.stringify({ 'groupSet': groupSet }),
            success(data) {
                const element = document.getElementById("message-text") as HTMLElement;
                element.textContent = "Custom groups have been saved successfully.";
            }
        });

  
    }
    generateClasses() {
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        var students = this.classesDefn.genderStudents(this.genderOption);
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
                    students, this.joinedStudents, this.separatedStudents);
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
                    students, this.joinedStudents, this.separatedStudents);
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
                    students, this.joinedStudents, this.separatedStudents);
                break;
        }

        this.set("selectedClassDefinitionViewModel", this.generateCustomGroupViewModel);
        this.selectedClassDefinitionViewModel.loadOptions(bandSet);
    };

    reset = () => {
        this.bandSet = this.classesDefn.createBandSet("class", this.studentCount);
        this.bandSet.bands[0].setClassCount(3);

        this.customBandSet = this.classesDefn.createBandSet("Band", this.studentCount, 2);

        this.languageBandSet = this.classesDefn.createBandSet("Band", this.studentCount, 1);

        this.topMiddleLowestBandSet = this.classesDefn.createTopMiddleBottomBandSet("class", this.studentCount);

        this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
    }

    //
    setDatasource = (test, results, languages) => {
        var testInfo = new TestFile();
        testInfo.set(test, results, languages);
        this.isCoedSchool = testInfo.isUnisex;
        this.studentCount = testInfo.studentCount;
        this.studentCountInAllClasses = testInfo.studentCount;
        this.classesDefn = new ClassesDefinition(testInfo);

        this.pairedStudentsControl = new
            StudentSetListControl("Paired",
                this.joinedStudents,
                this.classesDefn.students,
                document.getElementById("popup-window-container"));

        this.separatedStudentsControl = new
            StudentSetListControl("Separated",
            this.separatedStudents,
            this.classesDefn.students,
            document.getElementById("popup-window-container"));

        this.reset();
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
