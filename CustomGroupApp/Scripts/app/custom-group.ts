enum GroupingMethod {
    Unknown = 0,
    MixedAbility = 1,
    Streaming = 2,
    Banding = 3,
    TopMiddleLowest = 4,
    Language = 5,
    CustomGroup = 6
}

enum SearchDirection {
    Forward,
    Backward
}

enum Gender {
    All = 0,
    Girls = 1,
    Boys = 2
}

enum BandType {
    None = 0,
    Custom = 1,
    Top = 2,
    Middle = 3,
    Lowest = 4
}

enum StreamType {
    None = 0,
    OverallAbilty = 1,
    English = 1,
    MathsAchievement = 2
}

enum BandStreamType {
    None = 0,
    Streaming = 1,
    Parallel = 2,
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

class SummaryClass {
    classNo: number;
    average: number;
    count: number;
}

class StudentClass {
    constructor(public s: Student) {
        this.source = s;
        this.name = s.name;
        this.gender = s.sex;
        this.score = s.genab.raw + s.mathPerformance.raw + s.reading.raw + s.spelling.raw;
    }

    source: Student;
    gender: string;
    score: number;
    name: string;
    classNo: number;
    bandNo: number;
    flag: number;
}

class SearchClassContext {
    constructor(public classNo: number,
        public firstClassNo: number,
        public lastClassNo: number,
        public isLastClass: boolean) {
    }
}

class GroupingHelper {
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
            students[i].score = students[i].source.overallAbilityScore();
        }
    };

    setEnglishScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].source.englishScore();
        }
    };

    setMathAchievementScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].source.mathsAchievementScore();
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
    };

    groupByStreaming = (classes: Array<ClassDefinition>,
        students: Array<StudentClass>,
        streamType: StreamType,
        mixBoysGirls: boolean) => {

        this.calculateTotalScore(students, streamType);

        if (!mixBoysGirls) {
            this.groupByStreamingInternal(classes, students);
        }

        var femaleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();
        var maleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();

        if (femaleStudents.length < maleStudents.length) {
            this.groupByStreamingInternal(classes, femaleStudents);
            this.groupByStreamingInternal(classes, maleStudents);
        } else {
            this.groupByStreamingInternal(classes, maleStudents);
            this.groupByStreamingInternal(classes, femaleStudents);
        }
    };

    private groupByStreamingInternal = (classes: Array<ClassDefinition>, students: Array<StudentClass>) => {
        var sortedStudents = Enumerable.From(students).OrderByDescending(s => s.score).Select(s => s).ToArray();
        var classNo = 0;
        var numberStudentsInClass = 0;
        for (let i = 0; i < sortedStudents.length; i++) {
            const student = sortedStudents[i];
            student.classNo = classNo + 1;
            classes[classNo].students.push(student);
            numberStudentsInClass++;
            if (classes[classNo].count <= numberStudentsInClass) {
                classNo++;
                numberStudentsInClass = 0;
            }
        }
        return classes;
    };

}

class ClassDefinition {
    constructor(public parent: BandDefinition, public index: number, public count: number) {
        this.uid = createUuid();
    }

    uid: string;
    students: Array<StudentClass> = [];
    average: number;

    get moreStudents(): number {
        return this.count - (this.students ? this.students.length : 0);
    }
}

class BandDefinition {
    constructor(public parent: ClassesDefinition,
        public bandNo: number,
        public bandName: string,
        public studentCount,
        public classCount: number = 1,
        public bandType: BandType = BandType.None,
        public streamType: StreamType = StreamType.OverallAbilty,
        public groupType: GroupingMethod = GroupingMethod.Streaming,
        public mixBoysGirls: boolean = false) {

        this.uid = createUuid();
        this.setClassCount(classCount);
    }

    uid: string;
    students: Array<StudentClass> = [];
    classes: Array<ClassDefinition> = [];

    private groupHelper = new GroupingHelper();

    setClassCount = (classCount: number) => {
        this.classCount = classCount;
        this.calculateClassesSize(classCount);
    };
    distributeStudents = (groupType: GroupingMethod, streamType: StreamType, mixBoysGirls: boolean) => {
        switch (groupType) {
        case GroupingMethod.MixedAbility:
            break;
        case GroupingMethod.Streaming:
            break;
        case GroupingMethod.Banding:
            break;
        case GroupingMethod.TopMiddleLowest:
            break;
        case GroupingMethod.Language:
            break;
        case GroupingMethod.CustomGroup:
            break;
        }
    };

    calculateClassesAverage = (classes: Array<ClassDefinition>) => {
        for (let i = 0; i < classes.length; i++) {
            classes[i].average = Enumerable.From(classes[i].students).Average(x => x.score);
        }
    };

    groupByMixAbility = (mixBoysGirls: boolean) => {
        var students = this.students;

        this.groupHelper.calculateTotalScore(this.students, this.streamType);

        if (!mixBoysGirls) {
            this.classes = this.groupByMixAbilityInternal(students);
            return;
        }

        var femaleClasses = this.groupByMixAbilityInternal(Enumerable.From(students)
            .Where(s => (s.gender === "F"))
            .Select(s => s)
            .ToArray());
        var maleClasses = this.groupByMixAbilityInternal(Enumerable.From(students)
            .Where(s => (s.gender === "M"))
            .Select(s => s)
            .ToArray());

        var index = this.classCount - 1;

        for (let i = 0; i < this.classCount; i++) {
            if (i < femaleClasses.length) {
                this.classes[i].students = (this.classes[i].students.concat(femaleClasses[i].students));
            }
            if (index < maleClasses.length) {
                for (let j = 0; j < maleClasses[index].students.length; j++) {
                    maleClasses[index].students[j].classNo = i + 1;
                }
                this.classes[i].students = (this.classes[i].students.concat(maleClasses[index].students));
            }
            index--;
        }

    };


    private groupByMixAbilityInternal = (students: Array<StudentClass>): Array<ClassDefinition> => {
            var classes = this.classes;
            var sortedStudents = Enumerable.From(students).OrderByDescending(s => s.score).Select(s => s).ToArray();
            var nextClass = new SearchClassContext(0, 0, this.classCount - 1, false);
            for (let i = 0; i < sortedStudents.length; i++) {
                const student = sortedStudents[i];
                student.classNo = nextClass.classNo + 1;
                student.bandNo = this.bandNo;
                classes[nextClass.classNo].students.push(student);
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
                classQueue.push(classes[i]);
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

    groupByStreaming = (mixBoysGirls: boolean) => {
        var students = this.students;
        this.groupHelper.calculateTotalScore(this.students, this.streamType);

        if (!mixBoysGirls) {
            this.classes = this.groupByStreamingInternal(students);
            return;
        }

        var femaleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();
        var maleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();

        var maleClasses = this.groupByStreamingInternal(maleStudents);
        var femaleClasses = this.groupByStreamingInternal(femaleStudents);

        if (femaleStudents.length < maleStudents.length) {
            for (let i = 0; i < this.classCount; i++) {
                if (i < femaleClasses.length) {
                    for (let j = 0; j < femaleClasses[i].students.length; j++) {
                        if (this.classes[i].count <= this.classes[i].students.length) {
                            break;
                        }
                        femaleClasses[i].students[j].flag = 1;
                        this.classes[i].students.push(femaleClasses[i].students[j]);
                    }
                }
            }
        }

        for (let i = 0; i < this.classCount; i++) {
            if (i < femaleClasses.length) {
                this.classes[i].students = (this.classes[i].students.concat(femaleClasses[i].students));
            }
            if (i < maleClasses.length) {
                this.classes[i].students = (this.classes[i].students.concat(maleClasses[i].students));
            }
        }
    };

    private groupByStreamingInternal = (students: Array<StudentClass>): Array<ClassDefinition> => {
            var classes = this.classes;
            var sortedStudents = Enumerable.From(students).OrderByDescending(s => s.score).Select(s => s).ToArray();
            var classNo = 0;
            var numberStudentsInClass = 0;
            for (let i = 0; i < sortedStudents.length; i++) {
                const student = sortedStudents[i];
                student.classNo = classNo + 1;
                student.bandNo = this.bandNo;
                classes[classNo].students.push(student);
                numberStudentsInClass++;
                if (classes[classNo].count <= numberStudentsInClass) {
                    classNo++;
                    numberStudentsInClass = 0;
                }
            }
            return classes;
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
        public bandStreamType = BandStreamType.Streaming,
        public mixBoysGirls = false) {

        this.uid = createUuid();
        this.createBands(name, studentCount, bandCount);
    }

    uid: string;
    students: Array<StudentClass> = [];
    bands: Array<BandDefinition>;

    // ReSharper disable once InconsistentNaming
    private _bankCount: number;

    get bandCount(): number {
        return this.bands ? this.bands.length : 0;
    }

    private groupingHelper = new GroupingHelper();


    createBandClasses = (bandStreamType: BandStreamType, mixBoysGirls: boolean) => {
        if (!bandStreamType) {
            bandStreamType = this.bandStreamType;
        }
        if (!mixBoysGirls) {
            mixBoysGirls = this.mixBoysGirls;
        }

        this.bandStreamType = bandStreamType;
        this.mixBoysGirls = mixBoysGirls;

        // Create a temporary banddefinition to calculate the band sizes
        var band = this.convertToClasses(this);
        band.groupByStreaming(this.mixBoysGirls);
        for (let i = 0; i < band.classes.length; i++) {
            this.bands[i].students = band.classes[i].students;
        }

        for (let i = 0; i < this.bands.length; i++) {
            this.bands[i].groupByMixAbility(this.mixBoysGirls);
        }
    };

    prepare = () => {

    };
    private createBands = (name: string,
        studentCount: number,
        bandCount: number,
        bandType: BandType = BandType.None,
        streamType: StreamType = StreamType.OverallAbilty,
        groupType: GroupingMethod = GroupingMethod.Streaming,
        mixBoysGirls: boolean = false) => {

        var tmpBands = this.groupingHelper.calculateClassesSize(studentCount, bandCount);

        this.bands = [];
        for (let i = 0; i < bandCount; i++) {
            const band = new BandDefinition(this.parent,
                i + 1,
                `Band ${i + 1}`,
                tmpBands[0],
                1,
                bandType,
                streamType,
                groupType,
                mixBoysGirls);

            this.bands.push(band);
        }
    };

    private convertToClasses = (bandSet: BandSet): BandDefinition => {
        var band = new BandDefinition(this.parent, 1, "Band", bandSet.bands.length, this.students.length);
        for (let i = 0; i < bandSet.bands.length; i++) {
            band.classes[i].count = bandSet.bands[i].studentCount;
        }

        return band;
    };
    private convertFromClasses = (classDefinition: ClassDefinition, bandNo: number): BandDefinition => {
        return new BandDefinition(this.parent, bandNo, `Band ${bandNo}`, classDefinition.count);
    };
}

class TopMiddleLowestBandSet extends BandSet {
    constructor(public parent: ClassesDefinition, public studentCount: number) {
        super(parent, "TopMiddleLowest", studentCount, 3);
    }
}

class ClassesDefinition {
    constructor(public testFile: TestFile) {
        this.uid = createUuid();
        this.groupGender = testFile.isUnisex ? Gender.All : (testFile.hasBoys ? Gender.Boys : Gender.Girls);
        this.testFile = testFile;

        this.students = new Array<StudentClass>();
        for (let i = 0; i < testFile.students.length; i++) {
            this.students.push(new StudentClass(testFile.students[i]));
        }
    }

    uid: string;
    students: Array<StudentClass>;
    groupName: string;
    groupGender: Gender;
    streamType: StreamType;
    customBands: BandSet;
    spreadBoysGirlsEqually = false;
    excludeLeavingStudent = false;

    get studentCount(): number {
        return this.students.length;
    }

    createBandSet = (name: string,
        studentCount: number,
        bandCount: number = 1,
        bandStreamType = BandStreamType.Streaming,
        mixBoysGirls = false): BandSet => {

        return new BandSet(this, name, studentCount, bandCount, bandStreamType, mixBoysGirls);
    };

    createTopMiddleBottomBandSet = (studentCount: number): TopMiddleLowestBandSet => {
        return new TopMiddleLowestBandSet(this, studentCount);
    };
}