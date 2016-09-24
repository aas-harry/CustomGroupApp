class TopMiddleLowestBandClassDefinitionViewModel extends kendo.data.ObservableObject
    implements IBandClassSettings {
    constructor(public studentCount: number = 0) {
        super();
    }

    bandCount = 3;
    classCount = 1;

    private bandSet = new TopMiddleLowestBandSet(null, this.studentCount);
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

    getBandSet(): BandSet {
        return this.bandSet;
    }
}