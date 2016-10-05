class CustomGroupListViewModel extends kendo.data.ObservableObject {

    private menuPanelElement: HTMLElement;
    private contentElement: HTMLElement;
    constructor(public testNumber: number, menuPanelElement: HTMLElement, contentElement: HTMLElement) {
        super();
        super.init(this);

        this.menuPanelElement = menuPanelElement;
        this.contentElement = contentElement;
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
        var testInfo = new TestFile();
        testInfo.set(test, results, languages, customGroups);
    };
}
