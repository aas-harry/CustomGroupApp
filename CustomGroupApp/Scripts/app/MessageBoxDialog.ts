class MessageBoxDialog {

    private commonUtils = new CommonUtils();
    private kendoHelper = new KendoHelper();

    showInfoDialog = (element: string,
        message: string,
        title: string,
        height: number = 120,
        width: number = 400,
        callback: () => any = null) => {

        this.initWindowContainer(element, message, title, width, height, callback);
    }

    showWarningDialog = (element: string,
        message: string,
        title: string,
        height: number = 120,
        width: number = 400,
        callback: () => any = null) => {

        this.initWindowContainer(element, message, title, width, height, callback);
    }

    showErrorDialog = (element: string,
        message: string,
        title: string,
        height: number = 120,
        width: number = 400,
        callback: () => any) => {

        this.initWindowContainer(element, message, title, width, height, callback);
    }

    showSuccessDialog = (element: string,
        message: string,
        title: string,
        height: number = 120,
        width: number = 400,
        callback: () => any = null) => {

        this.initWindowContainer(element, message, title, width, height, callback);
    }

    showYesNoDialog = (element: string,
        message: string,
        title: string,
        height: number = 120,
        width: number = 400,
        callback: (status: DialogResult) => any,
        yesButton = "Yes",
        noButton = "No") => {

        this.initWindowContainer(element, message, title, width, height, callback, yesButton, noButton);
    }

    showYesNoCancelDialog = (element: string,
        message: string,
        title: string,
        callback: (result: DialogResult) => any,
        height = 120,
        width = 400,
        yesButton = "Yes",
        noButton = "No",
        cancelButton = "Cancel"
        ) => {

        this.initWindowContainer(element, message, title, width, height, callback, yesButton, noButton, cancelButton);
    }

    private createButton = (container: HTMLDivElement, caption: string, id: string, popupWindow: kendo.ui.Window,
        callback: (result: DialogResult) => any, dialogResult: DialogResult): HTMLElement => {
        const button = document.createElement("button");
        button.id = id;
        button.textContent = caption;
        button.setAttribute("style", "margin-left: 2.5px; margin-right: 2.5px");

        container.appendChild(button);
        this.kendoHelper.createKendoButton(id,
            () => {
                popupWindow.close().destroy();
                if (callback) {
                    callback(dialogResult);
                }
            });
        return button;
    }

    private initWindowContainer = (element: string, message: string, title: string, width: number, height: number,
        callback: (result: DialogResult) => any, 
        yesButton?: string, noButton?: string, cancelButton?: string): HTMLDivElement => {

        const elementContainer = document.getElementById(element);
        if (elementContainer.childElementCount > 0) {
            while (elementContainer.hasChildNodes()) {
                elementContainer.removeChild(elementContainer.lastChild);
            }
        }

        // create window content
        const window = document.createElement("div");
        window.setAttribute("style", "margin: 10px 0 10px 0; overflow: none");
        window.id = this.commonUtils.createUid();
        window.setAttribute("style", "padding: 20px");
        elementContainer.appendChild(window);

        const messageElement = document.createElement("p") as HTMLParagraphElement;
        messageElement.innerHTML = message;
        messageElement.setAttribute("style", "margin-top: 10px");
        window.appendChild(messageElement);

        const buttonContainer = document.createElement("div");
        buttonContainer.setAttribute("style", "margin-top: 30px");
        window.appendChild(buttonContainer);

        var popupWindow = this.showDialog(window, title, width, height);

        if (! yesButton && ! noButton && ! cancelButton) {
            this.createButton(buttonContainer, "OK", "ok-button", popupWindow, callback, DialogResult.Ok);
        }

        if (yesButton) {
            this.createButton(buttonContainer, yesButton, "yes-button", popupWindow, callback, DialogResult.Yes);
        }

        if (noButton) {
            this.createButton(buttonContainer, noButton, "no-button", popupWindow, callback, DialogResult.No);
        }

        if (cancelButton) {
            this.createButton(buttonContainer, cancelButton, "cancel-button", popupWindow, callback, DialogResult.Cancel);
        }
        return window;
    }

    private showDialog = (window: HTMLElement, title: string, width: number, height: number): kendo.ui.Window => {
        var popupWindow = $(`#${window.id}`)
            .kendoWindow({
                width: width + "px",
                height: height + "px",
                modal: true,
                scrollable: true,
                actions: ["Close"],
                resizable: false,
                title: title
            })
            .data("kendoWindow");

        $(`#${window.id}`).parent().addClass("h-window-caption");
        popupWindow.center().open();

        return popupWindow;
    }
}

enum DialogResult {
    Yes=1,
    No=2,
    Cancel=3,
    Ok=4
}