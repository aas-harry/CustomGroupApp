using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
    }
}