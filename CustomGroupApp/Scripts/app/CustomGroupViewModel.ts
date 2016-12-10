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
    private testInfo: TestFile;
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
    private _schoolGroupClassDefinitionViewModel: SchoolGroupClassDefinitionViewModel;
    private classViewModels = new Array<ICustomGroupViewModel>();
    private _generateCustomGroupViewModel: GenerateCustomGroupViewModel;
    private _selectedLanguageOption = 1;
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

    get selectedLanguageOption(): number {
        return this._selectedLanguageOption;
    }

    set selectedLanguageOption(val: number) {
        this._selectedLanguageOption = val;
    }

    selectedGroupingOption = "MixedAbility";
    selectedStreamingOption = "OverallAbilty";
    selectedTopClassGroupingOption = "Streaming";
    selectedLowestClassGroupingOption = "Streaming";

    mixGirlsBoysOption = false;
    splitOtherGroup = true;
    currentGroupStep = 1;
    isSaved = false;
    isLastStep = false;
    isFirstStep = true;
    isCoedSchool = true;
    studentCountInAllClasses = 0;
    incorrectTotalStudentsInClass = false;
    studentCountInAllClassesColor = "black";
    diffTotalStudentsInClass : string;
    classCount = 3;
    bandCount = 2;
    groupName: string;
    selectedClassDefinitionViewModel: CustomGroupBaseViewModel;
    // joinedStudents: Array<StudentSet> = [];
    // separatedStudents: Array<StudentSet> = [];
    errorMessage: string;
    hasErrors = false;
    rootSite: string;
    hasHiddenClasses = false;
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
            this.classViewModels.push(this._classDefinitionViewModel);
        }
        return this._classDefinitionViewModel;
    }

    get preAllocatedClassDefinitionViewModel(): PreallocatedClassDefinitionViewModel {
        if (this._preAllocatedClassDefinitionViewModel === undefined) {
            this._preAllocatedClassDefinitionViewModel = new
                PreallocatedClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
            this.classViewModels.push(this._preAllocatedClassDefinitionViewModel);
        }
        return this._preAllocatedClassDefinitionViewModel;
    }

    get topMiddleLowestBandClassDefinitionViewModel(): TopMiddleLowestBandClassDefinitionViewModel {
        if (this._topMiddleLowestBandClassDefinitionViewModel === undefined) {
            this._topMiddleLowestBandClassDefinitionViewModel = new
                TopMiddleLowestBandClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
            this.classViewModels.push(this._topMiddleLowestBandClassDefinitionViewModel);
        }
        return this._topMiddleLowestBandClassDefinitionViewModel;
    }

    get bandClassDefinitionViewModel(): BandClassDefinitionViewModel {
        if (this._bandClassDefinitionViewModel === undefined) {
            this._bandClassDefinitionViewModel = new
                BandClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
            this.classViewModels.push(this._bandClassDefinitionViewModel);
        }
        return this._bandClassDefinitionViewModel;
    }

    get languageClassDefinitionViewModel(): LanguageClassDefinitionViewModel {
        if (this._languageClassDefinitionViewModel === undefined) {
            this._languageClassDefinitionViewModel = new
                LanguageClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
            this.classViewModels.push(this._languageClassDefinitionViewModel);
        }

        return this._languageClassDefinitionViewModel;
    }

    get schoolGroupClassDefinitionViewModel(): SchoolGroupClassDefinitionViewModel {
        if (this._schoolGroupClassDefinitionViewModel === undefined) {
            this._schoolGroupClassDefinitionViewModel = new
                SchoolGroupClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
            this.classViewModels.push(this._schoolGroupClassDefinitionViewModel);
        }
        return this._schoolGroupClassDefinitionViewModel;
    }

    get generateCustomGroupViewModel(): GenerateCustomGroupViewModel {
        if (this._generateCustomGroupViewModel === undefined) {
            this._generateCustomGroupViewModel = new GenerateCustomGroupViewModel(this);
        }
        return this._generateCustomGroupViewModel;
    }

    private nextStep = () => {
        super.set("currentGroupStep", this.currentGroupStep + 1);
        this.callGetViewStep(this.currentGroupStep, this.containerElementName);
    };
    private previousStep = () => {
        this.set("hasErrors", false);
        this.set("errorMessage", "");

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
            url: "..\\Customgroup\\" + viewName,
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
            this.languageClassDefinitionViewModel.numberOfLanguage = this._selectedLanguageOption;
            break;

        case GroupingMethod.Preallocated:
            this.set("selectedClassDefinitionViewModel", this.preAllocatedClassDefinitionViewModel);
            break;

        case GroupingMethod.SchoolGroup:
            this.set("selectedClassDefinitionViewModel", this.schoolGroupClassDefinitionViewModel);
            break;

        default:
            this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
            break;
        }

        this.selectedClassDefinitionViewModel.loadOptions();
    }

    saveStudentSets = () => {
        let studentSets = Enumerable.From(this.pairedStudentsControl.studentSets)
            .Union(this.separatedStudentsControl.studentSets)
            .ToArray();
        this.groupingHelper.updateStudentSets(this.testInfo.fileNumber, studentSets, (e) => {});
    }

    loadStudentSets = () => {
        const self = this;
        this.groupingHelper.getStudentSets(this.testInfo.fileNumber,
            (status, results) => {
                const joinedStudents = this.convertStudentSets(results, StudentSetType.Paired,2 );
                const separatedStudents = this.convertStudentSets(results, StudentSetType.Separated,2);

                self.pairedStudentsControl.loadStudentSets(joinedStudents);
                self.separatedStudentsControl.loadStudentSets(separatedStudents);
            });
    }

    private convertStudentSets = (results: any, type: StudentSetType, minStudents: number) => {
        const ret = new Array<StudentSet>();
        for (let s of results) {
            if (s.groupType !== type) {
                continue;
            }
            const studentSet = new StudentSet(type);
            studentSet.rowId = s.rowId;
            studentSet.type = s.groupType;
            const students = this.getStudents(s.students);
            if (students && students.length >= minStudents) {
                studentSet.students = students;
                ret.push(studentSet);
            }
        }
        return ret;
    }

    private getStudents = (studentIds: Array<Number>) => {
        var lookup = Enumerable.From(studentIds).ToDictionary(x => x, x => x);
        var students = new Array<StudentClass>();
        for (let s of this.classesDefn.students) {
            if (lookup.Contains(s.studentId)) {
                students.push(s);
            }
        }
        return students;
    }

    showStudentGroupingOption = (
        joinedStudentsCell: HTMLTableCellElement,
        separatedStudentsCell: HTMLTableCellElement) => {
     
        this.pairedStudentsControl.createStudentSetContainer(joinedStudentsCell, StudentSetType.Paired, this.classesDefn.testFile.isUnisex);
        this.separatedStudentsControl.createStudentSetContainer(separatedStudentsCell, StudentSetType.Separated, this.classesDefn.testFile.isUnisex);
    }

    showAllClasses = (e: any) => {
        this.generateCustomGroupViewModel.showAllClasses();
        this.set("hasHiddenClasses", false);
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
        const studentSelector = new StudentSelector();
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
        const self = this;
        const bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        this.groupingHelper.saveClasses(bandSet,
            (status, classItems) => {
                const element = document.getElementById("message-text") as HTMLElement;
                element.textContent = "Custom groups have been saved successfully.";

                for (let classItem of classItems) {
                    self.testInfo.customGroups.push(classItem);
                }
                self.set("isSaved", status);
            });
    }

    openCustomGroups = () => {
        $.ajax({
            url: "..\\Customgroup\\CustomGroupListView",
            type: 'POST',
            success(html) {
                $("#reportContent").replaceWith(html);
                $(window).trigger('resize');
            }

        });
    }

    exportToCsv = () => {
        this.groupingHelper.exportGroupSet(this.classesDefn.testFile,
            this.selectedClassDefinitionViewModel.getBandSet(), "csv",
            (status, msg) => { });
    }

    exportToExcel = () => {
        this.groupingHelper.exportGroupSet(this.classesDefn.testFile,
            this.selectedClassDefinitionViewModel.getBandSet(), "excel",
            (status, msg) => { });
    }

    downloadLanguagePreferenceTemplate = () => {
        this.groupingHelper.downloadTemplateFile("DownloadLanguagePreferenceTemplate", this.classesDefn.testFile.fileNumber);
    }

    downloadPreAllocatedClassTemplate = () => {
        this.groupingHelper.downloadTemplateFile("DownloadPreAllocatedClassTemplate", this.classesDefn.testFile.fileNumber);
    }

    downloadSchoolGroupTemplate = () => {
        this.groupingHelper.downloadTemplateFile("DownloadSchoolGroupTemplate", this.classesDefn.testFile.fileNumber);
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
                this.pairedStudentsControl.studentSets,
                this.separatedStudentsControl.studentSets);
            break;

        case GroupingMethod.TopMiddleLowest:
            bandSet.groupType = GroupingMethod.Streaming;
            bandSet.bands[0].groupType = this.topClassGroupingOption;
            bandSet.bands[0].bandType = BandType.Top;

            bandSet.bands[1].groupType = GroupingMethod.MixedAbility; // Middle class always using mixed ability
            bandSet.bands[0].bandType = BandType.Middle;

            bandSet.bands[2].groupType = this.lowestClassGroupingOption;
            bandSet.bands[0].bandType = BandType.Lowest;
            for (let band of bandSet.bands) {
                band.streamType = this.streamType;
                band.mixBoysGirls = this.mixGirlsBoysOption;
            }
            bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName,
                students,
                this.pairedStudentsControl.studentSets,
                this.separatedStudentsControl.studentSets);
            break;

        case GroupingMethod.Language:


            for (let band of bandSet.bands) {
                const studentCountInClasses = Enumerable.From(band.classes).Sum(x => x.count);
                let needMoreStudents = studentCountInClasses - band.studentCount;
                if (needMoreStudents > 0) {
                    // Need to get studens in other bands
                    for (let otherBand of bandSet.bands) {
                        if (otherBand.uid === band.uid) {
                            continue;
                        }
                        const totalStudents = Enumerable.From(otherBand.classes).Sum(x => x.count);
                        if (totalStudents >= otherBand.studentCount) {
                            continue;
                        }

                        const newStudents = this.groupingHelper.getStudentsFromOtherBand(otherBand,
                            needMoreStudents,
                            (s) => s.langPref2 === band.languageSet.language1);
                        if (newStudents.length > 0) {
                            band.studentCount += newStudents.length;
                            needMoreStudents -= newStudents.length;
                            for (let s of newStudents) {
                                band.students.push(s);
                            }
                        }
                    }
                }
                if (needMoreStudents > 0) {
                    // Need to get studens in other bands
                    for (let otherBand of bandSet.bands) {
                        if (otherBand.uid === band.uid) {
                            continue;
                        }
                        const totalStudents = Enumerable.From(otherBand.classes).Sum(x => x.count);
                        if (totalStudents <= otherBand.studentCount) {
                            continue;
                        }

                        const newStudents = this.groupingHelper.getStudentsFromOtherBand(otherBand,
                            needMoreStudents,
                            (s) => s.langPref3 === band.languageSet.language1);
                        if (newStudents.length > 0) {
                            band.studentCount += newStudents.length;
                            needMoreStudents -= newStudents.length;
                            for (let s of newStudents) {
                                band.students.push(s);
                            }
                        }
                    }
                }
            }

            for (let band of bandSet.bands) {
                band.groupType = GroupingMethod.MixedAbility;
                band.bandType = BandType.Language;
                band.streamType = this.streamType;
                band.mixBoysGirls = this.mixGirlsBoysOption;
                band.prepare(this.groupName ? this.groupName + " " + band.bandName : band.bandName,
                    band.students,
                    this.pairedStudentsControl.studentSets,
                    this.separatedStudentsControl.studentSets);
            }
            break;

        case GroupingMethod.SchoolGroup:
        {
            for (let band of bandSet.bands) {
                band.groupType = GroupingMethod.MixedAbility;
                band.bandType = BandType.SchoolGroup;
                band.streamType = this.streamType;
                band.mixBoysGirls = this.mixGirlsBoysOption;
                band.prepare(this.groupName ? this.groupName + " " + band.bandName : band.bandName,
                    band.students,
                    this.pairedStudentsControl.studentSets,
                    this.separatedStudentsControl.studentSets);
            }
            break;
        }

        case GroupingMethod.Preallocated:
            bandSet.groupType = GroupingMethod.MixedAbility;
            bandSet.bands[0].groupType = GroupingMethod.MixedAbility;
            bandSet.bands[0].bandType = BandType.None;
            bandSet.bands[0].streamType = this.streamType;
            bandSet.bands[0].mixBoysGirls = this.mixGirlsBoysOption;

            for (let classItem of bandSet.bands[0].classes) {
                this.groupingHelper.calculateTotalScore(classItem.students, this.streamType);
            }
            bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName,
                bandSet.bands[0].students,
                this.pairedStudentsControl.studentSets,
                this.separatedStudentsControl.studentSets,
                false);
            break;

        default:
            bandSet.groupType = GroupingMethod.Streaming;
            bandSet.bands[0].groupType = this.groupingOption;
            bandSet.bands[0].bandType = BandType.None;
            bandSet.bands[0].streamType = this.streamType;
            bandSet.bands[0].mixBoysGirls = this.mixGirlsBoysOption;
            bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName,
                students,
                this.pairedStudentsControl.studentSets,
                this.separatedStudentsControl.studentSets);
            break;
        }

        this.generateCustomGroupViewModel.showClasses(bandSet);
    };

    reset = () => {
        this.preAllocatedBandset = this.classesDefn.createPreAllocatedClassBandSet("class", this.studentCount);
        this.pairedStudentsControl.clear();
        this.separatedStudentsControl.clear();
        for (let s of this.classesDefn.students) {
            s.setClass(null);
        }

        for (let vm of this.classViewModels) {
            if (vm) {
                vm.reset();
            }
        }


        // this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
    }

    //
    setDatasource = (testFile: TestFile, groupSetIds: Array<number> = []) => {
        const regroup = groupSetIds && groupSetIds.length > 0;
        this.testInfo = testFile;
        this.isCoedSchool = this.testInfo.isUnisex;

        const groupSetStudents = new Array<Student>();
        if (regroup) {

            // Get the students in the class
            for (let groupSetId of groupSetIds) {
                const groupSet = Enumerable.From(testFile.customGroups)
                    .FirstOrDefault(null, x => x.groupSetid === groupSetId);
                if (groupSet) {
                    const studentLookup = Enumerable.From(groupSet.students).ToDictionary(x => x.studentId, x => x);
                    for (let s of testFile.students) {
                        if (studentLookup.Contains(s.studentId)) {
                            groupSetStudents.push(s);
                        }
                    }
                }
            }


            this.studentCount = groupSetStudents.length;
            this.studentCountInAllClasses = groupSetStudents.length;


        } else {
            this.studentCount = this.testInfo.studentCount - this.leavingStudentsCount;
            this.studentCountInAllClasses = this.testInfo.studentCount - this.leavingStudentsCount;
        }


        this.classesDefn = new ClassesDefinition(this.testInfo, regroup ? groupSetStudents : null);
        this.pairedStudentsControl = new
            StudentSetListControl("Paired",
                this.classesDefn.students,
                document.getElementById("popup-window-container"));

        this.separatedStudentsControl = new
            StudentSetListControl("Separated",
                this.classesDefn.students,
                document.getElementById("popup-window-container"));

        this.reset();
    };

    onClassCountChanged = (e) => {
        var vm = this.selectedClassDefinitionViewModel as IClassSetting;
        if (vm && e.sender) {
            this.classCount = e.sender.value();
            vm.onClassCountChanged(this.classCount);
        }
    }

    onBandCountChanged = (e) => {
        var vm = this.selectedClassDefinitionViewModel as IBandSetting;
        if (vm && e.sender) {
            this.bandCount = e.sender.value();
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
            var diff = Math.abs(this.studentCount - this.studentCountInAllClasses);
            this.set("incorrectTotalStudentsInClass", true);
            this.set("studentCountInAllClassesColor", "red");
            this.set("hasErrors", true);
            const studentText = diff === 1 ? "student" : "students";
            this.set("errorMessage", "Please fix the errors before continue to the next step.");
            if (this.studentCount > this.studentCountInAllClasses) {
                this.set("diffTotalStudentsInClass", ` (add ${diff} more ` + studentText + `)`);
            } else {
                this.set("diffTotalStudentsInClass", ` (remove ${diff} ` + studentText + `)`);
            }
            return false;
        }
        this.set("incorrectTotalStudentsInClass", false);
        this.set("studentCountInAllClassesColor", "black");

        this.set("hasErrors", false);
        this.set("errorMessage", "");
        return true;
    }
}