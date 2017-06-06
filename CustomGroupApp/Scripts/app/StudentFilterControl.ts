class StudentFilterControl {
    private testFile: TestFile;
    private customGroups: Array<{ groupName: string, classItem: ClassDefinition}>;

    constructor(testFile: TestFile) {
        this.testFile = testFile;

        this.setDatasource();
    }

    create = (elementName: string, callback: (students: Array<Student>) => any) => {
        const container = document.getElementById(elementName);
       
        this.addCustomGroupFilter(container, callback);
        if (this.testFile.isUnisex) {
            this.addGenderFiler(container, callback);
        }
    }

    private addCustomGroupFilter = (container: HTMLElement, callback: (students: Array<Student>) => any) => {
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
                        const classItem = val.classItem as ClassDefinition;
                        if (classItem) {
                            tmpCallback(this.testFile.filterTestByGroup(classItem));
                        }
                    }
                }
            } as kendo.ui.DropDownListOptions);

        var groupList = $(`#${groupElementName}`).data("kendoDropDownList");
        groupList.list.width(350);
    }

    private addGenderFiler = (container: HTMLElement, callback: (students: Array<Student>) => any) => {
        const genderElementName = "gender-filter";
        const genderCombobox = document.createElement("div");
        genderCombobox.id = genderElementName;
        genderCombobox.setAttribute("style", "width: 90px");
        container.appendChild(genderCombobox);

        const genders =  [
            { "name": "CoEd", "gender": Gender.All },
            { "name": "Female", "gender": Gender.Girls },
            { "name": "Male", "gender": Gender.Boys }
        ];

        $(`#${genderElementName}`)
            .kendoDropDownList({
                dataSource: genders,
                dataTextField: "name",
                dataValueField: "gender",
                change: (e: kendo.ui.DropDownListChangeEvent) => {
                    const tmpCallback = callback;
                    if (tmpCallback) {
                        const control = e.sender as kendo.ui.DropDownList;
                        const val = control.dataItem();
                        const gender = val.gender as Gender;
                        if (gender) {
                            tmpCallback(this.testFile.filterByGender(gender));
                        }
                    }
                }
            } as kendo.ui.DropDownListOptions);
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