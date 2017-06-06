class StudentCareerProfileViewModel extends StudentPortfolio
    implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private kendoHelper = new KendoHelper();
    private container: HTMLElement;
    private reports = [
        new ReportItem("Career Profile", "StudentCareerProfileView", ReportType.StudentCareerProfile, this)
    ];

    
    careerInterestChart: kendo.dataviz.ui.Chart;
    careerAwareness: string;

    setAdditionalProperties = (student: Student) => {
        this.set("careerAwareness", this.student.careers.careerAwareness);

        this.updateCareerOnterestChart();
        this.updateStudentCareerPreferences();
        this.updateStudentWorkCharacteristics();
    }

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }

    initReport = (reportType: ReportType): void => {
        this.careerInterestChart = $("#career-interests-chart").data("kendoChart");
        this.isViewReady = true;
    }
    
    setAdditionalData = (callback: (status) => any) => {
        if (this.testFile.hasCareerDetails) {
            const tmpCallback = callback;
            if (tmpCallback) {
                tmpCallback(true);
            }
            return;
        }

        const self = this;
        $.ajax({
            type: "POST",
            url: "GetCareerProfiles",
            data: JSON.stringify({ 'testnum': self.testFile.fileNumber }),
            contentType: "application/json",
            success(data) {
                self.testFile.setCareerDetails(data.StudentCareers);

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

    private updateStudentCareerPreferences = () => {
        const table = document.getElementById("career-preferences-table") as HTMLTableElement;
        const tbody = table.tBodies[0] as HTMLTableSectionElement;
        while (tbody.rows.length > 0) {
            tbody.deleteRow(0);
        }

        for (let s of this.student.careers.getCareerPrefs()) {
            const row = tbody.insertRow();
            const descriptionCell = document.createElement("div") as HTMLElement;
            descriptionCell.setAttribute("style", "font-weight: bold; width: 150px; text-align: left");
            descriptionCell.textContent = s.description ;
            this.kendoHelper.addElementCell(row, descriptionCell);
            this.kendoHelper.addCell(row, `: ${s.notes}`);
        }
    }

    private updateStudentWorkCharacteristics = () => {
        const table = document.getElementById("work-characteristics-table") as HTMLTableElement;
        const tbody = table.tBodies[0] as HTMLTableSectionElement;
        while (tbody.rows.length > 0) {
            tbody.deleteRow(0);
        }

      
        for (let s of this.student.workCharacteristics) {
            const row = tbody.insertRow();
            const descriptionCell = document.createElement("div") as HTMLElement;
            descriptionCell.setAttribute("style", "font-weight: bold; width: 150px; text-align: left");
            descriptionCell.textContent = s.description;
            this.kendoHelper.addElementCell(row, descriptionCell);
            this.kendoHelper.addCell(row, `- ${s.value}`);
        }

    }

    private updateCareerOnterestChart = () => {
        $("#career-interests-chart").height(300);
        this.careerInterestChart.dataSource.data(this.student.careers.careers);
        this.careerInterestChart.redraw();
    }
}