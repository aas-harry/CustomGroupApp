class CustomGroupListViewModel extends kendo.data.ObservableObject {

    private menuPanelElement: HTMLElement;
    private contentElement: HTMLElement;
    private testInfo: TestFile;
    private customGroupListControl = new CustomGroupListControl();
    private selectedClass: ClassDefinition;

    constructor(menuPanelElement: HTMLElement, contentElement: HTMLElement) {
        super();
        super.init(this);

        this.menuPanelElement = menuPanelElement;
        this.contentElement = contentElement;
    }

    create = () => {
        const myself = this;
        $.ajax({
            type: "POST",
            url: "CustomGroup\\SplitCustomGroupView",
            data: { testnum: this.selectedClass.groupSetid },
            contentType: "application/json",
            success(html) {
                const content = document.createElement("div");
                content.id = "custom-group-container";
                myself.contentElement.appendChild(content);
                $("#custom-group-container").html(html);
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

    showMenuPanel = () => {
        this.customGroupListControl.create(this.menuPanelElement, this.testInfo.customGroups,
            (classDefn) => { this.selectedClass = classDefn; }, 800);
    }

   
    setDatasource = (testFile: TestFile) => {
        this.testInfo = testFile;
        
    };
}
