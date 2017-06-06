class Stanine {
    lowerScore: number;
    midScore: number;
    constructor(public subject: SubjectType, public stanine: number, public score: number) { }
}

class StanineTables {
    stanines = new Array<Stanine>();

    setStanines = (data: any) => {
        this.stanines = [];
        for (let table of data) {
            for (let i = 0; i < table.Stanines.length; i++) {
                this.stanines.push(new Stanine(table.Subject, i + 1, table.Stanines[i]));
            }
        }
    }
    getStanine = (score: number, subject: SubjectType): number => {
        const table = Enumerable.From(this.stanines).Where(s => s.subject === subject).OrderBy(s => s.score).ToArray();
        for (let s of table) {
            if (score <= s.score) {
                return s.stanine;
            }
        }
        return 0;
    }

    getStanines = (subject: SubjectType): Array<Stanine> => {
        var tables = Enumerable.From(this.stanines).Where(s => s.subject === subject).OrderBy(s => s.stanine).ToArray();
        let lowerScore = 0;
        for (let t of tables) {
            t.lowerScore = lowerScore;
            t.midScore = Math.floor((t.score - t.lowerScore) / 2) + t.lowerScore;
            lowerScore = t.score;
        }
        return tables;
    }

    getStanineRangeScore = (score: number, subject: SubjectType, maxScore: number): number => {
        const table = Enumerable.From(this.stanines).Where(s => s.subject === subject).OrderBy(s => s.score).ToArray();
        let stanine = 1;
        let x1 = 0;
        let x2 = table[0].score;
        for (var i = 0; i < table.length; i++) {
            if (score <= table[i].score) {
                stanine = i + 1;
                x2 = stanine === 9 ? maxScore : table[i].score;
                break;
            }
            x1 = table[i].score;
        }

        if ((x2 - x1) === 0) return (stanine - 1);

        return (stanine - 1) + (score - x1) / (x2 - x1);
    } 
}