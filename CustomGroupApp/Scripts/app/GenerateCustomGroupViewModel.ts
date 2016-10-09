

class GenerateCustomGroupViewModel extends kendo.data.ObservableObject{
    constructor() {
        super();
    }

    private bandSet: BandSet;
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private customClassGridCollection = new CustomClassGridCollection();
    private hiddenClasses : Array<string> = [];
    
    showClasses(source: BandSet): boolean {
        debugger;
        this.bandSet = source;
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
    
}