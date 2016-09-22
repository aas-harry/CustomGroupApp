class ClassDefinitionViewModel extends kendo.data.ObservableObject
    implements IBandClassSettings {

    constructor(public studentCount: number = 0) {
        super();
        super.init(this);
    }

    classCount = 1;

    groupingHelper = new GroupingHelper();
    kendoHelper = new KendoHelper();

    // This function is called when the student count in a class is changed
    onStudentCountInClassChanged = () => {
    };

    onClassCountChange = () => {
    
        var tmpClasses = this.groupingHelper.calculateClassesSize(this.studentCount, this.classCount);

        this.createInputTextBox(Enumerable.From(tmpClasses).Select((val, classNo) => 
            new ClassDefinition(null, classNo+1, val)).ToArray());
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
        super.set("classCount", source.bands[0].classes.length);
        this.createInputTextBox(source.bands[0].classes);
        return true;
    }
}
