class CustomGroupListViewModel extends kendo.data.ObservableObject {

    private menuPanelElement: HTMLElement;
    private contentElement: HTMLElement;
    private testInfo: TestFile;
    private customGroupListControl = new CustomGroupListControl();
    private _customGroupViewModel;

    get customGroupViewMdel(): CustomGroupViewModel {
        if (!this._customGroupViewModel) {
            this._customGroupViewModel = new CustomGroupViewModel("", 80, "");
        }
        return this._customGroupViewModel;
    }

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
            url: "CustomGroup\\CustomGroupWizard",
            contentType: "application/json",
            data: JSON.stringify({ 'testNumber': 101481 }),
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
        this.customGroupListControl.create(this.menuPanelElement, this.testInfo.customGroups, 800);
    }

   
    setDatasource = (testFile: TestFile) => {
        this.testInfo = testFile;
        
    };
}
