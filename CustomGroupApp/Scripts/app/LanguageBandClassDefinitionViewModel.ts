class LanguageBandClassDefinitionViewModel extends kendo.data.ObservableObject
    implements IBandClassSettings {
    constructor(public studentCount: number = 0) {
        super();
    }

    bandCount = 3;
    classCount = 1;
    languageSets : Array<LanguageSet> = [];

    bandSet = new BandSet(null, "custom", this.studentCount, 1);
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private bandTableControl = new BandTableControl();

    saveOptions(source: BandSet): boolean {
        return true;
    }

    loadOptions(source: BandSet): boolean {
        this.bandSet = source;
        super.set("bandCount", source.bands.length);
        this.bandTableControl.init("classes-settings-container", source);
        return true;
    }

    getBandSet() {
        return this.bandSet;
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

        this.bandSet.createBands("language", this.studentCount, this.languageSets.length);
        let i = 0;
        for (let item of this.languageSets) {
            this.bandSet.bands[i].bandName = item.description;
            this.bandSet.bands[i].studentCount = item.count;
            this.bandSet.bands[i].setClassCount(1);
            i++;
        }
    }

    studentWithLanguagePrefCount = 0;
    // ReSharper disable once InconsistentNaming
    _students: Array<StudentClass> = [];
}