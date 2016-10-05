class CustomGroupListViewModel extends kendo.data.ObservableObject {

    private menuPanelElement: HTMLElement;
    private contentElement: HTMLElement;
    private testInfo: TestFile;
    private customGroupLisdtContol = new CustomGroupListControl();
    private _customGroupViewModel;

    get customGroupViewMdel(): CustomGroupViewModel {
        if (!this._customGroupViewModel) {
            this._customGroupViewModel = new CustomGroupViewModel("", 80, "");
        }
        return this._customGroupViewModel;
    }

    constructor(public testNumber: number, menuPanelElement: HTMLElement, contentElement: HTMLElement) {
        super();
        super.init(this);

        this.menuPanelElement = menuPanelElement;
        this.contentElement = contentElement;
    }

    create = () => {
        const myself = this;
        $.ajax({
            type: "POST",
            url: "Customgroup\\CustomGroupWizard",
            contentType: "application/json",
            data: JSON.stringify({ 'testNumber': myself.testNumber }),
            success(html) {
                debugger;
                var content = document.createElement("div");
                content.id = "custom-goup-wizard";
                myself.contentElement.appendChild(content);
                $("#custom-group-wizard").html(html);
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

    }

    initMenuPanel = (callback: (flag: boolean, e?: any) => any) => {
        const myself = this;
        $.ajax({
            type: "POST",
            url: "Customgroup\\GetCustomGroupListViewData",
            contentType: "application/json",
            data: JSON.stringify({ 'testNumber': this.testNumber }),
            success(data) {
                myself.setDatasource(data.Test, data.Results, data.StudentLanguages, data.CustomGroupSets);

                const tmpCallback = callback;
                if (tmpCallback) {
                    callback(true);
                }

                myself.customGroupLisdtContol.create(myself.menuPanelElement, myself.testInfo.customGroups);
            },
            error(e) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    callback(false, e);
                }
            }
        });
    }

    setDatasource = (test, results, languages, customGroups) => {
        this.testInfo = new TestFile();
        this.testInfo.set(test, results, languages, customGroups);
    };
}
