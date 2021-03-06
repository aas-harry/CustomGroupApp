﻿enum BandStreamType {
    None,
    Streaming,
    Parallel,
}

enum BandType {
    None = 0,
    Custom = 1,
    Top = 2,
    Middle = 3,
    Lowest = 4,
    Language = 5, // student language preference
    PreallocatedClass = 6,
    SchoolGroup = 7 // group defined by school. e.g. house

}

enum Gender {
    All = 0,
    Girls = 1,
    Boys = 2
}

enum GroupingMethod {
    Unknown,
    MixedAbility,
    Streaming,
    Banding,
    TopMiddleLowest,
    Language,
    SchoolGroup,
    Preallocated
}

enum StreamType {
    None=0,
    OverallAbilty=1,
    MathsAchievement = 2,
    English=3,
    MathsAchievementQr=4
}

function createUuid() {
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

interface IClassSetting {
    onClassCountChanged: (count: number) => any;
}

interface IBandSetting {
    onBandCountChanged: (count: number) => any;
}

interface ICustomGroupViewModel {
    classesDefn: ClassesDefinition;
    bandSet: BandSet;
    studentCount: number;
    loadOptions();
    reset();
    getBandSet(): BandSet;
    genderChanged: (gender: Gender, studentCount: number) => any;
    studentInAllClassesCount: number;
    addBandsAndClassesControl: () => any;
}

class SummaryClass {
    classNo: number;
    average: number;
    count: number;
}

class LanguageSet {
    constructor(public language1: string, public language2: string, public singleLanguage = false) {
        this.language1LowerCase = this.isNoPrefs(language1) ? "" : language1.toLowerCase();
        if (! singleLanguage) {
            this.language2LowerCase = this.isNoPrefs(language2) ? "" : language2.toLowerCase();
        }
    }

    private language1LowerCase: string;
    private language2LowerCase: string;

    public count = 0;
    public students: Array<StudentClass> = [];
    public nolanguagePrefs = false;

    get description(): string {
        if (this.singleLanguage) {
            return this.language1;
        }

        if (! this.isNoPrefs(this.language1) && ! this.isNoPrefs(this.language2)) {
            return this.language1 + " / \n" + this.language2;
        }
        if (this.language1 && !this.isNoPrefs(this.language2)) {
            return this.language1;
        }
        if (this.language2 && !this.isNoPrefs(this.language1)) {
            return this.language2;
        }
        this.nolanguagePrefs = true;
        return "No Prefs";
    }

    isEqual(language1: string, language2: string): boolean {
        language1 = this.isNoPrefs(language1) ? "" : language1;
        language2 = this.isNoPrefs(language2) ? "" : language2;

        if (this.singleLanguage) {
            return (language1.toLowerCase() === this.language1LowerCase);
        }

        if (language1.toLowerCase() === this.language1LowerCase &&
            language2.toLowerCase() === this.language2LowerCase) {
            return true;
        }
        if (language1.toLowerCase() === this.language2LowerCase &&
            language2.toLowerCase() === this.language1LowerCase) {
            return true;
        }
        return false;
    }

    isNoPrefs = (language: string): boolean => {
        if (! language) {
            return true;
        }
        language = language.toLowerCase();
        return (language === "" || language === "no" || language === "none");
    }

    public addStudent(student: StudentClass) {
        this.count++;
        this.students.push(student);
    };
}

class PreAllocatedStudent {
    name: string;
    studentId: number;
    className: string;

    get tested(): string {
        return this.studentId && this.studentId > 0 ? "Yes" : "No";
    }

    constructor(student: any) {
        this.name = student.Name;
        this.studentId = student.StudentId;
        this.className = student.Class;
    }

}

class StudentClass {
    constructor(s: Student) {
        this.source = s;
        this.uid = createUuid();

        this._name = s.name;
        this._studentId = s.studentId;
        this._gender = s.sex;
        this._dob = s.dob;
        this.setLanguagePrefs();

    }

    private source: Student;
    private class: ClassDefinition;
    // ReSharper disable InconsistentNaming
    private _studentId: number;
    private _gender: string;
    private _languagePrefs: string[];
    private _langPref1: string;
    private _langPref2: string;
    private _langPref3: string;
    private _name: string;
    private _dob: Date;
    private _schoolGroup = "";
// ReSharper restore InconsistentNaming

    uid: string;
    score: number;

    get name() {
        return this._name;
    }

    get dob() {
        return this._dob;
    }

    get gender() {
        return this.source.sex;
    }

    get studentId() { // I need to have this studentid to generate the classes
        return this._studentId;
    }

    get id() {
        return this._studentId;
    }

    get languagePrefs() {
        return this._languagePrefs;
    }

    get hasLanguagePreferences(): boolean {
        return this.languagePrefs && this.languagePrefs.length > 0;
    }

    get classNo(): number {
        return this.class ? this.class.index : 0;
    }

    get schoolGroup(): string {
        return this._schoolGroup;
    }

    get langPref1(): string {
        return this._langPref1;
    }

    get langPref2(): string {
        return this._langPref2;
    }

    get langPref3(): string {
        return this._langPref3;
    }

    // Need to call this function everytime the student language preferences change in the student property
    setLanguagePrefs = () => {
        if (!this.source) {
            return;
        }
        this._languagePrefs = this.source.languagePrefs;
        this._langPref1 = this.languagePrefs && this.languagePrefs.length > 0 ? this.languagePrefs[0] : "";
        this._langPref2 = this.languagePrefs && this.languagePrefs.length > 1 ? this.languagePrefs[1] : "";
        this._langPref3 = this.languagePrefs && this.languagePrefs.length > 2 ? this.languagePrefs[2] : "";
    }
    // Need to call this function everytime the school group change in the student property
    setSchoolGroups = () => {
        if (!this.source) {
            return;
        }
        this._schoolGroup = this.source.schoolGroup;
    }

    overallAbilityScore = (): number => {
        return this.source.overallAbilityScore();
    }

    mathsAchievementScore = (): number => {
        return this.source.mathsAchievementScore();
    }

    mathsAchievementQrScore = (): number => {
        return this.source.mathsAchievemenQrScore();
    }

    englishScore = (): number => {
        return this.source.englishScore();
    }


    bandNo: number;
    flag: number;
    canMoveToOtherClass = true;

    setClass = (classItem: ClassDefinition) => {
        if (!classItem) {
            this.canMoveToOtherClass = true;
        }
        this.class = classItem;
    }

    swapWith = (studentTo: StudentClass) => {
        var fromClass = this.class;
        var toClass = studentTo.class;
        toClass.removeStudent(studentTo);
        fromClass.removeStudent(this);

        toClass.addStudent(this);
        fromClass.addStudent(studentTo);
    }

    copy = (): StudentClass => {
        return new StudentClass(this.source);
    }
}

class GroupContext {
    mixBoysGirls = false;
    separatedStudents: Array<StudentSet> = [];
    joinedStudents: Array<StudentSet> = [];
}

class SearchClassContext {
    constructor(public classNo: number,
        public firstClassNo: number,
        public lastClassNo: number,
        public isLastClass: boolean) {
    }
}

class GroupingHelper {

    private commonUtils = new CommonUtils();

    // This function can be used to convert GroupingMethod and BandStreamType string
    convertGroupingOptionFromString = (groupType: string): GroupingMethod => {
        switch (groupType) {
        case "Parallel":
        case "MixedAbility":
            return GroupingMethod.MixedAbility;
        case "Streaming":
            return GroupingMethod.Streaming;
        case "Banding":
            return GroupingMethod.Banding;
        case "TopMiddleLowest":
            return GroupingMethod.TopMiddleLowest;
        case "Language":
            return GroupingMethod.Language;
        case "Preallocated":
            return GroupingMethod.Preallocated;
        case "SchoolGroup":
            return GroupingMethod.SchoolGroup;
        case "Unknown":
        case "None":
            return GroupingMethod.Unknown;
        default:
            alert("incorrect type");
            return GroupingMethod.Unknown;
        }
    }

    convertStreamTypeFromString = (streamType: string): StreamType => {
        switch (streamType) {
        case "OverallAbilty":
            return StreamType.OverallAbilty;
        case "English":
            return StreamType.English;
        case "MathsAchievement":
            return StreamType.MathsAchievement;
        case "MathsAchievementQr":
            return StreamType.MathsAchievementQr;
        case "None":
            return StreamType.None;
        default:
            alert("incorrect type");
            return StreamType.None;
        }
    }

    convertGenderFromString = (gender: string): Gender => {
        switch (gender) {
        case "All":
            return Gender.All;
        case "Girls":
            return Gender.Girls;
        case "Boys":
            return Gender.Boys;
        default:
            alert("incorrect type");
            return Gender.All;
        }
    }
    createBlankClasses = (parent: BandDefinition, totalStudents: number, classCount: number):
        Array<ClassDefinition> => {
            var classSizes = this.calculateClassesSize(totalStudents, classCount);

            var classes = new Array<ClassDefinition>();
            for (let i = 0; i < classCount; i++) {
                classes.push(new ClassDefinition(parent, i + 1, classSizes[i]));
            }
            return classes;
        };

    calculateClassesSize = (totalStudents: number, classCount: number): Array<number> => {
        var studentInClass = Math.floor(totalStudents / classCount);
        var remainingStudents = totalStudents - (studentInClass * classCount);

        var classes = new Array<number>();
        for (let i = 0; i < classCount; i++) {
            classes.push(studentInClass + (remainingStudents > 0 ? 1 : 0));
            remainingStudents--;
        }
        return classes;
    };

    setOveralAbilityScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].overallAbilityScore();
        }
    };

    setEnglishScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].englishScore();
        }
    };

    setMathAchievementScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].mathsAchievementScore();
        }
    };

    setMathAchievementQrScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].mathsAchievementQrScore();
        }
    };

    calculateTotalScore = (students: Array<StudentClass>, streamType: StreamType) => {
        if (streamType === StreamType.OverallAbilty) {
            this.setOveralAbilityScore(students);
        }
        if (streamType === StreamType.English) {
            this.setEnglishScore(students);
        }
        if (streamType === StreamType.MathsAchievement) {
            this.setMathAchievementScore(students);
        }
        if (streamType === StreamType.MathsAchievementQr) {
            this.setMathAchievementQrScore(students);
        }
    };

    handleSeparatedStudents = (classes: Array<ClassDefinition>, separatedStudents: Array<StudentSet>) => {
        var students = Enumerable.From(classes).SelectMany(s => s.students).ToArray();

        for (let studentSet of separatedStudents) {
            const tmpStudentSet = studentSet.filterStudents(students);
            if (!tmpStudentSet) {
                continue;
            }

            const allocatedClasses = new Array<number>();
            const studentClasses = Enumerable.From(tmpStudentSet.students)
                .GroupBy(x => x.classNo, x => x)
                .ToArray();

            // Check if all the students are in different class already
            if (Enumerable.From(studentClasses).All(x => x.source.length === 1)) {
                for (let s of studentClasses) {
                    s.source[0].canMoveToOtherClass = false;
                }
                continue;
            }

            const flattenedStudentList = Enumerable.From(classes).SelectMany(c => c.students).ToArray();
            for (let classGroup of studentClasses) {
                if (classGroup.source.length === 1) {
                    // he/she is already in separate class
                    classGroup.source[0].canMoveToOtherClass = false;
                    allocatedClasses.push(classGroup.Key());
                    continue;
                }

                allocatedClasses.push(classGroup.Key());
                for (let j = 1; j < classGroup.source.length; j++) {
                    const s = classGroup.source[j];
                    let replacement = this.findStudentReplacement(s, flattenedStudentList, allocatedClasses, true);
                    // if cannot find the replacement student with the same gender, try again with any gender
                    if (replacement == null &&
                        Enumerable.From(classes).SelectMany(c => c.students).Any(x => x.gender === "M") &&
                        Enumerable.From(classes).SelectMany(c => c.students).Any(x => x.gender === "F")) {
                        replacement = this.findStudentReplacement(s, flattenedStudentList, allocatedClasses, false);
                    }
//                    console.log("Student: " + s.name, s.classNo, replacement.name, replacement.classNo);
                    if (replacement != null) {
                        s.swapWith(replacement);
                        s.canMoveToOtherClass = false;
                        allocatedClasses.push(s.classNo);
                    }
                }
            }
        }
    };


    handleJoinedStudents = (classes: Array<ClassDefinition>, joinedStudents: Array<StudentSet>) => {
        var students = Enumerable.From(classes).SelectMany(s => s.students).ToArray();

        for (let studentSet of joinedStudents) {
            const tmpStudentSet = studentSet.filterStudents(students);
            if (!tmpStudentSet) {
                continue;
            }

            const allocatedClasses = new Array<number>();
            const studentClasses = Enumerable.From(tmpStudentSet.students)
                .GroupBy(x => x.classNo, x => x)
                .ToArray();

            // All students are already in the same class
            if (studentClasses.length === 1) {
                for (let s of studentClasses[0].source) {
                    s.canMoveToOtherClass = false;
                }
                continue;
            }

            // Find the class with most number of free students (can be moved students)
            let classDest = -1;
            let cnt = 0;
            for (let classgroup of studentClasses) {
                const freeStudentCount = classes[classgroup.Key() - 1].freeStudentCount;
                if (cnt < freeStudentCount) {
                    classDest = classgroup.Key();
                    cnt = freeStudentCount;
                }
            }
            // Add all the students to the class which has most of the students already
            for (let classgroup of studentClasses) {
                for (let s of classgroup.source) {
                    if (s.classNo === classDest) {
                        continue;
                    }

                    let replacement = this
                        .findStudentReplacement(s, classes[classDest - 1].students, allocatedClasses, true);
                    // if cannot find the replacement student with the same gender, try again with any gender
                    if (replacement == null &&
                        Enumerable.From(classes).SelectMany(c => c.students).Any(x => x.gender === "M") &&
                        Enumerable.From(classes).SelectMany(c => c.students).Any(x => x.gender === "F")) {
                        replacement = this
                            .findStudentReplacement(s, classes[classDest - 1].students, allocatedClasses, false);
                    }
                    // console.log("Student: " + s.name, s.classNo, replacement.name, replacement.classNo);
                    if (replacement != null) {
                        s.swapWith(replacement);
                        s.canMoveToOtherClass = false;
                    }
                }
            }
        }
    };

    getStudentsFromOtherBand = (fromBand: BandDefinition,
        count: number,
        condition: (student: StudentClass) => boolean): Array<StudentClass> => {
        const students = new Array<StudentClass>();
        const studentCount = Enumerable.From(fromBand.classes).Sum(x => x.count);
        let pos = 0;
        while (count > 0 && pos < fromBand.students.length && studentCount < fromBand.students.length) {
            let student = fromBand.students[pos];
            if (!condition(student)) {
                pos++;
                continue;
            }

            students.push(student);
            fromBand.students.splice(pos, 1);
            count--;
        }
        return students;
    }

    private findStudentReplacement = (student: StudentClass,
        students: Array<StudentClass>,
        allocatedClasses: Array<number>,
        sameGender = false): StudentClass => {

        var tmpStudents: Array<StudentClass>;
        if (sameGender) {
            tmpStudents = Enumerable.From(students)
                .Where(s => s.canMoveToOtherClass &&
                    s.gender === student.gender &&
                    ! Enumerable.From(allocatedClasses).Contains(s.classNo))
                .Select(s => s)
                .ToArray();
        } else {
            tmpStudents = Enumerable.From(students)
                .Where(s => s.canMoveToOtherClass && !Enumerable.From(allocatedClasses).Contains(s.classNo))
                .Select(s => s)
                .ToArray();
        }

        // Try to find students with 10, 20, 30, 40, 50 score difference first before pick any students
        for (var diff of [10, 20, 30, 40, 50, 300]) {
            var replacement = Enumerable.From(tmpStudents)
                .FirstOrDefault(null, x => x.canMoveToOtherClass && Math.abs(x.score - student.score) <= diff);
            if (replacement != null) {
                return replacement;
            }
        }

        return null;
    };

    groupByStreaming = (classes: Array<ClassDefinition>,
        students: Array<StudentClass>,
        streamType: StreamType,
        mixBoysGirls: boolean,
        joinedStudents: Array<StudentSet> = [],
        separatedStudents: Array<StudentSet> = []) => {

        this.calculateTotalScore(students, streamType);

        if (!mixBoysGirls) {
            this.groupByStreamingInternal(classes, students);
        } else {
            const femaleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();
            const maleStudents = Enumerable.From(students).Where(s => (s.gender === "M")).Select(s => s).ToArray();

            var parentBand = classes[0].parent;
            if (femaleStudents.length < maleStudents.length) {
                this.genderSplitByStreaming(parentBand, femaleStudents, classes);
                this.groupByStreamingInternal(classes, maleStudents);
            } else {
                this.genderSplitByStreaming(parentBand, maleStudents, classes);
                this.groupByStreamingInternal(classes, femaleStudents);
            }
        }
        this.handleJoinedStudents(classes, joinedStudents);
        this.handleSeparatedStudents(classes, separatedStudents);
    };

    genderSplitByStreaming = (parentBand: BandDefinition,
        students: Array<StudentClass>,
        classes: Array<ClassDefinition>) => {
        const tmpClasses = this.createBlankClasses(parentBand, students.length, classes.length);
        this.groupByStreamingInternal(tmpClasses, students);
        for (let i = 0; i < tmpClasses.length; i++) {
            for (let s of tmpClasses[i].students) {
                classes[i].addStudent(s);
            }
        }
    }

    groupByMixAbility = (classes: Array<ClassDefinition>,
        students: Array<StudentClass>,
        streamType: StreamType,
        mixBoysGirls: boolean,
        joinedStudents: Array<StudentSet> = [],
        separatedStudents: Array<StudentSet> = []) => {

        this.calculateTotalScore(students, streamType);

        if (!mixBoysGirls) {
            this.groupByMixAbilityInternal(classes, students);
        } else {
            var femaleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();
            var maleStudents = Enumerable.From(students).Where(s => (s.gender === "M")).Select(s => s).ToArray();

            if (femaleStudents.length < maleStudents.length) {
                this.groupByMixAbilityInternal(classes, femaleStudents);
                this.groupByMixAbilityInternal(classes, maleStudents, true);
            } else {
                this.groupByMixAbilityInternal(classes, maleStudents);
                this.groupByMixAbilityInternal(classes, femaleStudents, true);
            }
        }
        this.handleJoinedStudents(classes, joinedStudents);
        this.handleSeparatedStudents(classes, separatedStudents);

    };


    private groupByMixAbilityInternal = (classes: Array<ClassDefinition>,
        students: Array<StudentClass>,
        orderReversed: boolean = false) => {
        var sortedStudents = orderReversed === false
            ? Enumerable.From(students).OrderByDescending(s => s.score).Select(s => s).ToArray()
            : Enumerable.From(students).OrderBy(s => s.score).Select(s => s).ToArray();

        var classCount = classes.length;
        var nextClass = new SearchClassContext(0, 0, classCount - 1, false);
        /// TODO: Check if no classes allocated
        for (let i = 0; i < sortedStudents.length; i++) {
            classes[nextClass.classNo].addStudent(sortedStudents[i]);
            nextClass = this.getNextClassToAddNewStudent(classes, nextClass);
        }
        return classes;
    };

    private getNextClassToAddNewStudent = (classes: Array<ClassDefinition>, context: SearchClassContext):
        SearchClassContext => {
            // this is the logic to get the next class
            // 1. Get the next available class 
            // 2. If the next class is the last class and then we need to ctart again from the last initial class no + 1
            //    This is will distribute the smarter students evently across all classes.

            var result = new SearchClassContext(-1, context.firstClassNo, context.lastClassNo, false);
            var nextClassNo: number;
            if (context.isLastClass) {
                nextClassNo = context.firstClassNo;
                result.lastClassNo = nextClassNo < classes.length ? context.firstClassNo : (classes.length - 1);
                result.firstClassNo = nextClassNo < classes.length ? (nextClassNo + 1) : 0;
            } else {
                nextClassNo = context.classNo;
            }

            // get the class in the right order to pick up
            var classQueue = [];
            for (let i = nextClassNo + 1; i < classes.length; i++) {
                classQueue.push(classes[i]);
            }
            for (let i = 0; i <= nextClassNo; i++) {
                /// TODO : check this condition
                if (i < classes.length) {
                    classQueue.push(classes[i]);
                }
            }

            for (let i = 0; i < classQueue.length; i++) {
                if (classQueue[i].students.length >= classQueue[i].count) {
                    continue;
                }
                result.classNo = classQueue[i].index - 1;

                // we have reach the last class
                if (result.lastClassNo === (classQueue[i].index - 1)) {
                    result.isLastClass = true;
                }
                break;
            }

            // If all groups have been completed, add the rest of the students into first group
            if (result.classNo === -1) {
                result.classNo = 0;
            }
            return result;
        };

    private groupByStreamingInternal = (classes: Array<ClassDefinition>, students: Array<StudentClass>) => {
        var sortedStudents = Enumerable.From(students).OrderByDescending(s => s.score).Select(s => s).ToArray();
        var classNo = 0;
        for (let i = 0; i < sortedStudents.length; i++) {
            classes[classNo].addStudent(sortedStudents[i]);
            if (classes[classNo].moreStudents <= 0) {
                classNo++;
                if (classNo >= classes.length) {
                    break;
                }
            }
        }
        return classes;
    };

    exportGroupSetIds = (testFile: TestFile,
        groupSets: Array<number>,
        exportType = "csv",
        callback: (boolean, message) => any) => {

        const exportGroupDialog = new ExportCustomGroupDialog();
        exportGroupDialog.openDialog(document.getElementById("popup-window-container"),
            false,
            testFile.hasStudentLanguagePrefs,
            testFile.hasStudentIds,
            (status: boolean, includeResults: boolean, includeLang: boolean, includeStudentId: boolean) => {

                if (status) {
                    this.exportGroupInternal(testFile.fileNumber,
                        groupSets,
                        exportType,
                        includeResults,
                        includeLang,
                        includeStudentId,
                        callback);
                }
            });
    };

    exportGroupSet = (testFile: TestFile,
        bandSet: BandSet,
        exportType = "csv",
        callback: (boolean, message) => any) => {
        var groupSets = Enumerable.From(bandSet.bands).SelectMany(b => b.classes).Select(c => c.groupSetid).ToArray();

        this.exportGroupSetIds(testFile, groupSets, exportType, callback);
    }

    private exportGroupInternal = (testNumber: number,
        groupSets: Array<number>,
        exportType = "csv",
        includeResults: boolean,
        includeLang: boolean,
        includeStudentId: boolean,
        callback: (boolean, message) => any) => {

        toastr.info("Exporting custom groups...");

        var exportTypeUrl = exportType === "csv"
            ? "..\\Home\\ExportGroupSetsToCsv"
            : "..\\Home\\ExportGroupSetsToExcel";
        $.ajax({
            url: exportTypeUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                testNum: testNumber,
                groupSets: groupSets,
                includeResults: includeResults,
                includeLang: includeLang,
                includeStudentId: includeStudentId
            }),
            success: result => {
                if (result.status) {
                    toastr.success("Finished exporting custom groups");

                    window.open(result.urlLink);
                } else {
                    toastr.warning(result.message,
                        "",
                        {
                            "closeButton": true,
                            "positionClass": "toast-top-full-width",
                            "hideDuration": 100,
                            "showDuration": 100,
                            "timeOut": 10000
                        });
                }

                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(result.status, result.message);
                }
            },
            error: (() => {})
        });
    }

    updateGroupName = (classDefn: ClassDefinition, callback: (boolean) => any) => {
        $.ajax({
            type: "POST",
            url: "..\\Customgroup\\UpdateGroupSetName",
            contentType: "application/json",
            data: JSON.stringify({ 'groupSetId': classDefn.groupSetid, 'groupName': classDefn.name }),
            success(data) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(true);
                }
            },
            error(e) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(false);
                }
            }
        });
    }

    mergeClasses = (groupSets: Array<number>,
        testnum: number,
        groupName: string,
        callback: (boolean, classItem: ClassDefinition, message: string) => any) => {
        $.ajax({
            type: "POST",
            url: "..\\CustomGroup\\MergeCustomGroupSets",
            contentType: "application/json",
            data:
                JSON.stringify({
                    'groupSets': groupSets,
                    'testnum': testnum,
                    'groupName': groupName
                }),
            success(result) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(result.status, result.classItem, result.message);
                }
            },
            error(e) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(e.status, null, null);
                }
            }
        });
    }

    deleteClasses = (groupSets: Array<number>, testnum: number, callback: (boolean) => any) => {
        $.ajax({
            type: "POST",
            url: "..\\CustomGroup\\DeleteCustomGroupSets",
            contentType: "application/json",
            data:
                JSON.stringify({
                    'groupSets': groupSets,
                    'testnum': testnum
                }),
            success(status) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(true);
                }
            },
            error(e) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(false);
                }
            }
        });
    }

    getStudentSets = (testnum: number, callback: (boolean, any) => any) => {
        $.ajax({
            type: "POST",
            url: "..\\Customgroup\\GetStudentSets",
            contentType: "application/json",
            data: JSON.stringify({ 'testnum': testnum }),
            success(data) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(data.Status, data.Results);
                }
            },
            error(e) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(false, null);
                }
            }
        });
    }

    updateStudentSets = (testnum: number, studentSets: Array<StudentSet>, callback: (boolean, any) => any) => {
        const studentGroups = [];
        for (let studentSet of studentSets) {
            let studentIds = null;
            for (let student of studentSet.students) {
                studentIds = studentIds ? studentIds + "," + student.studentId : student.studentId;
            }
            studentGroups.push({
                Id: studentSet.rowId,
                Testnum: testnum,
                GroupType: studentSet.type,
                Students: studentIds
            });
        }

        $.ajax({
            type: "POST",
            url: "..\\Customgroup\\UpdateStudentSets",
            contentType: "application/json",
            data: JSON.stringify(
            {
                'testnum': testnum,
                'studentGroups': studentGroups
            }),
            success(data) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(data.Status, data.Results);
                }
            },
            error(e) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(false, null);
                }
            }
        });
    }

    updateStudentsInClass = (classDefn: ClassDefinition, callback: (boolean) => any) => {
        $.ajax({
            type: "POST",
            url: "..\\Customgroup\\UpdateStudentsInClass",
            contentType: "application/json",
            data: JSON.stringify(
            {
                'groupSetId': classDefn.groupSetid,
                'students': Enumerable.From(classDefn.students).Select(s => s.studentId).ToArray()
            }),
            success(data) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(true);
                }
            },
            error(e) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(false);
                }
            }
        });
    }

    addDeleteStudentsInClass = (addIntoClassId: number,
        addStudents: Array<number>,
        deleteFromClassId: number,
        deleteStudents: Array<number>,
        callback: (boolean) => any) => {
        $.ajax({
            type: "POST",
            url: "..\\Customgroup\\AddDeleteStudentsInClass",
            contentType: "application/json",
            data: JSON.stringify(
            {
                'addIntoClassId': addIntoClassId,
                'addStudents': addStudents,
                'deleteFromClassId': deleteFromClassId,
                'deleteStudents': deleteStudents
            }),
            success(data) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(true);
                }
            },
            error(e) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(false);
                }
            }
        });
    }

    addClass = (testNumber: number, classItem: ClassDefinition, callback: (status: boolean, classItem: any) => any) => {
        const self = this;
        // ReSharper disable InconsistentNaming
        var groupsets = Array<{
            'GroupSetId': number,
            'TestNumber': number,
            'Name': string,
            'Students': Array<number>,
            'Streaming': number,
            'GroupId': string
        }>();
        groupsets.push(
        {
            GroupSetId: 0,
            TestNumber: testNumber,
            Name: classItem.name,
            Students: Enumerable.From(classItem.students).Select(x => x.studentId).ToArray(),
            Streaming: classItem.streamType,
            GroupId: this.commonUtils.createUid()
        });

        // ReSharper restore InconsistentNaming


        $.ajax({
            type: "POST",
            url: "..\\Customgroup\\SaveCustomGroupSets",
            contentType: "application/json",
            data: JSON.stringify({ 'groupSets': groupsets, 'testNumber': testNumber }),
            success(data) {


                const tmpCallback = callback;
                if (tmpCallback) {
                    if (data && data.GroupSets.length === 1) {
                        tmpCallback(true, data.GroupSets[0]);
                    } else {
                        tmpCallback(false, null);
                    }

                }

            },
            error(e) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(false, null);
                }
            }
        });
    }

    saveClasses = (bandSet: BandSet, callback: (boolean, classItems: Array<ClassDefinition>) => any) => {
        const self = this;
        // ReSharper disable InconsistentNaming
        var groupsets = Array<{
            'GroupSetId': number,
            'TestNumber': number,
            'Name': string,
            'Students': Array<number>,
            'Streaming': number,
            'GroupId': string
        }>();
        // ReSharper restore InconsistentNaming

        var groupId = this.commonUtils.createUid();

        for (let bandItem of bandSet.bands) {
            for (let classItem of bandItem.classes) {
                groupsets.push(
                {
                    GroupSetId: 0,
                    TestNumber: bandSet.parent.testFile.fileNumber,
                    Name: classItem.name,
                    Students: Enumerable.From(classItem.students).Select(x => x.studentId).ToArray(),
                    Streaming: bandItem.streamType,
                    GroupId: groupId
                });
            }
        }


        $.ajax({
            type: "POST",
            url: "..\\Customgroup\\SaveCustomGroupSets",
            contentType: "application/json",
            data: JSON.stringify({ 'groupSets': groupsets, 'testNumber': bandSet.parent.testFile.fileNumber }),
            success(data) {
                const lookup = Enumerable.From(data.GroupSets).ToDictionary(x => x.Name, x => x.Id);
                const classItems = new Array<ClassDefinition>();
                // update the groupset id in classes
                for (let bandItem of bandSet.bands) {
                    for (let classItem of bandItem.classes) {
                        if (lookup.Contains(classItem.name)) {
                            classItem.groupSetid = lookup.Get(classItem.name);
                            classItems.push(classItem);
                        }
                    }
                }

                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(true, classItems);
                }

            },
            error(e) {
                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(false, null);
                }
            }
        });
    }

    downloadTemplateFile = (templateName: string, testNumber: number) => {
        $.ajax({
            type: "POST",
            url: `..\\Customgroup\\${templateName}`,
            contentType: "application/json",
            data: JSON.stringify({ 'testNumber': testNumber }),
            success(url) {
                if (url === "Error: Your connection to this website has timed out. Please login again.") {
                    return;
                }
                url = url.replace('"', "").replace('"', "");
                window.open(url, "_blank");
            }
        });
    }
}

enum StudentSetType {
    None = 0,
    Paired = 1,
    Separated = 2,
    CustomGroup = 3
}

class StudentSet {
    constructor(type: StudentSetType) {
        this.studentSetId = this.kendoHelper.createUuid();
        this.type = type;
    }

    private kendoHelper = new KendoHelper();
    rowId: number; // this is the record number in the database
    studentSetId: string;
    setName: string;
    type: StudentSetType;

    // ReSharper disable InconsistentNaming
    private _students: Array<StudentClass> = [];
    private _studentList: string;
    // ReSharper restore InconsistentNaming

    get students() {
        return this._students;
    }

    set students(value) {
        this._students = value;
        this._studentList = Enumerable.From(this._students).Take(5).Select(x => x.name).ToString(",") +
            (this._students.length > 5 ? " and more..." : "");
    }

    get studentList() {
        return this._studentList;
    }

    // Create a new copy studentset that has students in students list
    filterStudents = (students: Array<StudentClass>): StudentSet => {
        const result = new StudentSet(this.type);
        const lookup = Enumerable.From(students).ToDictionary(s => s.studentId, s => s);
        for (let s of this.students) {
            if (lookup.Contains(s.studentId)) {
                result.students.push(lookup.Get(s.studentId));
            }
        }

        return result.students.length > 0 ? result : null;
    }
}

class ClassDefinition {
    constructor(public parent: BandDefinition, public index: number, public count: number = 0, public notUsed = false) {
        this.uid = createUuid();
    }

    // ReSharper disable InconsistentNaming
    _streamType: StreamType;
    // ReSharper restore InconsistentNaming
    groupSetid: number;
    uid: string;
    name: string;
    students: Array<StudentClass> = [];
    average: number;
    boysCount: number;
    girlsCount: number;
    boysAverage: number;
    girlsAverage: number;
    isSelected: boolean;

    get streamType(): StreamType {
        return this._streamType;
    }

    set streamType(value: StreamType) {
        this._streamType = value;
        if (this.students && this.students.length > 0) {
            this.calculateScore(value);
            this.calculateClassesAverage();
        }
    }

    // ReSharper disable once InconsistentNaming
    private _notAllocatedStudentCount: number;
    preallocatedStudentCount = 0;

    get notAllocatedStudentCount(): number {
        return this._notAllocatedStudentCount;
    };

    set notAllocatedStudentCount(value) {
        this._notAllocatedStudentCount = value;
        this.count = value + this.preallocatedStudentCount;
    }

    get freeStudentCount(): number {
        return Enumerable.From(this.students).Count(x => x.canMoveToOtherClass);
    }

    get moreStudents(): number {
        return this.count - (this.students ? this.students.length : 0);
    }

    addStudent = (student: StudentClass, canbeMoved = true) => {
        if (Enumerable.From(this.students).Any(x => x.id === student.id)) {
            return;
        }
        student.setClass(this);
        student.canMoveToOtherClass = canbeMoved;
        this.students.push(student);
    }

    removeStudent = (student: StudentClass) => {
        student.setClass(null);
        for (let i = 0; i < this.students.length; i++) {
            if (this.students[i].id === student.id) {
                this.students.splice(i, 1);
                return;
            }
        }
    }

    private padLeft = (value: number, length: number): string => {
        var str = '' + value;
        while (str.length < length) {
            str = `0${str}`;
        }
        return str;
    }

    clearAddStudents = (students: Array<StudentClass>) => {
        this.students = [];
        for (const s of students) {
            this.addStudent(s);
        }
    }


    copy = (source: ClassDefinition) => {
        this.groupSetid = source.groupSetid;
        this.name = source.name;
        this.streamType = source.streamType;
        this.clearAddStudents(source.students);
        this.calculateScore(this.streamType);
        this.calculateClassesAverage();
    }
    private getNumberDigits = (val: number): number => {
        if (val < 10) {
            return 1;
        }
        if (val < 100) {
            return 2;
        }
        return 3;
    }

    prepare = (name: string) => {
        switch (this.parent.bandType) {
        case BandType.None:
            this.name = name + " " + this.padLeft(this.index, this.getNumberDigits(this.parent.classCount));
            break;
        case BandType.Language:
            this.name = name + " " + this.padLeft(this.index, this.getNumberDigits(this.parent.classCount));
            break;
        case BandType.Custom:
            this.name = name +
                " " +
                this.padLeft(this.index, this.getNumberDigits(this.parent.classCount)) +
                " of " +
                this.parent.bandNo;
            break;
        case BandType.Top:
            this.name = name + " " + "Top " + this.padLeft(this.index, this.getNumberDigits(this.parent.classCount));
            break;
        case BandType.Middle:
            this.name = name + " " + "Middle " + this.padLeft(this.index, this.getNumberDigits(this.parent.classCount));
            break;
        case BandType.Lowest:
            this.name = name + " " + "Lowest " + this.padLeft(this.index, this.getNumberDigits(this.parent.classCount));
            break;
        default:
            this.name = name + " " + this.padLeft(this.index, this.getNumberDigits(this.parent.classCount));
            break;
        }
    }

    calculateScore = (streamType: StreamType) => {
        switch (streamType) {
        case StreamType.English:
            Enumerable.From(this.students).ForEach(s => s.score = s.englishScore());
            break;

        case StreamType.MathsAchievement:
            Enumerable.From(this.students).ForEach(s => s.score = s.mathsAchievementScore());
            break;

        default:
            Enumerable.From(this.students).ForEach(s => s.score = s.overallAbilityScore());
            break;

        }
    }

    calculateClassesAverage = () => {
        this.average = Enumerable.From(this.students).Average(x => x.score);
        this.count = this.students.length;
        const boys = Enumerable.From(this.students).Where(x => x.gender === "M").ToArray();
        const girls = Enumerable.From(this.students).Where(x => x.gender === "F").ToArray();

        this.boysCount = boys.length;
        if (this.boysCount === 0) {
            this.boysAverage = 0;
        } else {
            this.boysAverage = Enumerable.From(boys).Average(x => x.score);
        }

        this.girlsCount = girls.length;
        if (this.girlsCount === 0) {
            this.girlsAverage = 0;
        } else {
            this.girlsAverage = Enumerable.From(girls).Average(x => x.score);
        }
    };
    saveGroupName = (callback: (boolean) => any) => {
        if (!this.name || this.name === "") {
            const tmpCallback = callback;
            if (tmpCallback) {
                tmpCallback(false);
            }
            return;
        }


    }
}

class BandDefinition {
    constructor(public parent: BandSet,
        public bandNo: number,
        public bandName: string,
        public studentCount: number,
        public classCount: number = 1,
        public bandType = BandType.None,
        public streamType = StreamType.OverallAbilty,
        public groupType = GroupingMethod.Streaming,
        public mixBoysGirls: boolean = false) {

        this.uid = createUuid();
        this.setClassCount(classCount);
    }

    uid: string;
    students: Array<StudentClass> = [];
    classes: Array<ClassDefinition> = [];
    // true if the band is used as a bucket for students which are not in other bands and later need to be split to those bands.
    // E.g. language preferences classes, student who don't have language preference will be added to other language bands
    commonBand = false;

    languageSet: LanguageSet;
    private groupHelper = new GroupingHelper();

    setClassCount = (classCount: number) => {
        this.classCount = classCount;
        this.classes = this.groupHelper.createBlankClasses(this, this.studentCount, classCount);
    };

    calculateClassesAverage = () => {
        for (let classDefn of this.classes) {
            classDefn.calculateClassesAverage();
        }
    };

    prepare = (name: string,
        students: Array<StudentClass> = null,
        joinedStudents: Array<StudentSet> = [],
        separatedStudents: Array<StudentSet> = [],
        resetClasses = true) => {
        if (students) {
            this.students = students;
        }

        // Reset the students list
        if (resetClasses) {
            for (let classItem of this.classes) {
                classItem.students = [];
            }
        }

        switch (this.groupType) {
        case GroupingMethod.MixedAbility:
            this.groupHelper.groupByMixAbility(this.classes,
                this.students,
                this.streamType,
                this.mixBoysGirls,
                joinedStudents,
                separatedStudents);
            break;
        case GroupingMethod.Streaming:
            this.groupHelper.groupByStreaming(this.classes, this.students, this.streamType, this.mixBoysGirls);
            break;
        case GroupingMethod.Banding:
        case GroupingMethod.TopMiddleLowest:
        case GroupingMethod.Language:
        case GroupingMethod.SchoolGroup:
            break;
        }

        this.groupHelper.handleJoinedStudents(this.classes, joinedStudents);
        this.groupHelper.handleSeparatedStudents(this.classes, separatedStudents);

        for (let i = 0; i < this.classes.length; i++) {
            this.classes[i].prepare(name);
            this.classes[i].calculateClassesAverage();
        }
    };

    private calculateClassesSize = (classCount: number) => {
        var studentInClass = Math.floor(this.studentCount / classCount);
        var remainingStudents = this.studentCount - (studentInClass * classCount);

        this.classes = [];
        for (let i = 0; i < classCount; i++) {
            this.classes.push(new ClassDefinition(this, i + 1, studentInClass + (remainingStudents > 0 ? 1 : 0)));
            remainingStudents--;
        }
    };
}

class BandSet {
    constructor(public parent: ClassesDefinition,
        public name: string,
        public studentCount: number,
        bandCount: number = 1,
        public bandType = BandType.None,
        public bandStreamType = BandStreamType.Streaming,
        public streamType = StreamType.OverallAbilty,
        public groupType = GroupingMethod.Streaming,
        public mixBoysGirls = false) {

        this.uid = createUuid();
        this.createBands(name, studentCount, bandCount, bandType, streamType, groupType, mixBoysGirls);
    }

    uid: string;
    students: Array<StudentClass> = [];
    bands: Array<BandDefinition>;

    // ReSharper disable once InconsistentNaming
    private _bankCount: number;

    get bandCount(): number {
        return this.bands ? this.bands.length : 0;
    }

    protected groupingHelper = new GroupingHelper();

    prepare = (name: string,
        students: Array<StudentClass>,
        joinedStudents: Array<StudentSet> = [],
        separatedStudents: Array<StudentSet> = [],
        resetClasses = true) => {
        this.students = students;

        if (this.bandCount === 1) {
            this.bands[0].students = this.students;
            this.bands[0].prepare(name, this.students, joinedStudents, separatedStudents, resetClasses);
            return;
        }
        var classes = this.convertToClasses(this);
        // Reset the students list
        if (resetClasses) {
            for (let classItem of classes) {
                classItem.students = [];
            }
        }
        if (this.bandStreamType === BandStreamType.Streaming) {
            this.groupingHelper.groupByStreaming(classes,
                this.students,
                this.streamType,
                this.mixBoysGirls);
        } else {
            this.groupingHelper.groupByMixAbility(classes,
                this.students,
                this.streamType,
                this.mixBoysGirls);
        }

        this.groupingHelper.handleJoinedStudents(classes, joinedStudents);
        this.groupingHelper.handleSeparatedStudents(classes, separatedStudents);

        for (let i = 0; i < this.bands.length; i++) {
            this.bands[i].students = classes[i].students;
            this.bands[i].prepare(name, null, joinedStudents, separatedStudents);
        }
    }


    createBands = (name: string,
        studentCount: number,
        bandCount: number,
        bandType: BandType = BandType.Custom,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls: boolean = false) => {

        var tmpBands = this.groupingHelper.calculateClassesSize(studentCount, bandCount);

        this.bands = [];
        for (let i = 0; i < bandCount; i++) {
            const bandNo = i + 1;
            const band = new BandDefinition(this,
                bandNo,
                name + " " + bandNo,
                tmpBands[i],
                1,
                bandType,
                streamType,
                groupType,
                mixBoysGirls);

            this.bands.push(band);
        }
    };

    protected convertToClasses = (bandSet: BandSet): Array<ClassDefinition> => {
        var classes = new Array<ClassDefinition>();
        for (let i = 0; i < bandSet.bands.length; i++) {
            classes.push(new ClassDefinition(null, i + 1, bandSet.bands[i].studentCount));
        }
        return classes;
    };
}

class CustomBandSet extends BandSet {
    constructor(public parent: ClassesDefinition,
        public studentCount: number,
        public bandCount: number = 1,
        bandStreamType = BandStreamType.Streaming,
        bandType = BandType.None,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls: boolean = false) {
        super(parent, "Custom", studentCount, bandCount, bandType, bandStreamType, streamType, groupType, mixBoysGirls);
    }

    prepare = (name: string, students: Array<StudentClass>) => {
        this.students = students;
        var classes = this.convertToClasses(this);
        if (this.bandStreamType === BandStreamType.Streaming) {
            this.groupingHelper.groupByStreaming(classes,
                this.students,
                this.streamType,
                this.mixBoysGirls);
        } else {
            this.groupingHelper.groupByMixAbility(classes,
                this.students,
                this.streamType,
                this.mixBoysGirls);
        }

        this.bands[0].students = this.students;
        for (let i = 0; i < this.bands.length; i++) {
            this.bands[i].students = classes[i].students;
            this.bands[i].prepare(name);
        }
    }
}

class TopMiddleLowestBandSet extends BandSet {
    constructor(public parent: ClassesDefinition,
        public studentCount: number,
        public bandStreamType = BandStreamType.Streaming,
        bandType = BandType.None,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls: boolean = false) {
        super(parent,
            "TopMiddleLowest",
            studentCount,
            3,
            BandType.Custom,
            bandStreamType,
            streamType,
            groupType,
            mixBoysGirls);

        this.bands[0].bandType = BandType.Top;
        this.bands[1].bandType = BandType.Middle;
        this.bands[2].bandType = BandType.Lowest;
        this.bands[0].bandName = "Top";
        this.bands[1].bandName = "Middle";
        this.bands[2].bandName = "Lowest";
    }

    setStudentCount = (studentCount: number) => {
        this.studentCount = studentCount;
        this.createBands(this.name,
            studentCount,
            this.bandCount,
            this.bandType,
            this.streamType,
            this.groupType,
            this.mixBoysGirls);
    }
}

class ClassesDefinition {
    constructor(public testFile: TestFile = null, students: Array<Student> = null) {
        this.uid = createUuid();
        if (testFile != null) {
            this.groupGender = testFile.isUnisex ? Gender.All : (testFile.hasBoys ? Gender.Boys : Gender.Girls);
            this.testFile = testFile;

            this.boysCount = 0;
            this.girlsCount = 0;
            if (!students) {
                students = testFile.students;
            }
            for (let s of students) {
                this.students.push(new StudentClass(s));
                if (s.sex === "M") {
                    this.boysCount++;
                }
                if (s.sex === "F") {
                    this.girlsCount++;
                }
            }
        }
    }


    uid: string;
    students: Array<StudentClass> = [];
    groupName: string;
    groupGender: Gender;
    streamType: StreamType;
    customBands: BandSet;
    spreadBoysGirlsEqually = false;
    excludeLeavingStudent = false;
    boysCount: number;
    girlsCount: number;

    genderStudents = (gender: Gender): Array<StudentClass> => {
        switch (gender) {
        case Gender.Girls:
            return Enumerable.From(this.students).Where(x => x.gender === "F").ToArray();

        case Gender.Boys:
            return Enumerable.From(this.students).Where(x => x.gender === "M").ToArray();
        }
        return this.students;
    }

    genderStudentCount = (gender: Gender): number => {
        let studentCount = this.studentCount;
        switch (gender) {
        case Gender.Girls:
            studentCount = this.girlsCount;
            break;
        case Gender.Boys:
            studentCount = this.boysCount;
            break;
        }
        return studentCount;
    }

    get studentCount(): number {
        return this.students.length;
    }

    setStudentLanguagePrefs = () => {
        if (!this.students) {
            return;
        }
        for (let s of this.students) {
            s.setLanguagePrefs();
        }
    }

    setSchoolGroups = () => {
        if (!this.students) {
            return;
        }
        for (let s of this.students) {
            s.setSchoolGroups();
        }
    }

    createBandSet = (name: string,
        studentCount: number,
        bandCount: number = 1,
        bandStreamType = BandStreamType.Streaming,
        bandType = BandType.None,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls = false): BandSet => {

        return new BandSet(this,
            name,
            studentCount,
            bandCount,
            bandType,
            bandStreamType,
            streamType,
            groupType,
            mixBoysGirls);
    };

    createPreAllocatedClassBandSet = (name: string,
        studentCount: number,
        bandCount: number = 1,
        bandStreamType = BandStreamType.Streaming,
        bandType = BandType.None,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls = false): BandSet => {

        const bandSet = new BandSet(this,
            name,
            studentCount,
            bandCount,
            bandType,
            bandStreamType,
            streamType,
            groupType,
            mixBoysGirls);

        bandSet.bandType = BandType.PreallocatedClass;
        return bandSet;
    };

    createSchoolGroupBandSet = (name: string,
        studentCount: number,
        bandCount: number = 1,
        bandStreamType = BandStreamType.Streaming,
        bandType = BandType.None,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls = false): BandSet => {

        const bandSet = new BandSet(this,
            name,
            studentCount,
            bandCount,
            bandType,
            bandStreamType,
            streamType,
            groupType,
            mixBoysGirls);

        bandSet.bandType = BandType.SchoolGroup;
        return bandSet;
    };


    createCustomBandSet = (
        name: string,
        studentCount: number,
        bandCount: number): CustomBandSet => {
        return new CustomBandSet(this, studentCount, bandCount);
    }

    createTopMiddleBottomBandSet = (name: string,
        studentCount: number,
        bandStreamType = BandStreamType.Streaming,
        bandType = BandType.None,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls = false): TopMiddleLowestBandSet => {
        return new TopMiddleLowestBandSet(this,
            studentCount,
            bandStreamType,
            bandType,
            streamType,
            groupType,
            mixBoysGirls);
    };
}