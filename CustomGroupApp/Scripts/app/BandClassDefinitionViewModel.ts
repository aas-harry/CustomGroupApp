class TopMiddleLowestBandClassDefinitionViewModel extends kendo.data.ObservableObject
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

    getClasses = (): Array<number> => {
        var classes = new Array<number>();
        this.classes.forEach((val: any) => {
            var classCnt = $(`#class${val.classNo}`).data("kendoNumericTextBox");
            classes.push(classCnt.value());
        });
        return classes;
    }

    private bandSet = new TopMiddleLowestBandSet(null, this.studentCount);
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
}

class BandClassDefinitionViewModel extends kendo.data.ObservableObject implements IBandClassSettings{
    classes: kendo.data.ObservableArray = new kendo.data.ObservableArray(
        [
            { classNo: 1, studentCount: 1 }
        ]);
    constructor(public studentCount: number = 0) {
        super();
    }

    bandCount = 1;
    classCount = 1;
    
    getClasses = (): Array<number> => {
        var classes = new Array<number>();
        this.classes.forEach((val: any) => {
            var classCnt = $(`#class${val.classNo}`).data("kendoNumericTextBox");
            classes.push(classCnt.value());
        });
        return classes;
    }

    private bandSet : BandSet;
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private bandNumericTextBoxes = new BandNumericTextBoxCollection();


    onBandCountChange = () => {
        this.bandSet.createBands("custom", this.studentCount, this.bandCount);
        this.bandNumericTextBoxes.initTable("#classes-settings-container", this.bandSet.bands);
    }

    private createNumberInputField = (elementId: string): HTMLElement => {
        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style","width: 100px");
        element.id = elementId;
        return element;
    };

    saveOptions(source: BandSet): boolean {
        return true;
    }

    loadOptions(source: BandSet): boolean {
        this.bandSet = source;
        this.bandCount = source.bands.length;
        this.bandNumericTextBoxes.initTable("#classes-settings-container", source.bands);
        return true;
    }
}
