class ExportCustomGroupDialog {
    private includeResultsElement = "include-results-option";
    private includeLanguagesElement = "include-language-option";
    private includeStudentIdElement = "include-student-id";

    get includeResults() {
        var checkBox = document.getElementById(this.includeResultsElement) as HTMLInputElement;
        return checkBox ? checkBox.checked : false;
    }

    get includeLanguages() {
        var checkBox = document.getElementById(this.includeLanguagesElement) as HTMLInputElement;
        return checkBox ? checkBox.checked : false;
    }

    get includeStudentId() {
        var checkBox = document.getElementById(this.includeStudentIdElement) as HTMLInputElement;
        return checkBox ? checkBox.checked : false;
    }

    openDialog = (element: HTMLElement,
        includeResults: boolean, includeLanguagePrefs: boolean, includeStudentId: boolean,
        callback: (status: boolean, includeResults: boolean, includeLanguagePrefs: boolean, includeStudentId: boolean) => any) => {
        const commonUtils = new CommonUtils();
        const kendoHelper = new KendoHelper();

        // create window content
        const window = document.createElement("div");
        window.setAttribute("style", "margin: 10px 0 10px 0; overflow: none");
        window.id = commonUtils.createUid();

        if (element.childElementCount > 0) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        }
        element.appendChild(window);
        

        var popupWindow = $(`#${window.id}`)
            .kendoWindow({
                width: "400px",
                height: "150px",
                modal: true,
                scrollable: true,
                actions: ["Close"],
                resizable: false,
                title: "Export Selected Custom Groupss"
            })
            .data("kendoWindow");

        // Add options
        window.setAttribute("style", "padding: 20px");
        window.appendChild(this.addOptions("Include Student Results", this.includeResultsElement, includeResults));
        window.appendChild(this.addOptions("Include Student Language Preferences", this.includeLanguagesElement, includeLanguagePrefs));
        window.appendChild(this.addOptions("Include Student Ids", this.includeStudentIdElement, includeStudentId));

        // Add export and cancel buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.setAttribute("style", "margin-top: 10px");
        const saveButtonElement = document.createElement("button");
        saveButtonElement.id = "export-button";
        saveButtonElement.textContent = "Export";
        saveButtonElement.setAttribute("style", "margin-left: 2.5px; margin-right: 2.5px");
        const cancelButtonElement = document.createElement("button");
        cancelButtonElement.id = "cancel-button";
        cancelButtonElement.textContent = "Cancel";

        buttonContainer.appendChild(saveButtonElement);
        buttonContainer.appendChild(cancelButtonElement);
        window.appendChild(buttonContainer);

        kendoHelper.createKendoButton("export-button",
            (e) => {
                callback(true, this.includeResults, this.includeLanguages, this.includeStudentId);
                popupWindow.close().destroy();
            });

        kendoHelper.createKendoButton("cancel-button",
            (e) => {
                popupWindow.close().destroy();
                callback(false, false, false, false);
            });

        $(`#${window.id}`).parent().addClass("h-window-caption");
        popupWindow.center().open();
    }
    private addOptions = (optionName: string, optionId: string, initialVal: boolean): HTMLDivElement => {
        const optionContainer = document.createElement("div");
        const optionLabel = document.createElement("label");
        optionLabel.setAttribute("style", "font-weight: normal");
        optionLabel.textContent = optionName;
        const optionCheckBox = document.createElement("input");
        optionCheckBox.type = "checkbox";
        optionCheckBox.id = optionId;
        if (initialVal) {
            optionCheckBox.setAttribute("checked", "checked");
        }
        optionContainer.appendChild(optionCheckBox);
        optionContainer.appendChild(optionLabel);
        return optionContainer;
    }
}