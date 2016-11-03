class KendoHelper {
    private integerFormat = "n0";

    createClassInputContainer = (
        cell: HTMLTableCellElement,
        studentCount = 1,
        classNo: number,
        bandNo: number = 1,
        callbackChangeEvent = null,
        addLabel = false): kendo.ui.NumericTextBox => {
        if (addLabel) {
            const label = document.createElement("span");
            label.textContent = `Class ${classNo}`;
            label.setAttribute("style", "margin-right: 5px");
            cell.appendChild(label);
        }

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px");
        element.id = `class-${bandNo}-${classNo}`;
        cell.appendChild(element);

        return this.createClassInputField(element.id, studentCount, callbackChangeEvent);;
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

        return this.createStudentCountInputControl(element.id, studentCount, callbackChangeEvent);
    }

    createLabel = (cell: HTMLTableCellElement, description: string, width = 150, textAlign = "left") => {
        var label = document.createElement("span");
        label.textContent = description;
        label.setAttribute("style", `margin-right: 5px; width: ${width}px; textAlign: ${textAlign}`);
        cell.appendChild(label);

    }
    createNumberLabel = (cell: HTMLTableCellElement, value: number, width = 150) => {
        var label = document.createElement("span");
        label.textContent = value.toString();
        label.setAttribute("style", `margin-right: 5px; width: ${width}px; text-align: center`);
        cell.appendChild(label);
    }

    createMultiLineLabel = (cell: HTMLTableCellElement, line1: string, line2: string, separator: string = "/") => {
        var label = document.createElement("span");
        label.textContent = line1 + " " + separator + line2;
        label.setAttribute("style", "margin-right: 5px");
        cell.appendChild(label);

    }

    createClassInputField = (
        element: string,
        studentCount = 1,
        callbackChangeEvent = null): kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            studentCount,
            0,
            250,
            this.integerFormat,
            callbackChangeEvent);
    }

    createClassCountInputControl = (
            element: string,
            classCount = 1,
            callbackChangeEvent: (count: number, inputControl: kendo.ui.NumericTextBox) => any = null): kendo.ui.
        NumericTextBox => {
            return this.createNumericTextBox(
                element,
                classCount,
                1,
                50,
                this.integerFormat,
                callbackChangeEvent);
        }


    // This function convert the passed element id into numerictextbox for student count input textbox
    createStudentCountInputControl = (
            element: string,
            studentCount: number = 1,
            callbackChangeEvent: (count: number, inputControl: kendo.ui.NumericTextBox) => any = null): kendo.ui.
        NumericTextBox => {
            return this.createNumericTextBox(
                element,
                studentCount,
                1,
                500,
                this.integerFormat,
                callbackChangeEvent);
        }

    createStudentCountInClassInputControl = (
            element: string,
            classItem: ClassDefinition,
            studentCount: number = 1, // use this property to overwrite the student count in classItem
            callbackChangeEvent: (classItem: ClassDefinition, inputControl: kendo.ui.NumericTextBox) => any = null):
        kendo.
        ui.NumericTextBox => {
            return this.createNumericTextBox(
                element,
                studentCount,
                1,
                250,
                this.integerFormat,
                (value, e) => {

                    if (classItem) {
                        classItem.count = value;
                    }

                    if (callbackChangeEvent != null) {
                        var inputControl = e as kendo.ui.NumericTextBox;
                        callbackChangeEvent(classItem, inputControl);
                    }
                });
        }

    // Input control to enter the number of students in a band in a bandset
    createStudentCountInBandInputControl = (
            element: string,
            bandItem: BandDefinition,
            studentCount: number = 1, // use this property to overwrite the student count in a band
            callbackChangeEvent: (bandItem: BandDefinition, inputControl: kendo.ui.NumericTextBox) => any = null): kendo
        .ui.
        NumericTextBox => {
            return this.createNumericTextBox(
                element,
                studentCount,
                1,
                250,
                this.integerFormat,
                (value, e) => {

                    if (bandItem) {
                        bandItem.studentCount = value;
                    }

                    if (callbackChangeEvent != null) {
                        var inputControl = e as kendo.ui.NumericTextBox;
                        callbackChangeEvent(bandItem, inputControl);
                    }
                });
        }

    createBandCountInBandSetInputControl = (
            element: string,
            bandSet: BandSet,
            bandCount: number, // use this property to overwrite the band count in bandSet
            callbackChangeEvent: (bandSet: BandSet, inputControl: kendo.ui.NumericTextBox) => any = null): kendo.ui.
        NumericTextBox => {
            return this.createNumericTextBox(
                element,
                bandCount,
                1,
                250,
                this.integerFormat,
                (value, e) => {
                    if (callbackChangeEvent != null) {
                        var inputControl = e as kendo.ui.NumericTextBox;
                        callbackChangeEvent(bandSet, inputControl);
                    }
                });
        }

    createStudentLanguageGrid = (element: string = "student-language-preferences-list",
        students: Array<StudentClass>,
        isUnisex: boolean): kendo.ui.Grid => {
        var columns;
        if (isUnisex) {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "gender", title: "Sex", width: "80px" },
                { field: "langPref1", title: "Pref1", width: "80px" },
                { field: "langPref2", title: "Pref1", width: "80px" },
                { field: "langPref3", title: "Pref1", width: "80px" }
            ];
        } else {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "score", title: "Score", width: "80px" },
                { field: "langPref1", title: "Pref1", width: "80px" },
                { field: "langPref2", title: "Pref1", width: "80px" },
                { field: "langPref3", title: "Pref1", width: "80px" }
            ];
        }

        var studentLanguages = Enumerable.From(students).Select(x => new StudentClassRow(x)).ToArray();
        $(`#${element}`)
            .kendoGrid({
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: studentLanguages
            });

        return $(`#${element}`).data("kendoGrid");
    }

    createPreAllocatedStudentGrid = (element: string = "preallocated-students-list",
        students: Array<PreAllocatedStudent>): kendo.ui.Grid => {
        var columns = [
            {
                field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" },
               
            },
            {
                field: "className", title: "Class", width: "80px" 
                //aggregates: ["count"] 
            },
                { field: "tested", title: "Tested", width: "80px" }
            ];

        $(`#${element}`)
            .kendoGrid({
                dataSource: {
                    schema: {
                        model: {
                            fields: {
                                name: { type: "string" },
                                className: { type: "string" },
                                tested: { type: "string" }
                            }
                        }
                    },
                    //group: {
                    //    field: "className", aggregates: [
                    //        { field: "className", aggregate: "count" }
                    //    ]
                    //},
                    data: students
                },
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                groupable: true,
                selectable: "row"

            });

        return $(`#${element}`).data("kendoGrid");
    }

    createUploadControl = (
        element: string,
        saveUrl: string,
        completeCallback: (e: any) => any): kendo.ui.Upload => {
        $(`#${element}`)
            .kendoUpload({
                async: {
                    'saveUrl': saveUrl,
                    'autoUpload': true
                },
                showFileList: false,
                localization: {
                    select: "Select File"
                },
                multiple: false,
                success: completeCallback
            });

        const uploadCtrl = $(`#${element}`).data("kendoUpload") as kendo.ui.Upload;
       
        return uploadCtrl;
    };

    createNumericTextBox = (
            element: string,
            defaultValue = 0,
            min = 0,
            max = 10,
            format = this.integerFormat,
            callbackChangeEvent: (count: number, inputControl: kendo.ui.NumericTextBox) => any = null): kendo.ui.
        NumericTextBox => {
            $(`#${element}`)
                .kendoNumericTextBox({
                    options: {},
                    change: (e) => {
                        var inputControl = e.sender as kendo.ui.NumericTextBox;
                        if (callbackChangeEvent != null) {
                            callbackChangeEvent(inputControl.value(), inputControl);
                        }
                    }
                    //spin: (e) => {
                    //    var inputControl = e.sender as kendo.ui.NumericTextBox;
                    //    if (callbackChangeEvent != null) {
                    //        callbackChangeEvent(inputControl.value(), inputControl);
                    //    }
                    //}
                } as kendo.ui.NumericTextBoxOptions);

            const numericTextBox = $(`#${element}`).data("kendoNumericTextBox");
            numericTextBox.options.format = format;
            numericTextBox.value(defaultValue);
            numericTextBox.max(max);
            numericTextBox.min(min);

            return numericTextBox;
        };

    createKendoButton = (elementName: string, clickCallback: (e: any) => any, margin = "margin: 5px;"): kendo.ui.Button => {
        $(`#${elementName}`)
            .kendoButton({
                click: (e) => {
                    const tmpCallback = clickCallback;
                    if (tmpCallback) {
                        tmpCallback(e);
                    }
                }
            });

        const kendoButton = $(`#${elementName}`).data("kendoButton");
        return kendoButton;
    }

    createButton = (caption: string, size = "btn", type = "btn-default", margin = "margin: 5px;"): HTMLButtonElement => {
        const button = document.createElement("button");
        button.id = createUuid();
        button.textContent = caption;
        button.setAttribute("class", `${size} ${type}`);
        button.setAttribute("style", `${margin}`);
        return button;
    }


    createUuid = () => {
        const s = [];
        const hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        const uuid = s.join("");
        return uuid;
    }
}