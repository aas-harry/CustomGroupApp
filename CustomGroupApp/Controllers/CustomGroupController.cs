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

        [HttpPost]
        public JsonResult GetStudentLanguagePrefs(int testnum)
        {
            return Json(_dataService.GetStudentLanguagePrefs(testnum).ToList());
        }

        public ActionResult CustomGroupWizard(int testnum)
        {
            return View("CustomGroupWizard", new CustomGroupViewModel
            {
                Test= _dataService.GetTest(testnum),
                Results = _dataService.GetResults(testnum).ToList(),
                StudentLanguages = _dataService.GetStudentLanguagePrefs(testnum).ToList()
            });
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
            //var testnumber = 1014181;
            //var results = _dataService.GetResults(testnumber).Select(x => new {x.Name, x.Id}).OrderBy(x=> x.Name).ToList();
            //using (var sr = new StreamReader(@"c:\temp\Year 6.csv"))
            //{
            //    var csvReader = new CsvReader(sr);
            //    csvReader.Configuration.SkipEmptyRecords = true;
            //    csvReader.Configuration.IgnoreBlankLines = true;
            //    csvReader.Configuration.TrimFields = true;
            //    csvReader.Configuration.TrimHeaders = true;

            //    var rows = csvReader.GetRecords<StudentLanguage>().OrderBy(x=> x.Name).ToList();
            //    var studentLanguages = new List<StudentLanguagePref>();
            //    foreach (var s in results)
            //    {
            //        var lpn = rows.FirstOrDefault(x => x.Name.Equals(s.Name, StringComparison.InvariantCultureIgnoreCase));
            //        if (lpn == null) continue;
            //        studentLanguages.Add(new StudentLanguagePref
            //        {
            //            Testnum = testnumber,
            //            StudentId = s.Id,
            //            Pref1 = lpn.Pref1,
            //            Pref2 = lpn.Pref2,
            //            Pref3 = lpn.Pref3
            //        });
            //    }
            //    _dataService.UpdateStudentLanguagePrefs(testnumber, studentLanguages);
            //}

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