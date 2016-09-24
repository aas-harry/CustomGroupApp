class BandClassDefinitionViewModel extends kendo.data.ObservableObject implements IBandClassSettings{
    constructor(public studentCount: number = 0) {
        super();
    }

    bandCount = 1;
    classCount = 1;
    
    private bandSet : BandSet;
    private bandTableControl = new BandTableControl();

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
}
