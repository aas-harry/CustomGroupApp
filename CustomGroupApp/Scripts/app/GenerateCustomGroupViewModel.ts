class GenerateCustomGroupViewModel extends kendo.data.ObservableObject implements IBandClassSettings{
    constructor(public studentCount: number = 0, onStudentCountChangedEvent: (classCount: number) => any) {
        super();

        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }

    private bandSet: BandSet;
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private customClassGridCollection = new CustomClassGridCollection();
    private bandTableControl: BandTableControl;
    private hiddenClasses : Array<string> = [];

    saveOptions(source: BandSet): boolean {
        return true;
    }

    loadOptions(source: BandSet): boolean {
        this.bandSet = source;
        super.set("bandCount", source.bands.length);
        this.customClassGridCollection.initTable("#classes-settings-container", source.bands);
        return true;
    }

    showAllClasses = () => {
        this.hiddenClasses = [];
        this.customClassGridCollection.initTable("#classes-settings-container", this.bandSet.bands);
    }

    hideClass = (uid: string) => {
        this.hiddenClasses.push(uid);

        this.customClassGridCollection.initTable("#classes-settings-container", this.bandSet.bands, this.hiddenClasses);
    }

    getBandSet() {
        return this.bandSet;
    }

    genderChanged = (gender: Gender, studentCount: number) => {
        this.studentCount = studentCount;
        this.bandSet.studentCount = studentCount;
        this.customClassGridCollection.initTable("#classes-settings-container", this.bandSet.bands);
    }

    showStudentLanguagePreferences = () => { };
    importStudents = () => { };

    onStudentCountChangedEvent: (classCount: number) => any;
    callOnStudentCountChangedEvent = () => {
        const onStudentCountChangedEvent = this.onStudentCountChangedEvent;
        if (onStudentCountChangedEvent != null) {
            onStudentCountChangedEvent(Enumerable.From(this.bandSet.bands).SelectMany(b => b.classes).Sum(x => x.count));
        }
    };
}