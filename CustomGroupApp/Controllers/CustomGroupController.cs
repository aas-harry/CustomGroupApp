using System.Linq;
using System.Web.Mvc;
using CustomGroupApp.Models;

namespace CustomGroupApp.Controllers
{
    public class CustomGroupController : Controller
    {
        private readonly DataService _dataService;

        public CustomGroupController()
        {
            _dataService = new DataService();
        }

        // GET: CustomGroup
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetResults(int testnum)
        {
            // var testnum = 10000040;
            var results = _dataService.GetResults(testnum).ToList();
            var test = _dataService.GetTest(testnum);

            return Json(new {Test = test, Results = results});
        }

        public ActionResult CustomGroupWizard(int testnum)
        {
            // var testnum = 10000040;
            var results = _dataService.GetResults(testnum).ToList();
            var test = _dataService.GetTest(testnum);

            return View("CustomGroupWizard", new TestViewModel {Test=test, Results = results});
        }

        public ActionResult SelectGroupingTypeStep()
        {
            return PartialView("SelectGroupingType");
        }
        public ActionResult ClassConfigurationStep()
        {
            return PartialView("ClassConfiguration");
        }
        
        public ActionResult TopMiddleLowestClassConfigurationStep()
        {
            return PartialView("TopMiddleLowestBandClassConfiguration");
        }

        public ActionResult LanguageClassConfigurationStep()
        {
            return PartialView("LanguageBandClassConfiguration");
        }

        public ActionResult BandClassConfigurationStep()
        {
            return PartialView("BandClassConfiguration");
        }

        public ActionResult SaveCustomGroupStep()
        {
            return PartialView("SaveCustomGroup");
        }
        public ActionResult StudentGroupingOptionsStep()
        {
            return PartialView("StudentGroupingOptions");
        }
    }
}