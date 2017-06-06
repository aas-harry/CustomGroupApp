class CustomGroupListViewModel extends kendo.data.ObservableObject {
    private popupWindowContainer = "popup-window-container";
    private groupingHelper = new GroupingHelper();
    private messageBox = new MessageBoxDialog();
    private testInfo: TestFile;
    private customGroupListControl = new CustomGroupListControl();
    private customClassGridCollection = new CustomClassGridCollection();
    private selectedClass: ClassDefinition;
    private classesDefn: ClassesDefinition;
    private bandSet: BandSet;

    constructor() {
        super();

        this.customClassGridCollection.classChangedCallback = this.onClassChanged;
    }

    message: string;
    hasMessage: boolean;

    add = () => {
        const self = this;
        const studentSelector = new AddCustomGroupDialog();
        studentSelector.openDialog(document.getElementById("popup-window-container"),
            this.classesDefn.students,
            (groupName, students) => {
                const classItem = self.testInfo.addCustomGroup(
                {
                    "Name": groupName,
                    "Students": Enumerable.From(students).Select(s=> s.studentId).ToArray(),
                    "GroupSetId": 0,
                    "Streaming": StreamType.None
                    });

                self.groupingHelper.addClass(self.classesDefn.testFile.fileNumber, classItem, (status, item) => {
                    if (status) {
                        classItem.name = item.Name;
                        classItem.groupSetid = item.Id;

                        self.customGroupListControl.addClassItems([classItem]);
                    } else {
                        toastr.info("Failed to add custom group.");

                    }
                });
               
            },
            30);
    }

    regroup = () => {
        var selectedItems = this.getSelectedItems();
        if (selectedItems.length === 0) {
            return;
        }

        $.ajax({
            type: "POST",
            url: "..\\CustomGroup\\SplitCustomGroupView",
            contentType: "application/json",
            data: JSON.stringify({ 'groupSetIds': Enumerable.From(selectedItems).Select(x=> x.groupSetid).ToArray() }),
            success(html) {
                $("#reportContent").replaceWith(html);
            },
            error(e) {

            }
        });
    }

    create = () => {
        $.ajax({
            type: "POST",
            url: "..\\CustomGroup\\CustomGroupWizard",
            success(html) {
                $("#reportContent").replaceWith(html);
            },
            error(e) {

            }
        });

    }
    delete = () => {
        const self = this;
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length === 0) {
            this.messageBox.showInfoDialog(this.popupWindowContainer, "Please select a custom group to delete.", "Delete Custom Groups", 120, 450, null);
            return;
        }

        this.messageBox.showYesNoDialog(this.popupWindowContainer,
            "Do you want to delete the selected custom groups (" +
            selectedItems.length + (selectedItems.length === 1 ? " item)": " items)") +
            "?", "Delete Custom Groups", 120, 450,
            (status) => {
                if (status !== DialogResult.Yes) {
                    return;
                }

                this.set("message", "Deleting selected custom groups...");
                this.set("hasMessage", true);

                this.groupingHelper.deleteClasses(
                    Enumerable.From(selectedItems).Select(x => x.groupSetid).ToArray(),
                    this.classesDefn.testFile.fileNumber, (status) => {
                        if (status) {
                            self.customClassGridCollection.clear();

                            self.testInfo.customGroups = Enumerable.From(self.testInfo.customGroups).Except(selectedItems, x => x.groupSetid).ToArray();
                            self.customGroupListControl.deleteClassItems(selectedItems);
                        }
                        self.set("message", null);
                        this.set("hasMessage", false);
                    });
            });
    }

    merge = () => {
        const self = this;
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length <= 1) {
            this.messageBox.showInfoDialog("popup-window-container", "Please select one or more groups to merge.", "Merge");
            return;
        }

        let initialName = undefined;
        for (let g of selectedItems) {
            initialName = initialName ? initialName + ", " + g.name : g.name;
        }
        const msg = "You have selected " + selectedItems.length + " custom groups. Please enter new custom group name (max 80 chars).";
        this.messageBox.showInputDialog("popup-window-container", msg, "Merge", (e) => {
            if (e == DialogResult.No) {
                return true;
            }

            const input = document.getElementById("input-text") as HTMLInputElement;
            const groupName = input.value;
            if (! groupName) {
                toastr.warning("Custom group name must not be blank.");
                return false;
            }
            if (groupName.length > 80) {
                toastr.warning("Custom group name must be less than 80 characters.");
                return false;
            }
            this.set("message", "merging selected custom groups...");
            this.set("hasMessage", true);

            this.groupingHelper.mergeClasses(
                Enumerable.From(selectedItems).Select(x => x.groupSetid).ToArray(),
                this.classesDefn.testFile.fileNumber, groupName, (status, item) => {
                    if (status) {
                        const classItem = self.testInfo.addCustomGroup(item);
                        self.customGroupListControl.addClassItems([classItem]);
                    }
                    self.set("message", null);
                    this.set("hasMessage", false);
                });
                return true;
        },
            initialName,
            135, 520);
       
    }

    exportToCsv = () => {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length === 0) {
            return;
        }

        this.groupingHelper.exportGroupSetIds(this.classesDefn.testFile,
            Enumerable.From(selectedItems).Select(x => x.groupSetid).ToArray(),
            "csv", (status, msg) => { });

   
    }

    exportToExcel = () => {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length === 0) {
            return;
        }

        this.groupingHelper.exportGroupSetIds(this.classesDefn.testFile,
            Enumerable.From(selectedItems).Select(x => x.groupSetid).ToArray(),
            "excel", (status, msg) => { });
    }

    private getSelectedItems = (): Array<ClassDefinition> => {
        const selectedItems = this.customGroupListControl.selectedItems;
        if (selectedItems.length === 0) {
            const selectedItem = this.customGroupListControl.selectedItem;
            if (selectedItem) {
                selectedItems.push(selectedItem);
            }
        }
        return selectedItems;
    }

    showCustomGroups = (elementName: string) => {
        const customGroupSets = Enumerable.From(this.testInfo.customGroups).Where(s => s.groupSetid > 0).ToArray();
        this.customGroupListControl.create(document.getElementById(elementName), customGroupSets,
            this.onSelectedCustomGroups, this.onSelectedCustomGroup);
    }

    setDatasource = (testFile: TestFile) => {
        this.testInfo = testFile;
        this.classesDefn = new ClassesDefinition(testFile, null);
        this.bandSet = new BandSet(this.classesDefn, "Custom", 0);
    };


    private onClassChanged = (classItem: ClassDefinition) => {
        this.customGroupListControl.updateClassItem(classItem);
    }

    onSelectedCustomGroup = (item: ClassDefinition) => {
        const self = this;
        self.selectedClass = item;
        self.bandSet.createBands("Custom", this.selectedClass.count, 1);
        self.bandSet.bands[0].setClassCount(1);
        self.bandSet.bands[0].classes[0].copy(self.selectedClass);

        this.customClassGridCollection.initTable("#classes-settings-container", this.bandSet.bands, true, this.classesDefn.students);
    }

    onSelectedCustomGroups = (items: Array<number>) => {
        const self = this;
        if (items.length > 20) {
            items = Enumerable.From(items).Take(20).ToArray();
        }

        let classItems = new Array<ClassDefinition>();
        let studentCount = 0;
        var itemLookup = Enumerable.From(items).ToDictionary(x => x, x => x);
        for (let item of self.testInfo.customGroups) {
            if (itemLookup.Contains(item.groupSetid)) {
                studentCount += item.count;
                classItems.push(item);
            }
        }

        self.bandSet.createBands("Custom", studentCount, 1);
        self.bandSet.bands[0].setClassCount(classItems.length);
        let i = 0;
        for (let item of classItems) {
            self.bandSet.bands[0].classes[i].copy(item);
            i++;
        }
        self.customClassGridCollection.initTable("#classes-settings-container", self.bandSet.bands, true, this.classesDefn.students);
    }
}
