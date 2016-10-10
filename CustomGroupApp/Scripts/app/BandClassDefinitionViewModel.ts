class CustomGroupBaseViewModel extends kendo.data.ObservableObject
    implements ICustomGroupViewModel, IClassSetting, IBandSetting {
    constructor(classesDefn: ClassesDefinition, onStudentCountChangedEvent: (classCount: number) => any) {
        super();

        this.classesDefn = classesDefn;
        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
    }

    private onStudentCountChangedEvent: (classCount: number) => any;

    // ReSharper disable once InconsistentNaming
    private _studentCount = 0;
    get studentCount(): number {
        return this._studentCount;
    }
    set studentCount(value: number) {

        this._studentCount = value;
        this.studentCountChanged(value);
    }

    get studentInAllClassesCount(): number {
        return 0;
    }
    set studentInAllClassesCount(value: number) {
    }

    protected studentCountChanged(value: number) {
    }

    callOnStudentCountChangedEvent = () => {
        const onStudentCountChangedEvent = this.onStudentCountChangedEvent;
        if (onStudentCountChangedEvent != null) {
            onStudentCountChangedEvent(this.studentInAllClassesCount);
        }
    };

    addBandsAndClassesControl = () => {};

    saveOptions(): boolean {
        debugger;
        // ReSharper disable InconsistentNaming
        let groupsets = Array<{ 'GroupSetId': number, 'TestNumber': number, 'Name': string, 'Students': Array<number>, 'Streaming': number }>();
        // ReSharper restore InconsistentNaming

        for (let bandItem of this.bandSet.bands) {
            for (let classItem of bandItem.classes) {
                groupsets.push(
                    {
                        GroupSetId: 0,
                        TestNumber: this.bandSet.parent.testFile.fileNumber,
                        Name: classItem.name,
                        Students: Enumerable.From(classItem.students).Select(x => x.studentId).ToArray(),
                        Streaming: bandItem.streamType
                    });
            }
        }

        $.ajax({
            type: "POST",
            url: "CustomGroup\\SaveCustomGroupSets",
            contentType: "application/json",
            data: JSON.stringify({
                'groupSets': groupsets,
                 'testNumber': this.bandSet.parent.testFile.fileNumber
            }),
            success(html) {
            },
            error(e) {
            }
        });

        return true;
    }

    loadOptions() { }

    getBandSet(): BandSet { return this.bandSet; }

    genderChanged = (gender: Gender, studentCount: number) => {
        this.studentCount = studentCount;
    }

    classesDefn: ClassesDefinition;
    bandSet: BandSet;

    onClassCountChanged = (count: number) => { }
    onBandCountChanged = (count: number) => { }
}


class BandClassDefinitionViewModel extends CustomGroupBaseViewModel {
    constructor(classesDefn: ClassesDefinition, onStudentCountChangedEvent: (classCount: number) => any) {
        super(classesDefn, onStudentCountChangedEvent);

        this.bandSet = classesDefn.createBandSet("Band", classesDefn.studentCount, 2);
        this.studentCount = classesDefn.studentCount;

        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }

    bandCount = 1;
    classCount = 1;

    protected studentCountChanged(value: number) {
        this.bandSet.studentCount = value;
    }

    private bandTableControl: BandTableControl;

    onBandCountChanged = (count: number) => {
        this.bandCount = count;
        this.addBandsAndClassesControl();
    }

    get studentInAllClassesCount(): number {
        return Enumerable.From(this.bandSet.bands).SelectMany(b => b.classes).Sum(x => x.count);
    }

    loadOptions(): boolean {
        this.bandTableControl.init("classes-settings-container", this.bandSet);
        return true;
    }

    genderChanged = (gender: Gender, studentCount: number) => {
        this.studentCount = studentCount;
        this.bandSet.studentCount = studentCount;
        this.addBandsAndClassesControl();
    }

    addBandsAndClassesControl = () => {
        this.bandSet.createBands("Band", this.studentCount, this.bandCount);
        this.bandTableControl.init("classes-settings-container", this.bandSet);
    };

}
