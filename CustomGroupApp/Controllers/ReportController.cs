using System.Web.Mvc;

namespace CustomGroupApp.Controllers
{
    public class ReportController : Controller
    {
        // GET: StudentPortfolio
        public ActionResult StudentPortfolioView()
        {
            return PartialView("StudentPortfolioList");
        }

        public ActionResult StudentNaplanView()
        {
            return PartialView("StudentNaplanReport");
        }

        public ActionResult MathsSkillsProfileView()
        {
            return PartialView("StudentMathProfileView");
        }

        public ActionResult SchoolStudentRecordView()
        {
            return PartialView("SchoolStudentRecord");
        }

        public ActionResult StudentPortfolioPrintDialog()
        {
            return PartialView("StudentPortfolioPrintDialogView");
        }
    }
}