using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;
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
            var school = _dataService.GetSchool(testnum);
            var customGroupSets = _dataService.GetCustomGroupSets(testnum).ToList();

            return Json(new {Test = test, Results = results, School = school, CustomGroups = customGroupSets });
        }

        [HttpPost]
        public JsonResult GetStudentLanguagePrefs(int testnum)
        {
            return Json(_dataService.GetStudentLanguagePrefs(testnum).ToList());
        }

        [HttpPost]
        public JsonResult SaveClasses(CustomGroupSet groupSet)
        {
            return Json(true);
        }

        [HttpPost]
        public JsonResult GetCustomGroupListViewData(int testNumber)
        {
            return Json(new CustomGroupViewModel
            {
                Test = _dataService.GetTest(testNumber),
                Results = _dataService.GetResults(testNumber).ToList(),
                CustomGroupSets = _dataService.GetCustomGroupSets(testNumber).ToList(),
                StudentLanguages = _dataService.GetStudentLanguagePrefs(testNumber).ToList()
            });
        }

        [HttpPost]
        public JsonResult SaveCustomGroupSets(IEnumerable<CustomGroupSet> groupSets, int testNumber)
        {
            _dataService.UpdateCustomGroupSets(groupSets, testNumber);
            return Json(true);
        }

        public ActionResult SplitCustomGroupView(int groupSetId)
        {
            return View("CustomGroupWizard", groupSetId);
        }


        public ActionResult CustomGroupWizard()
        {
            return View("CustomGroupWizard", 0);
        }

        public JsonResult ImportPreallocatedClasses(IEnumerable<HttpPostedFileBase> files, string id)
        {
            var testNumber = int.Parse(id);
            var studentClasses = new List<PreallocatedClassStudent>();

            if (files != null)
                foreach (var file in files)
                    try
                    {
                        using (var sr = new StreamReader(file.InputStream))
                        {
                            var testnumber = testNumber;
                            var results =
                                _dataService.GetResults(testnumber)
                                    .Select(x => new {x.Name, x.Id})
                                    .OrderBy(x => x.Name)
                                    .ToList();
                            var csvReader = new CsvReader(sr);
                            csvReader.Configuration.SkipEmptyRecords = true;
                            csvReader.Configuration.IgnoreBlankLines = true;
                            csvReader.Configuration.TrimFields = true;
                            csvReader.Configuration.TrimHeaders = true;
                            csvReader.Configuration.WillThrowOnMissingField = false;
                            studentClasses =
                                csvReader.GetRecords<PreallocatedClassStudent>().ToList();

                            foreach (var s in studentClasses)
                            {
                                int classNo;
                                if (!int.TryParse(s.Class, out classNo))
                                {
                                    s.Class = string.Empty;
                                }
                                var lpn = results.FirstOrDefault(
                                    x => x.Name.Equals(s.Name, StringComparison.InvariantCultureIgnoreCase));
                                if (lpn == null) continue;
                                s.StudentId = lpn.Id;
                            }
                        }
                        // only can process one file 
                        break;
                    }
                    catch (Exception ex)
                    {
                        
                    }

            return Json(studentClasses);
        }
        public JsonResult ImportStudentLanguages(IEnumerable<HttpPostedFileBase> files, string id)
        {
            var testNumber = int.Parse(id);
            var studentLanguages = new List<StudentLanguagePref>();

            if (files != null)
                foreach (var file in files)
                    try
                    {
                        using (var sr = new StreamReader(file.InputStream))
                        {
                            var testnumber = testNumber;
                            var results =
                                _dataService.GetResults(testnumber)
                                    .Select(x => new {x.Name, x.Id})
                                    .OrderBy(x => x.Name)
                                    .ToList();
                            var csvReader = new CsvReader(sr);
                            csvReader.Configuration.SkipEmptyRecords = true;
                            csvReader.Configuration.IgnoreBlankLines = true;
                            csvReader.Configuration.TrimFields = true;
                            csvReader.Configuration.TrimHeaders = true;

                            var rows = csvReader.GetRecords<StudentLanguage>().OrderBy(x => x.Name).ToList();
                            foreach (var s in results)
                            {
                                var lpn =
                                    rows.FirstOrDefault(
                                        x => x.Name.Equals(s.Name, StringComparison.InvariantCultureIgnoreCase));
                                if (lpn == null) continue;
                                studentLanguages.Add(new StudentLanguagePref
                                {
                                    Testnum = testnumber,
                                    StudentId = s.Id,
                                    Pref1 = lpn.Pref1,
                                    Pref2 = lpn.Pref2,
                                    Pref3 = lpn.Pref3
                                });
                            }
                            _dataService.UpdateStudentLanguagePrefs(testnumber, studentLanguages);
                        }
                        // only can process one file 
                        break;
                    }
                    catch (Exception){}

            return Json(studentLanguages);
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

        public ActionResult PreallocatedClassConfigurationStep()
        {
            return PartialView("PreallocatedClassConfiguration");
        }

        public ActionResult BandClassConfigurationStep()
        {
            return PartialView("BandClassConfiguration");
        }

        public ActionResult EnterCustomGroupNameStep()
        {
            return PartialView("EnterCustomGroupName");
        }
        public ActionResult SaveCustomGroupStep()
        {
            return PartialView("SaveCustomGroup");
        }

        public ActionResult StudentGroupingOptionsStep()
        {
            return PartialView("StudentGroupingOptions");
        }

        public ActionResult GenerateCustomGroupStep()
        {
            return PartialView("GenerateCustomGroup");
        }

        public ActionResult CustomGroupListView(int testnum)
        {
            return PartialView("CustomGroupListView", testnum);
        }
    }
}