﻿class TopMiddleLowestBandClassDefinitionViewModel extends kendo.data.ObservableObject
    implements IBandClassSettings {
    constructor(public studentCount: number = 0, onStudentCountChangedEvent: (classCount: number) => any) {
        super();
        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }

    bandCount = 3;
    classCount = 1;

    private bandSet = new TopMiddleLowestBandSet(null, this.studentCount);
    private bandTableControl: BandTableControl;


    saveOptions(source: BandSet): boolean {
        return true;
    }

    loadOptions(source: BandSet): boolean {
        this.bandSet = source as TopMiddleLowestBandSet;
        super.set("bandCount", source.bands.length);
        this.bandTableControl.init("classes-settings-container", source);
        return true;
    }

    getBandSet(): BandSet {
        return this.bandSet;
    }

    genderChanged = (gender: Gender, studentCount: number) => {
        this.studentCount = studentCount;
        this.bandSet.setStudentCount(studentCount);
        this.bandTableControl.init("classes-settings-container", this.bandSet);
    }

    showStudentLanguagePreferences = () => { };
    importStudents = () => {};

    onStudentCountChangedEvent: (classCount: number) => any;
    callOnStudentCountChangedEvent = () => {
        const onStudentCountChangedEvent = this.onStudentCountChangedEvent;
        if (onStudentCountChangedEvent != null) {
            onStudentCountChangedEvent(Enumerable.From(this.bandSet.bands).SelectMany(b => b.classes).Sum(x => x.count));
        }
    };
}