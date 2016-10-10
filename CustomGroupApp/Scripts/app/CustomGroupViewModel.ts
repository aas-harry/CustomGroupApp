class CustomGroupViewModel extends kendo.data.ObservableObject {
    constructor(public containerElementName, public studentCount: number, rootSite: string) {
        super();

        this.rootSite = rootSite;
        this.studentCount = studentCount;
    }

    private commonUtils = new CommonUtils();
    private groupingHelper = new GroupingHelper();
    private pairedStudentsControl: StudentSetListControl;
    private separatedStudentsControl: StudentSetListControl;
    private leavingStudentsControl: StudentSetListControl;
    private stepCollection = new StepCollection();
    private testInfo = new TestFile();
    private topMiddleLowestBandSet: TopMiddleLowestBandSet;
    private languageBandSet: BandSet;
    private preAllocatedBandset: BandSet;
    private classesDefn: ClassesDefinition;
    // ReSharper disable InconsistentNaming
    private _classDefinitionViewModel: ClassDefinitionViewModel;
    private _preAllocatedClassDefinitionViewModel: PreallocatedClassDefinitionViewModel;
    private _bandClassDefinitionViewModel: BandClassDefinitionViewModel;
    private _topMiddleLowestBandClassDefinitionViewModel: TopMiddleLowestBandClassDefinitionViewModel;
    private _languageClassDefinitionViewModel: LanguageClassDefinitionViewModel;
    private _generateCustomGroupViewModel: GenerateCustomGroupViewModel;
    private _genderOption = "All";
    private gender = Gender.All;
    // ReSharper restore InconsistentNaming

    get selectedGenderOption(): string {
        return this._genderOption;
    };

    set selectedGenderOption(value: string) {
        this.set("studentLeavingOption", false);
        this.set("leavingStudentCount", 0);
        this.leavingStudents = [];

        this._genderOption = value;
        this.gender = this.commonUtils.genderFromString(value);
        this.set("studentCount", this.classesDefn.genderStudentCount(this.gender));
        this.set("studentCountInAllClasses", this.studentCount);
        this.selectedClassDefinitionViewModel.genderChanged(this.gender, this.studentCount);
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
    classCount = 3;
    bandCount = 2;
    groupName: string;
    selectedClassDefinitionViewModel: CustomGroupBaseViewModel;
    joinedStudents: Array<StudentSet> = [];
    separatedStudents: Array<StudentSet> = [];
    errorMessage: string;
    hasErrors = false;
    rootSite: string;
    hasHiddenClasses: boolean = false;
    message: string;

    // leaving students properties
    studentLeavingOption = false;
    leavingStudents: Array<StudentClass> = [];
    leavingStudentsCount = 0;

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
                ClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
        }
        return this._classDefinitionViewModel;
    }

    get preAllocatedClassDefinitionViewModel(): PreallocatedClassDefinitionViewModel {
        if (this._preAllocatedClassDefinitionViewModel === undefined) {
            this._preAllocatedClassDefinitionViewModel = new
                PreallocatedClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
        }
        return this._preAllocatedClassDefinitionViewModel;
    }

    get topMiddleLowestBandClassDefinitionViewModel(): TopMiddleLowestBandClassDefinitionViewModel {
        if (this._topMiddleLowestBandClassDefinitionViewModel === undefined) {
            this._topMiddleLowestBandClassDefinitionViewModel = new
                TopMiddleLowestBandClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
        }
        return this._topMiddleLowestBandClassDefinitionViewModel;
    }

    get bandClassDefinitionViewModel(): BandClassDefinitionViewModel {
        if (this._bandClassDefinitionViewModel === undefined) {
            this._bandClassDefinitionViewModel = new
                BandClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
        }
        return this._bandClassDefinitionViewModel;
    }

    get languageClassDefinitionViewModel(): LanguageClassDefinitionViewModel {
        if (this._languageClassDefinitionViewModel === undefined) {
            this._languageClassDefinitionViewModel = new
                LanguageClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
        }
        return this._languageClassDefinitionViewModel;
    }

    get generateCustomGroupViewModel(): GenerateCustomGroupViewModel {
        if (this._generateCustomGroupViewModel === undefined) {
            this._generateCustomGroupViewModel = new GenerateCustomGroupViewModel();
        }
        return this._generateCustomGroupViewModel;
    }

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

        const viewName = this.stepCollection.getStepView(this.groupingOption, stepNo);
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
            this.set("selectedClassDefinitionViewModel", this.bandClassDefinitionViewModel);
            break;

        case GroupingMethod.TopMiddleLowest:
            this.set("selectedClassDefinitionViewModel", this.topMiddleLowestBandClassDefinitionViewModel);
            break;

        case GroupingMethod.Language:
            this.set("selectedClassDefinitionViewModel", this.languageClassDefinitionViewModel);
            break;

        case GroupingMethod.Preallocated:
            this.set("selectedClassDefinitionViewModel", this.preAllocatedClassDefinitionViewModel);
            break;

        default:
            this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
            break;
        }

        this.selectedClassDefinitionViewModel.loadOptions();
    }

    showStudentGroupingOption = (
        joinedStudentsCell: HTMLTableCellElement,
        separatedStudentsCell: HTMLTableCellElement) => {

        this.pairedStudentsControl.createStudentSetContainer(joinedStudentsCell, this.classesDefn.testFile.isUnisex);
        this.separatedStudentsControl
            .createStudentSetContainer(separatedStudentsCell, this.classesDefn.testFile.isUnisex);
    }

    showAllClasses = (e: any) => {
        this.generateCustomGroupViewModel.showAllClasses();
        this.set("hasHiddenClasses", false);
        kendo.bind($("#custom-group-container"), this);
    }

    hideClass = (e: any) => {
        this.generateCustomGroupViewModel.hideClass(this.commonUtils.getUid(e.target.id));
        this.set("hasHiddenClasses", true);
        kendo.bind($("#custom-group-container"), this);
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

    studentLeavingOptionChanged = (e: any) => {
        if (this.studentLeavingOption) {
            this.editLeavingStudents();
        } else {
            this.set("leavingStudentCount", 0);
            this.setStudentCount();
        }
    }


    private setStudentCount = () => {
        var value = this.classesDefn.genderStudentCount(this.gender) - this.leavingStudentsCount;
        this.set("studentCount", value);
        this.selectedClassDefinitionViewModel.studentCount = value;
        this.validateStudentCount();
    }

    editLeavingStudents = () => {
        const studentSelector = new StudentSelector(20);
        studentSelector.openDialog(document.getElementById("popup-window-container"),
            this.classesDefn.genderStudents(this.gender),
            this.leavingStudents,
            (students) => {
                
                this.leavingStudents = students;
                this.set("leavingStudentsCount", this.leavingStudents.length);
                this.setStudentCount();
            },
            30);
    }

    saveClasses() {
        const bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        this.groupingHelper.saveClasses(bandSet);
    }

    generateClasses() {
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        const students = Enumerable.From(this.classesDefn.genderStudents(this.genderOption))
                .Except(this.leavingStudents, x => x.studentId)
                .ToArray();
        
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
                students,
                this.joinedStudents,
                this.separatedStudents);
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
                students,
                this.joinedStudents,
                this.separatedStudents);
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

        case GroupingMethod.Preallocated:
            bandSet.groupType = GroupingMethod.MixedAbility;
            bandSet.bands[0].groupType = GroupingMethod.MixedAbility;
            bandSet.bands[0].streamType = this.streamType;
            bandSet.bands[0].mixBoysGirls = this.mixGirlsBoysOption;

            for (let classItem of bandSet.bands[0].classes) {
                this.groupingHelper.calculateTotalScore(classItem.students, this.streamType);
            }
            bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName,
                bandSet.bands[0].students,
                this.joinedStudents,
                this.separatedStudents,
                false);
            break;

        default:
            bandSet.groupType = GroupingMethod.Streaming;
            bandSet.bands[0].groupType = this.groupingOption;
            bandSet.bands[0].streamType = this.streamType;
            bandSet.bands[0].mixBoysGirls = this.mixGirlsBoysOption;
            bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName,
                students,
                this.joinedStudents,
                this.separatedStudents);
            break;
        }

        this.generateCustomGroupViewModel.showClasses(bandSet);
    };

    reset = () => {
        this.preAllocatedBandset = this.classesDefn.createBandSet("class", this.studentCount);
    

       // this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
    }

    //
    setDatasource = (test, results, languages) => {
        var testInfo = new TestFile();
        testInfo.set(test, results, languages);
        this.isCoedSchool = testInfo.isUnisex;
        this.studentCount = testInfo.studentCount - this.leavingStudentsCount;

        this.studentCountInAllClasses = testInfo.studentCount - this.leavingStudentsCount;
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

    onClassCountChanged = () => {
        var vm = this.selectedClassDefinitionViewModel as IClassSetting;
        if (vm) {
            vm.onClassCountChanged(this.classCount);
        }
    }

    onBandCountChanged = () => {
        var vm = this.selectedClassDefinitionViewModel as IBandSetting;
        if (vm) {
            vm.onBandCountChanged(this.bandCount);
        }
    }

    onStudentCountInAllClassesChanged = (count: number) => {
        // set the total number students in all classes
        this.set("studentCountInAllClasses", count);
        this.validateStudentCount();

    }

    validateStudentCount = (): boolean => {
        if (this.studentCount !== this.studentCountInAllClasses) {
            this.set("hasErrors", true);
            this.set("errorMessage",
                "The total number students in all classes doesn't match with number of students in test file");
            return false;
        }

        this.set("hasErrors", false);
        this.set("errorMessage", "");
        return true;
    }
}