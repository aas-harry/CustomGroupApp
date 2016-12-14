using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CustomGroupApp.Controllers
{
    public class HomeController : Controller
    {
        private DataService _dataService;

        public HomeController()
        {
            _dataService = new DataService();
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult SaveStudentNotes(int id, string notes)
        {
            _dataService.SaveStudentNotes(id, notes);
            return Json(true);
            
        }
    }


}