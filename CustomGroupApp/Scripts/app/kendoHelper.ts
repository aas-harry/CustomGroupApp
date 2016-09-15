class KendoHelper
{
    private integerFormat = "n0";

    createBandInputContainer = (cell: HTMLTableCellElement, bandNo: number) => {
        //var label = document.createElement("span");
        //label.textContent = `Band ${bandNo}`;
        //label.setAttribute("style", "margin-right: 5px");
        //cell.appendChild(label);

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px");
        element.id = `Band${bandNo}`;
        cell.appendChild(element);

        this.createBandInputField(element.id, null);
    }
    createLabel = (cell: HTMLTableCellElement, description: string) => {
     var label = document.createElement("span");
        label.textContent = description;
        label.setAttribute("style", "margin-right: 5px");
        cell.appendChild(label);

    }
    createClassInputField = (
        element: string,
        callbackChangeEvent = null) => {
        return this.createNumericTextBox(
            element,
            1,
            1,
            30,
            this.integerFormat,
            callbackChangeEvent);
    }

    createBandInputField = (
        element: string,
        callbackChangeEvent = null) => {
        return this.createNumericTextBox(
            element,
            1,
            1,
            5,
            this.integerFormat,
            callbackChangeEvent);
    }

    createNumericTextBox = (
        element: string,
        defaultValue = 0,
        min = 0,
        max = 10,
        format = this.integerFormat,
        callbackChangeEvent = null) => {

        $(`#${element}`)
            .kendoNumericTextBox({
                options: {},
                change: callbackChangeEvent,
                spin: callbackChangeEvent
            } as kendo.ui.NumericTextBoxOptions);

        const numericTextBox = $(`#${element}`).data("kendoNumericTextBox");
        numericTextBox.options.format = format;
        numericTextBox.value(defaultValue);
        numericTextBox.max(max);
        numericTextBox.min(min);
    }
}