class StudentClassRow extends kendo.data.ObservableObject {
    constructor(student: StudentClass) {
        super(null);
        this.convert(student);
    }
    id: number;
    name: string;
    dob: Date;
    gender: string;
    score: number;
    class: number;
    langPref1: string;
    langPref2: string;
    langPref3: string;
    schoolGroup: string;
    hasLanguagePrefs = false;

    convert = (student: StudentClass) => {
        this.id = student.id;
        this.name = student.name;
        this.dob = student.dob;
        this.gender = student.gender;
        this.score = student.score;
        this.class = student.classNo;
        this.langPref1 = student.langPref1;
        this.langPref2 = student.langPref2;
        this.langPref3 = student.langPref3;
        if (this.langPref1 !== "" || this.langPref2 !== "" || this.langPref3 !== "") {
            this.hasLanguagePrefs = true;
        }
        this.schoolGroup = student.schoolGroup;
    }
}