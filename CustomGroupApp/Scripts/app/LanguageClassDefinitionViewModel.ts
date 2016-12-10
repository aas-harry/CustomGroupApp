class LanguageClassDefinitionViewModel extends kendo.data.ObservableObject
    implements ICustomGroupViewModel {
    constructor(public classesDefn: ClassesDefinition, onStudentCountChangedEvent: (classCount: number) => any) {
        super();

        this.reset();

        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }

    numberOfLanguage = 1;
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

    reset() {
        this.bandSet = this.classesDefn.createBandSet("Band", this.classesDefn.studentCount, 1);
        this.studentCount = this.classesDefn.studentCount;
        this.set("bandCount", 3);
        this.set("classCount", 1);
    }

    loadOptions(): boolean {
        this.createLanguageSet();
        this.addBandsAndClassesControl();

        this.set("showStudentLanguageList", false);
        this.showStudentLanguagePreferences(false);

        $("#upload-language-upload-control").hide();
        return true;
    }

    getBandSet() {
        return this.bandSet;
    }

    // ReSharper disable UnusedParameter
    genderChanged = (gender: Gender, studentCount: number) => {

    }
    // ReSharper restore UnusedParameter

    showStudentLanguageCaption = "View Students";

    toggleStudentLanguagePreferences = () => {
        this.set("showStudentLanguageList", !this.showStudentLanguageList);
        this.showStudentLanguagePreferences(this.showStudentLanguageList);    
    }

    showStudentLanguagePreferences = (showList) => {
    
        if (showList) {
            this.set("showStudentLanguageCaption", "Hide Students");
            this.kendoHelper.createStudentLanguageGrid("student-language-preferences-list", this.classesDefn.students, true);
        } else {
            this.set("showStudentLanguageCaption", "Show Students");
        }
    }

    importStudents = () => {
        const container = document.getElementById("uploader-container");
        container.innerHTML = '<input type="file" id= "files" name= "files" />';
        this.kendoHelper.createUploadControl("files", `..\\Customgroup\\ImportStudentLanguages?id=${this.classesDefn.testFile.fileNumber}`, this.onUploadCompleted);    
        $("#upload-language-upload-control").show();

        this.set("showStudentLanguageList", false);
        this.showStudentLanguagePreferences(false);    
    };

    onUploadCompleted = (e: any): any => {
        if (e && e.response) {
            this.classesDefn.testFile.setStudentLanguagePrefs(e.response);
            this.classesDefn.setStudentLanguagePrefs();
            this.createLanguageSet();
            this.addBandsAndClassesControl();
        }
        $("#upload-language-upload-control").hide();
        this.set("showStudentLanguageList", true);
        this.showStudentLanguagePreferences(true);    
    }

    private createLanguageSet = () => {
        this.set("studentWithLanguagePrefCount",
            Enumerable.From(this.classesDefn.students).Count(x => x.hasLanguagePreferences));
        this.languageSets = [];

        if (this.numberOfLanguage === 1) {
            this.createOneLanguageClasses();
        } else {
            this.createTwoLanguageClasses();
        }
       
       
        this.set("hasStudentLanguagePreferences", this.studentWithLanguagePrefCount > 0);
    }

    private createOneLanguageClasses = () => {
        for (let s of this.classesDefn.students) {
            let matched = Enumerable.From(this.languageSets)
                .FirstOrDefault(null, x => x.isEqual(s.langPref1, s.langPref2));

            if (matched == null) {
                matched = new LanguageSet(s.langPref1, null, true);
                this.languageSets.push(matched);
            }
            matched.addStudent(s);
        }
    }
    private createTwoLanguageClasses = () => {
        for (let s of this.classesDefn.students) {
            let matched = Enumerable.From(this.languageSets)
                .FirstOrDefault(null, x => x.isEqual(s.langPref1, s.langPref2));

            if (matched == null) {
                matched = new LanguageSet(s.langPref1, s.langPref2);
                this.languageSets.push(matched);
            }
            matched.addStudent(s);
        }
    }

    hasStudentLanguagePreferences = false;
    showStudentLanguageList = false;
    studentWithLanguagePrefCount = 0;
    
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
            this.bandSet.bands[i].languageSet = item;
            i++;
        }

        this.bandTableControl.init("classes-settings-container", this.bandSet);
    };
}