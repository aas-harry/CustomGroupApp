using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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
    }
}