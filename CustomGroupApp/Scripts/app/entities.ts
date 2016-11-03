var subjectTypes = [
    { Subject: "Unknown", Index: 0, IsAchievement: false, IsAbility: false },
    { Subject: "Genab", Index: 1, IsAchievement: false, IsAbility: true },
    { Subject: "Verbal", Index: 2, IsAchievement: false, IsAbility: true },
    { Subject: "NonVerbal", Index: 3, IsAchievement: false, IsAbility: true },
    { Subject: "MathReasoning", Index: 4, IsAchievement: false, IsAbility: true },
    { Subject: "MathPerformance", Index: 5, IsAchievement: true, IsAbility: false },
    { Subject: "Reading", Index: 6, IsAchievement: true, IsAbility: false },
    { Subject: "Writing", Index: 7, IsAchievement: true, IsAbility: false },
    { Subject: "Spelling", Index: 8, IsAchievement: true, IsAbility: false },
    { Subject: "Ravens", Index: 9, IsAchievement: false, IsAbility: true }
];

class Subject {
    index: number = 0;
    subject: string = "";
    isAchievement: boolean = false;
    isAbility: boolean = false;
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
        return "Hi " + this.name;
    };
}

class School {
    id: number;
    name: string;
    scode: number;
    isMainSchool: boolean = false;

}

class TestFile {
    school: School = new School();
    fileNumber: number;
    grade: number;
    category: string;
    testDate: Date;
    testYear: number;
    studentCount: number;
    published: Date;
    subjectTypes: Array<Subject> = [];
    students: Array<Student> = [];
    isUnisex: boolean;
    hasBoys: boolean = false;
    hasGirls: boolean = false;
    isCoopSchoolTest: boolean;
    customGroups: Array<ClassDefinition> = [];

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

    clear = () => {
        this.fileNumber = undefined;
        this.grade = undefined;
        this.category = undefined;
        this.testDate = undefined;
        this.testYear = undefined;
        this.studentCount = undefined;
        this.published = undefined;
        this.subjectTypes = [];
        this.students = [];
    };

    setCustomGroups = (data: any, students: Array<Student>) => {
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
            this.customGroups.push(classItem);
        }
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
    }

    setStudents = (data: Array<any>, langPrefs: Array<any> = []) => {
        this.students = [];
        this.hasGirls = false;
        this.hasBoys = false;
        var hasStudentLangPrefs = langPrefs && langPrefs.length > 0;
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
            if (hasStudentLangPrefs) {
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

     
        this.studentCount = this.students.length;
        this.isUnisex = this.hasGirls && this.hasBoys;
    };
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
    reading: Score;
    writing: Score;
    spelling: Score;
    raven: Score;

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

        this.genab = new Score(r.Genab, r.Iqs, r.t_genab, r.Sgenab, new RangeScore(r.Iq1, r.Iq2), null);
        this.verbal = new Score(r.Verb, r.Vis, r.t_verbal, r.Sverb, new RangeScore(r.Vil, r.Vih), null);
        this.nonverbal = new Score(r.Nverb, r.Nvis, r.t_nverbal, r.Snverb, new RangeScore(r.Nvil, r.Nvih), null);
        this.mathPerformance = new Score(r.Prs, r.Pst, r.t_pst, r.Smath, null, r.NpiMath);
        this.reading = new Score(r.Rrs, r.Rst, r.t_rst, r.Sread, null, r.NpiRead);
        this.spelling = new Score(r.Srs, r.Sst, r.t_sst, r.Sspell, null, null);
        this.writing = new Score(r.Wrs, r.Wrt, r.t_wr, r.Swrit, null, r.NpiWrit);
        this.raven = new Score(r.Raven, r.Iqs2, r.Tmst, null, new RangeScore(r.Iq12, r.Iq22), null);

        this.serialno = r.snow;
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
    englishScore = (): number => {
        var total = 0;
        total += this.verbal.scaledScore ? this.verbal.scaledScore : 0;
        total += this.reading.scaledScore ? this.reading.scaledScore : 0;
        total += this.writing.scaledScore ? this.writing.scaledScore : 0;
        return total;
    }
}




