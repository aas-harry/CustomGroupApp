class ClassDefinitionViewModel extends kendo.data.ObservableObject {

    classes: kendo.data.ObservableArray = new kendo.data.ObservableArray(
        [
            { classNo: 1, studentCount: 11 },
            { classNo: 2, studentCount: 12 },
            { classNo: 3, studentCount: 13 },
            { classNo: 4, studentCount: 14 }
        ]);
    constructor() {
        super();
        super.init(this);
    }

    classCount = 4;

    onClassCountChange = () => {
        console.log("Class Cnt: ", this.classCount);
        this.classes.splice(0, this.classCount);
        for (let i = 1; i < this.classCount; i++) {
            this.classes.push({ classNo: i, studentCount: 11 });
            $("#classes-setting-container2").append("<input id='class"+ i+ "' style='width: 80px; margin-right: 15px; margin-left: 10px; margin-bottom: 5px'" +
              "></input");

            $(`#class${i}`)
                .kendoNumericTextBox({
                    options: { min: 1, max: 30, value: 11, format: "n0", bind: {value: this.classes[i]}}
                } as kendo.ui.NumericTextBoxOptions);
        }

    }
}
