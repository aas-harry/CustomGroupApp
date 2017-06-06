class TestInformationDialog {
    popupWindow: kendo.ui.Window;
    private commonUtils = new CommonUtils();
    private kendoHelper = new KendoHelper();


    constructor(public container: HTMLElement, public testFile: TestFile) {
    }

    showDialog() {
        // create window content
        const window = document.createElement("div");
        window.setAttribute("style", "margin: 10px 0 10px 0; overflow: no-display");
        window.id = this.commonUtils.createUid();
        this.container.appendChild(window);

        var windowHeight = (this.testFile.subjectsTested.length > 0) ? (this.testFile.subjectsTested.length * 40 - 30) + "px" : 80 + "px";
        this.popupWindow = $(`#${window.id}`)
            .kendoWindow({
                width: "400px",
                height: windowHeight,
                modal: true,
                scrollable: true,
                actions: ["Close"],
                resizable: false,
                title: "Number of Items"
            })
            .data("kendoWindow");

        // Add test information container
        window.appendChild(this.testFile.subjectsTested.length > 0
                ? this.createDataContainer()
                : this.createNoDataContainer());

        // Add close button
        const closeButtonElement = document.createElement("button");
        closeButtonElement.id = "close-button";
        closeButtonElement.textContent = "Close";
        closeButtonElement.setAttribute("style", "position: absolute; bottom: 20px; right: 20px");
        closeButtonElement.onclick = () => {
            this.popupWindow.close();
        };
        window.appendChild(closeButtonElement);
        
        // Display the popup window
        $(`#${window.id}`).parent().addClass("h-window-caption");
        this.popupWindow.center().open();
    }

    private createDataContainer = (): HTMLDivElement => {
        const container = document.createElement("div");        

        var tbl = document.createElement("table");
        tbl.setAttribute("style", "border: 0; margin: 0 auto; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 14px;");

        var tbdy = document.createElement("tbody");
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(""));
        td.setAttribute("style", "border:0; width: 70%; padding: 3px;");
        tr.appendChild(td);

        td = document.createElement("td");
        td.appendChild(document.createTextNode("No. of Items"));
        td.setAttribute("style", "border:0; font-weight: bold; text-decoration: underline; padding: 3px;");
        tr.appendChild(td);

        tbdy.appendChild(tr);

        $.each(this.testFile.subjectsTested,
            (ind, val) => {
                tr = document.createElement("tr");
                td = document.createElement("td");
                td.setAttribute("style", "border:0; padding: 3px;");
                td.appendChild(document.createTextNode(val.name));
                tr.appendChild(td);

                td = document.createElement("td");
                td.setAttribute("style", "border:0; text-align: center; padding: 3px;");
                td.appendChild(document.createTextNode(`${val.count}`));
                tr.appendChild(td);

                tbdy.appendChild(tr);
            });

        tbl.appendChild(tbdy);
        var height = this.testFile.subjectsTested.length * 10 + 5;
        container.setAttribute("style", "width: 100%; height: " + height + "%;");

        container.appendChild(tbl);
        return container;
    }

    private createNoDataContainer = () : HTMLDivElement => {
        const container = document.createElement("div");        

        var tbl = document.createElement("table");
        tbl.setAttribute("style", "border: 0; margin: 0 auto; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 14px;");

        var tbdy = document.createElement("tbody");
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.appendChild(document.createTextNode("No data to be shown."));
        td.setAttribute("style", "border:0; width: 70%; padding: 3px;");
        tr.appendChild(td);
        tbdy.appendChild(tr);

        tbl.appendChild(tbdy);
        container.setAttribute("style", "width: 100%; height: 100%;");

        container.appendChild(tbl);
        return container;
    }
}