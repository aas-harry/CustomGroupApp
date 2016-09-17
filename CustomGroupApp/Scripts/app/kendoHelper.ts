class KendoHelper
{
    private integerFormat = "n0";

    createBandInputContainer = (
        cell: HTMLTableCellElement,
        bandNo: number,
        callback,
        addLabel = false): kendo.ui.NumericTextBox => {
        if (addLabel) {
            const label = document.createElement("span");
            label.textContent = `Band ${bandNo}`;
            label.setAttribute("style", "margin-right: 5px");
            cell.appendChild(label);
        }

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px");
        element.id = `band-${bandNo}`;
        cell.appendChild(element);

        return this.createBandInputField(element.id, callback);
    }

    createClassInputContainer = (
        cell: HTMLTableCellElement,
        studentCount = 1,
        classNo: number,
        bandNo: number = 1,
        callbackChangeEvent = null,
        hideCell = false, addLabel = false): kendo.ui.NumericTextBox => {
        if (addLabel) {
            const label = document.createElement("span");
            label.textContent = `Class ${classNo}`;
            label.setAttribute("style", "margin-right: 5px");
            cell.appendChild(label);
        }

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px");
        element.id = `class${bandNo}-${classNo}`;
        cell.appendChild(element);

        return this.createClassInputField(element.id, studentCount, callbackChangeEvent);
    }

    createStudentsInputContainer = (
        cell: HTMLTableCellElement,
        studentCount: number,
        classNo: number,
        bandNo: number = 1,
        callbackChangeEvent = null,
        addLabel = false): kendo.ui.NumericTextBox => {
        if (addLabel) {
            const label = document.createElement("span");
            label.textContent = "No. Students";
            label.setAttribute("style", "margin-right: 5px");
            cell.appendChild(label);
        }

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px");
        element.id = `students-${bandNo}-${classNo}`;
        cell.appendChild(element);

        return this.createStudentsInputField(element.id, studentCount, callbackChangeEvent);
    }

    createLabel = (cell: HTMLTableCellElement, description: string) => {
     var label = document.createElement("span");
        label.textContent = description;
        label.setAttribute("style", "margin-right: 5px");
        cell.appendChild(label);

    }
    createClassInputField = (
        element: string,
        studentCount = 1,
        callbackChangeEvent = null) : kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            studentCount,
            1,
            250,
            this.integerFormat,
            callbackChangeEvent);
    }

    createBandInputField = (
        element: string,
        callbackChangeEvent = null): kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            1,
            1,
            5,
            this.integerFormat,
            callbackChangeEvent);
    }

    createStudentsInputField = (
        element: string,
        studentCount: number = 1,
        callbackChangeEvent = null): kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            studentCount,
            1,
            250,
            this.integerFormat,
            callbackChangeEvent);
    }

    createNumericTextBox = (
        element: string,
        defaultValue = 0,
        min = 0,
        max = 10,
        format = this.integerFormat,
        callbackChangeEvent = null) : kendo.ui.NumericTextBox => {

        $(`#${element}`)
            .kendoNumericTextBox({
                options: {},
                change: callbackChangeEvent
                //spin: callbackChangeEvent
            } as kendo.ui.NumericTextBoxOptions);

        const numericTextBox = $(`#${element}`).data("kendoNumericTextBox");
        numericTextBox.options.format = format;
        numericTextBox.value(defaultValue);
        numericTextBox.max(max);
        numericTextBox.min(min);
        return numericTextBox;
    }
}