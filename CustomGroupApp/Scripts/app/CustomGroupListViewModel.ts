class CustomGroupListViewModel extends kendo.data.ObservableObject {
    private groupingHelper = new GroupingHelper();
    private testInfo: TestFile;
    private customGroupListControl = new CustomGroupListControl();
    private customClassGridCollection = new CustomClassGridCollection();
    private selectedClass: ClassDefinition;
    private classesDefn : ClassesDefinition;
    private bandSet: BandSet;

    constructor() {
        super();
        
        this.customClassGridCollection.classChangedCallback = this.onClassChanged;
    }

    message: string;
    hasMessage: boolean;

    splitgroup = () => {
        $.ajax({
            type: "POST",
            url: "CustomGroup\\SplitCustomGroupView",
            contentType: "application/json",
            data: JSON.stringify({ 'groupSetId': this.selectedClass.groupSetid }),
            success(html) {

                $("#content").replaceWith("<div id='content'></div>");
                $("#content").append(html);
            },
            error(e) {
                
            }
        });
    }
    create = () => {
        $.ajax({
            type: "POST",
            url: "CustomGroup\\CustomGroupWizard",
            success(html) {

                $("#content").replaceWith("<div id='content'></div>");
                $("#content").append(html);
            },
            error(e) {

            }
        });

    }
    
    delete = () => {
        const self = this;
        let selectedItems = this.customGroupListControl.selectedItems;
        if (selectedItems.length === 0) {
            const selectedItem = this.customGroupListControl.selectedItem;
            if (selectedItem) {
                selectedItems.push(selectedItem);
            }
        }
        if (selectedItems.length === 0) {
            return;
        }

        this.set("message", "Deleting selected custom groups...");
        this.set("hasMessage", true);

        this.groupingHelper.deleteClasses(
            Enumerable.From(selectedItems).Select(x => x.groupSetid).ToArray(),
            this.classesDefn.testFile.fileNumber, (status) => {
                if (status) {
                    self.customGroupListControl.deleteClassItems(selectedItems);
                }
                self.set("message", null);
                this.set("hasMessage", false);
            });
    }

    showCustomGroups = (elementName: string) => {
        this.customGroupListControl.create(document.getElementById(elementName), this.testInfo.customGroups,
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
        let classItems = new Array<ClassDefinition>();
        let studentCount = 0;
        var itemLookup = Enumerable.From(items).ToDictionary(x=> x, x=> x);
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
