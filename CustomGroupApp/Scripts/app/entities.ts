enum ReportType {
    None = 0,
    StudentResults = 1,
    SchoolStudentRecord = 2,
    NationalProgressIndex = 3,
    StudentMathsSkillsProfileList = 4,
    StudentMathsSkillsProfileTable = 5,
    StudentReadingSkillsProfileList = 6,
    StudentReadingSkillsProfileTable = 7,
    StudentWritingCriteria = 8,
    StudentMarkedWritingScript = 9,
    StudentCareerProfile = 10
}

enum TestCategory {
    None = 0,
    Placement = 1,
    Scholarship = 2,
    GandT = 3,
    Nwpa = 4
}


class User {
    id: number;
    role: number;
    name: string;
    email: string;
    schools: Array<School>;
    currentSchool: School;
    isInternalUser: boolean;
    greeting = () => {
        return `Hi ${this.name}`;
    };
}

class School {
    id: number;
    name: string;
    scode: number;
    isMainSchool = false;
}

class TestFile {
    school = new School();
    fileNumber: number;
    grade: number;
    category: string;
    testDate: Date;
    testYear: number;
    studentCount: number;
    published: Date;
    // subjectTypes: Array<Subject> = [];
    students: Array<Student> = [];
    isUnisex: boolean;
    hasBoys = false;
    hasGirls = false;
    isCoopSchoolTest: boolean;
    customGroups: Array<ClassDefinition> = [];
    hasCustomGroups: boolean;
    hasStudentLanguagePrefs: boolean;
    hasStudentIds: boolean;
    subjectsTested: Array<ISubject>;

    private allSubjects = new Array<SubjectInfo>();

    displayTestDate: string;
    get yearLevel(): string {
        return `${this.grade} / ${this.testYear}`;
    }
    description = () => {
        if (this.fileNumber === 1015049) {
            return this.fileNumber + " " + this.category + " Ravens";
        }
        return this.fileNumber + " " + this.category;
    };

    set = (test: any, school: any, results: any, languages: any, customGroupSets: any = []) => {
        this.fileNumber = test.Testnum;
        this.grade = test.Grade;
        this.category = test.Category;
        this.testDate = new Date(parseInt(test.Testdate.substr(6)));
        this.testYear = this.testDate.getFullYear();
        this.setStudents(results, languages);
        this.setStudentLanguagePrefs(languages, this.students);
        this.setCustomGroups(customGroupSets, this.students);
        if (school) {
            this.school.name = school.Name;
            this.school.id = school.Id;
            this.school.scode = test.Scode;
            this.school.isMainSchool = school.IsMainSchool;
        }
    }

    constructor(){
        this.allSubjects.push(new SubjectInfo(null, 0, false, false));
        this.allSubjects.push(new SubjectInfo(new GenabSubject(), 1, false, true));
        this.allSubjects.push(new SubjectInfo(new VerbalSubject(), 2, false, true));
        this.allSubjects.push(new SubjectInfo(new NonVerbalSubject(), 3, false, true));
        this.allSubjects.push(new SubjectInfo(new MathReasoningSubject(), 4, false, true));
        this.allSubjects.push(new SubjectInfo(new MathPerformanceSubject(), 5, true, false));
        this.allSubjects.push(new SubjectInfo(new ReadingSubject(), 6, true, false));
        this.allSubjects.push(new SubjectInfo(new WritingSubject(), 7, true, false));
        this.allSubjects.push(new SubjectInfo(new SpellingSubject(), 8, true, false));
        this.allSubjects.push(new SubjectInfo(new RavenSubject(), 9, false, true));

    }

    clear = () => {
        this.fileNumber = undefined;
        this.grade = undefined;
        this.category = undefined;
        this.testDate = undefined;
        this.testYear = undefined;
        this.studentCount = undefined;
        this.published = undefined;
        this.students = [];
    };

    setCustomGroups = (data: any, students: Array<Student>) => {
        if (students === null) {
            students = this.students;
        }
        this.customGroups = [];
        var studentDict = Enumerable.From(students).ToDictionary(x => x.studentId, x => x);
        for (let item of data) {
            const classItem = new ClassDefinition(null, 0, 0);
            for (let id of item.Students) {
                if (studentDict.Contains(id)) {
                    classItem.students.push(new StudentClass(studentDict.Get(id)));
                }
            }
            classItem.count = classItem.students.length;
            classItem.name = item.Name;
            classItem.groupSetid = item.GroupSetId;
            classItem.streamType = item.Streaming;
            this.customGroups.push(classItem);
        }

        this.hasCustomGroups = this.customGroups.length > 0;
    }

    addCustomGroup = (item: any): ClassDefinition => {
        var studentDict = Enumerable.From(this.students).ToDictionary(x => x.studentId, x => x);
        const classItem = new ClassDefinition(null, 0, 0);
        for (let id of item.Students) {
            if (studentDict.Contains(id)) {
                classItem.students.push(new StudentClass(studentDict.Get(id)));
            }
        }
        classItem.count = classItem.students.length;
        classItem.name = item.Name;
        classItem.groupSetid = item.GroupSetId;
        classItem.streamType = item.Streaming;
        this.customGroups.push(classItem);
        return classItem;
    }

    setStudentLanguagePrefs = (langPrefs: Array<any>, students: Array<Student> = null) => {
        if (!langPrefs || langPrefs.length === 0) {
            return;
        }
        if (!students) {
            students = this.students;
        }
        var enumerable = Enumerable.From(langPrefs);

        students.forEach((student: Student) => {
            var languagePrefs = enumerable.FirstOrDefault(null, s => s.StudentId === student.studentId);

            if (languagePrefs != null) {
                if (languagePrefs.Pref1) {
                    student.languagePrefs.push(languagePrefs.Pref1);
                }
                if (languagePrefs.Pref2) {
                    student.languagePrefs.push(languagePrefs.Pref2);
                }
                if (languagePrefs.Pref3) {
                    student.languagePrefs.push(languagePrefs.Pref3);
                }
            }
        });

        this.hasStudentLanguagePrefs = true;
    }

    setSchoolGroup = (studentGroups: Array<any>, students: Array<Student> = null) => {
        if (!studentGroups || studentGroups.length === 0) {
            return;
        }
        if (!students) {
            students = this.students;
        }
        var lookup = Enumerable.From(studentGroups).ToDictionary(x => x.StudentId, x => x.Group);

        students.forEach((student: Student) => {
            if (lookup.Contains(student.studentId)) {
                student.schoolGroup = lookup.Get(student.studentId);
            } else {
                student.schoolGroup = "";
            }
        });
    }

    setStudents = (data: Array<any>, langPrefs: Array<any> = []) => {
        this.students = [];
        this.hasGirls = false;
        this.hasBoys = false;
        this.hasStudentLanguagePrefs = langPrefs && langPrefs.length > 0;
        var enumerable = Enumerable.From(langPrefs);

        Enumerable.From(data).OrderBy(x=>x.Name).ForEach((s: any) => {
            const student = new Student(s);
            this.students.push(student);
            if (! this.hasBoys && s.Sex === "M") {
                this.hasBoys = true;
            }
            if (!this.hasGirls && s.Sex === "F") {
                this.hasGirls = true;
            }
            if (this.hasStudentLanguagePrefs) {
                var languagePrefs = enumerable.FirstOrDefault(null, s => s.StudentId === student.studentId);
                if (languagePrefs != null) {
                    if (languagePrefs.Pref1) {
                        student.languagePrefs.push(languagePrefs.Pref1);
                    }
                    if (languagePrefs.Pref2) {
                        student.languagePrefs.push(languagePrefs.Pref2);
                    }
                    if (languagePrefs.Pref3) {
                        student.languagePrefs.push(languagePrefs.Pref3);
                    }
                }
            }
        });

        this.hasStudentIds = Enumerable.From(this.students).Any(s => s.schoolStudentId !== "");
        this.studentCount = this.students.length;
        this.isUnisex = this.hasGirls && this.hasBoys;

        this.subjectsTested = [];
        const sampleStudents = Enumerable.From(this.students).Take(30).ToArray();
        for (let item of this.allSubjects) {
            if (!item.subject) {
                continue;
            }
            if (Enumerable.From(sampleStudents).Count(student => {
                    var score = item.subject.getScore(student);
                    return score ? item.subject.getScore(student).raw > 1 : false;
                }
            ) > 5) {
                item.subject.isTested = true;
                this.subjectsTested.push(item.subject);
            }
        }
    };

    filterTestByGroup = (classItem: ClassDefinition): Array<Student> => {
        return this.filterTest(Enumerable.From(classItem.students).Select(s => s.studentId).ToArray());
    }

    filterByGender = (gender: Gender): Array<Student> => {
        if (!this.students || this.students.length === 0) {
            return [];
        }

        if (gender === Gender.Girls) {
            return Enumerable.From(this.students).Where(s => s.sex === "F").ToArray();
        }
        if (gender === Gender.Boys) {
            return Enumerable.From(this.students).Where(s => s.sex === "M").ToArray();
        }
        return this.students;
    }

    filterTest = (filtered: Array<number>): Array<Student> => {
        if (! this.students || this.students.length === 0) {
            return [];
        }
        const studentFilter = Enumerable.From(filtered).ToDictionary(x => x, x => x);
        return Enumerable.From(this.students).Where(s => studentFilter.Contains(s.studentId)).ToArray();
    }
}

class RangeScore {
    range = () => {
        return this.low + "-" + this.high;
    };

    constructor(public low: number, public high: number) {}
}

class Score {
    constructor(public raw: number, public stanine: number,
        public scaledScore: number, public score: number, public range: RangeScore, public naplan: number) { }
}

class Student {
    studentId: number;
    schoolStudentId: string;
    commonId: number;
    name: string;
    sex: string;
    dob: Date;
    speak: string;
    liveInAus: string;
    ca: number;
    serialno: number;

    genab: Score;
    verbal: Score;
    nonverbal: Score;
    mathPerformance: Score;
    mathReasoning: Score;
    mathQr: Score;
    reading: Score;
    writing: Score;
    spelling: Score;
    raven: Score;

    schoolGroup: string;
    languagePrefs: Array<string> = [];
    get hasLanguagePrefs(): boolean {
        return this.languagePrefs && this.languagePrefs.length > 0;
    }
    get hasSchoolStudentId(): boolean {
        return this.schoolStudentId && this.schoolStudentId !== "";
    }

    constructor(r: any) {
        this.studentId = r.Id;
        this.commonId = r.GlobalStudentId;
        this.schoolStudentId = r.Student_id;
        this.name = r.Name;
        this.sex = r.Sex;
        this.dob = new Date(parseInt(r.Dob.substr(6)));
        this.speak = r.Speak;
        this.liveInAus = r.Live_in_as;
        this.ca = r.Ca;

        this.genab = new Score(r.Genab, r.Iqs, r.T_genab, r.S_genab, new RangeScore(r.Iq1, r.Iq2), null);
        this.verbal = new Score(r.Verb, r.Vis, r.T_verbal, r.S_verbal, new RangeScore(r.Vil, r.Vih), null);
        this.nonverbal = new Score(r.Nverb, r.Nvis, r.T_nverbal, r.S_nonverb, new RangeScore(r.Nvil, r.Nvih), null);
        this.mathPerformance = new Score(r.Prs, r.Pst, r.T_pst, r.S_mathper, null, r.Npi_Math);
        this.mathQr = new Score(r.Qr, null, null, null, null, null);
        this.reading = new Score(r.Rrs, r.Rst, r.T_rst, r.S_reading, null, r.Npi_Read);
        this.spelling = new Score(r.Srs, r.Sst, r.T_sst, r.S_spelling, null, null);
        this.writing = new Score(r.NewWr, r.Wrt, r.T_wr, r.S_written, null, r.Npi_Writing);
        this.raven = new Score(r.Raven, r.Iqs2, r.T_mst, null, new RangeScore(r.Iq12, r.Iq22), null);

        this.serialno = r.Serialno;
        this.schoolGroup = "";
    }

    get dobString(): string {
        return kendo.toString(this.dob, "d");
    }

    overallAbilityScore = (): number => {
        var total = 0;
        total += this.genab.scaledScore ? this.genab.scaledScore : 0;
        total += this.mathPerformance.scaledScore ? this.mathPerformance.scaledScore : 0;
        total += this.reading.scaledScore ? this.reading.scaledScore : 0;
        total += this.writing.scaledScore ? this.writing.scaledScore : 0;
        return total;
    }
    mathsAchievementScore = (): number => {
        return this.mathPerformance.scaledScore ? this.mathPerformance.scaledScore : 0;
    }
    mathsAchievemenQrScore = (): number => {
        var total = 0;
        total += this.mathPerformance.raw ? this.mathPerformance.raw : 0;
        total += this.mathQr.raw ? this.mathQr.raw : 0;
        return total;
    }


    englishScore = (): number => {
        var total = 0;
        total += this.verbal.scaledScore ? this.verbal.scaledScore : 0;
        total += this.reading.scaledScore ? this.reading.scaledScore : 0;
        total += this.writing.scaledScore ? this.writing.scaledScore : 0;
        return total;
    }
}