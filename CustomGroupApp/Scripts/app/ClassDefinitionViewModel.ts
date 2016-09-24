class ClassDefinitionViewModel extends kendo.data.ObservableObject
    implements IBandClassSettings {

    constructor(public studentCount: number = 0) {
        super();
        super.init(this);
    }

    bandSet: BandSet;
    classCount = 1;

    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private classTableControl = new ClassTableControl();


    onClassCountChange = () => {

        this.bandSet.bands[0].setClassCount(this.classCount);
        this.classTableControl.init("classes-settings-container", this.bandSet);
    }

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
}
