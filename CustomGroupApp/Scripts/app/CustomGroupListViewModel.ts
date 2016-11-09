class CustomGroupListViewModel extends kendo.data.ObservableObject {
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


    create = () => {
        const myself = this;
        $.ajax({
            type: "POST",
            url: "CustomGroup\\SplitCustomGroupView",
            data: { 'groupSetId': myself.selectedClass.groupSetid },
            success(html) {

                $("#content").replaceWith("<div id='content'></div>");
                $("#content").append(html);
            },
            error(e) {
                
            }
        });
    }
    regroup = () => {

    }
    edit = () => {

    }
    delete = () => {

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
        console.log("onClassChanged: " + classItem.groupSetid, classItem.name);
        this.customGroupListControl.updateClassItem(classItem);
    }

    onSelectedCustomGroup = (item: ClassDefinition) => {
        const self = this;
        self.selectedClass = item;
        self.bandSet.createBands("Custom", this.selectedClass.count, 1);
        self.bandSet.bands[0].setClassCount(1);
        self.bandSet.bands[0].classes[0].copy(self.selectedClass);

        this.customClassGridCollection.initTable("#classes-settings-container", this.bandSet.bands, true);
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
        self.customClassGridCollection.initTable("#classes-settings-container", self.bandSet.bands, true);
    }
}
