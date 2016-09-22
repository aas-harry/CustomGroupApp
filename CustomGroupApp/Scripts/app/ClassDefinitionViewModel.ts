class ClassDefinitionViewModel extends kendo.data.ObservableObject
    implements IBandClassSettings {

    constructor(public studentCount: number = 0) {
        super();
        super.init(this);
    }

    bandSet: BandSet;
    classCount = 1;

    groupingHelper = new GroupingHelper();
    kendoHelper = new KendoHelper();

    // This function is called when the student count in a class is changed
    onStudentCountInClassChanged = (e: any) => {
        var uid = this.getUid(e.sender.element[0].id);
        var classItem = Enumerable.From(this.bandSet.bands[0].classes).FirstOrDefault(undefined, x => x.uid === uid);
        var inputField = e.sender as kendo.ui.NumericTextBox;
        if (classItem && inputField) {
            classItem.count = inputField.value();
        }
    };

    onClassCountChange = () => {
        this.bandSet.bands[0].setClassCount(this.classCount);
        this.createInputTextBox(this.bandSet.bands[0].classes);
    }

    createInputTextBox(classes: Array<ClassDefinition>) {
        $("#classes-settings-container").html("");
        const element = document.getElementById("classes-settings-container") as HTMLTableElement;

        var cnt = 0;
        for (let classItem of classes) {
            const classNo = classItem.index;
            cnt++;
            const label = document.createElement("span");
            label.textContent = `Class ${classNo}`;
            label.setAttribute("style", "width: 100px;text-align: right");
            element.appendChild(label);

            const inputElement = document.createElement("input") as HTMLInputElement;
            inputElement.type = "text";
            inputElement.setAttribute("style", "width: 100px; margin-right: 10px; margin-left: 10px; margin-bottom: 5px'");
            inputElement.id = `class-${classItem.uid}`;
            element.appendChild(inputElement);

            this.kendoHelper.createStudentsInputField(inputElement.id,
                classItem.count,
                this.onStudentCountInClassChanged);

            if (cnt === 3) {
                $("#classes-settings-container")
                    .append("<div style='margin-top: 5px></div>");
                cnt = 0;
            }
        }
    }

    saveOptions(source: BandSet): boolean {

        return true;
    }

    loadOptions(source: BandSet): boolean {
        this.bandSet = source;
        super.set("classCount", source.bands[0].classes.length);
        this.createInputTextBox(source.bands[0].classes);
        return true;
    }

    getBandSet(): BandSet {
        return this.bandSet;
    }

    private getUid = (elementName: string) => {
        return elementName.substr(elementName.indexOf("-") + 1);
    }

    private parseElementClass = (elementName: string) => {
        var base = elementName.substr(elementName.indexOf("-") + 1);
        var bandNo = base.substr(0, base.indexOf("-"));
        var classNo = base.substr(base.indexOf("-", 1) + 1);
        return { bandNo: parseInt(bandNo), classNo: parseInt(classNo) };
    }
}
