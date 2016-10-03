class BandClassDefinitionViewModel extends kendo.data.ObservableObject implements IBandClassSettings {
    constructor(public studentCount: number = 0, onStudentCountChangedEvent: (classCount: number) => any) {
        super();

        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }

    bandCount = 1;
    classCount = 1;

    private bandSet: BandSet;
    private bandTableControl: BandTableControl;


    onBandCountChange = () => {
        this.bandSet.createBands("Band", this.studentCount, this.bandCount);
        this.bandTableControl.init("classes-settings-container", this.bandSet);
    }

    saveOptions(source: BandSet): boolean {
        return true;
    }

    loadOptions(source: BandSet): boolean {
        this.bandSet = source;
        super.set("bandCount", source.bands.length);
        this.bandTableControl.init("classes-settings-container", source);
        return true;
    }

    getBandSet(): BandSet {
        return this.bandSet;
    }

    showStudentLanguagePreferences = () => {};
    importStudentLanguages = () => { };

    genderChanged = (gender: Gender, studentCount: number) => {
        this.bandSet.studentCount = studentCount;
        this.studentCount = studentCount;
        this.onBandCountChange();
    }

    onStudentCountChangedEvent: (classCount: number) => any;
    callOnStudentCountChangedEvent = () => {
        const onStudentCountChangedEvent = this.onStudentCountChangedEvent;
        if (onStudentCountChangedEvent != null) {
            onStudentCountChangedEvent(Enumerable.From(this.bandSet.bands).SelectMany(b=> b.classes).Sum(x => x.count));
        }
    };

}
