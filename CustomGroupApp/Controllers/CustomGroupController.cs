using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using CsvHelper;
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
            var results = _dataService.GetResults(1015238).Select(x => new {x.Name, x.Id}).ToList();
            using (var sr = new StreamReader(@"c:\temp\Year 6.csv"))
            {
                var csvReader = new CsvReader(sr);
           //     csvReader.Read();
         //       var s1 = csvReader.GetField(typeof(string), 0);
          var ss = csvReader.GetRecords<StudentLanguage>().ToList();
                var list = new List<StudentLanguagePref>();
                foreach (var s in results)
                {
                    var lpn = ss.FirstOrDefault(x => x.Name.Equals(s.Name, StringComparison.InvariantCultureIgnoreCase));
                    if (lpn != null)
                    {
                        if (!string.IsNullOrEmpty(lpn.Pref1))
                        {
                            list.Add(new StudentLanguagePref
                            {
                                StudentId = s.Id,
                                Language = lpn.Pref1
                            });

                        }
                        if (!string.IsNullOrEmpty(lpn.Pref2))
                        {
                            list.Add(new StudentLanguagePref
                            {
                                StudentId = s.Id,
                                Language = lpn.Pref2
                            });

                        }
                        if (!string.IsNullOrEmpty(lpn.Pref3))
                        {
                            list.Add(new StudentLanguagePref
                            {
                                StudentId = s.Id,
                                Language = lpn.Pref3
                            });

                        }
                    }
                }
            }

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