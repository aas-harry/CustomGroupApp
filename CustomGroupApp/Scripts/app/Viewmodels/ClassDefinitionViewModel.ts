class ClassDefinitionViewModel extends kendo.data.ObservableObject
    implements IBandClassSettings {

    constructor(public studentCount: number = 0, onStudentCountChangedEvent: (classCount: number) => any) {
        super();
        super.init(this);

        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.classTableControl = new ClassTableControl(this.callOnStudentCountChangedEvent);
    }

    bandSet: BandSet;
    classCount = 1;

    private parentContainer: CustomGroupViewModel;
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private classTableControl : ClassTableControl;

    onStudentCountChangedEvent: (classCount: number) => any;
    importStudentLanguages = () => { };

    onClassCountChanged = () => {
        this.bandSet.bands[0].setClassCount(this.classCount);
        this.classTableControl.init("classes-settings-container", this.bandSet);

        const onStudentCountChangedEvent = this.onStudentCountChangedEvent;
        if (onStudentCountChangedEvent != null) {
            onStudentCountChangedEvent(Enumerable.From(this.bandSet.bands[0].classes).Sum(x=> x.count));
        }
    }

    callOnStudentCountChangedEvent = () => {
        const onStudentCountChangedEvent = this.onStudentCountChangedEvent;
        if (onStudentCountChangedEvent != null) {
            onStudentCountChangedEvent(Enumerable.From(this.bandSet.bands[0].classes).Sum(x => x.count));
        }
    };

    saveOptions(source: BandSet): boolean {

        return true;
    }

    loadOptions(source: BandSet): boolean {
        this.bandSet = source;
        super.set("classCount", source.bands[0].classes.length);
        this.classTableControl.init("classes-settings-container", this.bandSet);
        return true;
    }

    getBandSet(): BandSet {
        return this.bandSet;
    }

    showStudentLanguagePreferences = () => { };

}
