class LanguageClassDefinitionViewModel extends kendo.data.ObservableObject
    implements ICustomGroupViewModel {
    constructor(public classesDefn: ClassesDefinition, onStudentCountChangedEvent: (classCount: number) => any) {
        super();

        this.bandSet = classesDefn.createBandSet("Band", classesDefn.studentCount, 1);
        this.studentCount = classesDefn.studentCount;

        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }

    bandCount = 3;
    classCount = 1;
    languageSets : Array<LanguageSet> = [];

    // ReSharper disable once InconsistentNaming
    private _studentCount = 0;
    get studentCount(): number {
        return this._studentCount;
    }
    set studentCount(value: number) {
        this.bandSet.studentCount = value;
        this._studentCount = value;
    }

    get studentInAllClassesCount(): number {
        return Enumerable.From(this.bandSet.bands).SelectMany(b => b.classes).Sum(x => x.count);
    }
    set studentInAllClassesCount(value: number) {
    }
    
    bandSet: BandSet;
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private bandTableControl: BandTableControl;
    private hasBandSetInitialised = false;

    saveOptions(): boolean {
        return true;
    }

    loadOptions(): boolean {
        
        this.createLanguageSet();
        this.addBandsAndClassesControl();

        $("#upload-language-upload-control").hide();
        return true;
    }

    getBandSet() {
        return this.bandSet;
    }

    genderChanged = (gender: Gender, studentCount: number) => {
    }

    showStudentLanguageCaption = "View Students";
    showStudentLanguagePreferences = () => {
        this.set("showStudentLanguageList", ! this.showStudentLanguageList);
        if (this.showStudentLanguageList) {
            this.set("showStudentLanguageCaption", "Hide Students");
            this.kendoHelper.createStudentLanguageGrid("student-language-preferences-list", this.classesDefn.students, true);
        } else {
            this.set("showStudentLanguageCaption", "Show Students");
        }
    }

    importStudents = () => {
        this.kendoHelper.createUploadControl("files", `Customgroup\\ImportStudentLanguages?id=${this.classesDefn.testFile.fileNumber}`, this.onUploadCompleted);    
        $("#upload-language-upload-control").show();
        this.set("showStudentLanguageList", false);
    };

    onUploadCompleted = (e: any): any => {
        if (e && e.response) {
            this.classesDefn.testFile.setStudentLanguagePrefs(e.response);
            this.createLanguageSet();
            this.addBandsAndClassesControl();
            this.set("showStudentLanguageList", true);
            this.set("showStudentLanguageCaption", "Hide Students");
        }
        $("#upload-language-upload-control").hide();
    }

    private createLanguageSet = () => {
        this.studentWithLanguagePrefCount = Enumerable.From(this.classesDefn.students).Count(x => x.hasLanguagePreferences);
        this.languageSets = [];

        for (let s of this.classesDefn.students) {
            let matched = Enumerable.From(this.languageSets)
                .FirstOrDefault(null, x => x.isEqual(s.langPref1, s.langPref2));

            if (matched == null) {
                matched = new LanguageSet(s.langPref1, s.langPref2);
                this.languageSets.push(matched);
            }
            matched.addStudent(s);
        }
        this.set("hasStudentLanguagePreferences", this.studentWithLanguagePrefCount > 0);
    }

    hasStudentLanguagePreferences = false;

   
    showStudentLanguageList = false;
    studentWithLanguagePrefCount = 0;
    // ReSharper disable once InconsistentNaming
   

    onStudentCountChangedEvent: (classCount: number) => any;
    callOnStudentCountChangedEvent = () => {
        const onStudentCountChangedEvent = this.onStudentCountChangedEvent;
        if (onStudentCountChangedEvent != null) {
            onStudentCountChangedEvent(this.studentInAllClassesCount);
        }
    };

    addBandsAndClassesControl = () => {
        this.bandSet.createBands("language", this.studentCount, this.languageSets.length);
        let i = 0;
        for (let item of this.languageSets) {
            this.bandSet.bands[i].bandName = item.description;
            this.bandSet.bands[i].studentCount = item.count;
            this.bandSet.bands[i].students = item.students;
            this.bandSet.bands[i].setClassCount(1);
            this.bandSet.bands[i].commonBand = item.nolanguagePrefs;
            i++;
        }

        this.bandTableControl.init("classes-settings-container", this.bandSet);
    };
}