class LanguageBandClassDefinitionViewModel extends kendo.data.ObservableObject
    implements IBandClassSettings {
    constructor(public studentCount: number = 0, onStudentCountChangedEvent: (classCount: number) => any) {
        super();

        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }

    bandCount = 3;
    classCount = 1;
    languageSets : Array<LanguageSet> = [];

    bandSet: BandSet;
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private bandTableControl: BandTableControl;
    private hasBandSetInitialised = false;

    saveOptions(source: BandSet): boolean {
        return true;
    }

    loadOptions(source: BandSet): boolean {
        this.bandSet = source;
        super.set("bandCount", source.bands.length);

        if (this.hasBandSetInitialised === false) {
            this.bandSet.createBands("language", this.studentCount, this.languageSets.length);
            let i = 0;
            for (let item of this.languageSets) {
                this.bandSet.bands[i].bandName = item.description;
                this.bandSet.bands[i].studentCount = item.count;
                this.bandSet.bands[i].students = item.students;
                this.bandSet.bands[i].setClassCount(1);
                i++;

                this.hasBandSetInitialised = true;
            }
        }

        this.bandTableControl.init("classes-settings-container", source);
        return true;
    }

    getBandSet() {
        return this.bandSet;
    }

    showStudentLanguageCaption = "View Students";
    showStudentLanguagePreferences = () => {
        this.set("showStudentLanguageList", ! this.showStudentLanguageList);
        if (this.showStudentLanguageList) {
            this.set("showStudentLanguageCaption", "Hide Students");
            this.kendoHelper.createStudentLanguageGrid("student-language-preferences-list", this._students, true);
        } else {
            this.set("showStudentLanguageCaption", "Show Students");
        }
    }

    set students(value: Array<StudentClass>) {
        this._students = value;
        this.studentWithLanguagePrefCount = Enumerable.From(value).Count(x => x.hasLanguagePreferences);

        this.languageSets = [];
        for (let s of this._students) {
            let matched = Enumerable.From(this.languageSets)
                .FirstOrDefault(null, x => x.isEqual(s.langPref1, s.langPref2));

            if (matched == null) {
                matched = new LanguageSet(s.langPref1, s.langPref2);
                this.languageSets.push(matched);
            }
            matched.addStudent(s);
        }
    }

    showStudentLanguageList = false;
    studentWithLanguagePrefCount = 0;
    // ReSharper disable once InconsistentNaming
    _students: Array<StudentClass> = [];

    onStudentCountChangedEvent: (classCount: number) => any;
    callOnStudentCountChangedEvent = () => {
        const onStudentCountChangedEvent = this.onStudentCountChangedEvent;
        if (onStudentCountChangedEvent != null) {
            onStudentCountChangedEvent(Enumerable.From(this.bandSet.bands).SelectMany(b => b.classes).Sum(x => x.count));
        }
    };
}