class GenerateCustomGroupViewModel extends kendo.data.ObservableObject {
    constructor(parentViewModel: CustomGroupViewModel) {
        super();

        this.parentViewModel = parentViewModel;
        this.customClassGridCollection = new CustomClassGridCollection();
        this.customClassGridCollection.hideClassCallback = this.onHideClass;
        this.customClassGridCollection.classChangedCallback = this.onClassChanged;
    }

    private parentViewModel: CustomGroupViewModel;
    private bandSet: BandSet;
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private customClassGridCollection: CustomClassGridCollection;

    private onHideClass = (classItem: ClassDefinition) => {
        this.parentViewModel.set("hasHiddenClasses", true);
    }

    private onClassChanged = (classItem: ClassDefinition) => {
    }

    showClasses(source: BandSet): boolean {
        this.bandSet = source;
        this.customClassGridCollection.initTable("#classes-settings-container", source.bands, false, []);
        return true;
    }

    showAllClasses = () => {
        this.customClassGridCollection.showAllClasses();
    }
}