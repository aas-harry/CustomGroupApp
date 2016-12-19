using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using ReportDataLibrary;
using ReportDataLibrary.Models;
using ReportDataLibrary.Models.StudentNaplan;

namespace CustomGroupApp.Controllers
{
    public class HomeController : Controller
    {
        private ReportingDataService _dataService;

        public HomeController()
        {
            _dataService = new ReportingDataService();
        }

        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public JsonResult GetNaplanData(int testnum)
        {
            List<StudentNaplanScore> naplanResults = new List<StudentNaplanScore>();
            var data = new StudentNaplanProfiles(new ReportDataContext {TestNumber = testnum});
            foreach (var s in data)
            {
                foreach (var r in s.NaplanScores)
                {
                    // Replace the id with student id
                    r.Id = s.Id;
                    naplanResults.Add(r);
                }
            }

            var scores = naplanResults.Select(x=> new 
            {
                x.Id,
                x.Grade,
                x.TestNumber,
                TestYear = x.Year,
                TestDate = x.Tested,
                x.Numeracy,
                x.Reading,
                x.Writing,
                x.Source
            });

            var meanScores = data.SchoolMeans.Select(x => new
                {
                    TestType = 0,
                    x.Year,
                    x.TestNumber,
                    x.Numeracy,
                    x.Reading,
                    x.Writing,
                    x.Source
                }).Union(data.StateMeans.Select(x => new
                {
                    TestType = 1,
                    x.Year,
                    TestNumber = 0,
                    x.Numeracy,
                    x.Reading,
                    x.Writing,
                    x.Source
                }))
                .Union(data.NationalMeans.Select(x => new
                    {
                        TestType = 2,
                        x.Year,
                        TestNumber = 0,
                        x.Numeracy,
                        x.Reading,
                        x.Writing,
                        x.Source
                    })
                );
            
            return
                Json(
                    new
                    {
                        NaplanResults = scores,
                        MeanScores = meanScores
                    });
        }

        [HttpPost]
        public JsonResult GetResults(int testnum)
        {
        
            // var testnum = 10000040;
            var results = _dataService.GetResults(testnum).ToList();
            var naplanResults = _dataService.GetNaplanResults(testnum).ToList();

            var semester = results.Count == 0 || results[0].Sem.HasValue == false
                ? 1
                : results[0].Sem.Value;

            var test = _dataService.GetTest(testnum);
            var school = _dataService.GetSchoolBySchoolCode(test.Scode);
            var customGroupSets = _dataService.GetCustomGroupSets(testnum).ToList();
            var stanineTables = _dataService.GetStanineTables(test, semester).ToList();
            return Json(new { Test = test, Results = results, School = school, CustomGroups = customGroupSets, StanineTables = stanineTables });
        }
    }


}