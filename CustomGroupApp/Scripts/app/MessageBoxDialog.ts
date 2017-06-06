class MessageBoxDialog {

    private commonUtils = new CommonUtils();
    private kendoHelper = new KendoHelper();
    private waitDialog = false;
    private popupWindow: kendo.ui.Window;

    showInfoDialog = (element: string,
        message: string,
        title: string,
        height: number = 120,
        width: number = 400,
        callback: () => any = null) => {

        this.initWindowContainer(element, message, title, width, height, callback);
    }

    showInputDialog = (element: string,
        message: string,
        title: string,
        callback: (status: DialogResult) => any = null,
        initialValue: string,
        height: number = 130,
        width: number = 400
        ) => {

        const container = document.createElement("div") as HTMLElement;
        container.setAttribute("style", "width:100%;");
        const msgElement = document.createElement("p") as HTMLElement;
        msgElement.textContent = message;
        container.appendChild(msgElement);
        const inputDiv = document.createElement("div") as HTMLElement;
        inputDiv.setAttribute("style", "width: 100%;");
        const input = document.createElement("input") as HTMLInputElement;
        input.value = initialValue;
        input.type = "text";
        input.id = "input-text";
        input.setAttribute("style", "width: 100%; max-width: 500px");
        input.setAttribute("class", "k-textbox");
        inputDiv.appendChild(input);
        container.appendChild(inputDiv);
        this.initWindowContainerInternal(element, container, title, width, height, callback, "Continue", "Cancel");
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

    showWaitDialog = (element: string,
        message: string,
        title: string,
        height: number = 120,
        width: number = 400): kendo.ui.Window => {

        this.waitDialog = true;
        return this.initWindowContainer(element, message, title, width, height, null);
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
                if (callback) {
                    const result = callback(dialogResult);
                    if (result === undefined || result === true) {
                        popupWindow.close().destroy();
                    }
                    return;
                }
                popupWindow.close().destroy();
            });
        return button;
    }

    private initWindowContainer = (element: string, message: string, title: string, width: number, height: number,
        callback: (result: DialogResult) => any, 
        yesButton?: string, noButton?: string, cancelButton?: string): kendo.ui.Window => {

      
        const messageElement = document.createElement("p") as HTMLParagraphElement;
        messageElement.innerHTML = message;
        messageElement.setAttribute("style", "margin-top: 10px");
      
        return this.initWindowContainerInternal(element, messageElement, title, width, height, callback,
        yesButton, noButton, cancelButton);
    }

    private initWindowContainerInternal = (element: string, message: HTMLElement, title: string, width: number, height: number,
        callback: (result: DialogResult) => any,
        yesButton?: string, noButton?: string, cancelButton?: string): kendo.ui.Window => {

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
       
        window.appendChild(message);

        const buttonContainer = document.createElement("div");
        buttonContainer.setAttribute("style", "margin-top: 20px");
        window.appendChild(buttonContainer);

        this.popupWindow = this.showDialog(window, title, width, height);

        if (!yesButton && !noButton && !cancelButton) {
            if (!this.waitDialog) {
                this.createButton(buttonContainer, "OK", "ok-button", this.popupWindow, callback, DialogResult.Ok);
            }
        }

        if (yesButton) {
            this.createButton(buttonContainer, yesButton, "yes-button", this.popupWindow, callback, DialogResult.Yes);
        }

        if (noButton) {
            this.createButton(buttonContainer, noButton, "no-button", this.popupWindow, callback, DialogResult.No);
        }

        if (cancelButton) {
            this.createButton(buttonContainer, cancelButton, "cancel-button", this.popupWindow, callback, DialogResult.Cancel);
        }
        return this.popupWindow;
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

    closeWindow = () => {
        if (!this.popupWindow) {
            return;
        }
        this.popupWindow.close().destroy();
    }
}

enum DialogResult {
    Yes=1,
    No=2,
    Cancel=3,
    Ok=4
}