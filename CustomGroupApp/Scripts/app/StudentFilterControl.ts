class StudentFilterControl {
    private testFile: TestFile;
    private customGroups: Array<{ groupName: string, classItem: ClassDefinition}>;

    constructor(testFile: TestFile) {
        this.testFile = testFile;

        this.setDatasource();
    }

    create = (elementName: string, callback: (classItem: ClassDefinition) => any) => {
        const container = document.getElementById(elementName);
        const groupElementName = "custom-group-list";

        const label = document.createElement("span");
        label.textContent = "Filter:";
        label.setAttribute("style", "margin: 0 0 0 5px");
        container.appendChild(label);

        const customGroupComboBox = document.createElement("div");
        customGroupComboBox.id = groupElementName;
        customGroupComboBox.setAttribute("style", "width: 200px");
        container.appendChild(customGroupComboBox);

        $(`#${groupElementName}`)
            .kendoDropDownList({
                dataSource: this.customGroups,
                dataTextField: "groupName",
                dataValueField: "classItem",
                change: (e: kendo.ui.DropDownListChangeEvent) => {
                    const tmpCallback = callback;
                    if (tmpCallback) {
                        const control = e.sender as kendo.ui.DropDownList;
                        const val = control.dataItem();
                       tmpCallback(val.classItem as ClassDefinition);
                    }
                }
            } as kendo.ui.DropDownListOptions);

        var groupList = $(`#${groupElementName}`).data("kendoDropDownList");
        groupList.list.width(350);

    }

    selectedCustomGroupChanged = () => {
        
    }

    setDatasource = () => {
        this.customGroups = [];
        this.customGroups.push({ "groupName": "All Students", "classItem": new ClassDefinition(null,1)});
        if (this.testFile.hasCustomGroups) {
            Enumerable.From(this.testFile.customGroups).OrderBy(c => c.name)
                .ForEach(c => this.customGroups.push({ "groupName": c.name, "classItem": c }));
        }
    }

    destroy: {
        
    }
}