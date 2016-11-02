class SchoolStudentRecordViewModel extends StudentPortfolio
    implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);

        this.urlLink = "SchoolStudentRecordView";
        this.reportName = "School Student Record";

    }

    bornInAus: string;
    secondLanguage: string;
   
    setAdditionalProperties = (student: Student) => {
        this.set("bornInAus", student.liveInAus);
        this.set("secondLanguage", student.speak);
    }
}