class LanguageBandClassDefinitionViewModel extends kendo.data.ObservableObject
    implements IBandClassSettings {
    classes: kendo.data.ObservableArray = new kendo.data.ObservableArray(
        [
            { classNo: 1, studentCount: 1 }
        ]);
    constructor(public studentCount: number = 0) {
        super();
    }

    bandCount = 3;
    classCount = 1;
    languageSets : Array<LanguageSet> = [];

    getClasses = (): Array<number> => {
        var classes = new Array<number>();
        this.classes.forEach((val: any) => {
            var classCnt = $(`#class-${val.classNo}`).data("kendoNumericTextBox");
            classes.push(classCnt.value());
        });
        return classes;
    }

    bandSet = new BandSet(null, "custom", this.studentCount, 1);
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private bandNumericTextBoxes = new BandNumericTextBoxCollection();


    saveOptions(source: BandSet): boolean {
        return true;
    }

    loadOptions(source: BandSet): boolean {
        this.bandSet = source;
        this.bandCount = source.bands.length;
        this.bandNumericTextBoxes.initTable("#classes-settings-container", source.bands);

        return true;
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