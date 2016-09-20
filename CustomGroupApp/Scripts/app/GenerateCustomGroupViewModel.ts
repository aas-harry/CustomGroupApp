class GenerateCustomGroupViewModel extends kendo.data.ObservableObject implements IBandClassSettings{
    private bandSet: BandSet;
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private customClassGridCollection = new CustomClassGridCollection();


    saveOptions(source: BandSet): boolean {
        return true;
    }

    loadOptions(source: BandSet): boolean {
        this.bandSet = source;
        super.set("bandCount", source.bands.length);
        this.customClassGridCollection.initTable("#classes-settings-container", source.bands);
        return true;
    }
}